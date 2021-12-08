function setPrototypeOf(obj, proto) {
    if (Object.setPrototypeOf) {
        Object.setPrototypeOf(obj, proto);
    } else {
        obj.__proto__ = proto;
    }
}
function EtaErr(message) {
    const err = new Error(message);
    setPrototypeOf(err, EtaErr.prototype);
    return err;
}
EtaErr.prototype = Object.create(Error.prototype, {
    name: {
        value: "Eta Error",
        enumerable: false
    }
});
function ParseErr(message, str, indx) {
    const whitespace = str.slice(0, indx).split(/\n/);
    const lineNo = whitespace.length;
    const colNo = whitespace[lineNo - 1].length + 1;
    message += " at line " + lineNo + " col " + colNo + ":\n\n" + "  " + str.split(/\n/)[lineNo - 1] + "\n" + "  " + Array(colNo).join(" ") + "^";
    throw EtaErr(message);
}
const promiseImpl = Promise;
function getAsyncFunctionConstructor() {
    return (async function() {
    }).constructor;
}
function trimLeft(str) {
    return str.trimLeft();
}
function trimRight(str) {
    return str.trimRight();
}
function hasOwnProp(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}
function copyProps(toObj, fromObj) {
    for(const key in fromObj){
        if (hasOwnProp(fromObj, key)) {
            toObj[key] = fromObj[key];
        }
    }
    return toObj;
}
function trimWS(str, config, wsLeft, wsRight) {
    let leftTrim;
    let rightTrim;
    if (Array.isArray(config.autoTrim)) {
        leftTrim = config.autoTrim[1];
        rightTrim = config.autoTrim[0];
    } else {
        leftTrim = rightTrim = config.autoTrim;
    }
    if (wsLeft || wsLeft === false) {
        leftTrim = wsLeft;
    }
    if (wsRight || wsRight === false) {
        rightTrim = wsRight;
    }
    if (!rightTrim && !leftTrim) {
        return str;
    }
    if (leftTrim === "slurp" && rightTrim === "slurp") {
        return str.trim();
    }
    if (leftTrim === "_" || leftTrim === "slurp") {
        str = trimLeft(str);
    } else if (leftTrim === "-" || leftTrim === "nl") {
        str = str.replace(/^(?:\r\n|\n|\r)/, "");
    }
    if (rightTrim === "_" || rightTrim === "slurp") {
        str = trimRight(str);
    } else if (rightTrim === "-" || rightTrim === "nl") {
        str = str.replace(/(?:\r\n|\n|\r)$/, "");
    }
    return str;
}
const escMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
};
function replaceChar(s) {
    return escMap[s];
}
function XMLEscape(str) {
    const newStr = String(str);
    if (/[&<>"']/.test(newStr)) {
        return newStr.replace(/[&<>"']/g, replaceChar);
    } else {
        return newStr;
    }
}
const templateLitReg = /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})*}|(?!\${)[^\\`])*`/g;
const singleQuoteReg = /'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'/g;
const doubleQuoteReg = /"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?"/g;
function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
}
function parse(str, config) {
    let buffer = [];
    let trimLeftOfNextStr = false;
    let lastIndex = 0;
    const parseOptions = config.parse;
    if (config.plugins) {
        for(let i = 0; i < config.plugins.length; i++){
            const plugin = config.plugins[i];
            if (plugin.processTemplate) {
                str = plugin.processTemplate(str, config);
            }
        }
    }
    if (config.rmWhitespace) {
        str = str.replace(/[\r\n]+/g, "\n").replace(/^\s+|\s+$/gm, "");
    }
    templateLitReg.lastIndex = 0;
    singleQuoteReg.lastIndex = 0;
    doubleQuoteReg.lastIndex = 0;
    function pushString(strng, shouldTrimRightOfString) {
        if (strng) {
            strng = trimWS(strng, config, trimLeftOfNextStr, shouldTrimRightOfString);
            if (strng) {
                strng = strng.replace(/\\|'/g, "\\$&").replace(/\r\n|\n|\r/g, "\\n");
                buffer.push(strng);
            }
        }
    }
    const prefixes = [
        parseOptions.exec,
        parseOptions.interpolate,
        parseOptions.raw, 
    ].reduce(function(accumulator, prefix) {
        if (accumulator && prefix) {
            return accumulator + "|" + escapeRegExp(prefix);
        } else if (prefix) {
            return escapeRegExp(prefix);
        } else {
            return accumulator;
        }
    }, "");
    const parseOpenReg = new RegExp("([^]*?)" + escapeRegExp(config.tags[0]) + "(-|_)?\\s*(" + prefixes + ")?\\s*", "g");
    const parseCloseReg = new RegExp("'|\"|`|\\/\\*|(\\s*(-|_)?" + escapeRegExp(config.tags[1]) + ")", "g");
    let m;
    while(m = parseOpenReg.exec(str)){
        lastIndex = m[0].length + m.index;
        const precedingString = m[1];
        const wsLeft = m[2];
        const prefix = m[3] || "";
        pushString(precedingString, wsLeft);
        parseCloseReg.lastIndex = lastIndex;
        let closeTag;
        let currentObj = false;
        while(closeTag = parseCloseReg.exec(str)){
            if (closeTag[1]) {
                let content = str.slice(lastIndex, closeTag.index);
                parseOpenReg.lastIndex = lastIndex = parseCloseReg.lastIndex;
                trimLeftOfNextStr = closeTag[2];
                const currentType = prefix === parseOptions.exec ? "e" : prefix === parseOptions.raw ? "r" : prefix === parseOptions.interpolate ? "i" : "";
                currentObj = {
                    t: currentType,
                    val: content
                };
                break;
            } else {
                const __char = closeTag[0];
                if (__char === "/*") {
                    const commentCloseInd = str.indexOf("*/", parseCloseReg.lastIndex);
                    if (commentCloseInd === -1) {
                        ParseErr("unclosed comment", str, closeTag.index);
                    }
                    parseCloseReg.lastIndex = commentCloseInd;
                } else if (__char === "'") {
                    singleQuoteReg.lastIndex = closeTag.index;
                    const singleQuoteMatch = singleQuoteReg.exec(str);
                    if (singleQuoteMatch) {
                        parseCloseReg.lastIndex = singleQuoteReg.lastIndex;
                    } else {
                        ParseErr("unclosed string", str, closeTag.index);
                    }
                } else if (__char === '"') {
                    doubleQuoteReg.lastIndex = closeTag.index;
                    const doubleQuoteMatch = doubleQuoteReg.exec(str);
                    if (doubleQuoteMatch) {
                        parseCloseReg.lastIndex = doubleQuoteReg.lastIndex;
                    } else {
                        ParseErr("unclosed string", str, closeTag.index);
                    }
                } else if (__char === "`") {
                    templateLitReg.lastIndex = closeTag.index;
                    const templateLitMatch = templateLitReg.exec(str);
                    if (templateLitMatch) {
                        parseCloseReg.lastIndex = templateLitReg.lastIndex;
                    } else {
                        ParseErr("unclosed string", str, closeTag.index);
                    }
                }
            }
        }
        if (currentObj) {
            buffer.push(currentObj);
        } else {
            ParseErr("unclosed tag", str, m.index + precedingString.length);
        }
    }
    pushString(str.slice(lastIndex, str.length), false);
    if (config.plugins) {
        for(let i = 0; i < config.plugins.length; i++){
            const plugin = config.plugins[i];
            if (plugin.processAST) {
                buffer = plugin.processAST(buffer, config);
            }
        }
    }
    return buffer;
}
function compileToString(str, config) {
    const buffer = parse(str, config);
    let res = "var tR='',__l,__lP" + (config.include ? ",include=E.include.bind(E)" : "") + (config.includeFile ? ",includeFile=E.includeFile.bind(E)" : "") + "\nfunction layout(p,d){__l=p;__lP=d}\n" + (config.useWith ? "with(" + config.varName + "||{}){" : "") + compileScope(buffer, config) + (config.includeFile ? "if(__l)tR=" + (config.async ? "await " : "") + `includeFile(__l,Object.assign(${config.varName},{body:tR},__lP))\n` : config.include ? "if(__l)tR=" + (config.async ? "await " : "") + `include(__l,Object.assign(${config.varName},{body:tR},__lP))\n` : "") + "if(cb){cb(null,tR)} return tR" + (config.useWith ? "}" : "");
    if (config.plugins) {
        for(let i = 0; i < config.plugins.length; i++){
            const plugin = config.plugins[i];
            if (plugin.processFnString) {
                res = plugin.processFnString(res, config);
            }
        }
    }
    return res;
}
function compileScope(buff, config) {
    let i = 0;
    const buffLength = buff.length;
    let returnStr = "";
    for(i; i < buffLength; i++){
        const currentBlock = buff[i];
        if (typeof currentBlock === "string") {
            const str = currentBlock;
            returnStr += "tR+='" + str + "'\n";
        } else {
            const type = currentBlock.t;
            let content = currentBlock.val || "";
            if (type === "r") {
                if (config.filter) {
                    content = "E.filter(" + content + ")";
                }
                returnStr += "tR+=" + content + "\n";
            } else if (type === "i") {
                if (config.filter) {
                    content = "E.filter(" + content + ")";
                }
                if (config.autoEscape) {
                    content = "E.e(" + content + ")";
                }
                returnStr += "tR+=" + content + "\n";
            } else if (type === "e") {
                returnStr += content + "\n";
            }
        }
    }
    return returnStr;
}
class Cacher {
    cache;
    constructor(cache){
        this.cache = cache;
    }
    define(key, val) {
        this.cache[key] = val;
    }
    get(key) {
        return this.cache[key];
    }
    remove(key) {
        delete this.cache[key];
    }
    reset() {
        this.cache = {
        };
    }
    load(cacheObj) {
        copyProps(this.cache, cacheObj);
    }
}
const templates = new Cacher({
});
function includeHelper(templateNameOrPath, data) {
    const template = this.templates.get(templateNameOrPath);
    if (!template) {
        throw EtaErr('Could not fetch template "' + templateNameOrPath + '"');
    }
    return template(data, this);
}
const config = {
    async: false,
    autoEscape: true,
    autoTrim: [
        false,
        "nl"
    ],
    cache: false,
    e: XMLEscape,
    include: includeHelper,
    parse: {
        exec: "",
        interpolate: "=",
        raw: "~"
    },
    plugins: [],
    rmWhitespace: false,
    tags: [
        "<%",
        "%>"
    ],
    templates: templates,
    useWith: false,
    varName: "it"
};
function getConfig(override, baseConfig) {
    const res = {
    };
    copyProps(res, config);
    if (baseConfig) {
        copyProps(res, baseConfig);
    }
    if (override) {
        copyProps(res, override);
    }
    return res;
}
function compile(str, config) {
    const options = getConfig(config || {
    });
    const ctor = options.async ? getAsyncFunctionConstructor() : Function;
    try {
        return new ctor(options.varName, "E", "cb", compileToString(str, options));
    } catch (e) {
        if (e instanceof SyntaxError) {
            throw EtaErr("Bad template syntax\n\n" + e.message + "\n" + Array(e.message.length + 1).join("=") + "\n" + compileToString(str, options) + "\n");
        } else {
            throw e;
        }
    }
}
function existsSync(filePath) {
    try {
        Deno.lstatSync(filePath);
        return true;
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            return false;
        }
        throw err;
    }
}
const osType = (()=>{
    if (globalThis.Deno != null) {
        return Deno.build.os;
    }
    const navigator = globalThis.navigator;
    if (navigator?.appVersion?.includes?.("Win") ?? false) {
        return "windows";
    }
    return "linux";
})();
const isWindows = osType === "windows";
const CHAR_FORWARD_SLASH = 47;
function assertPath(path) {
    if (typeof path !== "string") {
        throw new TypeError(`Path must be a string. Received ${JSON.stringify(path)}`);
    }
}
function isPosixPathSeparator(code) {
    return code === 47;
}
function isPathSeparator(code) {
    return isPosixPathSeparator(code) || code === 92;
}
function isWindowsDeviceRoot(code) {
    return code >= 97 && code <= 122 || code >= 65 && code <= 90;
}
function normalizeString(path, allowAboveRoot, separator, isPathSeparator) {
    let res = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let code;
    for(let i = 0, len = path.length; i <= len; ++i){
        if (i < len) code = path.charCodeAt(i);
        else if (isPathSeparator(code)) break;
        else code = CHAR_FORWARD_SLASH;
        if (isPathSeparator(code)) {
            if (lastSlash === i - 1 || dots === 1) {
            } else if (lastSlash !== i - 1 && dots === 2) {
                if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
                    if (res.length > 2) {
                        const lastSlashIndex = res.lastIndexOf(separator);
                        if (lastSlashIndex === -1) {
                            res = "";
                            lastSegmentLength = 0;
                        } else {
                            res = res.slice(0, lastSlashIndex);
                            lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
                        }
                        lastSlash = i;
                        dots = 0;
                        continue;
                    } else if (res.length === 2 || res.length === 1) {
                        res = "";
                        lastSegmentLength = 0;
                        lastSlash = i;
                        dots = 0;
                        continue;
                    }
                }
                if (allowAboveRoot) {
                    if (res.length > 0) res += `${separator}..`;
                    else res = "..";
                    lastSegmentLength = 2;
                }
            } else {
                if (res.length > 0) res += separator + path.slice(lastSlash + 1, i);
                else res = path.slice(lastSlash + 1, i);
                lastSegmentLength = i - lastSlash - 1;
            }
            lastSlash = i;
            dots = 0;
        } else if (code === 46 && dots !== -1) {
            ++dots;
        } else {
            dots = -1;
        }
    }
    return res;
}
function _format(sep, pathObject) {
    const dir = pathObject.dir || pathObject.root;
    const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
    if (!dir) return base;
    if (dir === pathObject.root) return dir + base;
    return dir + sep + base;
}
const WHITESPACE_ENCODINGS = {
    "\u0009": "%09",
    "\u000A": "%0A",
    "\u000B": "%0B",
    "\u000C": "%0C",
    "\u000D": "%0D",
    "\u0020": "%20"
};
function encodeWhitespace(string) {
    return string.replaceAll(/[\s]/g, (c)=>{
        return WHITESPACE_ENCODINGS[c] ?? c;
    });
}
class DenoStdInternalError extends Error {
    constructor(message){
        super(message);
        this.name = "DenoStdInternalError";
    }
}
function assert(expr, msg = "") {
    if (!expr) {
        throw new DenoStdInternalError(msg);
    }
}
const sep = "\\";
const delimiter = ";";
function resolve6(...pathSegments) {
    let resolvedDevice = "";
    let resolvedTail = "";
    let resolvedAbsolute = false;
    for(let i = pathSegments.length - 1; i >= -1; i--){
        let path;
        if (i >= 0) {
            path = pathSegments[i];
        } else if (!resolvedDevice) {
            if (globalThis.Deno == null) {
                throw new TypeError("Resolved a drive-letter-less path without a CWD.");
            }
            path = Deno.cwd();
        } else {
            if (globalThis.Deno == null) {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path = Deno.env.get(`=${resolvedDevice}`) || Deno.cwd();
            if (path === undefined || path.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
                path = `${resolvedDevice}\\`;
            }
        }
        assertPath(path);
        const len = path.length;
        if (len === 0) continue;
        let rootEnd = 0;
        let device = "";
        let isAbsolute = false;
        const code = path.charCodeAt(0);
        if (len > 1) {
            if (isPathSeparator(code)) {
                isAbsolute = true;
                if (isPathSeparator(path.charCodeAt(1))) {
                    let j = 2;
                    let last = j;
                    for(; j < len; ++j){
                        if (isPathSeparator(path.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        const firstPart = path.slice(last, j);
                        last = j;
                        for(; j < len; ++j){
                            if (!isPathSeparator(path.charCodeAt(j))) break;
                        }
                        if (j < len && j !== last) {
                            last = j;
                            for(; j < len; ++j){
                                if (isPathSeparator(path.charCodeAt(j))) break;
                            }
                            if (j === len) {
                                device = `\\\\${firstPart}\\${path.slice(last)}`;
                                rootEnd = j;
                            } else if (j !== last) {
                                device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                                rootEnd = j;
                            }
                        }
                    }
                } else {
                    rootEnd = 1;
                }
            } else if (isWindowsDeviceRoot(code)) {
                if (path.charCodeAt(1) === 58) {
                    device = path.slice(0, 2);
                    rootEnd = 2;
                    if (len > 2) {
                        if (isPathSeparator(path.charCodeAt(2))) {
                            isAbsolute = true;
                            rootEnd = 3;
                        }
                    }
                }
            }
        } else if (isPathSeparator(code)) {
            rootEnd = 1;
            isAbsolute = true;
        }
        if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
            continue;
        }
        if (resolvedDevice.length === 0 && device.length > 0) {
            resolvedDevice = device;
        }
        if (!resolvedAbsolute) {
            resolvedTail = `${path.slice(rootEnd)}\\${resolvedTail}`;
            resolvedAbsolute = isAbsolute;
        }
        if (resolvedAbsolute && resolvedDevice.length > 0) break;
    }
    resolvedTail = normalizeString(resolvedTail, !resolvedAbsolute, "\\", isPathSeparator);
    return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
function normalize(path) {
    assertPath(path);
    const len = path.length;
    if (len === 0) return ".";
    let rootEnd = 0;
    let device;
    let isAbsolute = false;
    const code = path.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator(code)) {
            isAbsolute = true;
            if (isPathSeparator(path.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator(path.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    const firstPart = path.slice(last, j);
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator(path.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator(path.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            return `\\\\${firstPart}\\${path.slice(last)}\\`;
                        } else if (j !== last) {
                            device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                            rootEnd = j;
                        }
                    }
                }
            } else {
                rootEnd = 1;
            }
        } else if (isWindowsDeviceRoot(code)) {
            if (path.charCodeAt(1) === 58) {
                device = path.slice(0, 2);
                rootEnd = 2;
                if (len > 2) {
                    if (isPathSeparator(path.charCodeAt(2))) {
                        isAbsolute = true;
                        rootEnd = 3;
                    }
                }
            }
        }
    } else if (isPathSeparator(code)) {
        return "\\";
    }
    let tail;
    if (rootEnd < len) {
        tail = normalizeString(path.slice(rootEnd), !isAbsolute, "\\", isPathSeparator);
    } else {
        tail = "";
    }
    if (tail.length === 0 && !isAbsolute) tail = ".";
    if (tail.length > 0 && isPathSeparator(path.charCodeAt(len - 1))) {
        tail += "\\";
    }
    if (device === undefined) {
        if (isAbsolute) {
            if (tail.length > 0) return `\\${tail}`;
            else return "\\";
        } else if (tail.length > 0) {
            return tail;
        } else {
            return "";
        }
    } else if (isAbsolute) {
        if (tail.length > 0) return `${device}\\${tail}`;
        else return `${device}\\`;
    } else if (tail.length > 0) {
        return device + tail;
    } else {
        return device;
    }
}
function isAbsolute(path) {
    assertPath(path);
    const len = path.length;
    if (len === 0) return false;
    const code = path.charCodeAt(0);
    if (isPathSeparator(code)) {
        return true;
    } else if (isWindowsDeviceRoot(code)) {
        if (len > 2 && path.charCodeAt(1) === 58) {
            if (isPathSeparator(path.charCodeAt(2))) return true;
        }
    }
    return false;
}
function join(...paths) {
    const pathsCount = paths.length;
    if (pathsCount === 0) return ".";
    let joined;
    let firstPart = null;
    for(let i = 0; i < pathsCount; ++i){
        const path = paths[i];
        assertPath(path);
        if (path.length > 0) {
            if (joined === undefined) joined = firstPart = path;
            else joined += `\\${path}`;
        }
    }
    if (joined === undefined) return ".";
    let needsReplace = true;
    let slashCount = 0;
    assert(firstPart != null);
    if (isPathSeparator(firstPart.charCodeAt(0))) {
        ++slashCount;
        const firstLen = firstPart.length;
        if (firstLen > 1) {
            if (isPathSeparator(firstPart.charCodeAt(1))) {
                ++slashCount;
                if (firstLen > 2) {
                    if (isPathSeparator(firstPart.charCodeAt(2))) ++slashCount;
                    else {
                        needsReplace = false;
                    }
                }
            }
        }
    }
    if (needsReplace) {
        for(; slashCount < joined.length; ++slashCount){
            if (!isPathSeparator(joined.charCodeAt(slashCount))) break;
        }
        if (slashCount >= 2) joined = `\\${joined.slice(slashCount)}`;
    }
    return normalize(joined);
}
function relative(from, to) {
    assertPath(from);
    assertPath(to);
    if (from === to) return "";
    const fromOrig = resolve6(from);
    const toOrig = resolve6(to);
    if (fromOrig === toOrig) return "";
    from = fromOrig.toLowerCase();
    to = toOrig.toLowerCase();
    if (from === to) return "";
    let fromStart = 0;
    let fromEnd = from.length;
    for(; fromStart < fromEnd; ++fromStart){
        if (from.charCodeAt(fromStart) !== 92) break;
    }
    for(; fromEnd - 1 > fromStart; --fromEnd){
        if (from.charCodeAt(fromEnd - 1) !== 92) break;
    }
    const fromLen = fromEnd - fromStart;
    let toStart = 0;
    let toEnd = to.length;
    for(; toStart < toEnd; ++toStart){
        if (to.charCodeAt(toStart) !== 92) break;
    }
    for(; toEnd - 1 > toStart; --toEnd){
        if (to.charCodeAt(toEnd - 1) !== 92) break;
    }
    const toLen = toEnd - toStart;
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i = 0;
    for(; i <= length; ++i){
        if (i === length) {
            if (toLen > length) {
                if (to.charCodeAt(toStart + i) === 92) {
                    return toOrig.slice(toStart + i + 1);
                } else if (i === 2) {
                    return toOrig.slice(toStart + i);
                }
            }
            if (fromLen > length) {
                if (from.charCodeAt(fromStart + i) === 92) {
                    lastCommonSep = i;
                } else if (i === 2) {
                    lastCommonSep = 3;
                }
            }
            break;
        }
        const fromCode = from.charCodeAt(fromStart + i);
        const toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode) break;
        else if (fromCode === 92) lastCommonSep = i;
    }
    if (i !== length && lastCommonSep === -1) {
        return toOrig;
    }
    let out = "";
    if (lastCommonSep === -1) lastCommonSep = 0;
    for(i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i){
        if (i === fromEnd || from.charCodeAt(i) === 92) {
            if (out.length === 0) out += "..";
            else out += "\\..";
        }
    }
    if (out.length > 0) {
        return out + toOrig.slice(toStart + lastCommonSep, toEnd);
    } else {
        toStart += lastCommonSep;
        if (toOrig.charCodeAt(toStart) === 92) ++toStart;
        return toOrig.slice(toStart, toEnd);
    }
}
function toNamespacedPath(path) {
    if (typeof path !== "string") return path;
    if (path.length === 0) return "";
    const resolvedPath = resolve6(path);
    if (resolvedPath.length >= 3) {
        if (resolvedPath.charCodeAt(0) === 92) {
            if (resolvedPath.charCodeAt(1) === 92) {
                const code = resolvedPath.charCodeAt(2);
                if (code !== 63 && code !== 46) {
                    return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
                }
            }
        } else if (isWindowsDeviceRoot(resolvedPath.charCodeAt(0))) {
            if (resolvedPath.charCodeAt(1) === 58 && resolvedPath.charCodeAt(2) === 92) {
                return `\\\\?\\${resolvedPath}`;
            }
        }
    }
    return path;
}
function dirname(path) {
    assertPath(path);
    const len = path.length;
    if (len === 0) return ".";
    let rootEnd = -1;
    let end = -1;
    let matchedSlash = true;
    let offset = 0;
    const code = path.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator(code)) {
            rootEnd = offset = 1;
            if (isPathSeparator(path.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator(path.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator(path.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator(path.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            return path;
                        }
                        if (j !== last) {
                            rootEnd = offset = j + 1;
                        }
                    }
                }
            }
        } else if (isWindowsDeviceRoot(code)) {
            if (path.charCodeAt(1) === 58) {
                rootEnd = offset = 2;
                if (len > 2) {
                    if (isPathSeparator(path.charCodeAt(2))) rootEnd = offset = 3;
                }
            }
        }
    } else if (isPathSeparator(code)) {
        return path;
    }
    for(let i = len - 1; i >= offset; --i){
        if (isPathSeparator(path.charCodeAt(i))) {
            if (!matchedSlash) {
                end = i;
                break;
            }
        } else {
            matchedSlash = false;
        }
    }
    if (end === -1) {
        if (rootEnd === -1) return ".";
        else end = rootEnd;
    }
    return path.slice(0, end);
}
function basename(path, ext = "") {
    if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
    }
    assertPath(path);
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i;
    if (path.length >= 2) {
        const drive = path.charCodeAt(0);
        if (isWindowsDeviceRoot(drive)) {
            if (path.charCodeAt(1) === 58) start = 2;
        }
    }
    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
        if (ext.length === path.length && ext === path) return "";
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for(i = path.length - 1; i >= start; --i){
            const code = path.charCodeAt(i);
            if (isPathSeparator(code)) {
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            } else {
                if (firstNonSlashEnd === -1) {
                    matchedSlash = false;
                    firstNonSlashEnd = i + 1;
                }
                if (extIdx >= 0) {
                    if (code === ext.charCodeAt(extIdx)) {
                        if (--extIdx === -1) {
                            end = i;
                        }
                    } else {
                        extIdx = -1;
                        end = firstNonSlashEnd;
                    }
                }
            }
        }
        if (start === end) end = firstNonSlashEnd;
        else if (end === -1) end = path.length;
        return path.slice(start, end);
    } else {
        for(i = path.length - 1; i >= start; --i){
            if (isPathSeparator(path.charCodeAt(i))) {
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            } else if (end === -1) {
                matchedSlash = false;
                end = i + 1;
            }
        }
        if (end === -1) return "";
        return path.slice(start, end);
    }
}
function extname(path) {
    assertPath(path);
    let start = 0;
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    if (path.length >= 2 && path.charCodeAt(1) === 58 && isWindowsDeviceRoot(path.charCodeAt(0))) {
        start = startPart = 2;
    }
    for(let i = path.length - 1; i >= start; --i){
        const code = path.charCodeAt(i);
        if (isPathSeparator(code)) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
    }
    return path.slice(startDot, end);
}
function format(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
    }
    return _format("\\", pathObject);
}
function parse1(path) {
    assertPath(path);
    const ret = {
        root: "",
        dir: "",
        base: "",
        ext: "",
        name: ""
    };
    const len = path.length;
    if (len === 0) return ret;
    let rootEnd = 0;
    let code = path.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator(code)) {
            rootEnd = 1;
            if (isPathSeparator(path.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator(path.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator(path.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator(path.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            rootEnd = j;
                        } else if (j !== last) {
                            rootEnd = j + 1;
                        }
                    }
                }
            }
        } else if (isWindowsDeviceRoot(code)) {
            if (path.charCodeAt(1) === 58) {
                rootEnd = 2;
                if (len > 2) {
                    if (isPathSeparator(path.charCodeAt(2))) {
                        if (len === 3) {
                            ret.root = ret.dir = path;
                            return ret;
                        }
                        rootEnd = 3;
                    }
                } else {
                    ret.root = ret.dir = path;
                    return ret;
                }
            }
        }
    } else if (isPathSeparator(code)) {
        ret.root = ret.dir = path;
        return ret;
    }
    if (rootEnd > 0) ret.root = path.slice(0, rootEnd);
    let startDot = -1;
    let startPart = rootEnd;
    let end = -1;
    let matchedSlash = true;
    let i = path.length - 1;
    let preDotState = 0;
    for(; i >= rootEnd; --i){
        code = path.charCodeAt(i);
        if (isPathSeparator(code)) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        if (end !== -1) {
            ret.base = ret.name = path.slice(startPart, end);
        }
    } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
        ret.ext = path.slice(startDot, end);
    }
    if (startPart > 0 && startPart !== rootEnd) {
        ret.dir = path.slice(0, startPart - 1);
    } else ret.dir = ret.root;
    return ret;
}
function fromFileUrl(url) {
    url = url instanceof URL ? url : new URL(url);
    if (url.protocol != "file:") {
        throw new TypeError("Must be a file URL.");
    }
    let path = decodeURIComponent(url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
    if (url.hostname != "") {
        path = `\\\\${url.hostname}${path}`;
    }
    return path;
}
function toFileUrl(path) {
    if (!isAbsolute(path)) {
        throw new TypeError("Must be an absolute path.");
    }
    const [, hostname, pathname] = path.match(/^(?:[/\\]{2}([^/\\]+)(?=[/\\](?:[^/\\]|$)))?(.*)/);
    const url = new URL("file:///");
    url.pathname = encodeWhitespace(pathname.replace(/%/g, "%25"));
    if (hostname != null && hostname != "localhost") {
        url.hostname = hostname;
        if (!url.hostname) {
            throw new TypeError("Invalid hostname.");
        }
    }
    return url;
}
const mod = {
    sep: sep,
    delimiter: delimiter,
    resolve: resolve6,
    normalize: normalize,
    isAbsolute: isAbsolute,
    join: join,
    relative: relative,
    toNamespacedPath: toNamespacedPath,
    dirname: dirname,
    basename: basename,
    extname: extname,
    format: format,
    parse: parse1,
    fromFileUrl: fromFileUrl,
    toFileUrl: toFileUrl
};
const sep1 = "/";
const delimiter1 = ":";
function resolve1(...pathSegments) {
    let resolvedPath = "";
    let resolvedAbsolute = false;
    for(let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--){
        let path;
        if (i >= 0) path = pathSegments[i];
        else {
            if (globalThis.Deno == null) {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path = Deno.cwd();
        }
        assertPath(path);
        if (path.length === 0) {
            continue;
        }
        resolvedPath = `${path}/${resolvedPath}`;
        resolvedAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
    }
    resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute, "/", isPosixPathSeparator);
    if (resolvedAbsolute) {
        if (resolvedPath.length > 0) return `/${resolvedPath}`;
        else return "/";
    } else if (resolvedPath.length > 0) return resolvedPath;
    else return ".";
}
function normalize1(path) {
    assertPath(path);
    if (path.length === 0) return ".";
    const isAbsolute = path.charCodeAt(0) === 47;
    const trailingSeparator = path.charCodeAt(path.length - 1) === 47;
    path = normalizeString(path, !isAbsolute, "/", isPosixPathSeparator);
    if (path.length === 0 && !isAbsolute) path = ".";
    if (path.length > 0 && trailingSeparator) path += "/";
    if (isAbsolute) return `/${path}`;
    return path;
}
function isAbsolute1(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47;
}
function join1(...paths) {
    if (paths.length === 0) return ".";
    let joined;
    for(let i = 0, len = paths.length; i < len; ++i){
        const path = paths[i];
        assertPath(path);
        if (path.length > 0) {
            if (!joined) joined = path;
            else joined += `/${path}`;
        }
    }
    if (!joined) return ".";
    return normalize1(joined);
}
function relative1(from, to) {
    assertPath(from);
    assertPath(to);
    if (from === to) return "";
    from = resolve1(from);
    to = resolve1(to);
    if (from === to) return "";
    let fromStart = 1;
    const fromEnd = from.length;
    for(; fromStart < fromEnd; ++fromStart){
        if (from.charCodeAt(fromStart) !== 47) break;
    }
    const fromLen = fromEnd - fromStart;
    let toStart = 1;
    const toEnd = to.length;
    for(; toStart < toEnd; ++toStart){
        if (to.charCodeAt(toStart) !== 47) break;
    }
    const toLen = toEnd - toStart;
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i = 0;
    for(; i <= length; ++i){
        if (i === length) {
            if (toLen > length) {
                if (to.charCodeAt(toStart + i) === 47) {
                    return to.slice(toStart + i + 1);
                } else if (i === 0) {
                    return to.slice(toStart + i);
                }
            } else if (fromLen > length) {
                if (from.charCodeAt(fromStart + i) === 47) {
                    lastCommonSep = i;
                } else if (i === 0) {
                    lastCommonSep = 0;
                }
            }
            break;
        }
        const fromCode = from.charCodeAt(fromStart + i);
        const toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode) break;
        else if (fromCode === 47) lastCommonSep = i;
    }
    let out = "";
    for(i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i){
        if (i === fromEnd || from.charCodeAt(i) === 47) {
            if (out.length === 0) out += "..";
            else out += "/..";
        }
    }
    if (out.length > 0) return out + to.slice(toStart + lastCommonSep);
    else {
        toStart += lastCommonSep;
        if (to.charCodeAt(toStart) === 47) ++toStart;
        return to.slice(toStart);
    }
}
function toNamespacedPath1(path) {
    return path;
}
function dirname1(path) {
    assertPath(path);
    if (path.length === 0) return ".";
    const hasRoot = path.charCodeAt(0) === 47;
    let end = -1;
    let matchedSlash = true;
    for(let i = path.length - 1; i >= 1; --i){
        if (path.charCodeAt(i) === 47) {
            if (!matchedSlash) {
                end = i;
                break;
            }
        } else {
            matchedSlash = false;
        }
    }
    if (end === -1) return hasRoot ? "/" : ".";
    if (hasRoot && end === 1) return "//";
    return path.slice(0, end);
}
function basename1(path, ext = "") {
    if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
    }
    assertPath(path);
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i;
    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
        if (ext.length === path.length && ext === path) return "";
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for(i = path.length - 1; i >= 0; --i){
            const code = path.charCodeAt(i);
            if (code === 47) {
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            } else {
                if (firstNonSlashEnd === -1) {
                    matchedSlash = false;
                    firstNonSlashEnd = i + 1;
                }
                if (extIdx >= 0) {
                    if (code === ext.charCodeAt(extIdx)) {
                        if (--extIdx === -1) {
                            end = i;
                        }
                    } else {
                        extIdx = -1;
                        end = firstNonSlashEnd;
                    }
                }
            }
        }
        if (start === end) end = firstNonSlashEnd;
        else if (end === -1) end = path.length;
        return path.slice(start, end);
    } else {
        for(i = path.length - 1; i >= 0; --i){
            if (path.charCodeAt(i) === 47) {
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            } else if (end === -1) {
                matchedSlash = false;
                end = i + 1;
            }
        }
        if (end === -1) return "";
        return path.slice(start, end);
    }
}
function extname1(path) {
    assertPath(path);
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    for(let i = path.length - 1; i >= 0; --i){
        const code = path.charCodeAt(i);
        if (code === 47) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
    }
    return path.slice(startDot, end);
}
function format1(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
    }
    return _format("/", pathObject);
}
function parse2(path) {
    assertPath(path);
    const ret = {
        root: "",
        dir: "",
        base: "",
        ext: "",
        name: ""
    };
    if (path.length === 0) return ret;
    const isAbsolute = path.charCodeAt(0) === 47;
    let start;
    if (isAbsolute) {
        ret.root = "/";
        start = 1;
    } else {
        start = 0;
    }
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let i = path.length - 1;
    let preDotState = 0;
    for(; i >= start; --i){
        const code = path.charCodeAt(i);
        if (code === 47) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        if (end !== -1) {
            if (startPart === 0 && isAbsolute) {
                ret.base = ret.name = path.slice(1, end);
            } else {
                ret.base = ret.name = path.slice(startPart, end);
            }
        }
    } else {
        if (startPart === 0 && isAbsolute) {
            ret.name = path.slice(1, startDot);
            ret.base = path.slice(1, end);
        } else {
            ret.name = path.slice(startPart, startDot);
            ret.base = path.slice(startPart, end);
        }
        ret.ext = path.slice(startDot, end);
    }
    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);
    else if (isAbsolute) ret.dir = "/";
    return ret;
}
function fromFileUrl1(url) {
    url = url instanceof URL ? url : new URL(url);
    if (url.protocol != "file:") {
        throw new TypeError("Must be a file URL.");
    }
    return decodeURIComponent(url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"));
}
function toFileUrl1(path) {
    if (!isAbsolute1(path)) {
        throw new TypeError("Must be an absolute path.");
    }
    const url = new URL("file:///");
    url.pathname = encodeWhitespace(path.replace(/%/g, "%25").replace(/\\/g, "%5C"));
    return url;
}
const mod1 = {
    sep: sep1,
    delimiter: delimiter1,
    resolve: resolve1,
    normalize: normalize1,
    isAbsolute: isAbsolute1,
    join: join1,
    relative: relative1,
    toNamespacedPath: toNamespacedPath1,
    dirname: dirname1,
    basename: basename1,
    extname: extname1,
    format: format1,
    parse: parse2,
    fromFileUrl: fromFileUrl1,
    toFileUrl: toFileUrl1
};
const SEP = isWindows ? "\\" : "/";
const SEP_PATTERN = isWindows ? /[\\/]+/ : /\/+/;
function common(paths, sep = SEP) {
    const [first = "", ...remaining] = paths;
    if (first === "" || remaining.length === 0) {
        return first.substring(0, first.lastIndexOf(sep) + 1);
    }
    const parts = first.split(sep);
    let endOfPrefix = parts.length;
    for (const path of remaining){
        const compare = path.split(sep);
        for(let i = 0; i < endOfPrefix; i++){
            if (compare[i] !== parts[i]) {
                endOfPrefix = i;
            }
        }
        if (endOfPrefix === 0) {
            return "";
        }
    }
    const prefix = parts.slice(0, endOfPrefix).join(sep);
    return prefix.endsWith(sep) ? prefix : `${prefix}${sep}`;
}
const path = isWindows ? mod : mod1;
const { join: join2 , normalize: normalize2  } = path;
const regExpEscapeChars = [
    "!",
    "$",
    "(",
    ")",
    "*",
    "+",
    ".",
    "=",
    "?",
    "[",
    "\\",
    "^",
    "{",
    "|"
];
const rangeEscapeChars = [
    "-",
    "\\",
    "]"
];
function globToRegExp(glob, { extended =true , globstar: globstarOption = true , os =osType , caseInsensitive =false  } = {
}) {
    if (glob == "") {
        return /(?!)/;
    }
    const sep = os == "windows" ? "(?:\\\\|/)+" : "/+";
    const sepMaybe = os == "windows" ? "(?:\\\\|/)*" : "/*";
    const seps = os == "windows" ? [
        "\\",
        "/"
    ] : [
        "/"
    ];
    const globstar = os == "windows" ? "(?:[^\\\\/]*(?:\\\\|/|$)+)*" : "(?:[^/]*(?:/|$)+)*";
    const wildcard = os == "windows" ? "[^\\\\/]*" : "[^/]*";
    const escapePrefix = os == "windows" ? "`" : "\\";
    let newLength = glob.length;
    for(; newLength > 1 && seps.includes(glob[newLength - 1]); newLength--);
    glob = glob.slice(0, newLength);
    let regExpString = "";
    for(let j = 0; j < glob.length;){
        let segment = "";
        const groupStack = [];
        let inRange = false;
        let inEscape = false;
        let endsWithSep = false;
        let i = j;
        for(; i < glob.length && !seps.includes(glob[i]); i++){
            if (inEscape) {
                inEscape = false;
                const escapeChars = inRange ? rangeEscapeChars : regExpEscapeChars;
                segment += escapeChars.includes(glob[i]) ? `\\${glob[i]}` : glob[i];
                continue;
            }
            if (glob[i] == escapePrefix) {
                inEscape = true;
                continue;
            }
            if (glob[i] == "[") {
                if (!inRange) {
                    inRange = true;
                    segment += "[";
                    if (glob[i + 1] == "!") {
                        i++;
                        segment += "^";
                    } else if (glob[i + 1] == "^") {
                        i++;
                        segment += "\\^";
                    }
                    continue;
                } else if (glob[i + 1] == ":") {
                    let k = i + 1;
                    let value = "";
                    while(glob[k + 1] != null && glob[k + 1] != ":"){
                        value += glob[k + 1];
                        k++;
                    }
                    if (glob[k + 1] == ":" && glob[k + 2] == "]") {
                        i = k + 2;
                        if (value == "alnum") segment += "\\dA-Za-z";
                        else if (value == "alpha") segment += "A-Za-z";
                        else if (value == "ascii") segment += "\x00-\x7F";
                        else if (value == "blank") segment += "\t ";
                        else if (value == "cntrl") segment += "\x00-\x1F\x7F";
                        else if (value == "digit") segment += "\\d";
                        else if (value == "graph") segment += "\x21-\x7E";
                        else if (value == "lower") segment += "a-z";
                        else if (value == "print") segment += "\x20-\x7E";
                        else if (value == "punct") {
                            segment += "!\"#$%&'()*+,\\-./:;<=>?@[\\\\\\]^_‘{|}~";
                        } else if (value == "space") segment += "\\s\v";
                        else if (value == "upper") segment += "A-Z";
                        else if (value == "word") segment += "\\w";
                        else if (value == "xdigit") segment += "\\dA-Fa-f";
                        continue;
                    }
                }
            }
            if (glob[i] == "]" && inRange) {
                inRange = false;
                segment += "]";
                continue;
            }
            if (inRange) {
                if (glob[i] == "\\") {
                    segment += `\\\\`;
                } else {
                    segment += glob[i];
                }
                continue;
            }
            if (glob[i] == ")" && groupStack.length > 0 && groupStack[groupStack.length - 1] != "BRACE") {
                segment += ")";
                const type = groupStack.pop();
                if (type == "!") {
                    segment += wildcard;
                } else if (type != "@") {
                    segment += type;
                }
                continue;
            }
            if (glob[i] == "|" && groupStack.length > 0 && groupStack[groupStack.length - 1] != "BRACE") {
                segment += "|";
                continue;
            }
            if (glob[i] == "+" && extended && glob[i + 1] == "(") {
                i++;
                groupStack.push("+");
                segment += "(?:";
                continue;
            }
            if (glob[i] == "@" && extended && glob[i + 1] == "(") {
                i++;
                groupStack.push("@");
                segment += "(?:";
                continue;
            }
            if (glob[i] == "?") {
                if (extended && glob[i + 1] == "(") {
                    i++;
                    groupStack.push("?");
                    segment += "(?:";
                } else {
                    segment += ".";
                }
                continue;
            }
            if (glob[i] == "!" && extended && glob[i + 1] == "(") {
                i++;
                groupStack.push("!");
                segment += "(?!";
                continue;
            }
            if (glob[i] == "{") {
                groupStack.push("BRACE");
                segment += "(?:";
                continue;
            }
            if (glob[i] == "}" && groupStack[groupStack.length - 1] == "BRACE") {
                groupStack.pop();
                segment += ")";
                continue;
            }
            if (glob[i] == "," && groupStack[groupStack.length - 1] == "BRACE") {
                segment += "|";
                continue;
            }
            if (glob[i] == "*") {
                if (extended && glob[i + 1] == "(") {
                    i++;
                    groupStack.push("*");
                    segment += "(?:";
                } else {
                    const prevChar = glob[i - 1];
                    let numStars = 1;
                    while(glob[i + 1] == "*"){
                        i++;
                        numStars++;
                    }
                    const nextChar = glob[i + 1];
                    if (globstarOption && numStars == 2 && [
                        ...seps,
                        undefined
                    ].includes(prevChar) && [
                        ...seps,
                        undefined
                    ].includes(nextChar)) {
                        segment += globstar;
                        endsWithSep = true;
                    } else {
                        segment += wildcard;
                    }
                }
                continue;
            }
            segment += regExpEscapeChars.includes(glob[i]) ? `\\${glob[i]}` : glob[i];
        }
        if (groupStack.length > 0 || inRange || inEscape) {
            segment = "";
            for (const c of glob.slice(j, i)){
                segment += regExpEscapeChars.includes(c) ? `\\${c}` : c;
                endsWithSep = false;
            }
        }
        regExpString += segment;
        if (!endsWithSep) {
            regExpString += i < glob.length ? sep : sepMaybe;
            endsWithSep = true;
        }
        while(seps.includes(glob[i]))i++;
        if (!(i > j)) {
            throw new Error("Assertion failure: i > j (potential infinite loop)");
        }
        j = i;
    }
    regExpString = `^${regExpString}$`;
    return new RegExp(regExpString, caseInsensitive ? "i" : "");
}
function isGlob(str) {
    const chars = {
        "{": "}",
        "(": ")",
        "[": "]"
    };
    const regex = /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
    if (str === "") {
        return false;
    }
    let match;
    while(match = regex.exec(str)){
        if (match[2]) return true;
        let idx = match.index + match[0].length;
        const open = match[1];
        const close = open ? chars[open] : null;
        if (open && close) {
            const n = str.indexOf(close, idx);
            if (n !== -1) {
                idx = n + 1;
            }
        }
        str = str.slice(idx);
    }
    return false;
}
function normalizeGlob(glob, { globstar =false  } = {
}) {
    if (glob.match(/\0/g)) {
        throw new Error(`Glob contains invalid characters: "${glob}"`);
    }
    if (!globstar) {
        return normalize2(glob);
    }
    const s = SEP_PATTERN.source;
    const badParentPattern = new RegExp(`(?<=(${s}|^)\\*\\*${s})\\.\\.(?=${s}|$)`, "g");
    return normalize2(glob.replace(badParentPattern, "\0")).replace(/\0/g, "..");
}
function joinGlobs(globs, { extended =false , globstar =false  } = {
}) {
    if (!globstar || globs.length == 0) {
        return join2(...globs);
    }
    if (globs.length === 0) return ".";
    let joined;
    for (const glob of globs){
        const path = glob;
        if (path.length > 0) {
            if (!joined) joined = path;
            else joined += `${SEP}${path}`;
        }
    }
    if (!joined) return ".";
    return normalizeGlob(joined, {
        extended,
        globstar
    });
}
const path1 = isWindows ? mod : mod1;
const { basename: basename2 , delimiter: delimiter2 , dirname: dirname2 , extname: extname2 , format: format2 , fromFileUrl: fromFileUrl2 , isAbsolute: isAbsolute2 , join: join3 , normalize: normalize3 , parse: parse3 , relative: relative2 , resolve: resolve2 , sep: sep2 , toFileUrl: toFileUrl2 , toNamespacedPath: toNamespacedPath2 ,  } = path1;
const mod2 = {
    SEP: SEP,
    SEP_PATTERN: SEP_PATTERN,
    win32: mod,
    posix: mod1,
    basename: basename2,
    delimiter: delimiter2,
    dirname: dirname2,
    extname: extname2,
    format: format2,
    fromFileUrl: fromFileUrl2,
    isAbsolute: isAbsolute2,
    join: join3,
    normalize: normalize3,
    parse: parse3,
    relative: relative2,
    resolve: resolve2,
    sep: sep2,
    toFileUrl: toFileUrl2,
    toNamespacedPath: toNamespacedPath2,
    common,
    globToRegExp,
    isGlob,
    normalizeGlob,
    joinGlobs
};
const readFileSync = Deno.readTextFileSync;
const _BOM = /^\uFEFF/;
function getWholeFilePath(name, parentfile, isDirectory) {
    const includePath = mod2.resolve(isDirectory ? parentfile : mod2.dirname(parentfile), name) + (mod2.extname(name) ? "" : ".eta");
    return includePath;
}
function getPath(path, options) {
    let includePath = false;
    const views = options.views;
    let searchedPaths = [];
    const pathOptions = JSON.stringify({
        filename: options.filename,
        path: path,
        root: options.root,
        views: options.views
    });
    if (options.cache && options.filepathCache && options.filepathCache[pathOptions]) {
        return options.filepathCache[pathOptions];
    }
    function addPathToSearched(pathSearched) {
        if (!searchedPaths.includes(pathSearched)) {
            searchedPaths.push(pathSearched);
        }
    }
    function searchViews(views, path) {
        let filePath;
        if (Array.isArray(views) && views.some(function(v) {
            filePath = getWholeFilePath(path, v, true);
            addPathToSearched(filePath);
            return existsSync(filePath);
        })) {
            return filePath;
        } else if (typeof views === "string") {
            filePath = getWholeFilePath(path, views, true);
            addPathToSearched(filePath);
            if (existsSync(filePath)) {
                return filePath;
            }
        }
        return false;
    }
    const match = /^[A-Za-z]+:\\|^\//.exec(path);
    if (match && match.length) {
        const formattedPath = path.replace(/^\/*/, "");
        includePath = searchViews(views, formattedPath);
        if (!includePath) {
            const pathFromRoot = getWholeFilePath(formattedPath, options.root || "/", true);
            addPathToSearched(pathFromRoot);
            includePath = pathFromRoot;
        }
    } else {
        if (options.filename) {
            const filePath = getWholeFilePath(path, options.filename);
            addPathToSearched(filePath);
            if (existsSync(filePath)) {
                includePath = filePath;
            }
        }
        if (!includePath) {
            includePath = searchViews(views, path);
        }
        if (!includePath) {
            throw EtaErr('Could not find the template "' + path + '". Paths tried: ' + searchedPaths);
        }
    }
    if (options.cache && options.filepathCache) {
        options.filepathCache[pathOptions] = includePath;
    }
    return includePath;
}
function readFile(filePath) {
    try {
        return readFileSync(filePath).toString().replace(_BOM, "");
    } catch  {
        throw EtaErr("Failed to read template at '" + filePath + "'");
    }
}
function loadFile(filePath, options, noCache) {
    const config = getConfig(options);
    const template = readFile(filePath);
    try {
        const compiledTemplate = compile(template, config);
        if (!noCache) {
            config.templates.define(config.filename, compiledTemplate);
        }
        return compiledTemplate;
    } catch (e) {
        throw EtaErr("Loading file: " + filePath + " failed:\n\n" + e.message);
    }
}
function handleCache(options) {
    const filename = options.filename;
    if (options.cache) {
        const func = options.templates.get(filename);
        if (func) {
            return func;
        }
        return loadFile(filename, options);
    }
    return loadFile(filename, options, true);
}
function includeFile(path, options) {
    const newFileOptions = getConfig({
        filename: getPath(path, options)
    }, options);
    return [
        handleCache(newFileOptions),
        newFileOptions
    ];
}
function includeFileHelper(path, data) {
    const templateAndConfig = includeFile(path, this);
    return templateAndConfig[0](data, templateAndConfig[1]);
}
function handleCache1(template, options) {
    if (options.cache && options.name && options.templates.get(options.name)) {
        return options.templates.get(options.name);
    }
    const templateFunc = typeof template === "function" ? template : compile(template, options);
    if (options.cache && options.name) {
        options.templates.define(options.name, templateFunc);
    }
    return templateFunc;
}
function render(template, data, config, cb) {
    const options = getConfig(config || {
    });
    if (options.async) {
        if (cb) {
            try {
                const templateFn = handleCache1(template, options);
                templateFn(data, options, cb);
            } catch (err) {
                return cb(err);
            }
        } else {
            if (typeof promiseImpl === "function") {
                return new promiseImpl(function(resolve, reject) {
                    try {
                        resolve(handleCache1(template, options)(data, options));
                    } catch (err) {
                        reject(err);
                    }
                });
            } else {
                throw EtaErr("Please provide a callback function, this env doesn't support Promises");
            }
        }
    } else {
        return handleCache1(template, options)(data, options);
    }
}
config.includeFile = includeFileHelper;
config.filepathCache = {
};
const __default = "2.0.0-beta.2";
const osType1 = (()=>{
    const { Deno  } = globalThis;
    if (typeof Deno?.build?.os === "string") {
        return Deno.build.os;
    }
    const { navigator  } = globalThis;
    if (navigator?.appVersion?.includes?.("Win") ?? false) {
        return "windows";
    }
    return "linux";
})();
const isWindows1 = osType1 === "windows";
const CHAR_FORWARD_SLASH1 = 47;
function assertPath1(path) {
    if (typeof path !== "string") {
        throw new TypeError(`Path must be a string. Received ${JSON.stringify(path)}`);
    }
}
function isPosixPathSeparator1(code) {
    return code === 47;
}
function isPathSeparator1(code) {
    return isPosixPathSeparator1(code) || code === 92;
}
function isWindowsDeviceRoot1(code) {
    return code >= 97 && code <= 122 || code >= 65 && code <= 90;
}
function normalizeString1(path, allowAboveRoot, separator, isPathSeparator) {
    let res = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let code;
    for(let i = 0, len = path.length; i <= len; ++i){
        if (i < len) code = path.charCodeAt(i);
        else if (isPathSeparator(code)) break;
        else code = CHAR_FORWARD_SLASH1;
        if (isPathSeparator(code)) {
            if (lastSlash === i - 1 || dots === 1) {
            } else if (lastSlash !== i - 1 && dots === 2) {
                if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
                    if (res.length > 2) {
                        const lastSlashIndex = res.lastIndexOf(separator);
                        if (lastSlashIndex === -1) {
                            res = "";
                            lastSegmentLength = 0;
                        } else {
                            res = res.slice(0, lastSlashIndex);
                            lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
                        }
                        lastSlash = i;
                        dots = 0;
                        continue;
                    } else if (res.length === 2 || res.length === 1) {
                        res = "";
                        lastSegmentLength = 0;
                        lastSlash = i;
                        dots = 0;
                        continue;
                    }
                }
                if (allowAboveRoot) {
                    if (res.length > 0) res += `${separator}..`;
                    else res = "..";
                    lastSegmentLength = 2;
                }
            } else {
                if (res.length > 0) res += separator + path.slice(lastSlash + 1, i);
                else res = path.slice(lastSlash + 1, i);
                lastSegmentLength = i - lastSlash - 1;
            }
            lastSlash = i;
            dots = 0;
        } else if (code === 46 && dots !== -1) {
            ++dots;
        } else {
            dots = -1;
        }
    }
    return res;
}
function _format1(sep, pathObject) {
    const dir = pathObject.dir || pathObject.root;
    const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
    if (!dir) return base;
    if (dir === pathObject.root) return dir + base;
    return dir + sep + base;
}
const WHITESPACE_ENCODINGS1 = {
    "\u0009": "%09",
    "\u000A": "%0A",
    "\u000B": "%0B",
    "\u000C": "%0C",
    "\u000D": "%0D",
    "\u0020": "%20"
};
function encodeWhitespace1(string) {
    return string.replaceAll(/[\s]/g, (c)=>{
        return WHITESPACE_ENCODINGS1[c] ?? c;
    });
}
class DenoStdInternalError1 extends Error {
    constructor(message){
        super(message);
        this.name = "DenoStdInternalError";
    }
}
function assert1(expr, msg = "") {
    if (!expr) {
        throw new DenoStdInternalError1(msg);
    }
}
const sep3 = "\\";
const delimiter3 = ";";
function resolve3(...pathSegments) {
    let resolvedDevice = "";
    let resolvedTail = "";
    let resolvedAbsolute = false;
    for(let i = pathSegments.length - 1; i >= -1; i--){
        let path;
        const { Deno  } = globalThis;
        if (i >= 0) {
            path = pathSegments[i];
        } else if (!resolvedDevice) {
            if (typeof Deno?.cwd !== "function") {
                throw new TypeError("Resolved a drive-letter-less path without a CWD.");
            }
            path = Deno.cwd();
        } else {
            if (typeof Deno?.env?.get !== "function" || typeof Deno?.cwd !== "function") {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path = Deno.env.get(`=${resolvedDevice}`) || Deno.cwd();
            if (path === undefined || path.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
                path = `${resolvedDevice}\\`;
            }
        }
        assertPath1(path);
        const len = path.length;
        if (len === 0) continue;
        let rootEnd = 0;
        let device = "";
        let isAbsolute = false;
        const code = path.charCodeAt(0);
        if (len > 1) {
            if (isPathSeparator1(code)) {
                isAbsolute = true;
                if (isPathSeparator1(path.charCodeAt(1))) {
                    let j = 2;
                    let last = j;
                    for(; j < len; ++j){
                        if (isPathSeparator1(path.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        const firstPart = path.slice(last, j);
                        last = j;
                        for(; j < len; ++j){
                            if (!isPathSeparator1(path.charCodeAt(j))) break;
                        }
                        if (j < len && j !== last) {
                            last = j;
                            for(; j < len; ++j){
                                if (isPathSeparator1(path.charCodeAt(j))) break;
                            }
                            if (j === len) {
                                device = `\\\\${firstPart}\\${path.slice(last)}`;
                                rootEnd = j;
                            } else if (j !== last) {
                                device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                                rootEnd = j;
                            }
                        }
                    }
                } else {
                    rootEnd = 1;
                }
            } else if (isWindowsDeviceRoot1(code)) {
                if (path.charCodeAt(1) === 58) {
                    device = path.slice(0, 2);
                    rootEnd = 2;
                    if (len > 2) {
                        if (isPathSeparator1(path.charCodeAt(2))) {
                            isAbsolute = true;
                            rootEnd = 3;
                        }
                    }
                }
            }
        } else if (isPathSeparator1(code)) {
            rootEnd = 1;
            isAbsolute = true;
        }
        if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
            continue;
        }
        if (resolvedDevice.length === 0 && device.length > 0) {
            resolvedDevice = device;
        }
        if (!resolvedAbsolute) {
            resolvedTail = `${path.slice(rootEnd)}\\${resolvedTail}`;
            resolvedAbsolute = isAbsolute;
        }
        if (resolvedAbsolute && resolvedDevice.length > 0) break;
    }
    resolvedTail = normalizeString1(resolvedTail, !resolvedAbsolute, "\\", isPathSeparator1);
    return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
function normalize4(path) {
    assertPath1(path);
    const len = path.length;
    if (len === 0) return ".";
    let rootEnd = 0;
    let device;
    let isAbsolute = false;
    const code = path.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator1(code)) {
            isAbsolute = true;
            if (isPathSeparator1(path.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator1(path.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    const firstPart = path.slice(last, j);
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator1(path.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator1(path.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            return `\\\\${firstPart}\\${path.slice(last)}\\`;
                        } else if (j !== last) {
                            device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                            rootEnd = j;
                        }
                    }
                }
            } else {
                rootEnd = 1;
            }
        } else if (isWindowsDeviceRoot1(code)) {
            if (path.charCodeAt(1) === 58) {
                device = path.slice(0, 2);
                rootEnd = 2;
                if (len > 2) {
                    if (isPathSeparator1(path.charCodeAt(2))) {
                        isAbsolute = true;
                        rootEnd = 3;
                    }
                }
            }
        }
    } else if (isPathSeparator1(code)) {
        return "\\";
    }
    let tail;
    if (rootEnd < len) {
        tail = normalizeString1(path.slice(rootEnd), !isAbsolute, "\\", isPathSeparator1);
    } else {
        tail = "";
    }
    if (tail.length === 0 && !isAbsolute) tail = ".";
    if (tail.length > 0 && isPathSeparator1(path.charCodeAt(len - 1))) {
        tail += "\\";
    }
    if (device === undefined) {
        if (isAbsolute) {
            if (tail.length > 0) return `\\${tail}`;
            else return "\\";
        } else if (tail.length > 0) {
            return tail;
        } else {
            return "";
        }
    } else if (isAbsolute) {
        if (tail.length > 0) return `${device}\\${tail}`;
        else return `${device}\\`;
    } else if (tail.length > 0) {
        return device + tail;
    } else {
        return device;
    }
}
function isAbsolute3(path) {
    assertPath1(path);
    const len = path.length;
    if (len === 0) return false;
    const code = path.charCodeAt(0);
    if (isPathSeparator1(code)) {
        return true;
    } else if (isWindowsDeviceRoot1(code)) {
        if (len > 2 && path.charCodeAt(1) === 58) {
            if (isPathSeparator1(path.charCodeAt(2))) return true;
        }
    }
    return false;
}
function join4(...paths) {
    const pathsCount = paths.length;
    if (pathsCount === 0) return ".";
    let joined;
    let firstPart = null;
    for(let i = 0; i < pathsCount; ++i){
        const path = paths[i];
        assertPath1(path);
        if (path.length > 0) {
            if (joined === undefined) joined = firstPart = path;
            else joined += `\\${path}`;
        }
    }
    if (joined === undefined) return ".";
    let needsReplace = true;
    let slashCount = 0;
    assert1(firstPart != null);
    if (isPathSeparator1(firstPart.charCodeAt(0))) {
        ++slashCount;
        const firstLen = firstPart.length;
        if (firstLen > 1) {
            if (isPathSeparator1(firstPart.charCodeAt(1))) {
                ++slashCount;
                if (firstLen > 2) {
                    if (isPathSeparator1(firstPart.charCodeAt(2))) ++slashCount;
                    else {
                        needsReplace = false;
                    }
                }
            }
        }
    }
    if (needsReplace) {
        for(; slashCount < joined.length; ++slashCount){
            if (!isPathSeparator1(joined.charCodeAt(slashCount))) break;
        }
        if (slashCount >= 2) joined = `\\${joined.slice(slashCount)}`;
    }
    return normalize4(joined);
}
function relative3(from, to) {
    assertPath1(from);
    assertPath1(to);
    if (from === to) return "";
    const fromOrig = resolve3(from);
    const toOrig = resolve3(to);
    if (fromOrig === toOrig) return "";
    from = fromOrig.toLowerCase();
    to = toOrig.toLowerCase();
    if (from === to) return "";
    let fromStart = 0;
    let fromEnd = from.length;
    for(; fromStart < fromEnd; ++fromStart){
        if (from.charCodeAt(fromStart) !== 92) break;
    }
    for(; fromEnd - 1 > fromStart; --fromEnd){
        if (from.charCodeAt(fromEnd - 1) !== 92) break;
    }
    const fromLen = fromEnd - fromStart;
    let toStart = 0;
    let toEnd = to.length;
    for(; toStart < toEnd; ++toStart){
        if (to.charCodeAt(toStart) !== 92) break;
    }
    for(; toEnd - 1 > toStart; --toEnd){
        if (to.charCodeAt(toEnd - 1) !== 92) break;
    }
    const toLen = toEnd - toStart;
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i = 0;
    for(; i <= length; ++i){
        if (i === length) {
            if (toLen > length) {
                if (to.charCodeAt(toStart + i) === 92) {
                    return toOrig.slice(toStart + i + 1);
                } else if (i === 2) {
                    return toOrig.slice(toStart + i);
                }
            }
            if (fromLen > length) {
                if (from.charCodeAt(fromStart + i) === 92) {
                    lastCommonSep = i;
                } else if (i === 2) {
                    lastCommonSep = 3;
                }
            }
            break;
        }
        const fromCode = from.charCodeAt(fromStart + i);
        const toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode) break;
        else if (fromCode === 92) lastCommonSep = i;
    }
    if (i !== length && lastCommonSep === -1) {
        return toOrig;
    }
    let out = "";
    if (lastCommonSep === -1) lastCommonSep = 0;
    for(i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i){
        if (i === fromEnd || from.charCodeAt(i) === 92) {
            if (out.length === 0) out += "..";
            else out += "\\..";
        }
    }
    if (out.length > 0) {
        return out + toOrig.slice(toStart + lastCommonSep, toEnd);
    } else {
        toStart += lastCommonSep;
        if (toOrig.charCodeAt(toStart) === 92) ++toStart;
        return toOrig.slice(toStart, toEnd);
    }
}
function toNamespacedPath3(path) {
    if (typeof path !== "string") return path;
    if (path.length === 0) return "";
    const resolvedPath = resolve3(path);
    if (resolvedPath.length >= 3) {
        if (resolvedPath.charCodeAt(0) === 92) {
            if (resolvedPath.charCodeAt(1) === 92) {
                const code = resolvedPath.charCodeAt(2);
                if (code !== 63 && code !== 46) {
                    return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
                }
            }
        } else if (isWindowsDeviceRoot1(resolvedPath.charCodeAt(0))) {
            if (resolvedPath.charCodeAt(1) === 58 && resolvedPath.charCodeAt(2) === 92) {
                return `\\\\?\\${resolvedPath}`;
            }
        }
    }
    return path;
}
function dirname3(path) {
    assertPath1(path);
    const len = path.length;
    if (len === 0) return ".";
    let rootEnd = -1;
    let end = -1;
    let matchedSlash = true;
    let offset = 0;
    const code = path.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator1(code)) {
            rootEnd = offset = 1;
            if (isPathSeparator1(path.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator1(path.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator1(path.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator1(path.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            return path;
                        }
                        if (j !== last) {
                            rootEnd = offset = j + 1;
                        }
                    }
                }
            }
        } else if (isWindowsDeviceRoot1(code)) {
            if (path.charCodeAt(1) === 58) {
                rootEnd = offset = 2;
                if (len > 2) {
                    if (isPathSeparator1(path.charCodeAt(2))) rootEnd = offset = 3;
                }
            }
        }
    } else if (isPathSeparator1(code)) {
        return path;
    }
    for(let i = len - 1; i >= offset; --i){
        if (isPathSeparator1(path.charCodeAt(i))) {
            if (!matchedSlash) {
                end = i;
                break;
            }
        } else {
            matchedSlash = false;
        }
    }
    if (end === -1) {
        if (rootEnd === -1) return ".";
        else end = rootEnd;
    }
    return path.slice(0, end);
}
function basename3(path, ext = "") {
    if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
    }
    assertPath1(path);
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i;
    if (path.length >= 2) {
        const drive = path.charCodeAt(0);
        if (isWindowsDeviceRoot1(drive)) {
            if (path.charCodeAt(1) === 58) start = 2;
        }
    }
    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
        if (ext.length === path.length && ext === path) return "";
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for(i = path.length - 1; i >= start; --i){
            const code = path.charCodeAt(i);
            if (isPathSeparator1(code)) {
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            } else {
                if (firstNonSlashEnd === -1) {
                    matchedSlash = false;
                    firstNonSlashEnd = i + 1;
                }
                if (extIdx >= 0) {
                    if (code === ext.charCodeAt(extIdx)) {
                        if (--extIdx === -1) {
                            end = i;
                        }
                    } else {
                        extIdx = -1;
                        end = firstNonSlashEnd;
                    }
                }
            }
        }
        if (start === end) end = firstNonSlashEnd;
        else if (end === -1) end = path.length;
        return path.slice(start, end);
    } else {
        for(i = path.length - 1; i >= start; --i){
            if (isPathSeparator1(path.charCodeAt(i))) {
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            } else if (end === -1) {
                matchedSlash = false;
                end = i + 1;
            }
        }
        if (end === -1) return "";
        return path.slice(start, end);
    }
}
function extname3(path) {
    assertPath1(path);
    let start = 0;
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    if (path.length >= 2 && path.charCodeAt(1) === 58 && isWindowsDeviceRoot1(path.charCodeAt(0))) {
        start = startPart = 2;
    }
    for(let i = path.length - 1; i >= start; --i){
        const code = path.charCodeAt(i);
        if (isPathSeparator1(code)) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
    }
    return path.slice(startDot, end);
}
function format3(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
    }
    return _format1("\\", pathObject);
}
function parse4(path) {
    assertPath1(path);
    const ret = {
        root: "",
        dir: "",
        base: "",
        ext: "",
        name: ""
    };
    const len = path.length;
    if (len === 0) return ret;
    let rootEnd = 0;
    let code = path.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator1(code)) {
            rootEnd = 1;
            if (isPathSeparator1(path.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator1(path.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator1(path.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator1(path.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            rootEnd = j;
                        } else if (j !== last) {
                            rootEnd = j + 1;
                        }
                    }
                }
            }
        } else if (isWindowsDeviceRoot1(code)) {
            if (path.charCodeAt(1) === 58) {
                rootEnd = 2;
                if (len > 2) {
                    if (isPathSeparator1(path.charCodeAt(2))) {
                        if (len === 3) {
                            ret.root = ret.dir = path;
                            return ret;
                        }
                        rootEnd = 3;
                    }
                } else {
                    ret.root = ret.dir = path;
                    return ret;
                }
            }
        }
    } else if (isPathSeparator1(code)) {
        ret.root = ret.dir = path;
        return ret;
    }
    if (rootEnd > 0) ret.root = path.slice(0, rootEnd);
    let startDot = -1;
    let startPart = rootEnd;
    let end = -1;
    let matchedSlash = true;
    let i = path.length - 1;
    let preDotState = 0;
    for(; i >= rootEnd; --i){
        code = path.charCodeAt(i);
        if (isPathSeparator1(code)) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        if (end !== -1) {
            ret.base = ret.name = path.slice(startPart, end);
        }
    } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
        ret.ext = path.slice(startDot, end);
    }
    if (startPart > 0 && startPart !== rootEnd) {
        ret.dir = path.slice(0, startPart - 1);
    } else ret.dir = ret.root;
    return ret;
}
function fromFileUrl3(url) {
    url = url instanceof URL ? url : new URL(url);
    if (url.protocol != "file:") {
        throw new TypeError("Must be a file URL.");
    }
    let path = decodeURIComponent(url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
    if (url.hostname != "") {
        path = `\\\\${url.hostname}${path}`;
    }
    return path;
}
function toFileUrl3(path) {
    if (!isAbsolute3(path)) {
        throw new TypeError("Must be an absolute path.");
    }
    const [, hostname, pathname] = path.match(/^(?:[/\\]{2}([^/\\]+)(?=[/\\](?:[^/\\]|$)))?(.*)/);
    const url = new URL("file:///");
    url.pathname = encodeWhitespace1(pathname.replace(/%/g, "%25"));
    if (hostname != null && hostname != "localhost") {
        url.hostname = hostname;
        if (!url.hostname) {
            throw new TypeError("Invalid hostname.");
        }
    }
    return url;
}
const mod3 = {
    sep: sep3,
    delimiter: delimiter3,
    resolve: resolve3,
    normalize: normalize4,
    isAbsolute: isAbsolute3,
    join: join4,
    relative: relative3,
    toNamespacedPath: toNamespacedPath3,
    dirname: dirname3,
    basename: basename3,
    extname: extname3,
    format: format3,
    parse: parse4,
    fromFileUrl: fromFileUrl3,
    toFileUrl: toFileUrl3
};
const sep4 = "/";
const delimiter4 = ":";
function resolve4(...pathSegments) {
    let resolvedPath = "";
    let resolvedAbsolute = false;
    for(let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--){
        let path;
        if (i >= 0) path = pathSegments[i];
        else {
            const { Deno  } = globalThis;
            if (typeof Deno?.cwd !== "function") {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path = Deno.cwd();
        }
        assertPath1(path);
        if (path.length === 0) {
            continue;
        }
        resolvedPath = `${path}/${resolvedPath}`;
        resolvedAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH1;
    }
    resolvedPath = normalizeString1(resolvedPath, !resolvedAbsolute, "/", isPosixPathSeparator1);
    if (resolvedAbsolute) {
        if (resolvedPath.length > 0) return `/${resolvedPath}`;
        else return "/";
    } else if (resolvedPath.length > 0) return resolvedPath;
    else return ".";
}
function normalize5(path) {
    assertPath1(path);
    if (path.length === 0) return ".";
    const isAbsolute = path.charCodeAt(0) === 47;
    const trailingSeparator = path.charCodeAt(path.length - 1) === 47;
    path = normalizeString1(path, !isAbsolute, "/", isPosixPathSeparator1);
    if (path.length === 0 && !isAbsolute) path = ".";
    if (path.length > 0 && trailingSeparator) path += "/";
    if (isAbsolute) return `/${path}`;
    return path;
}
function isAbsolute4(path) {
    assertPath1(path);
    return path.length > 0 && path.charCodeAt(0) === 47;
}
function join5(...paths) {
    if (paths.length === 0) return ".";
    let joined;
    for(let i = 0, len = paths.length; i < len; ++i){
        const path = paths[i];
        assertPath1(path);
        if (path.length > 0) {
            if (!joined) joined = path;
            else joined += `/${path}`;
        }
    }
    if (!joined) return ".";
    return normalize5(joined);
}
function relative4(from, to) {
    assertPath1(from);
    assertPath1(to);
    if (from === to) return "";
    from = resolve4(from);
    to = resolve4(to);
    if (from === to) return "";
    let fromStart = 1;
    const fromEnd = from.length;
    for(; fromStart < fromEnd; ++fromStart){
        if (from.charCodeAt(fromStart) !== 47) break;
    }
    const fromLen = fromEnd - fromStart;
    let toStart = 1;
    const toEnd = to.length;
    for(; toStart < toEnd; ++toStart){
        if (to.charCodeAt(toStart) !== 47) break;
    }
    const toLen = toEnd - toStart;
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i = 0;
    for(; i <= length; ++i){
        if (i === length) {
            if (toLen > length) {
                if (to.charCodeAt(toStart + i) === 47) {
                    return to.slice(toStart + i + 1);
                } else if (i === 0) {
                    return to.slice(toStart + i);
                }
            } else if (fromLen > length) {
                if (from.charCodeAt(fromStart + i) === 47) {
                    lastCommonSep = i;
                } else if (i === 0) {
                    lastCommonSep = 0;
                }
            }
            break;
        }
        const fromCode = from.charCodeAt(fromStart + i);
        const toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode) break;
        else if (fromCode === 47) lastCommonSep = i;
    }
    let out = "";
    for(i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i){
        if (i === fromEnd || from.charCodeAt(i) === 47) {
            if (out.length === 0) out += "..";
            else out += "/..";
        }
    }
    if (out.length > 0) return out + to.slice(toStart + lastCommonSep);
    else {
        toStart += lastCommonSep;
        if (to.charCodeAt(toStart) === 47) ++toStart;
        return to.slice(toStart);
    }
}
function toNamespacedPath4(path) {
    return path;
}
function dirname4(path) {
    assertPath1(path);
    if (path.length === 0) return ".";
    const hasRoot = path.charCodeAt(0) === 47;
    let end = -1;
    let matchedSlash = true;
    for(let i = path.length - 1; i >= 1; --i){
        if (path.charCodeAt(i) === 47) {
            if (!matchedSlash) {
                end = i;
                break;
            }
        } else {
            matchedSlash = false;
        }
    }
    if (end === -1) return hasRoot ? "/" : ".";
    if (hasRoot && end === 1) return "//";
    return path.slice(0, end);
}
function basename4(path, ext = "") {
    if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
    }
    assertPath1(path);
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i;
    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
        if (ext.length === path.length && ext === path) return "";
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for(i = path.length - 1; i >= 0; --i){
            const code = path.charCodeAt(i);
            if (code === 47) {
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            } else {
                if (firstNonSlashEnd === -1) {
                    matchedSlash = false;
                    firstNonSlashEnd = i + 1;
                }
                if (extIdx >= 0) {
                    if (code === ext.charCodeAt(extIdx)) {
                        if (--extIdx === -1) {
                            end = i;
                        }
                    } else {
                        extIdx = -1;
                        end = firstNonSlashEnd;
                    }
                }
            }
        }
        if (start === end) end = firstNonSlashEnd;
        else if (end === -1) end = path.length;
        return path.slice(start, end);
    } else {
        for(i = path.length - 1; i >= 0; --i){
            if (path.charCodeAt(i) === 47) {
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            } else if (end === -1) {
                matchedSlash = false;
                end = i + 1;
            }
        }
        if (end === -1) return "";
        return path.slice(start, end);
    }
}
function extname4(path) {
    assertPath1(path);
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    for(let i = path.length - 1; i >= 0; --i){
        const code = path.charCodeAt(i);
        if (code === 47) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
    }
    return path.slice(startDot, end);
}
function format4(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
    }
    return _format1("/", pathObject);
}
function parse5(path) {
    assertPath1(path);
    const ret = {
        root: "",
        dir: "",
        base: "",
        ext: "",
        name: ""
    };
    if (path.length === 0) return ret;
    const isAbsolute = path.charCodeAt(0) === 47;
    let start;
    if (isAbsolute) {
        ret.root = "/";
        start = 1;
    } else {
        start = 0;
    }
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let i = path.length - 1;
    let preDotState = 0;
    for(; i >= start; --i){
        const code = path.charCodeAt(i);
        if (code === 47) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        if (end !== -1) {
            if (startPart === 0 && isAbsolute) {
                ret.base = ret.name = path.slice(1, end);
            } else {
                ret.base = ret.name = path.slice(startPart, end);
            }
        }
    } else {
        if (startPart === 0 && isAbsolute) {
            ret.name = path.slice(1, startDot);
            ret.base = path.slice(1, end);
        } else {
            ret.name = path.slice(startPart, startDot);
            ret.base = path.slice(startPart, end);
        }
        ret.ext = path.slice(startDot, end);
    }
    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);
    else if (isAbsolute) ret.dir = "/";
    return ret;
}
function fromFileUrl4(url) {
    url = url instanceof URL ? url : new URL(url);
    if (url.protocol != "file:") {
        throw new TypeError("Must be a file URL.");
    }
    return decodeURIComponent(url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"));
}
function toFileUrl4(path) {
    if (!isAbsolute4(path)) {
        throw new TypeError("Must be an absolute path.");
    }
    const url = new URL("file:///");
    url.pathname = encodeWhitespace1(path.replace(/%/g, "%25").replace(/\\/g, "%5C"));
    return url;
}
const mod4 = {
    sep: sep4,
    delimiter: delimiter4,
    resolve: resolve4,
    normalize: normalize5,
    isAbsolute: isAbsolute4,
    join: join5,
    relative: relative4,
    toNamespacedPath: toNamespacedPath4,
    dirname: dirname4,
    basename: basename4,
    extname: extname4,
    format: format4,
    parse: parse5,
    fromFileUrl: fromFileUrl4,
    toFileUrl: toFileUrl4
};
const path2 = isWindows1 ? mod3 : mod4;
const { join: join6 , normalize: normalize6  } = path2;
const path3 = isWindows1 ? mod3 : mod4;
const { basename: basename5 , delimiter: delimiter5 , dirname: dirname5 , extname: extname5 , format: format5 , fromFileUrl: fromFileUrl5 , isAbsolute: isAbsolute5 , join: join7 , normalize: normalize7 , parse: parse6 , relative: relative5 , resolve: resolve5 , sep: sep5 , toFileUrl: toFileUrl5 , toNamespacedPath: toNamespacedPath5 ,  } = path3;
function getFileInfoType(fileInfo) {
    return fileInfo.isFile ? "file" : fileInfo.isDirectory ? "dir" : fileInfo.isSymlink ? "symlink" : undefined;
}
function ensureDirSync(dir) {
    try {
        const fileInfo = Deno.lstatSync(dir);
        if (!fileInfo.isDirectory) {
            throw new Error(`Ensure path exists, expected 'dir', got '${getFileInfoType(fileInfo)}'`);
        }
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            Deno.mkdirSync(dir, {
                recursive: true
            });
            return;
        }
        throw err;
    }
}
function existsSync1(filePath) {
    try {
        Deno.lstatSync(filePath);
        return true;
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            return false;
        }
        throw err;
    }
}
var EOL;
(function(EOL) {
    EOL["LF"] = "\n";
    EOL["CRLF"] = "\r\n";
})(EOL || (EOL = {
}));
const main = {
    ARROW_UP: "↑",
    ARROW_DOWN: "↓",
    ARROW_LEFT: "←",
    ARROW_RIGHT: "→",
    ARROW_UP_LEFT: "↖",
    ARROW_UP_RIGHT: "↗",
    ARROW_DOWN_RIGHT: "↘",
    ARROW_DOWN_LEFT: "↙",
    RADIO_ON: "◉",
    RADIO_OFF: "◯",
    TICK: "✔",
    CROSS: "✘",
    ELLIPSIS: "…",
    POINTER_SMALL: "›",
    LINE: "─",
    POINTER: "❯",
    INFO: "ℹ",
    TAB_LEFT: "⇤",
    TAB_RIGHT: "⇥",
    ESCAPE: "⎋",
    BACKSPACE: "⌫",
    PAGE_UP: "⇞",
    PAGE_DOWN: "⇟",
    ENTER: "↵",
    SEARCH: "⌕"
};
const win = {
    ...main,
    RADIO_ON: "(*)",
    RADIO_OFF: "( )",
    TICK: "√",
    CROSS: "×",
    POINTER_SMALL: "»"
};
const Figures = Deno.build.os === "windows" ? win : main;
const base64abc = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "+",
    "/"
];
function encode(data) {
    const uint8 = typeof data === "string" ? new TextEncoder().encode(data) : data instanceof Uint8Array ? data : new Uint8Array(data);
    let result = "", i;
    const l = uint8.length;
    for(i = 2; i < l; i += 3){
        result += base64abc[uint8[i - 2] >> 2];
        result += base64abc[(uint8[i - 2] & 3) << 4 | uint8[i - 1] >> 4];
        result += base64abc[(uint8[i - 1] & 15) << 2 | uint8[i] >> 6];
        result += base64abc[uint8[i] & 63];
    }
    if (i === l + 1) {
        result += base64abc[uint8[i - 2] >> 2];
        result += base64abc[(uint8[i - 2] & 3) << 4];
        result += "==";
    }
    if (i === l) {
        result += base64abc[uint8[i - 2] >> 2];
        result += base64abc[(uint8[i - 2] & 3) << 4 | uint8[i - 1] >> 4];
        result += base64abc[(uint8[i - 1] & 15) << 2];
        result += "=";
    }
    return result;
}
const ESC = "\x1B";
const CSI = `${ESC}[`;
const OSC = `${ESC}]`;
const SEP1 = ";";
const bel = "\u0007";
const cursorPosition = `${CSI}6n`;
function cursorTo(x, y) {
    if (typeof y !== "number") {
        return `${CSI}${x}G`;
    }
    return `${CSI}${y};${x}H`;
}
function cursorMove(x, y) {
    let ret = "";
    if (x < 0) {
        ret += `${CSI}${-x}D`;
    } else if (x > 0) {
        ret += `${CSI}${x}C`;
    }
    if (y < 0) {
        ret += `${CSI}${-y}A`;
    } else if (y > 0) {
        ret += `${CSI}${y}B`;
    }
    return ret;
}
function cursorUp(count = 1) {
    return `${CSI}${count}A`;
}
function cursorDown(count = 1) {
    return `${CSI}${count}B`;
}
function cursorForward(count = 1) {
    return `${CSI}${count}C`;
}
function cursorBackward(count = 1) {
    return `${CSI}${count}D`;
}
function cursorNextLine(count = 1) {
    return `${CSI}E`.repeat(count);
}
function cursorPrevLine(count = 1) {
    return `${CSI}F`.repeat(count);
}
const cursorLeft = `${CSI}G`;
const cursorHide = `${CSI}?25l`;
const cursorShow = `${CSI}?25h`;
const cursorSave = `${ESC}7`;
const cursorRestore = `${ESC}8`;
function scrollUp(count = 1) {
    return `${CSI}S`.repeat(count);
}
function scrollDown(count = 1) {
    return `${CSI}T`.repeat(count);
}
const eraseScreen = `${CSI}2J`;
function eraseUp(count = 1) {
    return `${CSI}1J`.repeat(count);
}
function eraseDown(count = 1) {
    return `${CSI}0J`.repeat(count);
}
const eraseLine = `${CSI}2K`;
const eraseLineEnd = `${CSI}0K`;
const eraseLineStart = `${CSI}1K`;
function eraseLines(count) {
    let clear = "";
    for(let i = 0; i < count; i++){
        clear += eraseLine + (i < count - 1 ? cursorUp() : "");
    }
    clear += cursorLeft;
    return clear;
}
const clearScreen = "\u001Bc";
const clearTerminal = Deno.build.os === "windows" ? `${eraseScreen}${CSI}0f` : `${eraseScreen}${CSI}3J${CSI}H`;
function link(text, url) {
    return [
        OSC,
        "8",
        SEP1,
        SEP1,
        url,
        bel,
        text,
        OSC,
        "8",
        SEP1,
        SEP1,
        bel, 
    ].join("");
}
function image(buffer, options) {
    let ret = `${OSC}1337;File=inline=1`;
    if (options?.width) {
        ret += `;width=${options.width}`;
    }
    if (options?.height) {
        ret += `;height=${options.height}`;
    }
    if (options?.preserveAspectRatio === false) {
        ret += ";preserveAspectRatio=0";
    }
    return ret + ":" + encode(buffer) + bel;
}
const mod5 = {
    bel: bel,
    cursorPosition: cursorPosition,
    cursorTo: cursorTo,
    cursorMove: cursorMove,
    cursorUp: cursorUp,
    cursorDown: cursorDown,
    cursorForward: cursorForward,
    cursorBackward: cursorBackward,
    cursorNextLine: cursorNextLine,
    cursorPrevLine: cursorPrevLine,
    cursorLeft: cursorLeft,
    cursorHide: cursorHide,
    cursorShow: cursorShow,
    cursorSave: cursorSave,
    cursorRestore: cursorRestore,
    scrollUp: scrollUp,
    scrollDown: scrollDown,
    eraseScreen: eraseScreen,
    eraseUp: eraseUp,
    eraseDown: eraseDown,
    eraseLine: eraseLine,
    eraseLineEnd: eraseLineEnd,
    eraseLineStart: eraseLineStart,
    eraseLines: eraseLines,
    clearScreen: clearScreen,
    clearTerminal: clearTerminal,
    link: link,
    image: image
};
function getCursorPosition({ stdin =Deno.stdin , stdout =Deno.stdout  } = {
}) {
    const data = new Uint8Array(8);
    Deno.setRaw(stdin.rid, true);
    stdout.writeSync(new TextEncoder().encode(cursorPosition));
    stdin.readSync(data);
    Deno.setRaw(stdin.rid, false);
    const [y, x] = new TextDecoder().decode(data).match(/\[(\d+);(\d+)R/)?.slice(1, 3).map(Number) ?? [
        0,
        0
    ];
    return {
        x,
        y
    };
}
const tty1 = factory();
function factory(options) {
    let result = "";
    let stack = [];
    const stdout = options?.stdout ?? Deno.stdout;
    const stdin = options?.stdin ?? Deno.stdin;
    const tty = function(...args) {
        if (this) {
            update(args);
            stdout.writeSync(new TextEncoder().encode(result));
            return this;
        }
        return factory(args[0] ?? options);
    };
    tty.text = function(text) {
        stack.push([
            text,
            []
        ]);
        update();
        stdout.writeSync(new TextEncoder().encode(result));
        return this;
    };
    tty.getCursorPosition = ()=>getCursorPosition({
            stdout,
            stdin
        })
    ;
    const methodList = Object.entries(mod5);
    for (const [name, method] of methodList){
        if (name === "cursorPosition") {
            continue;
        }
        Object.defineProperty(tty, name, {
            get () {
                stack.push([
                    method,
                    []
                ]);
                return this;
            }
        });
    }
    return tty;
    function update(args) {
        if (!stack.length) {
            return;
        }
        if (args) {
            stack[stack.length - 1][1] = args;
        }
        result = stack.reduce((prev, [cur, args])=>prev + (typeof cur === "string" ? cur : cur.call(tty, ...args))
        , "");
        stack = [];
    }
}
const KeyMap = {
    "[P": "f1",
    "[Q": "f2",
    "[R": "f3",
    "[S": "f4",
    "OP": "f1",
    "OQ": "f2",
    "OR": "f3",
    "OS": "f4",
    "[11~": "f1",
    "[12~": "f2",
    "[13~": "f3",
    "[14~": "f4",
    "[[A": "f1",
    "[[B": "f2",
    "[[C": "f3",
    "[[D": "f4",
    "[[E": "f5",
    "[15~": "f5",
    "[17~": "f6",
    "[18~": "f7",
    "[19~": "f8",
    "[20~": "f9",
    "[21~": "f10",
    "[23~": "f11",
    "[24~": "f12",
    "[A": "up",
    "[B": "down",
    "[C": "right",
    "[D": "left",
    "[E": "clear",
    "[F": "end",
    "[H": "home",
    "OA": "up",
    "OB": "down",
    "OC": "right",
    "OD": "left",
    "OE": "clear",
    "OF": "end",
    "OH": "home",
    "[1~": "home",
    "[2~": "insert",
    "[3~": "delete",
    "[4~": "end",
    "[5~": "pageup",
    "[6~": "pagedown",
    "[[5~": "pageup",
    "[[6~": "pagedown",
    "[7~": "home",
    "[8~": "end"
};
const KeyMapShift = {
    "[a": "up",
    "[b": "down",
    "[c": "right",
    "[d": "left",
    "[e": "clear",
    "[2$": "insert",
    "[3$": "delete",
    "[5$": "pageup",
    "[6$": "pagedown",
    "[7$": "home",
    "[8$": "end",
    "[Z": "tab"
};
const KeyMapCtrl = {
    "Oa": "up",
    "Ob": "down",
    "Oc": "right",
    "Od": "left",
    "Oe": "clear",
    "[2^": "insert",
    "[3^": "delete",
    "[5^": "pageup",
    "[6^": "pagedown",
    "[7^": "home",
    "[8^": "end"
};
const SpecialKeyMap = {
    "\r": "return",
    "\n": "enter",
    "\t": "tab",
    "\b": "backspace",
    "\x7f": "backspace",
    "\x1b": "escape",
    " ": "space"
};
const kEscape = "\x1b";
function parse7(data) {
    let index = -1;
    const keys = [];
    const input = data instanceof Uint8Array ? new TextDecoder().decode(data) : data;
    const hasNext = ()=>input.length - 1 >= index + 1
    ;
    const next = ()=>input[++index]
    ;
    parseNext();
    return keys;
    function parseNext() {
        let ch = next();
        let s = ch;
        let escaped = false;
        const key = {
            name: undefined,
            sequence: undefined,
            code: undefined,
            ctrl: false,
            meta: false,
            shift: false
        };
        if (ch === kEscape && hasNext()) {
            escaped = true;
            s += ch = next();
            if (ch === kEscape) {
                s += ch = next();
            }
        }
        if (escaped && (ch === "O" || ch === "[")) {
            let code = ch;
            let modifier = 0;
            if (ch === "O") {
                s += ch = next();
                if (ch >= "0" && ch <= "9") {
                    modifier = (Number(ch) >> 0) - 1;
                    s += ch = next();
                }
                code += ch;
            } else if (ch === "[") {
                s += ch = next();
                if (ch === "[") {
                    code += ch;
                    s += ch = next();
                }
                const cmdStart = s.length - 1;
                if (ch >= "0" && ch <= "9") {
                    s += ch = next();
                    if (ch >= "0" && ch <= "9") {
                        s += ch = next();
                    }
                }
                if (ch === ";") {
                    s += ch = next();
                    if (ch >= "0" && ch <= "9") {
                        s += next();
                    }
                }
                const cmd = s.slice(cmdStart);
                let match;
                if (match = cmd.match(/^(\d\d?)(;(\d))?([~^$])$/)) {
                    code += match[1] + match[4];
                    modifier = (Number(match[3]) || 1) - 1;
                } else if (match = cmd.match(/^((\d;)?(\d))?([A-Za-z])$/)) {
                    code += match[4];
                    modifier = (Number(match[3]) || 1) - 1;
                } else {
                    code += cmd;
                }
            }
            key.ctrl = !!(modifier & 4);
            key.meta = !!(modifier & 10);
            key.shift = !!(modifier & 1);
            key.code = code;
            if (code in KeyMap) {
                key.name = KeyMap[code];
            } else if (code in KeyMapShift) {
                key.name = KeyMapShift[code];
                key.shift = true;
            } else if (code in KeyMapCtrl) {
                key.name = KeyMapCtrl[code];
                key.ctrl = true;
            } else {
                key.name = "undefined";
            }
        } else if (ch in SpecialKeyMap) {
            key.name = SpecialKeyMap[ch];
            key.meta = escaped;
        } else if (!escaped && ch <= "\x1a") {
            key.name = String.fromCharCode(ch.charCodeAt(0) + "a".charCodeAt(0) - 1);
            key.ctrl = true;
        } else if (/^[0-9A-Za-z]$/.test(ch)) {
            key.name = ch.toLowerCase();
            key.shift = /^[A-Z]$/.test(ch);
            key.meta = escaped;
        } else if (escaped) {
            key.name = ch.length ? undefined : "escape";
            key.meta = true;
        }
        key.sequence = s;
        if (s.length !== 0 && (key.name !== undefined || escaped)) {
            keys.push(key);
        } else if (charLengthAt(s, 0) === s.length) {
            keys.push(key);
        } else {
            throw new Error("Unrecognized or broken escape sequence");
        }
        if (hasNext()) {
            parseNext();
        }
    }
}
function charLengthAt(str, i) {
    const pos = str.codePointAt(i);
    if (typeof pos === "undefined") {
        return 1;
    }
    return pos >= 65536 ? 2 : 1;
}
const { Deno: Deno1  } = globalThis;
const noColor = typeof Deno1?.noColor === "boolean" ? Deno1.noColor : true;
let enabled = !noColor;
function setColorEnabled(value) {
    if (noColor) {
        return;
    }
    enabled = value;
}
function getColorEnabled() {
    return enabled;
}
function code(open, close) {
    return {
        open: `\x1b[${open.join(";")}m`,
        close: `\x1b[${close}m`,
        regexp: new RegExp(`\\x1b\\[${close}m`, "g")
    };
}
function run(str, code) {
    return enabled ? `${code.open}${str.replace(code.regexp, code.open)}${code.close}` : str;
}
function bold(str) {
    return run(str, code([
        1
    ], 22));
}
function dim(str) {
    return run(str, code([
        2
    ], 22));
}
function italic(str) {
    return run(str, code([
        3
    ], 23));
}
function underline(str) {
    return run(str, code([
        4
    ], 24));
}
function red(str) {
    return run(str, code([
        31
    ], 39));
}
function green(str) {
    return run(str, code([
        32
    ], 39));
}
function yellow(str) {
    return run(str, code([
        33
    ], 39));
}
function blue(str) {
    return run(str, code([
        34
    ], 39));
}
function magenta(str) {
    return run(str, code([
        35
    ], 39));
}
const ANSI_PATTERN = new RegExp([
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))", 
].join("|"), "g");
function stripColor(string) {
    return string.replace(ANSI_PATTERN, "");
}
class GenericPrompt {
    static injectedValue;
    settings;
    tty = tty1;
    indent;
    cursor = {
        x: 0,
        y: 0
    };
    #value;
    #lastError;
    #isFirstRun = true;
    static inject(value) {
        GenericPrompt.injectedValue = value;
    }
    constructor(settings){
        this.settings = {
            ...settings,
            keys: {
                submit: [
                    "enter",
                    "return"
                ],
                ...settings.keys ?? {
                }
            }
        };
        this.indent = this.settings.indent ?? " ";
    }
    async prompt() {
        try {
            return await this.#execute();
        } finally{
            this.tty.cursorShow();
        }
    }
    clear() {
        this.tty.cursorLeft.eraseDown();
    }
    #execute = async ()=>{
        if (typeof GenericPrompt.injectedValue !== "undefined" && this.#lastError) {
            throw new Error(await this.error());
        }
        await this.render();
        this.#lastError = undefined;
        if (!await this.read()) {
            return this.#execute();
        }
        if (typeof this.#value === "undefined") {
            throw new Error("internal error: failed to read value");
        }
        this.clear();
        const successMessage = this.success(this.#value);
        if (successMessage) {
            console.log(successMessage);
        }
        GenericPrompt.injectedValue = undefined;
        this.tty.cursorShow();
        return this.#value;
    };
    async render() {
        const result = await Promise.all([
            this.message(),
            this.body?.(),
            this.footer(), 
        ]);
        const content = result.filter(Boolean).join("\n");
        const y = content.split("\n").length - this.cursor.y - 1;
        if (!this.#isFirstRun || this.#lastError) {
            this.clear();
        }
        this.#isFirstRun = false;
        if (Deno.build.os === "windows") {
            console.log(content);
            this.tty.cursorUp();
        } else {
            Deno.stdout.writeSync(new TextEncoder().encode(content));
        }
        if (y) {
            this.tty.cursorUp(y);
        }
        this.tty.cursorTo(this.cursor.x);
    }
    async read() {
        if (typeof GenericPrompt.injectedValue !== "undefined") {
            const value = GenericPrompt.injectedValue;
            await this.#validateValue(value);
        } else {
            const events = await this.#readKey();
            if (!events.length) {
                return false;
            }
            for (const event of events){
                await this.handleEvent(event);
            }
        }
        return typeof this.#value !== "undefined";
    }
    submit() {
        return this.#validateValue(this.getValue());
    }
    message() {
        return `${this.settings.indent}${this.settings.prefix}` + bold(this.settings.message) + this.defaults();
    }
    defaults() {
        let defaultMessage = "";
        if (typeof this.settings.default !== "undefined") {
            defaultMessage += dim(` (${this.format(this.settings.default)})`);
        }
        return defaultMessage;
    }
    success(value) {
        return `${this.settings.indent}${this.settings.prefix}` + bold(this.settings.message) + this.defaults() + " " + this.settings.pointer + " " + green(this.format(value));
    }
    footer() {
        return this.error() ?? this.hint();
    }
    error() {
        return this.#lastError ? this.settings.indent + red(bold(`${Figures.CROSS} `) + this.#lastError) : undefined;
    }
    hint() {
        return this.settings.hint ? this.settings.indent + italic(blue(dim(`${Figures.POINTER} `) + this.settings.hint)) : undefined;
    }
    async handleEvent(event) {
        switch(true){
            case event.name === "c" && event.ctrl:
                this.clear();
                this.tty.cursorShow();
                Deno.exit(130);
                return;
            case this.isKey(this.settings.keys, "submit", event):
                await this.submit();
                break;
        }
    }
    #readKey = async ()=>{
        const data = await this.#readChar();
        return data.length ? parse7(data) : [];
    };
    #readChar = async ()=>{
        const buffer = new Uint8Array(8);
        const isTty = Deno.isatty(Deno.stdin.rid);
        if (isTty) {
            Deno.setRaw(Deno.stdin.rid, true, {
                cbreak: this.settings.cbreak === true
            });
        }
        const nread = await Deno.stdin.read(buffer);
        if (isTty) {
            Deno.setRaw(Deno.stdin.rid, false);
        }
        if (nread === null) {
            return buffer;
        }
        return buffer.subarray(0, nread);
    };
    #transformValue = (value)=>{
        return this.settings.transform ? this.settings.transform(value) : this.transform(value);
    };
    #validateValue = async (value)=>{
        if (!value && typeof this.settings.default !== "undefined") {
            this.#value = this.settings.default;
            return;
        }
        this.#value = undefined;
        this.#lastError = undefined;
        const validation = await (this.settings.validate ? this.settings.validate(value) : this.validate(value));
        if (validation === false) {
            this.#lastError = `Invalid answer.`;
        } else if (typeof validation === "string") {
            this.#lastError = validation;
        } else {
            this.#value = this.#transformValue(value);
        }
    };
    isKey(keys, name, event) {
        const keyNames = keys?.[name];
        return typeof keyNames !== "undefined" && (typeof event.name !== "undefined" && keyNames.indexOf(event.name) !== -1 || typeof event.sequence !== "undefined" && keyNames.indexOf(event.sequence) !== -1);
    }
}
class GenericInput extends GenericPrompt {
    inputValue = "";
    inputIndex = 0;
    constructor(settings){
        super({
            ...settings,
            keys: {
                moveCursorLeft: [
                    "left"
                ],
                moveCursorRight: [
                    "right"
                ],
                deleteCharLeft: [
                    "backspace"
                ],
                deleteCharRight: [
                    "delete"
                ],
                ...settings.keys ?? {
                }
            }
        });
    }
    getCurrentInputValue() {
        return this.inputValue;
    }
    message() {
        const message = super.message() + " " + this.settings.pointer + " ";
        this.cursor.x = stripColor(message).length + this.inputIndex + 1;
        return message + this.input();
    }
    input() {
        return underline(this.inputValue);
    }
    highlight(value, color1 = dim, color2 = blue) {
        value = value.toString();
        const inputLowerCase = this.getCurrentInputValue().toLowerCase();
        const valueLowerCase = value.toLowerCase();
        const index = valueLowerCase.indexOf(inputLowerCase);
        const matched = value.slice(index, index + inputLowerCase.length);
        return index >= 0 ? color1(value.slice(0, index)) + color2(matched) + color1(value.slice(index + inputLowerCase.length)) : value;
    }
    async handleEvent(event) {
        switch(true){
            case event.name === "c" && event.ctrl:
                this.clear();
                this.tty.cursorShow();
                Deno.exit(130);
                return;
            case this.isKey(this.settings.keys, "moveCursorLeft", event):
                this.moveCursorLeft();
                break;
            case this.isKey(this.settings.keys, "moveCursorRight", event):
                this.moveCursorRight();
                break;
            case this.isKey(this.settings.keys, "deleteCharRight", event):
                this.deleteCharRight();
                break;
            case this.isKey(this.settings.keys, "deleteCharLeft", event):
                this.deleteChar();
                break;
            case this.isKey(this.settings.keys, "submit", event):
                await this.submit();
                break;
            default:
                if (event.sequence && !event.meta && !event.ctrl) {
                    this.addChar(event.sequence);
                }
        }
    }
    addChar(__char) {
        this.inputValue = this.inputValue.slice(0, this.inputIndex) + __char + this.inputValue.slice(this.inputIndex);
        this.inputIndex++;
    }
    moveCursorLeft() {
        if (this.inputIndex > 0) {
            this.inputIndex--;
        }
    }
    moveCursorRight() {
        if (this.inputIndex < this.inputValue.length) {
            this.inputIndex++;
        }
    }
    deleteChar() {
        if (this.inputIndex > 0) {
            this.inputIndex--;
            this.deleteCharRight();
        }
    }
    deleteCharRight() {
        if (this.inputIndex < this.inputValue.length) {
            this.inputValue = this.inputValue.slice(0, this.inputIndex) + this.inputValue.slice(this.inputIndex + 1);
        }
    }
}
function distance(a, b) {
    if (a.length == 0) {
        return b.length;
    }
    if (b.length == 0) {
        return a.length;
    }
    const matrix = [];
    for(let i = 0; i <= b.length; i++){
        matrix[i] = [
            i
        ];
    }
    for(let j = 0; j <= a.length; j++){
        matrix[0][j] = j;
    }
    for(let i1 = 1; i1 <= b.length; i1++){
        for(let j = 1; j <= a.length; j++){
            if (b.charAt(i1 - 1) == a.charAt(j - 1)) {
                matrix[i1][j] = matrix[i1 - 1][j - 1];
            } else {
                matrix[i1][j] = Math.min(matrix[i1 - 1][j - 1] + 1, Math.min(matrix[i1][j - 1] + 1, matrix[i1 - 1][j] + 1));
            }
        }
    }
    return matrix[b.length][a.length];
}
class GenericList extends GenericInput {
    options = this.settings.options;
    listIndex = this.getListIndex();
    listOffset = this.getPageOffset(this.listIndex);
    static separator(label = "------------") {
        return {
            value: label,
            disabled: true
        };
    }
    static mapOption(option) {
        return {
            value: option.value,
            name: typeof option.name === "undefined" ? option.value : option.name,
            disabled: !!option.disabled
        };
    }
    constructor(settings){
        super({
            ...settings,
            keys: {
                previous: settings.search ? [
                    "up"
                ] : [
                    "up",
                    "u",
                    "8"
                ],
                next: settings.search ? [
                    "down"
                ] : [
                    "down",
                    "d",
                    "2"
                ],
                previousPage: [
                    "pageup"
                ],
                nextPage: [
                    "pagedown"
                ],
                ...settings.keys ?? {
                }
            }
        });
    }
    match() {
        const input = this.getCurrentInputValue().toLowerCase();
        if (!input.length) {
            this.options = this.settings.options.slice();
        } else {
            this.options = this.settings.options.filter((option)=>match(option.name) || option.name !== option.value && match(option.value)
            ).sort((a, b)=>distance(a.name, input) - distance(b.name, input)
            );
        }
        this.listIndex = Math.max(0, Math.min(this.options.length - 1, this.listIndex));
        this.listOffset = Math.max(0, Math.min(this.options.length - this.getListHeight(), this.listOffset));
        function match(value) {
            return stripColor(value).toLowerCase().includes(input);
        }
    }
    message() {
        let message = `${this.settings.indent}${this.settings.prefix}` + bold(this.settings.message) + this.defaults();
        if (this.settings.search) {
            message += " " + this.settings.searchLabel + " ";
        }
        this.cursor.x = stripColor(message).length + this.inputIndex + 1;
        return message + this.input();
    }
    body() {
        return this.getList() + this.getInfo();
    }
    getInfo() {
        if (!this.settings.info) {
            return "";
        }
        const selected = this.listIndex + 1;
        const actions = [
            [
                "Next",
                [
                    Figures.ARROW_DOWN
                ]
            ],
            [
                "Previous",
                [
                    Figures.ARROW_UP
                ]
            ],
            [
                "Next Page",
                [
                    Figures.PAGE_DOWN
                ]
            ],
            [
                "Previous Page",
                [
                    Figures.PAGE_UP
                ]
            ],
            [
                "Submit",
                [
                    Figures.ENTER
                ]
            ], 
        ];
        return "\n" + this.settings.indent + blue(Figures.INFO) + bold(` ${selected}/${this.options.length} `) + actions.map((cur)=>`${cur[0]}: ${bold(cur[1].join(" "))}`
        ).join(", ");
    }
    getList() {
        const list = [];
        const height = this.getListHeight();
        for(let i = this.listOffset; i < this.listOffset + height; i++){
            list.push(this.getListItem(this.options[i], this.listIndex === i));
        }
        if (!list.length) {
            list.push(this.settings.indent + dim("  No matches..."));
        }
        return list.join("\n");
    }
    getListHeight() {
        return Math.min(this.options.length, this.settings.maxRows || this.options.length);
    }
    getListIndex(value) {
        return typeof value === "undefined" ? this.options.findIndex((item)=>!item.disabled
        ) || 0 : this.options.findIndex((item)=>item.value === value
        ) || 0;
    }
    getPageOffset(index) {
        if (index === 0) {
            return 0;
        }
        const height = this.getListHeight();
        return Math.floor(index / height) * height;
    }
    getOptionByValue(value) {
        return this.options.find((option)=>option.value === value
        );
    }
    read() {
        if (!this.settings.search) {
            this.tty.cursorHide();
        }
        return super.read();
    }
    async handleEvent(event) {
        switch(true){
            case this.isKey(this.settings.keys, "previous", event):
                this.selectPrevious();
                break;
            case this.isKey(this.settings.keys, "next", event):
                this.selectNext();
                break;
            case this.isKey(this.settings.keys, "nextPage", event):
                this.selectNextPage();
                break;
            case this.isKey(this.settings.keys, "previousPage", event):
                this.selectPreviousPage();
                break;
            default:
                await super.handleEvent(event);
        }
    }
    moveCursorLeft() {
        if (this.settings.search) {
            super.moveCursorLeft();
        }
    }
    moveCursorRight() {
        if (this.settings.search) {
            super.moveCursorRight();
        }
    }
    deleteChar() {
        if (this.settings.search) {
            super.deleteChar();
        }
    }
    deleteCharRight() {
        if (this.settings.search) {
            super.deleteCharRight();
            this.match();
        }
    }
    addChar(__char) {
        if (this.settings.search) {
            super.addChar(__char);
            this.match();
        }
    }
    selectPrevious() {
        if (this.options.length < 2) {
            return;
        }
        if (this.listIndex > 0) {
            this.listIndex--;
            if (this.listIndex < this.listOffset) {
                this.listOffset--;
            }
            if (this.options[this.listIndex].disabled) {
                this.selectPrevious();
            }
        } else {
            this.listIndex = this.options.length - 1;
            this.listOffset = this.options.length - this.getListHeight();
            if (this.options[this.listIndex].disabled) {
                this.selectPrevious();
            }
        }
    }
    selectNext() {
        if (this.options.length < 2) {
            return;
        }
        if (this.listIndex < this.options.length - 1) {
            this.listIndex++;
            if (this.listIndex >= this.listOffset + this.getListHeight()) {
                this.listOffset++;
            }
            if (this.options[this.listIndex].disabled) {
                this.selectNext();
            }
        } else {
            this.listIndex = this.listOffset = 0;
            if (this.options[this.listIndex].disabled) {
                this.selectNext();
            }
        }
    }
    selectPreviousPage() {
        if (this.options?.length) {
            const height = this.getListHeight();
            if (this.listOffset >= height) {
                this.listIndex -= height;
                this.listOffset -= height;
            } else if (this.listOffset > 0) {
                this.listIndex -= this.listOffset;
                this.listOffset = 0;
            }
        }
    }
    selectNextPage() {
        if (this.options?.length) {
            const height = this.getListHeight();
            if (this.listOffset + height + height < this.options.length) {
                this.listIndex += height;
                this.listOffset += height;
            } else if (this.listOffset + height < this.options.length) {
                const offset = this.options.length - height;
                this.listIndex += offset - this.listOffset;
                this.listOffset = offset;
            }
        }
    }
}
class Checkbox extends GenericList {
    static inject(value) {
        GenericPrompt.inject(value);
    }
    static prompt(options) {
        return new this({
            pointer: blue(Figures.POINTER_SMALL),
            prefix: yellow("? "),
            indent: " ",
            listPointer: blue(Figures.POINTER),
            maxRows: 10,
            searchLabel: blue(Figures.SEARCH),
            minOptions: 0,
            maxOptions: Infinity,
            check: green(Figures.TICK),
            uncheck: red(Figures.CROSS),
            ...options,
            keys: {
                check: [
                    "space"
                ],
                ...options.keys ?? {
                }
            },
            options: Checkbox.mapOptions(options)
        }).prompt();
    }
    static separator(label) {
        return {
            ...super.separator(label),
            icon: false
        };
    }
    static mapOptions(options) {
        return options.options.map((item)=>typeof item === "string" ? {
                value: item
            } : item
        ).map((item)=>({
                ...this.mapOption(item),
                checked: typeof item.checked === "undefined" && options.default && options.default.indexOf(item.value) !== -1 ? true : !!item.checked,
                icon: typeof item.icon === "undefined" ? true : item.icon
            })
        );
    }
    getListItem(item, isSelected) {
        let line = this.settings.indent;
        line += isSelected ? this.settings.listPointer + " " : "  ";
        if (item.icon) {
            let check = item.checked ? this.settings.check + " " : this.settings.uncheck + " ";
            if (item.disabled) {
                check = dim(check);
            }
            line += check;
        } else {
            line += "  ";
        }
        line += `${isSelected ? this.highlight(item.name, (val)=>val
        ) : this.highlight(item.name)}`;
        return line;
    }
    getValue() {
        return this.settings.options.filter((item)=>item.checked
        ).map((item)=>item.value
        );
    }
    async handleEvent(event) {
        switch(true){
            case this.isKey(this.settings.keys, "check", event):
                this.checkValue();
                break;
            default:
                await super.handleEvent(event);
        }
    }
    checkValue() {
        const item = this.options[this.listIndex];
        item.checked = !item.checked;
    }
    validate(value) {
        const isValidValue = Array.isArray(value) && value.every((val)=>typeof val === "string" && val.length > 0 && this.settings.options.findIndex((option)=>option.value === val
            ) !== -1
        );
        if (!isValidValue) {
            return false;
        }
        if (value.length < this.settings.minOptions) {
            return `The minimum number of options is ${this.settings.minOptions} but got ${value.length}.`;
        }
        if (value.length > this.settings.maxOptions) {
            return `The maximum number of options is ${this.settings.maxOptions} but got ${value.length}.`;
        }
        return true;
    }
    transform(value) {
        return value.map((val)=>val.trim()
        );
    }
    format(value) {
        return value.map((val)=>this.getOptionByValue(val)?.name ?? val
        ).join(", ");
    }
}
class GenericSuggestions extends GenericInput {
    suggestionsIndex = -1;
    suggestionsOffset = 0;
    suggestions = [];
    constructor(settings){
        super({
            ...settings,
            keys: {
                complete: [
                    "tab"
                ],
                next: [
                    "up"
                ],
                previous: [
                    "down"
                ],
                nextPage: [
                    "pageup"
                ],
                previousPage: [
                    "pagedown"
                ],
                ...settings.keys ?? {
                }
            }
        });
        const suggestions = this.loadSuggestions();
        if (suggestions.length || this.settings.suggestions) {
            this.settings.suggestions = [
                ...suggestions,
                ...this.settings.suggestions ?? [], 
            ].filter(uniqueSuggestions);
        }
    }
    get localStorage() {
        if (this.settings.id && "localStorage" in window) {
            try {
                return window.localStorage;
            } catch (_) {
            }
        }
        return null;
    }
    loadSuggestions() {
        if (this.settings.id) {
            const json = this.localStorage?.getItem(this.settings.id);
            const suggestions = json ? JSON.parse(json) : [];
            if (!Array.isArray(suggestions)) {
                return [];
            }
            return suggestions;
        }
        return [];
    }
    saveSuggestions(...suggestions) {
        if (this.settings.id) {
            this.localStorage?.setItem(this.settings.id, JSON.stringify([
                ...suggestions,
                ...this.loadSuggestions(), 
            ].filter(uniqueSuggestions)));
        }
    }
    render() {
        this.match();
        return super.render();
    }
    match() {
        if (!this.settings.suggestions?.length) {
            return;
        }
        const input = this.getCurrentInputValue().toLowerCase();
        if (!input.length) {
            this.suggestions = this.settings.suggestions.slice();
        } else {
            this.suggestions = this.settings.suggestions.filter((value)=>stripColor(value.toString()).toLowerCase().startsWith(input)
            ).sort((a, b)=>distance((a || a).toString(), input) - distance((b || b).toString(), input)
            );
        }
        this.suggestionsIndex = Math.max(this.getCurrentInputValue().trim().length === 0 ? -1 : 0, Math.min(this.suggestions.length - 1, this.suggestionsIndex));
        this.suggestionsOffset = Math.max(0, Math.min(this.suggestions.length - this.getListHeight(), this.suggestionsOffset));
    }
    input() {
        return super.input() + dim(this.getSuggestion());
    }
    getSuggestion() {
        return this.suggestions[this.suggestionsIndex]?.toString().substr(this.getCurrentInputValue().length) ?? "";
    }
    body() {
        return this.getList() + this.getInfo();
    }
    getInfo() {
        if (!this.settings.info) {
            return "";
        }
        const selected = this.suggestionsIndex + 1;
        const matched = this.suggestions.length;
        const actions = [];
        if (this.settings.suggestions?.length) {
            if (this.settings.list) {
                actions.push([
                    "Next",
                    [
                        Figures.ARROW_DOWN
                    ]
                ], [
                    "Previous",
                    [
                        Figures.ARROW_UP
                    ]
                ], [
                    "Next Page",
                    [
                        Figures.PAGE_DOWN
                    ]
                ], [
                    "Previous Page",
                    [
                        Figures.PAGE_UP
                    ]
                ]);
            } else {
                actions.push([
                    "Next",
                    [
                        Figures.ARROW_UP
                    ]
                ], [
                    "Previous",
                    [
                        Figures.ARROW_DOWN
                    ]
                ]);
            }
            actions.push([
                "Complete",
                [
                    Figures.TAB_RIGHT,
                    dim(" or"),
                    Figures.ARROW_RIGHT
                ]
            ]);
        }
        actions.push([
            "Submit",
            [
                Figures.ENTER
            ]
        ]);
        let info = this.settings.indent;
        if (this.settings.suggestions?.length) {
            info += blue(Figures.INFO) + bold(` ${selected}/${matched} `);
        }
        info += actions.map((cur)=>`${cur[0]}: ${bold(cur[1].join(" "))}`
        ).join(", ");
        return info;
    }
    getList() {
        if (!this.settings.suggestions?.length || !this.settings.list) {
            return "";
        }
        const list = [];
        const height = this.getListHeight();
        for(let i = this.suggestionsOffset; i < this.suggestionsOffset + height; i++){
            list.push(this.getListItem(this.suggestions[i], this.suggestionsIndex === i));
        }
        if (list.length && this.settings.info) {
            list.push("");
        }
        return list.join("\n");
    }
    getListItem(value, isSelected) {
        let line = this.settings.indent ?? "";
        line += isSelected ? `${this.settings.listPointer} ` : "  ";
        if (isSelected) {
            line += underline(this.highlight(value));
        } else {
            line += this.highlight(value);
        }
        return line;
    }
    getListHeight(suggestions = this.suggestions) {
        return Math.min(suggestions.length, this.settings.maxRows || suggestions.length);
    }
    async handleEvent(event) {
        switch(true){
            case this.isKey(this.settings.keys, "next", event):
                if (this.settings.list) {
                    this.selectPreviousSuggestion();
                } else {
                    this.selectNextSuggestion();
                }
                break;
            case this.isKey(this.settings.keys, "previous", event):
                if (this.settings.list) {
                    this.selectNextSuggestion();
                } else {
                    this.selectPreviousSuggestion();
                }
                break;
            case this.isKey(this.settings.keys, "nextPage", event):
                if (this.settings.list) {
                    this.selectPreviousSuggestionsPage();
                } else {
                    this.selectNextSuggestionsPage();
                }
                break;
            case this.isKey(this.settings.keys, "previousPage", event):
                if (this.settings.list) {
                    this.selectNextSuggestionsPage();
                } else {
                    this.selectPreviousSuggestionsPage();
                }
                break;
            case this.isKey(this.settings.keys, "complete", event):
                this.complete();
                break;
            case this.isKey(this.settings.keys, "moveCursorRight", event):
                if (this.inputIndex < this.inputValue.length) {
                    this.moveCursorRight();
                } else {
                    this.complete();
                }
                break;
            default:
                await super.handleEvent(event);
        }
    }
    deleteCharRight() {
        if (this.inputIndex < this.inputValue.length) {
            super.deleteCharRight();
            if (!this.getCurrentInputValue().length) {
                this.suggestionsIndex = -1;
                this.suggestionsOffset = 0;
            }
        }
    }
    complete() {
        if (this.suggestions.length && this.suggestions[this.suggestionsIndex]) {
            this.inputValue = this.suggestions[this.suggestionsIndex].toString();
            this.inputIndex = this.inputValue.length;
            this.suggestionsIndex = 0;
            this.suggestionsOffset = 0;
        }
    }
    selectPreviousSuggestion() {
        if (this.suggestions?.length) {
            if (this.suggestionsIndex > -1) {
                this.suggestionsIndex--;
                if (this.suggestionsIndex < this.suggestionsOffset) {
                    this.suggestionsOffset--;
                }
            }
        }
    }
    selectNextSuggestion() {
        if (this.suggestions?.length) {
            if (this.suggestionsIndex < this.suggestions.length - 1) {
                this.suggestionsIndex++;
                if (this.suggestionsIndex >= this.suggestionsOffset + this.getListHeight()) {
                    this.suggestionsOffset++;
                }
            }
        }
    }
    selectPreviousSuggestionsPage() {
        if (this.suggestions?.length) {
            const height = this.getListHeight();
            if (this.suggestionsOffset >= height) {
                this.suggestionsIndex -= height;
                this.suggestionsOffset -= height;
            } else if (this.suggestionsOffset > 0) {
                this.suggestionsIndex -= this.suggestionsOffset;
                this.suggestionsOffset = 0;
            }
        }
    }
    selectNextSuggestionsPage() {
        if (this.suggestions?.length) {
            const height = this.getListHeight();
            if (this.suggestionsOffset + height + height < this.suggestions.length) {
                this.suggestionsIndex += height;
                this.suggestionsOffset += height;
            } else if (this.suggestionsOffset + height < this.suggestions.length) {
                const offset = this.suggestions.length - height;
                this.suggestionsIndex += offset - this.suggestionsOffset;
                this.suggestionsOffset = offset;
            }
        }
    }
}
function uniqueSuggestions(value, index, self) {
    return typeof value !== "undefined" && value !== "" && self.indexOf(value) === index;
}
class Input extends GenericSuggestions {
    static prompt(options) {
        if (typeof options === "string") {
            options = {
                message: options
            };
        }
        return new this({
            pointer: blue(Figures.POINTER_SMALL),
            prefix: yellow("? "),
            indent: " ",
            listPointer: blue(Figures.POINTER),
            maxRows: 8,
            minLength: 0,
            maxLength: Infinity,
            ...options
        }).prompt();
    }
    static inject(value) {
        GenericPrompt.inject(value);
    }
    success(value) {
        this.saveSuggestions(value);
        return super.success(value);
    }
    getValue() {
        return this.inputValue;
    }
    validate(value) {
        if (typeof value !== "string") {
            return false;
        }
        if (value.length < this.settings.minLength) {
            return `Value must be longer then ${this.settings.minLength} but has a length of ${value.length}.`;
        }
        if (value.length > this.settings.maxLength) {
            return `Value can't be longer then ${this.settings.maxLength} but has a length of ${value.length}.`;
        }
        return true;
    }
    transform(value) {
        return value.trim();
    }
    format(value) {
        return value;
    }
}
class Select extends GenericList {
    listIndex = this.getListIndex(this.settings.default);
    static inject(value) {
        GenericPrompt.inject(value);
    }
    static prompt(options) {
        return new this({
            pointer: blue(Figures.POINTER_SMALL),
            prefix: yellow("? "),
            indent: " ",
            listPointer: blue(Figures.POINTER),
            maxRows: 10,
            searchLabel: blue(Figures.SEARCH),
            ...options,
            options: Select.mapOptions(options)
        }).prompt();
    }
    static mapOptions(options) {
        return options.options.map((item)=>typeof item === "string" ? {
                value: item
            } : item
        ).map((item)=>this.mapOption(item)
        );
    }
    input() {
        return underline(blue(this.inputValue));
    }
    getListItem(item, isSelected) {
        let line = this.settings.indent;
        line += isSelected ? `${this.settings.listPointer} ` : "  ";
        line += `${isSelected ? this.highlight(item.name, (val)=>val
        ) : this.highlight(item.name)}`;
        return line;
    }
    getValue() {
        return this.options[this.listIndex]?.value ?? this.settings.default;
    }
    validate(value) {
        return typeof value === "string" && value.length > 0 && this.options.findIndex((option)=>option.value === value
        ) !== -1;
    }
    transform(value) {
        return value.trim();
    }
    format(value) {
        return this.getOptionByValue(value)?.name ?? value;
    }
}
function prompt(prompts, options) {
    return new PromptList(prompts, options).run(options?.initial);
}
let injected = {
};
class PromptList {
    prompts;
    options;
    result = {
    };
    index = -1;
    names;
    isInBeforeHook = false;
    get prompt() {
        return this.prompts[this.index];
    }
    constructor(prompts, options){
        this.prompts = prompts;
        this.options = options;
        this.names = this.prompts.map((prompt)=>prompt.name
        );
    }
    async run(name) {
        this.index = -1;
        this.result = {
        };
        this.isInBeforeHook = false;
        await this.next(name);
        return this.result;
    }
    async next(name) {
        if (this.updateIndex(name)) {
            await this.runBeforeHook(async ()=>{
                this.isInBeforeHook = false;
                await this.runPrompt();
                await this.runAfterHook();
            });
        }
    }
    updateIndex(name) {
        if (name && typeof name === "string") {
            this.index = this.names.indexOf(name);
            if (this.index === -1) {
                throw new Error(`Invalid prompt name: ${name}, allowed prompt names: ${this.names.join(", ")}`);
            }
        } else if (typeof name === "number") {
            if (name < 0 || name > this.names.length) {
                throw new Error(`Invalid prompt index: ${name}, prompt length: ${this.names.length}`);
            }
            this.index = name;
        } else if (name === true && !this.isInBeforeHook) {
            this.index++;
            if (this.index < this.names.length - 1) {
                this.index++;
            }
        } else {
            this.index++;
        }
        this.isInBeforeHook = false;
        if (this.index < this.names.length) {
            return true;
        } else if (this.index === this.names.length) {
            return false;
        } else {
            throw new Error("next() called multiple times");
        }
    }
    async runBeforeHook(run) {
        this.isInBeforeHook = true;
        const next = async (name)=>{
            if (name || typeof name === "number") {
                return this.next(name);
            }
            await run();
        };
        if (this.options?.before) {
            await this.options.before(this.prompt.name, this.result, async (name)=>{
                if (name || typeof name === "number") {
                    return this.next(name);
                } else if (this.prompt.before) {
                    await this.prompt.before(this.result, next);
                } else {
                    await run();
                }
            });
            return;
        } else if (this.prompt.before) {
            await this.prompt.before(this.result, next);
            return;
        }
        await run();
    }
    async runPrompt() {
        const prompt = this.prompt.type;
        if (typeof injected[this.prompt.name] !== "undefined") {
            if (prompt.inject) {
                prompt.inject(injected[this.prompt.name]);
            } else {
                GenericPrompt.inject(injected[this.prompt.name]);
            }
        }
        try {
            this.result[this.prompt.name] = await prompt.prompt({
                cbreak: this.options?.cbreak,
                ...this.prompt
            });
        } finally{
            tty1.cursorShow();
        }
    }
    async runAfterHook() {
        if (this.options?.after) {
            await this.options.after(this.prompt.name, this.result, async (name)=>{
                if (name) {
                    return this.next(name);
                } else if (this.prompt.after) {
                    await this.prompt.after(this.result, (name)=>this.next(name)
                    );
                } else {
                    await this.next();
                }
            });
        } else if (this.prompt.after) {
            await this.prompt.after(this.result, (name)=>this.next(name)
            );
        } else {
            await this.next();
        }
    }
}
function paramCaseToCamelCase(str) {
    return str.replace(/-([a-z])/g, (g)=>g[1].toUpperCase()
    );
}
function getOption(flags, name) {
    while(name[0] === "-"){
        name = name.slice(1);
    }
    for (const flag of flags){
        if (isOption(flag, name)) {
            return flag;
        }
    }
    return;
}
function didYouMeanOption(option, options) {
    const optionNames = options.map((option)=>[
            option.name,
            ...option.aliases ?? []
        ]
    ).flat().map((option)=>getFlag(option)
    );
    return didYouMean(" Did you mean option", getFlag(option), optionNames);
}
function didYouMeanType(type, types) {
    return didYouMean(" Did you mean type", type, types);
}
function didYouMean(message, type, types) {
    const match = closest(type, types);
    return match ? `${message} "${match}"?` : "";
}
function getFlag(name) {
    if (name.startsWith("-")) {
        return name;
    }
    if (name.length > 1) {
        return `--${name}`;
    }
    return `-${name}`;
}
function isOption(option, name) {
    return option.name === name || option.aliases && option.aliases.indexOf(name) !== -1;
}
function closest(str, arr) {
    let minDistance = Infinity;
    let minIndex = 0;
    for(let i = 0; i < arr.length; i++){
        const dist = distance(str, arr[i]);
        if (dist < minDistance) {
            minDistance = dist;
            minIndex = i;
        }
    }
    return arr[minIndex];
}
function getDefaultValue(option) {
    return typeof option.default === "function" ? option.default() : option.default;
}
class FlagsError extends Error {
    constructor(message){
        super(message);
        Object.setPrototypeOf(this, FlagsError.prototype);
    }
}
class UnknownRequiredOption extends FlagsError {
    constructor(option, options){
        super(`Unknown required option "${getFlag(option)}".${didYouMeanOption(option, options)}`);
        Object.setPrototypeOf(this, UnknownRequiredOption.prototype);
    }
}
class UnknownConflictingOption extends FlagsError {
    constructor(option, options){
        super(`Unknown conflicting option "${getFlag(option)}".${didYouMeanOption(option, options)}`);
        Object.setPrototypeOf(this, UnknownConflictingOption.prototype);
    }
}
class UnknownType extends FlagsError {
    constructor(type, types){
        super(`Unknown type "${type}".${didYouMeanType(type, types)}`);
        Object.setPrototypeOf(this, UnknownType.prototype);
    }
}
class ValidationError extends FlagsError {
    constructor(message){
        super(message);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
class DuplicateOption extends ValidationError {
    constructor(name){
        super(`Option "${getFlag(name).replace(/^--no-/, "--")}" can only occur once, but was found several times.`);
        Object.setPrototypeOf(this, DuplicateOption.prototype);
    }
}
class UnknownOption extends ValidationError {
    constructor(option, options){
        super(`Unknown option "${getFlag(option)}".${didYouMeanOption(option, options)}`);
        Object.setPrototypeOf(this, UnknownOption.prototype);
    }
}
class MissingOptionValue extends ValidationError {
    constructor(option){
        super(`Missing value for option "${getFlag(option)}".`);
        Object.setPrototypeOf(this, MissingOptionValue.prototype);
    }
}
class InvalidOptionValue extends ValidationError {
    constructor(option, expected, value){
        super(`Option "${getFlag(option)}" must be of type "${expected}", but got "${value}".`);
        Object.setPrototypeOf(this, InvalidOptionValue.prototype);
    }
}
class OptionNotCombinable extends ValidationError {
    constructor(option){
        super(`Option "${getFlag(option)}" cannot be combined with other options.`);
        Object.setPrototypeOf(this, OptionNotCombinable.prototype);
    }
}
class ConflictingOption extends ValidationError {
    constructor(option, conflictingOption){
        super(`Option "${getFlag(option)}" conflicts with option "${getFlag(conflictingOption)}".`);
        Object.setPrototypeOf(this, ConflictingOption.prototype);
    }
}
class DependingOption extends ValidationError {
    constructor(option, dependingOption){
        super(`Option "${getFlag(option)}" depends on option "${getFlag(dependingOption)}".`);
        Object.setPrototypeOf(this, DependingOption.prototype);
    }
}
class MissingRequiredOption extends ValidationError {
    constructor(option){
        super(`Missing required option "${getFlag(option)}".`);
        Object.setPrototypeOf(this, MissingRequiredOption.prototype);
    }
}
class RequiredArgumentFollowsOptionalArgument extends ValidationError {
    constructor(arg){
        super(`An required argument cannot follow an optional argument, but "${arg}"  is defined as required.`);
        Object.setPrototypeOf(this, RequiredArgumentFollowsOptionalArgument.prototype);
    }
}
class ArgumentFollowsVariadicArgument extends ValidationError {
    constructor(arg){
        super(`An argument cannot follow an variadic argument, but got "${arg}".`);
        Object.setPrototypeOf(this, ArgumentFollowsVariadicArgument.prototype);
    }
}
class NoArguments extends ValidationError {
    constructor(){
        super(`No arguments.`);
        Object.setPrototypeOf(this, NoArguments.prototype);
    }
}
class InvalidTypeError extends ValidationError {
    constructor({ label , name , value , type  }, expected){
        super(`${label} "${name}" must be of type "${type}", but got "${value}".` + (expected ? ` Expected values: ${expected.map((value)=>`"${value}"`
        ).join(", ")}` : ""));
        Object.setPrototypeOf(this, MissingOptionValue.prototype);
    }
}
function normalize8(args) {
    const normalized = [];
    let inLiteral = false;
    for (const arg of args){
        if (inLiteral) {
            normalized.push(arg);
        } else if (arg === "--") {
            inLiteral = true;
            normalized.push(arg);
        } else if (arg.length > 1 && arg[0] === "-") {
            const isLong = arg[1] === "-";
            const isDotted = !isLong && arg[2] === ".";
            if (arg.includes("=")) {
                const parts = arg.split("=");
                const flag = parts.shift();
                if (isLong) {
                    normalized.push(flag);
                } else {
                    normalizeShortFlags(flag);
                }
                normalized.push(parts.join("="));
            } else if (isLong || isDotted) {
                normalized.push(arg);
            } else {
                normalizeShortFlags(arg);
            }
        } else {
            normalized.push(arg);
        }
    }
    return normalized;
    function normalizeShortFlags(flag) {
        const flags = flag.slice(1).split("");
        if (isNaN(Number(flag[flag.length - 1]))) {
            flags.forEach((val)=>normalized.push(`-${val}`)
            );
        } else {
            normalized.push(`-${flags.shift()}`);
            normalized.push(flags.join(""));
        }
    }
}
var OptionType;
(function(OptionType) {
    OptionType["STRING"] = "string";
    OptionType["NUMBER"] = "number";
    OptionType["INTEGER"] = "integer";
    OptionType["BOOLEAN"] = "boolean";
})(OptionType || (OptionType = {
}));
const __boolean = (type)=>{
    if (~[
        "1",
        "true"
    ].indexOf(type.value)) {
        return true;
    }
    if (~[
        "0",
        "false"
    ].indexOf(type.value)) {
        return false;
    }
    throw new InvalidTypeError(type);
};
const number = (type)=>{
    const value = Number(type.value);
    if (Number.isFinite(value)) {
        return value;
    }
    throw new InvalidTypeError(type);
};
const string = ({ value  })=>{
    return value;
};
function validateFlags(flags, values, _knownFlaks, allowEmpty, optionNames = {
}) {
    const defaultValues = {
    };
    for (const option of flags){
        let name;
        let defaultValue = undefined;
        if (option.name.startsWith("no-")) {
            const propName = option.name.replace(/^no-/, "");
            if (propName in values) {
                continue;
            }
            const positiveOption = getOption(flags, propName);
            if (positiveOption) {
                continue;
            }
            name = paramCaseToCamelCase(propName);
            defaultValue = true;
        }
        if (!name) {
            name = paramCaseToCamelCase(option.name);
        }
        if (!(name in optionNames)) {
            optionNames[name] = option.name;
        }
        const hasDefaultValue = typeof values[name] === "undefined" && (typeof option.default !== "undefined" || typeof defaultValue !== "undefined");
        if (hasDefaultValue) {
            values[name] = getDefaultValue(option) ?? defaultValue;
            defaultValues[option.name] = true;
            if (typeof option.value === "function") {
                values[name] = option.value(values[name]);
            }
        }
    }
    const keys = Object.keys(values);
    if (keys.length === 0 && allowEmpty) {
        return;
    }
    const options = keys.map((name)=>({
            name,
            option: getOption(flags, optionNames[name])
        })
    );
    for (const { name , option: option1  } of options){
        if (!option1) {
            throw new UnknownOption(name, flags);
        }
        if (option1.standalone) {
            if (keys.length > 1) {
                if (options.every(({ option: opt  })=>opt && (option1 === opt || defaultValues[opt.name])
                )) {
                    return;
                }
                throw new OptionNotCombinable(option1.name);
            }
            return;
        }
        option1.conflicts?.forEach((flag)=>{
            if (isset(flag, values)) {
                throw new ConflictingOption(option1.name, flag);
            }
        });
        option1.depends?.forEach((flag)=>{
            if (!isset(flag, values) && !defaultValues[option1.name]) {
                throw new DependingOption(option1.name, flag);
            }
        });
        const isArray = (option1.args?.length || 0) > 1;
        option1.args?.forEach((arg, i)=>{
            if (arg.requiredValue && (typeof values[name] === "undefined" || isArray && typeof values[name][i] === "undefined")) {
                throw new MissingOptionValue(option1.name);
            }
        });
    }
    for (const option2 of flags){
        if (option2.required && !(paramCaseToCamelCase(option2.name) in values)) {
            if ((!option2.conflicts || !option2.conflicts.find((flag)=>!!values[flag]
            )) && !options.find((opt)=>opt.option?.conflicts?.find((flag)=>flag === option2.name
                )
            )) {
                throw new MissingRequiredOption(option2.name);
            }
        }
    }
    if (keys.length === 0 && !allowEmpty) {
        throw new NoArguments();
    }
}
function isset(flag, values) {
    const name = paramCaseToCamelCase(flag);
    return typeof values[name] !== "undefined";
}
const integer = (type)=>{
    const value = Number(type.value);
    if (Number.isInteger(value)) {
        return value;
    }
    throw new InvalidTypeError(type);
};
const Types = {
    [OptionType.STRING]: string,
    [OptionType.NUMBER]: number,
    [OptionType.INTEGER]: integer,
    [OptionType.BOOLEAN]: __boolean
};
function parseFlags(args, opts = {
}) {
    !opts.flags && (opts.flags = []);
    const normalized = normalize8(args);
    let inLiteral = false;
    let negate = false;
    const flags = {
    };
    const optionNames = {
    };
    let literal = [];
    let unknown = [];
    let stopEarly = null;
    opts.flags.forEach((opt)=>{
        opt.depends?.forEach((flag)=>{
            if (!opts.flags || !getOption(opts.flags, flag)) {
                throw new UnknownRequiredOption(flag, opts.flags ?? []);
            }
        });
        opt.conflicts?.forEach((flag)=>{
            if (!opts.flags || !getOption(opts.flags, flag)) {
                throw new UnknownConflictingOption(flag, opts.flags ?? []);
            }
        });
    });
    for(let i = 0; i < normalized.length; i++){
        let option;
        let args;
        const current = normalized[i];
        if (inLiteral) {
            literal.push(current);
            continue;
        }
        if (current === "--") {
            inLiteral = true;
            continue;
        }
        const isFlag = current.length > 1 && current[0] === "-";
        const next = ()=>normalized[i + 1]
        ;
        if (isFlag) {
            if (current[2] === "-" || current[1] === "-" && current.length === 3) {
                throw new UnknownOption(current, opts.flags);
            }
            negate = current.startsWith("--no-");
            option = getOption(opts.flags, current);
            if (!option) {
                if (opts.flags.length) {
                    throw new UnknownOption(current, opts.flags);
                }
                option = {
                    name: current.replace(/^-+/, ""),
                    optionalValue: true,
                    type: OptionType.STRING
                };
            }
            const positiveName = option.name.replace(/^no-?/, "");
            const propName = paramCaseToCamelCase(positiveName);
            if (typeof flags[propName] !== "undefined" && !option.collect) {
                throw new DuplicateOption(current);
            }
            args = option.args?.length ? option.args : [
                {
                    type: option.type,
                    requiredValue: option.requiredValue,
                    optionalValue: option.optionalValue,
                    variadic: option.variadic,
                    list: option.list,
                    separator: option.separator
                }
            ];
            let argIndex = 0;
            let inOptionalArg = false;
            const previous = flags[propName];
            parseNext(option, args);
            if (typeof flags[propName] === "undefined") {
                if (typeof option.default !== "undefined") {
                    flags[propName] = getDefaultValue(option);
                } else if (args[argIndex].requiredValue) {
                    throw new MissingOptionValue(option.name);
                } else {
                    flags[propName] = true;
                }
            }
            if (option.value) {
                flags[propName] = option.value(flags[propName], previous);
            } else if (option.collect) {
                const value = Array.isArray(previous) ? previous : [];
                value.push(flags[propName]);
                flags[propName] = value;
            }
            optionNames[propName] = option.name;
            opts.option?.(option, flags[propName]);
            function parseNext(option, args) {
                const arg = args[argIndex];
                if (!arg) {
                    const flag = next();
                    throw new UnknownOption(flag, opts.flags ?? []);
                }
                if (!arg.type) {
                    arg.type = OptionType.BOOLEAN;
                }
                if (option.args?.length) {
                    if ((typeof arg.optionalValue === "undefined" || arg.optionalValue === false) && typeof arg.requiredValue === "undefined") {
                        arg.requiredValue = true;
                    }
                } else {
                    if (arg.type !== OptionType.BOOLEAN && (typeof arg.optionalValue === "undefined" || arg.optionalValue === false) && typeof arg.requiredValue === "undefined") {
                        arg.requiredValue = true;
                    }
                }
                if (arg.requiredValue) {
                    if (inOptionalArg) {
                        throw new RequiredArgumentFollowsOptionalArgument(option.name);
                    }
                } else {
                    inOptionalArg = true;
                }
                if (negate) {
                    flags[propName] = false;
                    return;
                }
                let result;
                let increase = false;
                if (arg.list && hasNext(arg)) {
                    const parsed = next().split(arg.separator || ",").map((nextValue)=>{
                        const value = parseValue(option, arg, nextValue);
                        if (typeof value === "undefined") {
                            throw new InvalidOptionValue(option.name, arg.type ?? "?", nextValue);
                        }
                        return value;
                    });
                    if (parsed?.length) {
                        result = parsed;
                    }
                } else {
                    if (hasNext(arg)) {
                        result = parseValue(option, arg, next());
                    } else if (arg.optionalValue && arg.type === OptionType.BOOLEAN) {
                        result = true;
                    }
                }
                if (increase) {
                    i++;
                    if (!arg.variadic) {
                        argIndex++;
                    } else if (args[argIndex + 1]) {
                        throw new ArgumentFollowsVariadicArgument(next());
                    }
                }
                if (typeof result !== "undefined" && (args.length > 1 || arg.variadic)) {
                    if (!flags[propName]) {
                        flags[propName] = [];
                    }
                    flags[propName].push(result);
                    if (hasNext(arg)) {
                        parseNext(option, args);
                    }
                } else {
                    flags[propName] = result;
                }
                function hasNext(arg) {
                    return !!(normalized[i + 1] && (arg.optionalValue || arg.requiredValue || arg.variadic) && (normalized[i + 1][0] !== "-" || arg.type === OptionType.NUMBER && !isNaN(Number(normalized[i + 1]))) && arg);
                }
                function parseValue(option, arg, value) {
                    const type = arg.type || OptionType.STRING;
                    const result = opts.parse ? opts.parse({
                        label: "Option",
                        type,
                        name: `--${option.name}`,
                        value
                    }) : parseFlagValue(option, arg, value);
                    if (typeof result !== "undefined") {
                        increase = true;
                    }
                    return result;
                }
            }
        } else {
            if (opts.stopEarly) {
                stopEarly = current;
                break;
            }
            unknown.push(current);
        }
    }
    if (stopEarly) {
        const stopEarlyArgIndex = args.indexOf(stopEarly);
        if (stopEarlyArgIndex !== -1) {
            const doubleDashIndex = args.indexOf("--");
            unknown = args.slice(stopEarlyArgIndex, doubleDashIndex === -1 ? undefined : doubleDashIndex);
            if (doubleDashIndex !== -1) {
                literal = args.slice(doubleDashIndex + 1);
            }
        }
    }
    if (opts.flags?.length) {
        validateFlags(opts.flags, flags, opts.knownFlaks, opts.allowEmpty, optionNames);
    }
    const result = Object.keys(flags).reduce((result, key)=>{
        if (~key.indexOf(".")) {
            key.split(".").reduce((result, subKey, index, parts)=>{
                if (index === parts.length - 1) {
                    result[subKey] = flags[key];
                } else {
                    result[subKey] = result[subKey] ?? {
                    };
                }
                return result[subKey];
            }, result);
        } else {
            result[key] = flags[key];
        }
        return result;
    }, {
    });
    return {
        flags: result,
        unknown,
        literal
    };
}
function parseFlagValue(option, arg, value) {
    const type = arg.type || OptionType.STRING;
    const parseType = Types[type];
    if (!parseType) {
        throw new UnknownType(type, Object.keys(Types));
    }
    return parseType({
        label: "Option",
        type,
        name: `--${option.name}`,
        value
    });
}
function getPermissions() {
    return hasPermissions([
        "env",
        "hrtime",
        "net",
        "plugin",
        "read",
        "run",
        "write", 
    ]);
}
function isUnstable() {
    return !!Deno.permissions;
}
function didYouMeanCommand(command, commands, excludes = []) {
    const commandNames = commands.map((command)=>command.getName()
    ).filter((command)=>!excludes.includes(command)
    );
    return didYouMean(" Did you mean command", command, commandNames);
}
async function hasPermission(permission) {
    try {
        return (await Deno.permissions?.query?.({
            name: permission
        }))?.state === "granted";
    } catch  {
        return false;
    }
}
async function hasPermissions(names) {
    const permissions = {
    };
    await Promise.all(names.map((name)=>hasPermission(name).then((hasPermission)=>permissions[name] = hasPermission
        )
    ));
    return permissions;
}
const ARGUMENT_REGEX = /^[<\[].+[\]>]$/;
const ARGUMENT_DETAILS_REGEX = /[<\[:>\]]/;
function splitArguments(args) {
    const parts = args.trim().split(/[, =] */g);
    const typeParts = [];
    while(parts[parts.length - 1] && ARGUMENT_REGEX.test(parts[parts.length - 1])){
        typeParts.unshift(parts.pop());
    }
    const typeDefinition = typeParts.join(" ");
    return {
        flags: parts,
        typeDefinition
    };
}
function parseArgumentsDefinition(argsDefinition) {
    const argumentDetails = [];
    let hasOptional = false;
    let hasVariadic = false;
    const parts = argsDefinition.split(/ +/);
    for (const arg of parts){
        if (hasVariadic) {
            throw new ArgumentFollowsVariadicArgument(arg);
        }
        const parts = arg.split(ARGUMENT_DETAILS_REGEX);
        const type = parts[2] || OptionType.STRING;
        const details = {
            optionalValue: arg[0] !== "<",
            name: parts[1],
            action: parts[3] || type,
            variadic: false,
            list: type ? arg.indexOf(type + "[]") !== -1 : false,
            type
        };
        if (!details.optionalValue && hasOptional) {
            throw new RequiredArgumentFollowsOptionalArgument(details.name);
        }
        if (arg[0] === "[") {
            hasOptional = true;
        }
        if (details.name.length > 3) {
            const istVariadicLeft = details.name.slice(0, 3) === "...";
            const istVariadicRight = details.name.slice(-3) === "...";
            hasVariadic = details.variadic = istVariadicLeft || istVariadicRight;
            if (istVariadicLeft) {
                details.name = details.name.slice(3);
            } else if (istVariadicRight) {
                details.name = details.name.slice(0, -3);
            }
        }
        if (details.name) {
            argumentDetails.push(details);
        }
    }
    return argumentDetails;
}
class CommandError extends Error {
    constructor(message){
        super(message);
        Object.setPrototypeOf(this, CommandError.prototype);
    }
}
class ValidationError1 extends CommandError {
    exitCode;
    constructor(message, { exitCode  } = {
    }){
        super(message);
        Object.setPrototypeOf(this, ValidationError1.prototype);
        this.exitCode = exitCode ?? 1;
    }
}
class DuplicateOptionName extends CommandError {
    constructor(name){
        super(`Option with name "${getFlag(name)}" already exists.`);
        Object.setPrototypeOf(this, DuplicateOptionName.prototype);
    }
}
class MissingCommandName extends CommandError {
    constructor(){
        super("Missing command name.");
        Object.setPrototypeOf(this, MissingCommandName.prototype);
    }
}
class DuplicateCommandName extends CommandError {
    constructor(name){
        super(`Duplicate command name "${name}".`);
        Object.setPrototypeOf(this, DuplicateCommandName.prototype);
    }
}
class DuplicateCommandAlias extends CommandError {
    constructor(alias){
        super(`Duplicate command alias "${alias}".`);
        Object.setPrototypeOf(this, DuplicateCommandAlias.prototype);
    }
}
class CommandNotFound extends CommandError {
    constructor(name, commands, excluded){
        super(`Unknown command "${name}".${didYouMeanCommand(name, commands, excluded)}`);
        Object.setPrototypeOf(this, UnknownCommand.prototype);
    }
}
class DuplicateType extends CommandError {
    constructor(name){
        super(`Type with name "${name}" already exists.`);
        Object.setPrototypeOf(this, DuplicateType.prototype);
    }
}
class DuplicateCompletion extends CommandError {
    constructor(name){
        super(`Completion with name "${name}" already exists.`);
        Object.setPrototypeOf(this, DuplicateCompletion.prototype);
    }
}
class DuplicateExample extends CommandError {
    constructor(name){
        super(`Example with name "${name}" already exists.`);
        Object.setPrototypeOf(this, DuplicateExample.prototype);
    }
}
class DuplicateEnvironmentVariable extends CommandError {
    constructor(name){
        super(`Environment variable with name "${name}" already exists.`);
        Object.setPrototypeOf(this, DuplicateEnvironmentVariable.prototype);
    }
}
class EnvironmentVariableSingleValue extends CommandError {
    constructor(name){
        super(`An environment variable can only have one value, but "${name}" has more than one.`);
        Object.setPrototypeOf(this, EnvironmentVariableSingleValue.prototype);
    }
}
class EnvironmentVariableOptionalValue extends CommandError {
    constructor(name){
        super(`An environment variable cannot have an optional value, but "${name}" is defined as optional.`);
        Object.setPrototypeOf(this, EnvironmentVariableOptionalValue.prototype);
    }
}
class EnvironmentVariableVariadicValue extends CommandError {
    constructor(name){
        super(`An environment variable cannot have an variadic value, but "${name}" is defined as variadic.`);
        Object.setPrototypeOf(this, EnvironmentVariableVariadicValue.prototype);
    }
}
class DefaultCommandNotFound extends CommandError {
    constructor(name, commands){
        super(`Default command "${name}" not found.${didYouMeanCommand(name, commands)}`);
        Object.setPrototypeOf(this, DefaultCommandNotFound.prototype);
    }
}
class CommandExecutableNotFound extends CommandError {
    constructor(name, files){
        super(`Command executable not found: ${name}:\n    - ${files.join("\\n    - ")}`);
        Object.setPrototypeOf(this, CommandExecutableNotFound.prototype);
    }
}
class UnknownCompletionCommand extends CommandError {
    constructor(name, commands){
        super(`Auto-completion failed. Unknown command "${name}".${didYouMeanCommand(name, commands)}`);
        Object.setPrototypeOf(this, UnknownCompletionCommand.prototype);
    }
}
class UnknownCommand extends ValidationError1 {
    constructor(name, commands, excluded){
        super(`Unknown command "${name}".${didYouMeanCommand(name, commands, excluded)}`);
        Object.setPrototypeOf(this, UnknownCommand.prototype);
    }
}
class NoArgumentsAllowed extends ValidationError1 {
    constructor(name){
        super(`No arguments allowed for command "${name}".`);
        Object.setPrototypeOf(this, NoArgumentsAllowed.prototype);
    }
}
class MissingArguments extends ValidationError1 {
    constructor(args){
        super("Missing argument(s): " + args.join(", "));
        Object.setPrototypeOf(this, MissingArguments.prototype);
    }
}
class MissingArgument extends ValidationError1 {
    constructor(arg){
        super(`Missing argument "${arg}".`);
        Object.setPrototypeOf(this, MissingArgument.prototype);
    }
}
class TooManyArguments extends ValidationError1 {
    constructor(args){
        super(`Too many arguments: ${args.join(" ")}`);
        Object.setPrototypeOf(this, TooManyArguments.prototype);
    }
}
class Type {
}
class BooleanType extends Type {
    parse(type) {
        return __boolean(type);
    }
    complete() {
        return [
            "true",
            "false"
        ];
    }
}
class NumberType extends Type {
    parse(type) {
        return number(type);
    }
}
class StringType extends Type {
    parse(type) {
        return string(type);
    }
}
const border = {
    top: "─",
    topMid: "┬",
    topLeft: "┌",
    topRight: "┐",
    bottom: "─",
    bottomMid: "┴",
    bottomLeft: "└",
    bottomRight: "┘",
    left: "│",
    leftMid: "├",
    mid: "─",
    midMid: "┼",
    right: "│",
    rightMid: "┤",
    middle: "│"
};
class Cell {
    value;
    options = {
    };
    get length() {
        return this.toString().length;
    }
    static from(value) {
        const cell = new this(value);
        if (value instanceof Cell) {
            cell.options = {
                ...value.options
            };
        }
        return cell;
    }
    constructor(value){
        this.value = value;
    }
    toString() {
        return this.value.toString();
    }
    setValue(value) {
        this.value = value;
        return this;
    }
    clone(value) {
        const cell = new Cell(value ?? this);
        cell.options = {
            ...this.options
        };
        return cell;
    }
    border(enable, override = true) {
        if (override || typeof this.options.border === "undefined") {
            this.options.border = enable;
        }
        return this;
    }
    colSpan(span, override = true) {
        if (override || typeof this.options.colSpan === "undefined") {
            this.options.colSpan = span;
        }
        return this;
    }
    rowSpan(span, override = true) {
        if (override || typeof this.options.rowSpan === "undefined") {
            this.options.rowSpan = span;
        }
        return this;
    }
    align(direction, override = true) {
        if (override || typeof this.options.align === "undefined") {
            this.options.align = direction;
        }
        return this;
    }
    getBorder() {
        return this.options.border === true;
    }
    getColSpan() {
        return typeof this.options.colSpan === "number" && this.options.colSpan > 0 ? this.options.colSpan : 1;
    }
    getRowSpan() {
        return typeof this.options.rowSpan === "number" && this.options.rowSpan > 0 ? this.options.rowSpan : 1;
    }
    getAlign() {
        return this.options.align ?? "left";
    }
}
class Row extends Array {
    options = {
    };
    static from(cells) {
        const row = new this(...cells);
        if (cells instanceof Row) {
            row.options = {
                ...cells.options
            };
        }
        return row;
    }
    clone() {
        const row = new Row(...this.map((cell)=>cell instanceof Cell ? cell.clone() : cell
        ));
        row.options = {
            ...this.options
        };
        return row;
    }
    border(enable, override = true) {
        if (override || typeof this.options.border === "undefined") {
            this.options.border = enable;
        }
        return this;
    }
    align(direction, override = true) {
        if (override || typeof this.options.align === "undefined") {
            this.options.align = direction;
        }
        return this;
    }
    getBorder() {
        return this.options.border === true;
    }
    hasBorder() {
        return this.getBorder() || this.some((cell)=>cell instanceof Cell && cell.getBorder()
        );
    }
    getAlign() {
        return this.options.align ?? "left";
    }
}
function consumeWords(length, content) {
    let consumed = "";
    const words = content.split(/ /g);
    for(let i = 0; i < words.length; i++){
        let word = words[i];
        const hasLineBreak = word.indexOf("\n") !== -1;
        if (hasLineBreak) {
            word = word.split("\n").shift();
        }
        if (consumed) {
            const nextLength = stripColor(word).length;
            const consumedLength = stripColor(consumed).length;
            if (consumedLength + nextLength >= length) {
                break;
            }
        }
        consumed += (i > 0 ? " " : "") + word;
        if (hasLineBreak) {
            break;
        }
    }
    return consumed;
}
function longest(index, rows, maxWidth) {
    return Math.max(...rows.map((row)=>(row[index] instanceof Cell && row[index].getColSpan() > 1 ? "" : row[index]?.toString() || "").split("\n").map((r)=>{
            const str = typeof maxWidth === "undefined" ? r : consumeWords(maxWidth, r);
            return stripColor(str).length || 0;
        })
    ).flat());
}
class TableLayout {
    table;
    options;
    constructor(table, options){
        this.table = table;
        this.options = options;
    }
    toString() {
        const opts = this.createLayout();
        return opts.rows.length ? this.renderRows(opts) : "";
    }
    createLayout() {
        Object.keys(this.options.chars).forEach((key)=>{
            if (typeof this.options.chars[key] !== "string") {
                this.options.chars[key] = "";
            }
        });
        const hasBodyBorder = this.table.getBorder() || this.table.hasBodyBorder();
        const hasHeaderBorder = this.table.hasHeaderBorder();
        const hasBorder = hasHeaderBorder || hasBodyBorder;
        const header = this.table.getHeader();
        const rows = this.spanRows(header ? [
            header,
            ...this.table
        ] : this.table.slice());
        const columns = Math.max(...rows.map((row)=>row.length
        ));
        for (const row of rows){
            const length = row.length;
            if (length < columns) {
                const diff = columns - length;
                for(let i = 0; i < diff; i++){
                    row.push(this.createCell(null, row));
                }
            }
        }
        const padding = [];
        const width = [];
        for(let colIndex = 0; colIndex < columns; colIndex++){
            const minColWidth = Array.isArray(this.options.minColWidth) ? this.options.minColWidth[colIndex] : this.options.minColWidth;
            const maxColWidth = Array.isArray(this.options.maxColWidth) ? this.options.maxColWidth[colIndex] : this.options.maxColWidth;
            const colWidth = longest(colIndex, rows, maxColWidth);
            width[colIndex] = Math.min(maxColWidth, Math.max(minColWidth, colWidth));
            padding[colIndex] = Array.isArray(this.options.padding) ? this.options.padding[colIndex] : this.options.padding;
        }
        return {
            padding,
            width,
            rows,
            columns,
            hasBorder,
            hasBodyBorder,
            hasHeaderBorder
        };
    }
    spanRows(_rows, rowIndex = 0, colIndex = 0, rowSpan = [], colSpan = 1) {
        const rows = _rows;
        if (rowIndex >= rows.length && rowSpan.every((span)=>span === 1
        )) {
            return rows;
        } else if (rows[rowIndex] && colIndex >= rows[rowIndex].length && colIndex >= rowSpan.length && colSpan === 1) {
            return this.spanRows(rows, ++rowIndex, 0, rowSpan, 1);
        }
        if (colSpan > 1) {
            colSpan--;
            rowSpan[colIndex] = rowSpan[colIndex - 1];
            rows[rowIndex].splice(colIndex - 1, 0, rows[rowIndex][colIndex - 1]);
            return this.spanRows(rows, rowIndex, ++colIndex, rowSpan, colSpan);
        }
        if (colIndex === 0) {
            rows[rowIndex] = this.createRow(rows[rowIndex] || []);
        }
        if (rowSpan[colIndex] > 1) {
            rowSpan[colIndex]--;
            rows[rowIndex].splice(colIndex, 0, rows[rowIndex - 1][colIndex]);
            return this.spanRows(rows, rowIndex, ++colIndex, rowSpan, colSpan);
        }
        rows[rowIndex][colIndex] = this.createCell(rows[rowIndex][colIndex] || null, rows[rowIndex]);
        colSpan = rows[rowIndex][colIndex].getColSpan();
        rowSpan[colIndex] = rows[rowIndex][colIndex].getRowSpan();
        return this.spanRows(rows, rowIndex, ++colIndex, rowSpan, colSpan);
    }
    createRow(row) {
        return Row.from(row).border(this.table.getBorder(), false).align(this.table.getAlign(), false);
    }
    createCell(cell, row) {
        return Cell.from(cell ?? "").border(row.getBorder(), false).align(row.getAlign(), false);
    }
    renderRows(opts) {
        let result = "";
        const rowSpan = new Array(opts.columns).fill(1);
        for(let rowIndex = 0; rowIndex < opts.rows.length; rowIndex++){
            result += this.renderRow(rowSpan, rowIndex, opts);
        }
        return result.slice(0, -1);
    }
    renderRow(rowSpan, rowIndex, opts, isMultiline) {
        const row = opts.rows[rowIndex];
        const prevRow = opts.rows[rowIndex - 1];
        const nextRow = opts.rows[rowIndex + 1];
        let result = "";
        let colSpan = 1;
        if (!isMultiline && rowIndex === 0 && row.hasBorder()) {
            result += this.renderBorderRow(undefined, row, rowSpan, opts);
        }
        let isMultilineRow = false;
        result += " ".repeat(this.options.indent || 0);
        for(let colIndex = 0; colIndex < opts.columns; colIndex++){
            if (colSpan > 1) {
                colSpan--;
                rowSpan[colIndex] = rowSpan[colIndex - 1];
                continue;
            }
            result += this.renderCell(colIndex, row, opts);
            if (rowSpan[colIndex] > 1) {
                if (!isMultiline) {
                    rowSpan[colIndex]--;
                }
            } else if (!prevRow || prevRow[colIndex] !== row[colIndex]) {
                rowSpan[colIndex] = row[colIndex].getRowSpan();
            }
            colSpan = row[colIndex].getColSpan();
            if (rowSpan[colIndex] === 1 && row[colIndex].length) {
                isMultilineRow = true;
            }
        }
        if (opts.columns > 0) {
            if (row[opts.columns - 1].getBorder()) {
                result += this.options.chars.right;
            } else if (opts.hasBorder) {
                result += " ";
            }
        }
        result += "\n";
        if (isMultilineRow) {
            return result + this.renderRow(rowSpan, rowIndex, opts, isMultilineRow);
        }
        if (rowIndex === 0 && opts.hasHeaderBorder || rowIndex < opts.rows.length - 1 && opts.hasBodyBorder) {
            result += this.renderBorderRow(row, nextRow, rowSpan, opts);
        }
        if (rowIndex === opts.rows.length - 1 && row.hasBorder()) {
            result += this.renderBorderRow(row, undefined, rowSpan, opts);
        }
        return result;
    }
    renderCell(colIndex, row, opts, noBorder) {
        let result = "";
        const prevCell = row[colIndex - 1];
        const cell = row[colIndex];
        if (!noBorder) {
            if (colIndex === 0) {
                if (cell.getBorder()) {
                    result += this.options.chars.left;
                } else if (opts.hasBorder) {
                    result += " ";
                }
            } else {
                if (cell.getBorder() || prevCell?.getBorder()) {
                    result += this.options.chars.middle;
                } else if (opts.hasBorder) {
                    result += " ";
                }
            }
        }
        let maxLength = opts.width[colIndex];
        const colSpan = cell.getColSpan();
        if (colSpan > 1) {
            for(let o = 1; o < colSpan; o++){
                maxLength += opts.width[colIndex + o] + opts.padding[colIndex + o];
                if (opts.hasBorder) {
                    maxLength += opts.padding[colIndex + o] + 1;
                }
            }
        }
        const { current , next  } = this.renderCellValue(cell, maxLength);
        row[colIndex].setValue(next);
        if (opts.hasBorder) {
            result += " ".repeat(opts.padding[colIndex]);
        }
        result += current;
        if (opts.hasBorder || colIndex < opts.columns - 1) {
            result += " ".repeat(opts.padding[colIndex]);
        }
        return result;
    }
    renderCellValue(cell, maxLength) {
        const length = Math.min(maxLength, stripColor(cell.toString()).length);
        let words = consumeWords(length, cell.toString());
        const breakWord = stripColor(words).length > length;
        if (breakWord) {
            words = words.slice(0, length);
        }
        const next = cell.toString().slice(words.length + (breakWord ? 0 : 1));
        const fillLength = maxLength - stripColor(words).length;
        const align = cell.getAlign();
        let current;
        if (fillLength === 0) {
            current = words;
        } else if (align === "left") {
            current = words + " ".repeat(fillLength);
        } else if (align === "center") {
            current = " ".repeat(Math.floor(fillLength / 2)) + words + " ".repeat(Math.ceil(fillLength / 2));
        } else if (align === "right") {
            current = " ".repeat(fillLength) + words;
        } else {
            throw new Error("Unknown direction: " + align);
        }
        return {
            current,
            next: cell.clone(next)
        };
    }
    renderBorderRow(prevRow, nextRow, rowSpan, opts) {
        let result = "";
        let colSpan = 1;
        for(let colIndex = 0; colIndex < opts.columns; colIndex++){
            if (rowSpan[colIndex] > 1) {
                if (!nextRow) {
                    throw new Error("invalid layout");
                }
                if (colSpan > 1) {
                    colSpan--;
                    continue;
                }
            }
            result += this.renderBorderCell(colIndex, prevRow, nextRow, rowSpan, opts);
            colSpan = nextRow?.[colIndex].getColSpan() ?? 1;
        }
        return result.length ? " ".repeat(this.options.indent) + result + "\n" : "";
    }
    renderBorderCell(colIndex, prevRow, nextRow, rowSpan, opts) {
        const a1 = prevRow?.[colIndex - 1];
        const a2 = nextRow?.[colIndex - 1];
        const b1 = prevRow?.[colIndex];
        const b2 = nextRow?.[colIndex];
        const a1Border = !!a1?.getBorder();
        const a2Border = !!a2?.getBorder();
        const b1Border = !!b1?.getBorder();
        const b2Border = !!b2?.getBorder();
        const hasColSpan = (cell)=>(cell?.getColSpan() ?? 1) > 1
        ;
        const hasRowSpan = (cell)=>(cell?.getRowSpan() ?? 1) > 1
        ;
        let result = "";
        if (colIndex === 0) {
            if (rowSpan[colIndex] > 1) {
                if (b1Border) {
                    result += this.options.chars.left;
                } else {
                    result += " ";
                }
            } else if (b1Border && b2Border) {
                result += this.options.chars.leftMid;
            } else if (b1Border) {
                result += this.options.chars.bottomLeft;
            } else if (b2Border) {
                result += this.options.chars.topLeft;
            } else {
                result += " ";
            }
        } else if (colIndex < opts.columns) {
            if (a1Border && b2Border || b1Border && a2Border) {
                const a1ColSpan = hasColSpan(a1);
                const a2ColSpan = hasColSpan(a2);
                const b1ColSpan = hasColSpan(b1);
                const b2ColSpan = hasColSpan(b2);
                const a1RowSpan = hasRowSpan(a1);
                const a2RowSpan = hasRowSpan(a2);
                const b1RowSpan = hasRowSpan(b1);
                const b2RowSpan = hasRowSpan(b2);
                const hasAllBorder = a1Border && b2Border && b1Border && a2Border;
                const hasAllRowSpan = a1RowSpan && b1RowSpan && a2RowSpan && b2RowSpan;
                const hasAllColSpan = a1ColSpan && b1ColSpan && a2ColSpan && b2ColSpan;
                if (hasAllRowSpan && hasAllBorder) {
                    result += this.options.chars.middle;
                } else if (hasAllColSpan && hasAllBorder && a1 === b1 && a2 === b2) {
                    result += this.options.chars.mid;
                } else if (a1ColSpan && b1ColSpan && a1 === b1) {
                    result += this.options.chars.topMid;
                } else if (a2ColSpan && b2ColSpan && a2 === b2) {
                    result += this.options.chars.bottomMid;
                } else if (a1RowSpan && a2RowSpan && a1 === a2) {
                    result += this.options.chars.leftMid;
                } else if (b1RowSpan && b2RowSpan && b1 === b2) {
                    result += this.options.chars.rightMid;
                } else {
                    result += this.options.chars.midMid;
                }
            } else if (a1Border && b1Border) {
                if (hasColSpan(a1) && hasColSpan(b1) && a1 === b1) {
                    result += this.options.chars.bottom;
                } else {
                    result += this.options.chars.bottomMid;
                }
            } else if (b1Border && b2Border) {
                if (rowSpan[colIndex] > 1) {
                    result += this.options.chars.left;
                } else {
                    result += this.options.chars.leftMid;
                }
            } else if (b2Border && a2Border) {
                if (hasColSpan(a2) && hasColSpan(b2) && a2 === b2) {
                    result += this.options.chars.top;
                } else {
                    result += this.options.chars.topMid;
                }
            } else if (a1Border && a2Border) {
                if (hasRowSpan(a1) && a1 === a2) {
                    result += this.options.chars.right;
                } else {
                    result += this.options.chars.rightMid;
                }
            } else if (a1Border) {
                result += this.options.chars.bottomRight;
            } else if (b1Border) {
                result += this.options.chars.bottomLeft;
            } else if (a2Border) {
                result += this.options.chars.topRight;
            } else if (b2Border) {
                result += this.options.chars.topLeft;
            } else {
                result += " ";
            }
        }
        const length = opts.padding[colIndex] + opts.width[colIndex] + opts.padding[colIndex];
        if (rowSpan[colIndex] > 1 && nextRow) {
            result += this.renderCell(colIndex, nextRow, opts, true);
            if (nextRow[colIndex] === nextRow[nextRow.length - 1]) {
                if (b1Border) {
                    result += this.options.chars.right;
                } else {
                    result += " ";
                }
                return result;
            }
        } else if (b1Border && b2Border) {
            result += this.options.chars.mid.repeat(length);
        } else if (b1Border) {
            result += this.options.chars.bottom.repeat(length);
        } else if (b2Border) {
            result += this.options.chars.top.repeat(length);
        } else {
            result += " ".repeat(length);
        }
        if (colIndex === opts.columns - 1) {
            if (b1Border && b2Border) {
                result += this.options.chars.rightMid;
            } else if (b1Border) {
                result += this.options.chars.bottomRight;
            } else if (b2Border) {
                result += this.options.chars.topRight;
            } else {
                result += " ";
            }
        }
        return result;
    }
}
class Table extends Array {
    static _chars = {
        ...border
    };
    options = {
        indent: 0,
        border: false,
        maxColWidth: Infinity,
        minColWidth: 0,
        padding: 1,
        chars: {
            ...Table._chars
        }
    };
    headerRow;
    static from(rows) {
        const table = new this(...rows);
        if (rows instanceof Table) {
            table.options = {
                ...rows.options
            };
            table.headerRow = rows.headerRow ? Row.from(rows.headerRow) : undefined;
        }
        return table;
    }
    static fromJson(rows) {
        return new this().fromJson(rows);
    }
    static chars(chars) {
        Object.assign(this._chars, chars);
        return this;
    }
    static render(rows) {
        Table.from(rows).render();
    }
    fromJson(rows) {
        this.header(Object.keys(rows[0]));
        this.body(rows.map((row)=>Object.values(row)
        ));
        return this;
    }
    header(header) {
        this.headerRow = header instanceof Row ? header : Row.from(header);
        return this;
    }
    body(rows) {
        this.length = 0;
        this.push(...rows);
        return this;
    }
    clone() {
        const table = new Table(...this.map((row)=>row instanceof Row ? row.clone() : Row.from(row).clone()
        ));
        table.options = {
            ...this.options
        };
        table.headerRow = this.headerRow?.clone();
        return table;
    }
    toString() {
        return new TableLayout(this, this.options).toString();
    }
    render() {
        Deno.stdout.writeSync(new TextEncoder().encode(this.toString() + "\n"));
        return this;
    }
    maxColWidth(width, override = true) {
        if (override || typeof this.options.maxColWidth === "undefined") {
            this.options.maxColWidth = width;
        }
        return this;
    }
    minColWidth(width, override = true) {
        if (override || typeof this.options.minColWidth === "undefined") {
            this.options.minColWidth = width;
        }
        return this;
    }
    indent(width, override = true) {
        if (override || typeof this.options.indent === "undefined") {
            this.options.indent = width;
        }
        return this;
    }
    padding(padding, override = true) {
        if (override || typeof this.options.padding === "undefined") {
            this.options.padding = padding;
        }
        return this;
    }
    border(enable, override = true) {
        if (override || typeof this.options.border === "undefined") {
            this.options.border = enable;
        }
        return this;
    }
    align(direction, override = true) {
        if (override || typeof this.options.align === "undefined") {
            this.options.align = direction;
        }
        return this;
    }
    chars(chars) {
        Object.assign(this.options.chars, chars);
        return this;
    }
    getHeader() {
        return this.headerRow;
    }
    getBody() {
        return [
            ...this
        ];
    }
    getMaxColWidth() {
        return this.options.maxColWidth;
    }
    getMinColWidth() {
        return this.options.minColWidth;
    }
    getIndent() {
        return this.options.indent;
    }
    getPadding() {
        return this.options.padding;
    }
    getBorder() {
        return this.options.border === true;
    }
    hasHeaderBorder() {
        const hasBorder = this.headerRow?.hasBorder();
        return hasBorder === true || this.getBorder() && hasBorder !== false;
    }
    hasBodyBorder() {
        return this.getBorder() || this.some((row)=>row instanceof Row ? row.hasBorder() : row.some((cell)=>cell instanceof Cell ? cell.getBorder : false
            )
        );
    }
    hasBorder() {
        return this.hasHeaderBorder() || this.hasBodyBorder();
    }
    getAlign() {
        return this.options.align ?? "left";
    }
}
class HelpGenerator {
    cmd;
    indent = 2;
    options;
    static generate(cmd, options) {
        return new HelpGenerator(cmd, options).generate();
    }
    constructor(cmd, options = {
    }){
        this.cmd = cmd;
        this.options = {
            types: false,
            hints: true,
            colors: true,
            ...options
        };
    }
    generate() {
        const areColorsEnabled = getColorEnabled();
        setColorEnabled(this.options.colors);
        const result = this.generateHeader() + this.generateDescription() + this.generateOptions() + this.generateCommands() + this.generateEnvironmentVariables() + this.generateExamples() + "\n";
        setColorEnabled(areColorsEnabled);
        return result;
    }
    generateHeader() {
        const rows = [
            [
                bold("Usage:"),
                magenta(`${this.cmd.getPath()}${this.cmd.getArgsDefinition() ? " " + this.cmd.getArgsDefinition() : ""}`), 
            ], 
        ];
        const version = this.cmd.getVersion();
        if (version) {
            rows.push([
                bold("Version:"),
                yellow(`${this.cmd.getVersion()}`)
            ]);
        }
        return "\n" + Table.from(rows).indent(this.indent).padding(1).toString() + "\n";
    }
    generateDescription() {
        if (!this.cmd.getDescription()) {
            return "";
        }
        return this.label("Description") + Table.from([
            [
                this.cmd.getDescription()
            ], 
        ]).indent(this.indent * 2).maxColWidth(140).padding(1).toString() + "\n";
    }
    generateOptions() {
        const options = this.cmd.getOptions(false);
        if (!options.length) {
            return "";
        }
        const hasTypeDefinitions = !!options.find((option)=>!!option.typeDefinition
        );
        if (hasTypeDefinitions) {
            return this.label("Options") + Table.from([
                ...options.map((option)=>[
                        option.flags.map((flag)=>blue(flag)
                        ).join(", "),
                        highlightArguments(option.typeDefinition || "", this.options.types),
                        red(bold("-")) + " " + option.description.split("\n").shift(),
                        this.generateHints(option), 
                    ]
                ), 
            ]).padding([
                2,
                2,
                2
            ]).indent(this.indent * 2).maxColWidth([
                60,
                60,
                80,
                60
            ]).toString() + "\n";
        }
        return this.label("Options") + Table.from([
            ...options.map((option)=>[
                    option.flags.map((flag)=>blue(flag)
                    ).join(", "),
                    red(bold("-")) + " " + option.description.split("\n").shift(),
                    this.generateHints(option), 
                ]
            ), 
        ]).padding([
            2,
            2
        ]).indent(this.indent * 2).maxColWidth([
            60,
            80,
            60
        ]).toString() + "\n";
    }
    generateCommands() {
        const commands = this.cmd.getCommands(false);
        if (!commands.length) {
            return "";
        }
        const hasTypeDefinitions = !!commands.find((command)=>!!command.getArgsDefinition()
        );
        if (hasTypeDefinitions) {
            return this.label("Commands") + Table.from([
                ...commands.map((command)=>[
                        [
                            command.getName(),
                            ...command.getAliases()
                        ].map((name)=>blue(name)
                        ).join(", "),
                        highlightArguments(command.getArgsDefinition() || "", this.options.types),
                        red(bold("-")) + " " + command.getDescription().split("\n").shift(), 
                    ]
                ), 
            ]).padding([
                2,
                2,
                2
            ]).indent(this.indent * 2).toString() + "\n";
        }
        return this.label("Commands") + Table.from([
            ...commands.map((command)=>[
                    [
                        command.getName(),
                        ...command.getAliases()
                    ].map((name)=>blue(name)
                    ).join(", "),
                    red(bold("-")) + " " + command.getDescription().split("\n").shift(), 
                ]
            ), 
        ]).padding([
            2,
            2
        ]).indent(this.indent * 2).toString() + "\n";
    }
    generateEnvironmentVariables() {
        const envVars = this.cmd.getEnvVars(false);
        if (!envVars.length) {
            return "";
        }
        return this.label("Environment variables") + Table.from([
            ...envVars.map((envVar)=>[
                    envVar.names.map((name)=>blue(name)
                    ).join(", "),
                    highlightArgumentDetails(envVar.details, this.options.types),
                    `${red(bold("-"))} ${envVar.description}`, 
                ]
            ), 
        ]).padding(2).indent(this.indent * 2).toString() + "\n";
    }
    generateExamples() {
        const examples = this.cmd.getExamples();
        if (!examples.length) {
            return "";
        }
        return this.label("Examples") + Table.from(examples.map((example)=>[
                dim(bold(`${capitalize(example.name)}:`)),
                example.description, 
            ]
        )).padding(1).indent(this.indent * 2).maxColWidth(150).toString() + "\n";
    }
    generateHints(option) {
        if (!this.options.hints) {
            return "";
        }
        const hints = [];
        option.required && hints.push(yellow(`required`));
        typeof option.default !== "undefined" && hints.push(bold(`Default: `) + inspect(option.default, this.options.colors));
        option.depends?.length && hints.push(yellow(bold(`Depends: `)) + italic(option.depends.map(getFlag).join(", ")));
        option.conflicts?.length && hints.push(red(bold(`Conflicts: `)) + italic(option.conflicts.map(getFlag).join(", ")));
        const type = this.cmd.getType(option.args[0]?.type)?.handler;
        if (type instanceof Type) {
            const possibleValues = type.values?.(this.cmd, this.cmd.getParent());
            if (possibleValues?.length) {
                hints.push(bold(`Values: `) + possibleValues.map((value)=>inspect(value, this.options.colors)
                ).join(", "));
            }
        }
        if (hints.length) {
            return `(${hints.join(", ")})`;
        }
        return "";
    }
    label(label) {
        return "\n" + " ".repeat(this.indent) + bold(`${label}:`) + "\n\n";
    }
}
function capitalize(string) {
    return (string?.charAt(0).toUpperCase() + string.slice(1)) ?? "";
}
function inspect(value, colors) {
    return Deno.inspect(value, {
        depth: 1,
        colors,
        trailingComma: false
    });
}
function highlightArguments(argsDefinition, types = true) {
    if (!argsDefinition) {
        return "";
    }
    return parseArgumentsDefinition(argsDefinition).map((arg)=>highlightArgumentDetails(arg, types)
    ).join(" ");
}
function highlightArgumentDetails(arg, types = true) {
    let str = "";
    str += yellow(arg.optionalValue ? "[" : "<");
    let name = "";
    name += arg.name;
    if (arg.variadic) {
        name += "...";
    }
    name = magenta(name);
    str += name;
    if (types) {
        str += yellow(":");
        str += red(arg.type);
    }
    if (arg.list) {
        str += green("[]");
    }
    str += yellow(arg.optionalValue ? "]" : ">");
    return str;
}
class IntegerType extends Type {
    parse(type) {
        return integer(type);
    }
}
class Command {
    types = new Map();
    rawArgs = [];
    literalArgs = [];
    _name = "COMMAND";
    _parent;
    _globalParent;
    ver;
    desc = "";
    fn;
    options = [];
    commands = new Map();
    examples = [];
    envVars = [];
    aliases = [];
    completions = new Map();
    cmd = this;
    argsDefinition;
    isExecutable = false;
    throwOnError = false;
    _allowEmpty = true;
    _stopEarly = false;
    defaultCommand;
    _useRawArgs = false;
    args = [];
    isHidden = false;
    isGlobal = false;
    hasDefaults = false;
    _versionOption;
    _helpOption;
    _help;
    versionOption(flags, desc, opts) {
        this._versionOption = flags === false ? flags : {
            flags,
            desc,
            opts: typeof opts === "function" ? {
                action: opts
            } : opts
        };
        return this;
    }
    helpOption(flags, desc, opts) {
        this._helpOption = flags === false ? flags : {
            flags,
            desc,
            opts: typeof opts === "function" ? {
                action: opts
            } : opts
        };
        return this;
    }
    command(nameAndArguments, cmdOrDescription, override) {
        const result = splitArguments(nameAndArguments);
        const name = result.flags.shift();
        const aliases = result.flags;
        if (!name) {
            throw new MissingCommandName();
        }
        if (this.getBaseCommand(name, true)) {
            if (!override) {
                throw new DuplicateCommandName(name);
            }
            this.removeCommand(name);
        }
        let description;
        let cmd;
        if (typeof cmdOrDescription === "string") {
            description = cmdOrDescription;
        }
        if (cmdOrDescription instanceof Command) {
            cmd = cmdOrDescription.reset();
        } else {
            cmd = new Command();
        }
        cmd._name = name;
        cmd._parent = this;
        if (description) {
            cmd.description(description);
        }
        if (result.typeDefinition) {
            cmd.arguments(result.typeDefinition);
        }
        aliases.forEach((alias)=>cmd.alias(alias)
        );
        this.commands.set(name, cmd);
        this.select(name);
        return this;
    }
    alias(alias) {
        if (this.cmd._name === alias || this.cmd.aliases.includes(alias)) {
            throw new DuplicateCommandAlias(alias);
        }
        this.cmd.aliases.push(alias);
        return this;
    }
    reset() {
        this.cmd = this;
        return this;
    }
    select(name) {
        const cmd = this.getBaseCommand(name, true);
        if (!cmd) {
            throw new CommandNotFound(name, this.getBaseCommands(true));
        }
        this.cmd = cmd;
        return this;
    }
    name(name) {
        this.cmd._name = name;
        return this;
    }
    version(version) {
        if (typeof version === "string") {
            this.cmd.ver = ()=>version
            ;
        } else if (typeof version === "function") {
            this.cmd.ver = version;
        }
        return this;
    }
    help(help) {
        if (typeof help === "string") {
            this.cmd._help = ()=>help
            ;
        } else if (typeof help === "function") {
            this.cmd._help = help;
        } else {
            this.cmd._help = (cmd)=>HelpGenerator.generate(cmd, help)
            ;
        }
        return this;
    }
    description(description) {
        this.cmd.desc = description;
        return this;
    }
    hidden() {
        this.cmd.isHidden = true;
        return this;
    }
    global() {
        this.cmd.isGlobal = true;
        return this;
    }
    executable() {
        this.cmd.isExecutable = true;
        return this;
    }
    arguments(args) {
        this.cmd.argsDefinition = args;
        return this;
    }
    action(fn) {
        this.cmd.fn = fn;
        return this;
    }
    allowEmpty(allowEmpty = true) {
        this.cmd._allowEmpty = allowEmpty;
        return this;
    }
    stopEarly(stopEarly = true) {
        this.cmd._stopEarly = stopEarly;
        return this;
    }
    useRawArgs(useRawArgs = true) {
        this.cmd._useRawArgs = useRawArgs;
        return this;
    }
    default(name) {
        this.cmd.defaultCommand = name;
        return this;
    }
    globalType(name, type, options) {
        return this.type(name, type, {
            ...options,
            global: true
        });
    }
    type(name, handler, options) {
        if (this.cmd.types.get(name) && !options?.override) {
            throw new DuplicateType(name);
        }
        this.cmd.types.set(name, {
            ...options,
            name,
            handler
        });
        if (handler instanceof Type && (typeof handler.complete !== "undefined" || typeof handler.values !== "undefined")) {
            const completeHandler = (cmd, parent)=>handler.complete?.(cmd, parent) || []
            ;
            this.complete(name, completeHandler, options);
        }
        return this;
    }
    globalComplete(name, complete, options) {
        return this.complete(name, complete, {
            ...options,
            global: true
        });
    }
    complete(name, complete, options) {
        if (this.cmd.completions.has(name) && !options?.override) {
            throw new DuplicateCompletion(name);
        }
        this.cmd.completions.set(name, {
            name,
            complete,
            ...options
        });
        return this;
    }
    throwErrors() {
        this.cmd.throwOnError = true;
        return this;
    }
    shouldThrowErrors() {
        return this.cmd.throwOnError || !!this.cmd._parent?.shouldThrowErrors();
    }
    globalOption(flags, desc, opts) {
        if (typeof opts === "function") {
            return this.option(flags, desc, {
                value: opts,
                global: true
            });
        }
        return this.option(flags, desc, {
            ...opts,
            global: true
        });
    }
    option(flags, desc, opts) {
        if (typeof opts === "function") {
            return this.option(flags, desc, {
                value: opts
            });
        }
        const result = splitArguments(flags);
        const args = result.typeDefinition ? parseArgumentsDefinition(result.typeDefinition) : [];
        const option = {
            ...opts,
            name: "",
            description: desc,
            args,
            flags: result.flags,
            typeDefinition: result.typeDefinition
        };
        if (option.separator) {
            for (const arg of args){
                if (arg.list) {
                    arg.separator = option.separator;
                }
            }
        }
        for (const part of option.flags){
            const arg = part.trim();
            const isLong = /^--/.test(arg);
            const name = isLong ? arg.slice(2) : arg.slice(1);
            if (this.cmd.getBaseOption(name, true)) {
                if (opts?.override) {
                    this.removeOption(name);
                } else {
                    throw new DuplicateOptionName(name);
                }
            }
            if (!option.name && isLong) {
                option.name = name;
            } else if (!option.aliases) {
                option.aliases = [
                    name
                ];
            } else {
                option.aliases.push(name);
            }
        }
        if (option.prepend) {
            this.cmd.options.unshift(option);
        } else {
            this.cmd.options.push(option);
        }
        return this;
    }
    example(name, description) {
        if (this.cmd.hasExample(name)) {
            throw new DuplicateExample(name);
        }
        this.cmd.examples.push({
            name,
            description
        });
        return this;
    }
    globalEnv(name, description, options) {
        return this.env(name, description, {
            ...options,
            global: true
        });
    }
    env(name, description, options) {
        const result = splitArguments(name);
        if (!result.typeDefinition) {
            result.typeDefinition = "<value:boolean>";
        }
        if (result.flags.some((envName)=>this.cmd.getBaseEnvVar(envName, true)
        )) {
            throw new DuplicateEnvironmentVariable(name);
        }
        const details = parseArgumentsDefinition(result.typeDefinition);
        if (details.length > 1) {
            throw new EnvironmentVariableSingleValue(name);
        } else if (details.length && details[0].optionalValue) {
            throw new EnvironmentVariableOptionalValue(name);
        } else if (details.length && details[0].variadic) {
            throw new EnvironmentVariableVariadicValue(name);
        }
        this.cmd.envVars.push({
            name: result.flags[0],
            names: result.flags,
            description,
            type: details[0].type,
            details: details.shift(),
            ...options
        });
        return this;
    }
    async parse(args = Deno.args, dry) {
        try {
            this.reset();
            this.registerDefaults();
            this.rawArgs = args;
            const subCommand = args.length > 0 && this.getCommand(args[0], true);
            if (subCommand) {
                subCommand._globalParent = this;
                return await subCommand.parse(this.rawArgs.slice(1), dry);
            }
            const result = {
                options: {
                },
                args: this.rawArgs,
                cmd: this,
                literal: this.literalArgs
            };
            if (this.isExecutable) {
                if (!dry) {
                    await this.executeExecutable(this.rawArgs);
                }
                return result;
            } else if (this._useRawArgs) {
                if (dry) {
                    return result;
                }
                return await this.execute({
                }, ...this.rawArgs);
            } else {
                const { action , flags , unknown , literal  } = this.parseFlags(this.rawArgs);
                this.literalArgs = literal;
                const params = this.parseArguments(unknown, flags);
                await this.validateEnvVars();
                if (dry || action) {
                    if (action) {
                        await action.call(this, flags, ...params);
                    }
                    return {
                        options: flags,
                        args: params,
                        cmd: this,
                        literal: this.literalArgs
                    };
                }
                return await this.execute(flags, ...params);
            }
        } catch (error) {
            throw this.error(error);
        }
    }
    registerDefaults() {
        if (this.hasDefaults || this.getParent()) {
            return this;
        }
        this.hasDefaults = true;
        this.reset();
        !this.types.has("string") && this.type("string", new StringType(), {
            global: true
        });
        !this.types.has("number") && this.type("number", new NumberType(), {
            global: true
        });
        !this.types.has("integer") && this.type("integer", new IntegerType(), {
            global: true
        });
        !this.types.has("boolean") && this.type("boolean", new BooleanType(), {
            global: true
        });
        if (!this._help) {
            this.help({
                hints: true,
                types: false
            });
        }
        if (this._versionOption !== false && (this._versionOption || this.ver)) {
            this.option(this._versionOption?.flags || "-V, --version", this._versionOption?.desc || "Show the version number for this program.", {
                standalone: true,
                prepend: true,
                action: function() {
                    this.showVersion();
                    Deno.exit(0);
                },
                ...this._versionOption?.opts ?? {
                }
            });
        }
        if (this._helpOption !== false) {
            this.option(this._helpOption?.flags || "-h, --help", this._helpOption?.desc || "Show this help.", {
                standalone: true,
                global: true,
                prepend: true,
                action: function() {
                    this.showHelp();
                    Deno.exit(0);
                },
                ...this._helpOption?.opts ?? {
                }
            });
        }
        return this;
    }
    async execute(options, ...args) {
        if (this.fn) {
            await this.fn(options, ...args);
        } else if (this.defaultCommand) {
            const cmd = this.getCommand(this.defaultCommand, true);
            if (!cmd) {
                throw new DefaultCommandNotFound(this.defaultCommand, this.getCommands());
            }
            cmd._globalParent = this;
            await cmd.execute(options, ...args);
        }
        return {
            options,
            args,
            cmd: this,
            literal: this.literalArgs
        };
    }
    async executeExecutable(args) {
        const permissions = await getPermissions();
        if (!permissions.read) {
            await Deno.permissions?.request({
                name: "read"
            });
        }
        if (!permissions.run) {
            await Deno.permissions?.request({
                name: "run"
            });
        }
        const [main, ...names] = this.getPath().split(" ");
        names.unshift(main.replace(/\.ts$/, ""));
        const executableName = names.join("-");
        const files = [];
        const parts = Deno.mainModule.replace(/^file:\/\//g, "").split("/");
        if (Deno.build.os === "windows" && parts[0] === "") {
            parts.shift();
        }
        parts.pop();
        const path = parts.join("/");
        files.push(path + "/" + executableName, path + "/" + executableName + ".ts");
        files.push(executableName, executableName + ".ts");
        const denoOpts = [];
        if (isUnstable()) {
            denoOpts.push("--unstable");
        }
        denoOpts.push("--allow-read", "--allow-run");
        Object.keys(permissions).forEach((name)=>{
            if (name === "read" || name === "run") {
                return;
            }
            if (permissions[name]) {
                denoOpts.push(`--allow-${name}`);
            }
        });
        for (const file of files){
            try {
                Deno.lstatSync(file);
            } catch (error) {
                if (error instanceof Deno.errors.NotFound) {
                    continue;
                }
                throw error;
            }
            const cmd = [
                "deno",
                "run",
                ...denoOpts,
                file,
                ...args
            ];
            const process = Deno.run({
                cmd: cmd
            });
            const status = await process.status();
            if (!status.success) {
                Deno.exit(status.code);
            }
            return;
        }
        throw new CommandExecutableNotFound(executableName, files);
    }
    parseFlags(args) {
        try {
            let action;
            const result = parseFlags(args, {
                stopEarly: this._stopEarly,
                allowEmpty: this._allowEmpty,
                flags: this.getOptions(true),
                parse: (type)=>this.parseType(type)
                ,
                option: (option)=>{
                    if (!action && option.action) {
                        action = option.action;
                    }
                }
            });
            return {
                ...result,
                action
            };
        } catch (error) {
            if (error instanceof ValidationError) {
                throw new ValidationError1(error.message);
            }
            throw error;
        }
    }
    parseType(type) {
        const typeSettings = this.getType(type.type);
        if (!typeSettings) {
            throw new UnknownType(type.type, this.getTypes().map((type)=>type.name
            ));
        }
        return typeSettings.handler instanceof Type ? typeSettings.handler.parse(type) : typeSettings.handler(type);
    }
    async validateEnvVars() {
        if (!await hasPermission("env")) {
            return;
        }
        const envVars = this.getEnvVars(true);
        if (!envVars.length) {
            return;
        }
        envVars.forEach((env)=>{
            const name = env.names.find((name)=>!!Deno.env.get(name)
            );
            if (name) {
                this.parseType({
                    label: "Environment variable",
                    type: env.type,
                    name,
                    value: Deno.env.get(name) ?? ""
                });
            }
        });
    }
    parseArguments(args, flags) {
        const params = [];
        args = args.slice(0);
        if (!this.hasArguments()) {
            if (args.length) {
                if (this.hasCommands(true)) {
                    throw new UnknownCommand(args[0], this.getCommands());
                } else {
                    throw new NoArgumentsAllowed(this.getPath());
                }
            }
        } else {
            if (!args.length) {
                const required = this.getArguments().filter((expectedArg)=>!expectedArg.optionalValue
                ).map((expectedArg)=>expectedArg.name
                );
                if (required.length) {
                    const flagNames = Object.keys(flags);
                    const hasStandaloneOption = !!flagNames.find((name)=>this.getOption(name, true)?.standalone
                    );
                    if (!hasStandaloneOption) {
                        throw new MissingArguments(required);
                    }
                }
            } else {
                for (const expectedArg of this.getArguments()){
                    if (!args.length) {
                        if (expectedArg.optionalValue) {
                            break;
                        }
                        throw new MissingArgument(`Missing argument: ${expectedArg.name}`);
                    }
                    let arg;
                    if (expectedArg.variadic) {
                        arg = args.splice(0, args.length).map((value)=>this.parseType({
                                label: "Argument",
                                type: expectedArg.type,
                                name: expectedArg.name,
                                value
                            })
                        );
                    } else {
                        arg = this.parseType({
                            label: "Argument",
                            type: expectedArg.type,
                            name: expectedArg.name,
                            value: args.shift()
                        });
                    }
                    if (arg) {
                        params.push(arg);
                    }
                }
                if (args.length) {
                    throw new TooManyArguments(args);
                }
            }
        }
        return params;
    }
    error(error) {
        if (this.shouldThrowErrors() || !(error instanceof ValidationError1)) {
            return error;
        }
        this.showHelp();
        Deno.stderr.writeSync(new TextEncoder().encode(red(`  ${bold("error")}: ${error.message}\n`) + "\n"));
        Deno.exit(error instanceof ValidationError1 ? error.exitCode : 1);
    }
    getName() {
        return this._name;
    }
    getParent() {
        return this._parent;
    }
    getGlobalParent() {
        return this._globalParent;
    }
    getMainCommand() {
        return this._parent?.getMainCommand() ?? this;
    }
    getAliases() {
        return this.aliases;
    }
    getPath() {
        return this._parent ? this._parent.getPath() + " " + this._name : this._name;
    }
    getArgsDefinition() {
        return this.argsDefinition;
    }
    getArgument(name) {
        return this.getArguments().find((arg)=>arg.name === name
        );
    }
    getArguments() {
        if (!this.args.length && this.argsDefinition) {
            this.args = parseArgumentsDefinition(this.argsDefinition);
        }
        return this.args;
    }
    hasArguments() {
        return !!this.argsDefinition;
    }
    getVersion() {
        return this.getVersionHandler()?.call(this, this);
    }
    getVersionHandler() {
        return this.ver ?? this._parent?.getVersionHandler();
    }
    getDescription() {
        return typeof this.desc === "function" ? this.desc = this.desc() : this.desc;
    }
    getShortDescription() {
        return this.getDescription().trim().split("\n").shift();
    }
    getRawArgs() {
        return this.rawArgs;
    }
    getLiteralArgs() {
        return this.literalArgs;
    }
    showVersion() {
        Deno.stdout.writeSync(new TextEncoder().encode(this.getVersion()));
    }
    showHelp() {
        Deno.stdout.writeSync(new TextEncoder().encode(this.getHelp()));
    }
    getHelp() {
        this.registerDefaults();
        return this.getHelpHandler().call(this, this);
    }
    getHelpHandler() {
        return this._help ?? this._parent?.getHelpHandler();
    }
    hasOptions(hidden) {
        return this.getOptions(hidden).length > 0;
    }
    getOptions(hidden) {
        return this.getGlobalOptions(hidden).concat(this.getBaseOptions(hidden));
    }
    getBaseOptions(hidden) {
        if (!this.options.length) {
            return [];
        }
        return hidden ? this.options.slice(0) : this.options.filter((opt)=>!opt.hidden
        );
    }
    getGlobalOptions(hidden) {
        const getOptions = (cmd, options = [], names = [])=>{
            if (cmd) {
                if (cmd.options.length) {
                    cmd.options.forEach((option)=>{
                        if (option.global && !this.options.find((opt)=>opt.name === option.name
                        ) && names.indexOf(option.name) === -1 && (hidden || !option.hidden)) {
                            names.push(option.name);
                            options.push(option);
                        }
                    });
                }
                return getOptions(cmd._parent, options, names);
            }
            return options;
        };
        return getOptions(this._parent);
    }
    hasOption(name, hidden) {
        return !!this.getOption(name, hidden);
    }
    getOption(name, hidden) {
        return this.getBaseOption(name, hidden) ?? this.getGlobalOption(name, hidden);
    }
    getBaseOption(name, hidden) {
        const option = this.options.find((option)=>option.name === name
        );
        return option && (hidden || !option.hidden) ? option : undefined;
    }
    getGlobalOption(name, hidden) {
        if (!this._parent) {
            return;
        }
        const option = this._parent.getBaseOption(name, hidden);
        if (!option || !option.global) {
            return this._parent.getGlobalOption(name, hidden);
        }
        return option;
    }
    removeOption(name) {
        const index = this.options.findIndex((option)=>option.name === name
        );
        if (index === -1) {
            return;
        }
        return this.options.splice(index, 1)[0];
    }
    hasCommands(hidden) {
        return this.getCommands(hidden).length > 0;
    }
    getCommands(hidden) {
        return this.getGlobalCommands(hidden).concat(this.getBaseCommands(hidden));
    }
    getBaseCommands(hidden) {
        const commands = Array.from(this.commands.values());
        return hidden ? commands : commands.filter((cmd)=>!cmd.isHidden
        );
    }
    getGlobalCommands(hidden) {
        const getCommands = (cmd, commands = [], names = [])=>{
            if (cmd) {
                if (cmd.commands.size) {
                    cmd.commands.forEach((cmd)=>{
                        if (cmd.isGlobal && this !== cmd && !this.commands.has(cmd._name) && names.indexOf(cmd._name) === -1 && (hidden || !cmd.isHidden)) {
                            names.push(cmd._name);
                            commands.push(cmd);
                        }
                    });
                }
                return getCommands(cmd._parent, commands, names);
            }
            return commands;
        };
        return getCommands(this._parent);
    }
    hasCommand(name, hidden) {
        return !!this.getCommand(name, hidden);
    }
    getCommand(name, hidden) {
        return this.getBaseCommand(name, hidden) ?? this.getGlobalCommand(name, hidden);
    }
    getBaseCommand(name, hidden) {
        for (const cmd of this.commands.values()){
            if (cmd._name === name || cmd.aliases.includes(name)) {
                return cmd && (hidden || !cmd.isHidden) ? cmd : undefined;
            }
        }
    }
    getGlobalCommand(name, hidden) {
        if (!this._parent) {
            return;
        }
        const cmd = this._parent.getBaseCommand(name, hidden);
        if (!cmd?.isGlobal) {
            return this._parent.getGlobalCommand(name, hidden);
        }
        return cmd;
    }
    removeCommand(name) {
        const command = this.getBaseCommand(name, true);
        if (command) {
            this.commands.delete(command._name);
        }
        return command;
    }
    getTypes() {
        return this.getGlobalTypes().concat(this.getBaseTypes());
    }
    getBaseTypes() {
        return Array.from(this.types.values());
    }
    getGlobalTypes() {
        const getTypes = (cmd, types = [], names = [])=>{
            if (cmd) {
                if (cmd.types.size) {
                    cmd.types.forEach((type)=>{
                        if (type.global && !this.types.has(type.name) && names.indexOf(type.name) === -1) {
                            names.push(type.name);
                            types.push(type);
                        }
                    });
                }
                return getTypes(cmd._parent, types, names);
            }
            return types;
        };
        return getTypes(this._parent);
    }
    getType(name) {
        return this.getBaseType(name) ?? this.getGlobalType(name);
    }
    getBaseType(name) {
        return this.types.get(name);
    }
    getGlobalType(name) {
        if (!this._parent) {
            return;
        }
        const cmd = this._parent.getBaseType(name);
        if (!cmd?.global) {
            return this._parent.getGlobalType(name);
        }
        return cmd;
    }
    getCompletions() {
        return this.getGlobalCompletions().concat(this.getBaseCompletions());
    }
    getBaseCompletions() {
        return Array.from(this.completions.values());
    }
    getGlobalCompletions() {
        const getCompletions = (cmd, completions = [], names = [])=>{
            if (cmd) {
                if (cmd.completions.size) {
                    cmd.completions.forEach((completion)=>{
                        if (completion.global && !this.completions.has(completion.name) && names.indexOf(completion.name) === -1) {
                            names.push(completion.name);
                            completions.push(completion);
                        }
                    });
                }
                return getCompletions(cmd._parent, completions, names);
            }
            return completions;
        };
        return getCompletions(this._parent);
    }
    getCompletion(name) {
        return this.getBaseCompletion(name) ?? this.getGlobalCompletion(name);
    }
    getBaseCompletion(name) {
        return this.completions.get(name);
    }
    getGlobalCompletion(name) {
        if (!this._parent) {
            return;
        }
        const completion = this._parent.getBaseCompletion(name);
        if (!completion?.global) {
            return this._parent.getGlobalCompletion(name);
        }
        return completion;
    }
    hasEnvVars(hidden) {
        return this.getEnvVars(hidden).length > 0;
    }
    getEnvVars(hidden) {
        return this.getGlobalEnvVars(hidden).concat(this.getBaseEnvVars(hidden));
    }
    getBaseEnvVars(hidden) {
        if (!this.envVars.length) {
            return [];
        }
        return hidden ? this.envVars.slice(0) : this.envVars.filter((env)=>!env.hidden
        );
    }
    getGlobalEnvVars(hidden) {
        const getEnvVars = (cmd, envVars = [], names = [])=>{
            if (cmd) {
                if (cmd.envVars.length) {
                    cmd.envVars.forEach((envVar)=>{
                        if (envVar.global && !this.envVars.find((env)=>env.names[0] === envVar.names[0]
                        ) && names.indexOf(envVar.names[0]) === -1 && (hidden || !envVar.hidden)) {
                            names.push(envVar.names[0]);
                            envVars.push(envVar);
                        }
                    });
                }
                return getEnvVars(cmd._parent, envVars, names);
            }
            return envVars;
        };
        return getEnvVars(this._parent);
    }
    hasEnvVar(name, hidden) {
        return !!this.getEnvVar(name, hidden);
    }
    getEnvVar(name, hidden) {
        return this.getBaseEnvVar(name, hidden) ?? this.getGlobalEnvVar(name, hidden);
    }
    getBaseEnvVar(name, hidden) {
        const envVar = this.envVars.find((env)=>env.names.indexOf(name) !== -1
        );
        return envVar && (hidden || !envVar.hidden) ? envVar : undefined;
    }
    getGlobalEnvVar(name, hidden) {
        if (!this._parent) {
            return;
        }
        const envVar = this._parent.getBaseEnvVar(name, hidden);
        if (!envVar?.global) {
            return this._parent.getGlobalEnvVar(name, hidden);
        }
        return envVar;
    }
    hasExamples() {
        return this.examples.length > 0;
    }
    getExamples() {
        return this.examples;
    }
    hasExample(name) {
        return !!this.getExample(name);
    }
    getExample(name) {
        return this.examples.find((example)=>example.name === name
        );
    }
}
class BashCompletionsGenerator {
    cmd;
    static generate(cmd) {
        return new BashCompletionsGenerator(cmd).generate();
    }
    constructor(cmd){
        this.cmd = cmd;
    }
    generate() {
        const path = this.cmd.getPath();
        const version = this.cmd.getVersion() ? ` v${this.cmd.getVersion()}` : "";
        return `#!/usr/bin/env bash
# bash completion support for ${path}${version}

_${replaceSpecialChars(path)}() {
  local word cur prev
  local -a opts
  COMPREPLY=()
  cur="\${COMP_WORDS[COMP_CWORD]}"
  prev="\${COMP_WORDS[COMP_CWORD-1]}"
  cmd="_"
  opts=()

  _${replaceSpecialChars(this.cmd.getName())}_complete() {
    local action="$1"; shift
    mapfile -t values < <( ${this.cmd.getName()} completions complete "\${action}" "\${@}" )
    for i in "\${values[@]}"; do
      opts+=("$i")
    done
  }

  ${this.generateCompletions(this.cmd).trim()}

  for word in "\${COMP_WORDS[@]}"; do
    case "\${word}" in
      -*) ;;
      *)
        cmd_tmp="\${cmd}_\${word//[^[:alnum:]]/_}"
        if type "\${cmd_tmp}" &>/dev/null; then
          cmd="\${cmd_tmp}"
        fi
    esac
  done

  \${cmd}

  if [[ \${#opts[@]} -eq 0 ]]; then
    # shellcheck disable=SC2207
    COMPREPLY=($(compgen -f "\${cur}"))
    return 0
  fi

  local values
  values="$( printf "\\n%s" "\${opts[@]}" )"
  local IFS=$'\\n'
  # shellcheck disable=SC2207
  local result=($(compgen -W "\${values[@]}" -- "\${cur}"))
  if [[ \${#result[@]} -eq 0 ]]; then
    # shellcheck disable=SC2207
    COMPREPLY=($(compgen -f "\${cur}"))
  else
    # shellcheck disable=SC2207
    COMPREPLY=($(printf '%q\\n' "\${result[@]}"))
  fi

  return 0
}

complete -F _${replaceSpecialChars(path)} -o bashdefault -o default ${path}
`;
    }
    generateCompletions(command, path = "", index = 1) {
        path = (path ? path + " " : "") + command.getName();
        const commandCompletions = this.generateCommandCompletions(command, path, index);
        const childCommandCompletions = command.getCommands(false).filter((subCommand)=>subCommand !== command
        ).map((subCommand)=>this.generateCompletions(subCommand, path, index + 1)
        ).join("");
        return `${commandCompletions}

${childCommandCompletions}`;
    }
    generateCommandCompletions(command, path, index) {
        const flags = this.getFlags(command);
        const childCommandNames = command.getCommands(false).map((childCommand)=>childCommand.getName()
        );
        const completionsPath = ~path.indexOf(" ") ? " " + path.split(" ").slice(1).join(" ") : "";
        const optionArguments = this.generateOptionArguments(command, completionsPath);
        const completionsCmd = this.generateCommandCompletionsCommand(command.getArguments(), completionsPath);
        return `  __${replaceSpecialChars(path)}() {
    opts=(${[
            ...flags,
            ...childCommandNames
        ].join(" ")})
    ${completionsCmd}
    if [[ \${cur} == -* || \${COMP_CWORD} -eq ${index} ]] ; then
      return 0
    fi
    ${optionArguments}
  }`;
    }
    getFlags(command) {
        return command.getOptions(false).map((option)=>option.flags
        ).flat();
    }
    generateOptionArguments(command, completionsPath) {
        let opts = "";
        const options = command.getOptions(false);
        if (options.length) {
            opts += 'case "${prev}" in';
            for (const option of options){
                const flags = option.flags.map((flag)=>flag.trim()
                ).join("|");
                const completionsCmd = this.generateOptionCompletionsCommand(option.args, completionsPath, {
                    standalone: option.standalone
                });
                opts += `\n      ${flags}) ${completionsCmd} ;;`;
            }
            opts += "\n    esac";
        }
        return opts;
    }
    generateCommandCompletionsCommand(args, path) {
        if (args.length) {
            return `_${replaceSpecialChars(this.cmd.getName())}_complete ${args[0].action}${path}`;
        }
        return "";
    }
    generateOptionCompletionsCommand(args, path, opts) {
        if (args.length) {
            return `opts=(); _${replaceSpecialChars(this.cmd.getName())}_complete ${args[0].action}${path}`;
        }
        if (opts?.standalone) {
            return "opts=()";
        }
        return "";
    }
}
function replaceSpecialChars(str) {
    return str.replace(/[^a-zA-Z0-9]/g, "_");
}
class FishCompletionsGenerator {
    cmd;
    static generate(cmd) {
        return new FishCompletionsGenerator(cmd).generate();
    }
    constructor(cmd){
        this.cmd = cmd;
    }
    generate() {
        const path = this.cmd.getPath();
        const version = this.cmd.getVersion() ? ` v${this.cmd.getVersion()}` : "";
        return `#!/usr/bin/env fish
# fish completion support for ${path}${version}

function __fish_${replaceSpecialChars1(this.cmd.getName())}_using_command
  set cmds ${getCommandFnNames(this.cmd).join(" ")}
  set words (commandline -opc)
  set cmd "_"
  for word in $words
    switch $word
      case '-*'
        continue
      case '*'
        set word (string replace -r -a '\\W' '_' $word)
        set cmd_tmp $cmd"_$word"
        if contains $cmd_tmp $cmds
          set cmd $cmd_tmp
        end
    end
  end
  if [ "$cmd" = "$argv[1]" ]
    return 0
  end
  return 1
end

${this.generateCompletions(this.cmd).trim()}
`;
    }
    generateCompletions(command) {
        const parent = command.getParent();
        let result = ``;
        if (parent) {
            result += "\n" + this.complete(parent, {
                description: command.getShortDescription(),
                arguments: command.getName()
            });
        }
        const commandArgs = command.getArguments();
        if (commandArgs.length) {
            result += "\n" + this.complete(command, {
                arguments: commandArgs.length ? this.getCompletionCommand(commandArgs[0].action + " " + getCompletionsPath(command)) : undefined
            });
        }
        for (const option of command.getOptions(false)){
            result += "\n" + this.completeOption(command, option);
        }
        for (const subCommand of command.getCommands(false)){
            result += this.generateCompletions(subCommand);
        }
        return result;
    }
    completeOption(command, option) {
        const shortOption = option.flags.find((flag)=>flag.length === 2
        )?.replace(/^(-)+/, "");
        const longOption = option.flags.find((flag)=>flag.length > 2
        )?.replace(/^(-)+/, "");
        return this.complete(command, {
            description: option.description,
            shortOption: shortOption,
            longOption: longOption,
            required: true,
            standalone: option.standalone,
            arguments: option.args.length ? this.getCompletionCommand(option.args[0].action + " " + getCompletionsPath(command)) : undefined
        });
    }
    complete(command, options) {
        const cmd = [
            "complete"
        ];
        cmd.push("-c", this.cmd.getName());
        cmd.push("-n", `'__fish_${replaceSpecialChars1(this.cmd.getName())}_using_command __${replaceSpecialChars1(command.getPath())}'`);
        options.shortOption && cmd.push("-s", options.shortOption);
        options.longOption && cmd.push("-l", options.longOption);
        options.standalone && cmd.push("-x");
        cmd.push("-k");
        cmd.push("-f");
        if (options.arguments) {
            options.required && cmd.push("-r");
            cmd.push("-a", options.arguments);
        }
        options.description && cmd.push("-d", `'${options.description}'`);
        return cmd.join(" ");
    }
    getCompletionCommand(cmd) {
        return `'(${this.cmd.getName()} completions complete ${cmd.trim()})'`;
    }
}
function getCommandFnNames(cmd, cmds = []) {
    cmds.push(`__${replaceSpecialChars1(cmd.getPath())}`);
    cmd.getCommands(false).forEach((command)=>{
        getCommandFnNames(command, cmds);
    });
    return cmds;
}
function getCompletionsPath(command) {
    return command.getPath().split(" ").slice(1).join(" ");
}
function replaceSpecialChars1(str) {
    return str.replace(/[^a-zA-Z0-9]/g, "_");
}
class ZshCompletionsGenerator {
    cmd;
    actions = new Map();
    static generate(cmd) {
        return new ZshCompletionsGenerator(cmd).generate();
    }
    constructor(cmd){
        this.cmd = cmd;
    }
    generate() {
        const path = this.cmd.getPath();
        const name = this.cmd.getName();
        const version = this.cmd.getVersion() ? ` v${this.cmd.getVersion()}` : "";
        return `#!/usr/bin/env zsh
# zsh completion support for ${path}${version}

autoload -U is-at-least

# shellcheck disable=SC2154
(( $+functions[__${replaceSpecialChars2(name)}_complete] )) ||
function __${replaceSpecialChars2(name)}_complete {
  local name="$1"; shift
  local action="$1"; shift
  integer ret=1
  local -a values
  local expl lines
  _tags "$name"
  while _tags; do
    if _requested "$name"; then
      # shellcheck disable=SC2034
      lines="$(${name} completions complete "\${action}" "\${@}")"
      values=("\${(ps:\\n:)lines}")
      if (( \${#values[@]} )); then
        while _next_label "$name" expl "$action"; do
          compadd -S '' "\${expl[@]}" "\${values[@]}"
        done
      fi
    fi
  done
}

${this.generateCompletions(this.cmd).trim()}

# _${replaceSpecialChars2(path)} "\${@}"

compdef _${replaceSpecialChars2(path)} ${path}

`;
    }
    generateCompletions(command, path = "") {
        if (!command.hasCommands(false) && !command.hasOptions(false) && !command.hasArguments()) {
            return "";
        }
        path = (path ? path + " " : "") + command.getName();
        return `# shellcheck disable=SC2154
(( $+functions[_${replaceSpecialChars2(path)}] )) ||
function _${replaceSpecialChars2(path)}() {` + (!command.getParent() ? `
  local state` : "") + this.generateCommandCompletions(command, path) + this.generateSubCommandCompletions(command, path) + this.generateArgumentCompletions(command, path) + this.generateActions(command) + `\n}\n\n` + command.getCommands(false).filter((subCommand)=>subCommand !== command
        ).map((subCommand)=>this.generateCompletions(subCommand, path)
        ).join("");
    }
    generateCommandCompletions(command, path) {
        const commands = command.getCommands(false);
        let completions = commands.map((subCommand)=>`'${subCommand.getName()}:${subCommand.getShortDescription()}'`
        ).join("\n      ");
        if (completions) {
            completions = `
    local -a commands
    # shellcheck disable=SC2034
    commands=(
      ${completions}
    )
    _describe 'command' commands`;
        }
        if (command.hasArguments()) {
            const completionsPath = path.split(" ").slice(1).join(" ");
            const arg = command.getArguments()[0];
            const action = this.addAction(arg, completionsPath);
            if (action && command.getCompletion(arg.action)) {
                completions += `\n    __${replaceSpecialChars2(this.cmd.getName())}_complete ${action.arg.name} ${action.arg.action} ${action.cmd}`;
            }
        }
        if (completions) {
            completions = `\n\n  function _commands() {${completions}\n  }`;
        }
        return completions;
    }
    generateSubCommandCompletions(command, path) {
        if (command.hasCommands(false)) {
            const actions = command.getCommands(false).map((command)=>`${command.getName()}) _${replaceSpecialChars2(path + " " + command.getName())} ;;`
            ).join("\n      ");
            return `\n
  function _command_args() {
    case "\${words[1]}" in\n      ${actions}\n    esac
  }`;
        }
        return "";
    }
    generateArgumentCompletions(command, path) {
        this.actions.clear();
        const options = this.generateOptions(command, path);
        let argIndex = 0;
        let argsCommand = "\n\n  _arguments -w -s -S -C";
        if (command.hasOptions()) {
            argsCommand += ` \\\n    ${options.join(" \\\n    ")}`;
        }
        if (command.hasCommands(false) || command.getArguments().filter((arg)=>command.getCompletion(arg.action)
        ).length) {
            argsCommand += ` \\\n    '${++argIndex}: :_commands'`;
        }
        if (command.hasArguments() || command.hasCommands(false)) {
            const args = [];
            for (const arg of command.getArguments().slice(1)){
                const completionsPath = path.split(" ").slice(1).join(" ");
                const action = this.addAction(arg, completionsPath);
                args.push(`${++argIndex}${arg.optionalValue ? "::" : ":"}${action.name}`);
            }
            argsCommand += args.map((arg)=>`\\\n    '${arg}'`
            ).join("");
            if (command.hasCommands(false)) {
                argsCommand += ` \\\n    '*:: :->command_args'`;
            }
        }
        return argsCommand;
    }
    generateOptions(command, path) {
        const options = [];
        const cmdArgs = path.split(" ");
        cmdArgs.shift();
        const completionsPath = cmdArgs.join(" ");
        const excludedFlags = command.getOptions(false).map((option)=>option.standalone ? option.flags : false
        ).flat().filter((flag)=>typeof flag === "string"
        );
        for (const option of command.getOptions(false)){
            options.push(this.generateOption(option, completionsPath, excludedFlags));
        }
        return options;
    }
    generateOption(option, completionsPath, excludedOptions) {
        const flags = option.flags;
        let excludedFlags = option.conflicts?.length ? [
            ...excludedOptions,
            ...option.conflicts.map((opt)=>"--" + opt.replace(/^--/, "")
            ), 
        ] : excludedOptions;
        excludedFlags = option.collect ? excludedFlags : [
            ...excludedFlags,
            ...flags, 
        ];
        let args = "";
        for (const arg of option.args){
            const action = this.addAction(arg, completionsPath);
            if (arg.variadic) {
                args += `${arg.optionalValue ? "::" : ":"}${arg.name}:->${action.name}`;
            } else {
                args += `${arg.optionalValue ? "::" : ":"}${arg.name}:->${action.name}`;
            }
        }
        let description = option.description.trim().split("\n").shift();
        description = description.replace(/\[/g, "\\[").replace(/]/g, "\\]").replace(/"/g, '\\"').replace(/'/g, "'\"'\"'");
        const collect = option.collect ? "*" : "";
        if (option.standalone) {
            return `'(- *)'{${collect}${flags}}'[${description}]${args}'`;
        } else {
            const excluded = excludedFlags.length ? `'(${excludedFlags.join(" ")})'` : "";
            if (collect || flags.length > 1) {
                return `${excluded}{${collect}${flags}}'[${description}]${args}'`;
            } else {
                return `${excluded}${flags}'[${description}]${args}'`;
            }
        }
    }
    addAction(arg, cmd) {
        const action = `${arg.name}-${arg.action}`;
        if (!this.actions.has(action)) {
            this.actions.set(action, {
                arg: arg,
                label: `${arg.name}: ${arg.action}`,
                name: action,
                cmd
            });
        }
        return this.actions.get(action);
    }
    generateActions(command) {
        let actions = [];
        if (this.actions.size) {
            actions = Array.from(this.actions).map(([name, action])=>`${name}) __${replaceSpecialChars2(this.cmd.getName())}_complete ${action.arg.name} ${action.arg.action} ${action.cmd} ;;`
            );
        }
        if (command.hasCommands(false)) {
            actions.unshift(`command_args) _command_args ;;`);
        }
        if (actions.length) {
            return `\n\n  case "$state" in\n    ${actions.join("\n    ")}\n  esac`;
        }
        return "";
    }
}
function replaceSpecialChars2(str) {
    return str.replace(/[^a-zA-Z0-9]/g, "_");
}
class CommandType extends StringType {
    complete(_cmd, parent) {
        return parent?.getCommands(false).map((cmd)=>cmd.getName()
        ) || [];
    }
}
class HelpCommand extends Command {
    constructor(cmd){
        super();
        this.type("command", new CommandType()).arguments("[command:command]").description("Show this help or the help of a sub-command.").action((_, name)=>{
            if (!cmd) {
                cmd = name ? this.getGlobalParent()?.getBaseCommand(name) : this.getGlobalParent();
            }
            if (!cmd) {
                const cmds = this.getGlobalParent()?.getCommands();
                throw new UnknownCommand(name ?? "", cmds ?? [], [
                    this.getName(),
                    ...this.getAliases(), 
                ]);
            }
            cmd.showHelp();
            Deno.exit(0);
        });
    }
}
class YAMLError extends Error {
    mark;
    constructor(message = "(unknown reason)", mark = ""){
        super(`${message} ${mark}`);
        this.mark = mark;
        this.name = this.constructor.name;
    }
    toString(_compact) {
        return `${this.name}: ${this.message} ${this.mark}`;
    }
}
function isBoolean(value) {
    return typeof value === "boolean" || value instanceof Boolean;
}
function isObject(value) {
    return value !== null && typeof value === "object";
}
function repeat(str, count) {
    let result = "";
    for(let cycle = 0; cycle < count; cycle++){
        result += str;
    }
    return result;
}
function isNegativeZero(i) {
    return i === 0 && Number.NEGATIVE_INFINITY === 1 / i;
}
class Mark {
    name;
    buffer;
    position;
    line;
    column;
    constructor(name, buffer, position, line, column){
        this.name = name;
        this.buffer = buffer;
        this.position = position;
        this.line = line;
        this.column = column;
    }
    getSnippet(indent = 4, maxLength = 75) {
        if (!this.buffer) return null;
        let head = "";
        let start = this.position;
        while(start > 0 && "\x00\r\n\x85\u2028\u2029".indexOf(this.buffer.charAt(start - 1)) === -1){
            start -= 1;
            if (this.position - start > maxLength / 2 - 1) {
                head = " ... ";
                start += 5;
                break;
            }
        }
        let tail = "";
        let end = this.position;
        while(end < this.buffer.length && "\x00\r\n\x85\u2028\u2029".indexOf(this.buffer.charAt(end)) === -1){
            end += 1;
            if (end - this.position > maxLength / 2 - 1) {
                tail = " ... ";
                end -= 5;
                break;
            }
        }
        const snippet = this.buffer.slice(start, end);
        return `${repeat(" ", indent)}${head}${snippet}${tail}\n${repeat(" ", indent + this.position - start + head.length)}^`;
    }
    toString(compact) {
        let snippet, where = "";
        if (this.name) {
            where += `in "${this.name}" `;
        }
        where += `at line ${this.line + 1}, column ${this.column + 1}`;
        if (!compact) {
            snippet = this.getSnippet();
            if (snippet) {
                where += `:\n${snippet}`;
            }
        }
        return where;
    }
}
function compileList(schema, name, result) {
    const exclude = [];
    for (const includedSchema of schema.include){
        result = compileList(includedSchema, name, result);
    }
    for (const currentType of schema[name]){
        for(let previousIndex = 0; previousIndex < result.length; previousIndex++){
            const previousType = result[previousIndex];
            if (previousType.tag === currentType.tag && previousType.kind === currentType.kind) {
                exclude.push(previousIndex);
            }
        }
        result.push(currentType);
    }
    return result.filter((_type, index)=>!exclude.includes(index)
    );
}
function compileMap(...typesList) {
    const result = {
        fallback: {
        },
        mapping: {
        },
        scalar: {
        },
        sequence: {
        }
    };
    for (const types of typesList){
        for (const type of types){
            if (type.kind !== null) {
                result[type.kind][type.tag] = result["fallback"][type.tag] = type;
            }
        }
    }
    return result;
}
class Schema {
    static SCHEMA_DEFAULT;
    implicit;
    explicit;
    include;
    compiledImplicit;
    compiledExplicit;
    compiledTypeMap;
    constructor(definition){
        this.explicit = definition.explicit || [];
        this.implicit = definition.implicit || [];
        this.include = definition.include || [];
        for (const type of this.implicit){
            if (type.loadKind && type.loadKind !== "scalar") {
                throw new YAMLError("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
            }
        }
        this.compiledImplicit = compileList(this, "implicit", []);
        this.compiledExplicit = compileList(this, "explicit", []);
        this.compiledTypeMap = compileMap(this.compiledImplicit, this.compiledExplicit);
    }
    extend(definition) {
        return new Schema({
            implicit: [
                ...new Set([
                    ...this.implicit,
                    ...definition?.implicit ?? []
                ]), 
            ],
            explicit: [
                ...new Set([
                    ...this.explicit,
                    ...definition?.explicit ?? []
                ]), 
            ],
            include: [
                ...new Set([
                    ...this.include,
                    ...definition?.include ?? []
                ])
            ]
        });
    }
    static create() {
    }
}
const DEFAULT_RESOLVE = ()=>true
;
const DEFAULT_CONSTRUCT = (data)=>data
;
function checkTagFormat(tag) {
    return tag;
}
class Type1 {
    tag;
    kind = null;
    instanceOf;
    predicate;
    represent;
    defaultStyle;
    styleAliases;
    loadKind;
    constructor(tag, options){
        this.tag = checkTagFormat(tag);
        if (options) {
            this.kind = options.kind;
            this.resolve = options.resolve || DEFAULT_RESOLVE;
            this.construct = options.construct || DEFAULT_CONSTRUCT;
            this.instanceOf = options.instanceOf;
            this.predicate = options.predicate;
            this.represent = options.represent;
            this.defaultStyle = options.defaultStyle;
            this.styleAliases = options.styleAliases;
        }
    }
    resolve = ()=>true
    ;
    construct = (data)=>data
    ;
}
function copy(src, dst, off = 0) {
    off = Math.max(0, Math.min(off, dst.byteLength));
    const dstBytesAvailable = dst.byteLength - off;
    if (src.byteLength > dstBytesAvailable) {
        src = src.subarray(0, dstBytesAvailable);
    }
    dst.set(src, off);
    return src.byteLength;
}
const MIN_READ = 32 * 1024;
const MAX_SIZE = 2 ** 32 - 2;
class Buffer {
    #buf;
    #off = 0;
    constructor(ab){
        this.#buf = ab === undefined ? new Uint8Array(0) : new Uint8Array(ab);
    }
    bytes(options = {
        copy: true
    }) {
        if (options.copy === false) return this.#buf.subarray(this.#off);
        return this.#buf.slice(this.#off);
    }
    empty() {
        return this.#buf.byteLength <= this.#off;
    }
    get length() {
        return this.#buf.byteLength - this.#off;
    }
    get capacity() {
        return this.#buf.buffer.byteLength;
    }
    truncate(n) {
        if (n === 0) {
            this.reset();
            return;
        }
        if (n < 0 || n > this.length) {
            throw Error("bytes.Buffer: truncation out of range");
        }
        this.#reslice(this.#off + n);
    }
    reset() {
        this.#reslice(0);
        this.#off = 0;
    }
    #tryGrowByReslice = (n)=>{
        const l = this.#buf.byteLength;
        if (n <= this.capacity - l) {
            this.#reslice(l + n);
            return l;
        }
        return -1;
    };
    #reslice = (len)=>{
        assert(len <= this.#buf.buffer.byteLength);
        this.#buf = new Uint8Array(this.#buf.buffer, 0, len);
    };
    readSync(p) {
        if (this.empty()) {
            this.reset();
            if (p.byteLength === 0) {
                return 0;
            }
            return null;
        }
        const nread = copy(this.#buf.subarray(this.#off), p);
        this.#off += nread;
        return nread;
    }
    read(p) {
        const rr = this.readSync(p);
        return Promise.resolve(rr);
    }
    writeSync(p) {
        const m = this.#grow(p.byteLength);
        return copy(p, this.#buf, m);
    }
    write(p) {
        const n = this.writeSync(p);
        return Promise.resolve(n);
    }
    #grow = (n)=>{
        const m = this.length;
        if (m === 0 && this.#off !== 0) {
            this.reset();
        }
        const i = this.#tryGrowByReslice(n);
        if (i >= 0) {
            return i;
        }
        const c = this.capacity;
        if (n <= Math.floor(c / 2) - m) {
            copy(this.#buf.subarray(this.#off), this.#buf);
        } else if (c + n > MAX_SIZE) {
            throw new Error("The buffer cannot be grown beyond the maximum size.");
        } else {
            const buf = new Uint8Array(Math.min(2 * c + n, MAX_SIZE));
            copy(this.#buf.subarray(this.#off), buf);
            this.#buf = buf;
        }
        this.#off = 0;
        this.#reslice(Math.min(m + n, MAX_SIZE));
        return m;
    };
    grow(n) {
        if (n < 0) {
            throw Error("Buffer.grow: negative count");
        }
        const m = this.#grow(n);
        this.#reslice(m);
    }
    async readFrom(r) {
        let n = 0;
        const tmp = new Uint8Array(MIN_READ);
        while(true){
            const shouldGrow = this.capacity - this.length < MIN_READ;
            const buf = shouldGrow ? tmp : new Uint8Array(this.#buf.buffer, this.length);
            const nread = await r.read(buf);
            if (nread === null) {
                return n;
            }
            if (shouldGrow) this.writeSync(buf.subarray(0, nread));
            else this.#reslice(this.length + nread);
            n += nread;
        }
    }
    readFromSync(r) {
        let n = 0;
        const tmp = new Uint8Array(MIN_READ);
        while(true){
            const shouldGrow = this.capacity - this.length < MIN_READ;
            const buf = shouldGrow ? tmp : new Uint8Array(this.#buf.buffer, this.length);
            const nread = r.readSync(buf);
            if (nread === null) {
                return n;
            }
            if (shouldGrow) this.writeSync(buf.subarray(0, nread));
            else this.#reslice(this.length + nread);
            n += nread;
        }
    }
}
const BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
function resolveYamlBinary(data) {
    if (data === null) return false;
    let code;
    let bitlen = 0;
    const max = data.length;
    const map = BASE64_MAP;
    for(let idx = 0; idx < max; idx++){
        code = map.indexOf(data.charAt(idx));
        if (code > 64) continue;
        if (code < 0) return false;
        bitlen += 6;
    }
    return bitlen % 8 === 0;
}
function constructYamlBinary(data) {
    const input = data.replace(/[\r\n=]/g, "");
    const max = input.length;
    const map = BASE64_MAP;
    const result = [];
    let bits = 0;
    for(let idx = 0; idx < max; idx++){
        if (idx % 4 === 0 && idx) {
            result.push(bits >> 16 & 255);
            result.push(bits >> 8 & 255);
            result.push(bits & 255);
        }
        bits = bits << 6 | map.indexOf(input.charAt(idx));
    }
    const tailbits = max % 4 * 6;
    if (tailbits === 0) {
        result.push(bits >> 16 & 255);
        result.push(bits >> 8 & 255);
        result.push(bits & 255);
    } else if (tailbits === 18) {
        result.push(bits >> 10 & 255);
        result.push(bits >> 2 & 255);
    } else if (tailbits === 12) {
        result.push(bits >> 4 & 255);
    }
    return new Buffer(new Uint8Array(result));
}
function representYamlBinary(object) {
    const max = object.length;
    const map = BASE64_MAP;
    let result = "";
    let bits = 0;
    for(let idx = 0; idx < max; idx++){
        if (idx % 3 === 0 && idx) {
            result += map[bits >> 18 & 63];
            result += map[bits >> 12 & 63];
            result += map[bits >> 6 & 63];
            result += map[bits & 63];
        }
        bits = (bits << 8) + object[idx];
    }
    const tail = max % 3;
    if (tail === 0) {
        result += map[bits >> 18 & 63];
        result += map[bits >> 12 & 63];
        result += map[bits >> 6 & 63];
        result += map[bits & 63];
    } else if (tail === 2) {
        result += map[bits >> 10 & 63];
        result += map[bits >> 4 & 63];
        result += map[bits << 2 & 63];
        result += map[64];
    } else if (tail === 1) {
        result += map[bits >> 2 & 63];
        result += map[bits << 4 & 63];
        result += map[64];
        result += map[64];
    }
    return result;
}
function isBinary(obj) {
    const buf = new Buffer();
    try {
        if (0 > buf.readFromSync(obj)) return true;
        return false;
    } catch  {
        return false;
    } finally{
        buf.reset();
    }
}
const binary = new Type1("tag:yaml.org,2002:binary", {
    construct: constructYamlBinary,
    kind: "scalar",
    predicate: isBinary,
    represent: representYamlBinary,
    resolve: resolveYamlBinary
});
function resolveYamlBoolean(data) {
    const max = data.length;
    return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
}
function constructYamlBoolean(data) {
    return data === "true" || data === "True" || data === "TRUE";
}
const bool = new Type1("tag:yaml.org,2002:bool", {
    construct: constructYamlBoolean,
    defaultStyle: "lowercase",
    kind: "scalar",
    predicate: isBoolean,
    represent: {
        lowercase (object) {
            return object ? "true" : "false";
        },
        uppercase (object) {
            return object ? "TRUE" : "FALSE";
        },
        camelcase (object) {
            return object ? "True" : "False";
        }
    },
    resolve: resolveYamlBoolean
});
const YAML_FLOAT_PATTERN = new RegExp("^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?" + "|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?" + "|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*" + "|[-+]?\\.(?:inf|Inf|INF)" + "|\\.(?:nan|NaN|NAN))$");
function resolveYamlFloat(data) {
    if (!YAML_FLOAT_PATTERN.test(data) || data[data.length - 1] === "_") {
        return false;
    }
    return true;
}
function constructYamlFloat(data) {
    let value = data.replace(/_/g, "").toLowerCase();
    const sign = value[0] === "-" ? -1 : 1;
    const digits = [];
    if ("+-".indexOf(value[0]) >= 0) {
        value = value.slice(1);
    }
    if (value === ".inf") {
        return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    }
    if (value === ".nan") {
        return NaN;
    }
    if (value.indexOf(":") >= 0) {
        value.split(":").forEach((v)=>{
            digits.unshift(parseFloat(v));
        });
        let valueNb = 0;
        let base = 1;
        digits.forEach((d)=>{
            valueNb += d * base;
            base *= 60;
        });
        return sign * valueNb;
    }
    return sign * parseFloat(value);
}
const SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
function representYamlFloat(object, style) {
    if (isNaN(object)) {
        switch(style){
            case "lowercase":
                return ".nan";
            case "uppercase":
                return ".NAN";
            case "camelcase":
                return ".NaN";
        }
    } else if (Number.POSITIVE_INFINITY === object) {
        switch(style){
            case "lowercase":
                return ".inf";
            case "uppercase":
                return ".INF";
            case "camelcase":
                return ".Inf";
        }
    } else if (Number.NEGATIVE_INFINITY === object) {
        switch(style){
            case "lowercase":
                return "-.inf";
            case "uppercase":
                return "-.INF";
            case "camelcase":
                return "-.Inf";
        }
    } else if (isNegativeZero(object)) {
        return "-0.0";
    }
    const res = object.toString(10);
    return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
}
function isFloat(object) {
    return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 !== 0 || isNegativeZero(object));
}
const __float = new Type1("tag:yaml.org,2002:float", {
    construct: constructYamlFloat,
    defaultStyle: "lowercase",
    kind: "scalar",
    predicate: isFloat,
    represent: representYamlFloat,
    resolve: resolveYamlFloat
});
function reconstructFunction(code) {
    const func = new Function(`return ${code}`)();
    if (!(func instanceof Function)) {
        throw new TypeError(`Expected function but got ${typeof func}: ${code}`);
    }
    return func;
}
const func = new Type1("tag:yaml.org,2002:js/function", {
    kind: "scalar",
    resolve (data) {
        if (data === null) {
            return false;
        }
        try {
            reconstructFunction(`${data}`);
            return true;
        } catch (_err) {
            return false;
        }
    },
    construct (data) {
        return reconstructFunction(data);
    },
    predicate (object) {
        return object instanceof Function;
    },
    represent (object) {
        return object.toString();
    }
});
function isHexCode(c) {
    return 48 <= c && c <= 57 || 65 <= c && c <= 70 || 97 <= c && c <= 102;
}
function isOctCode(c) {
    return 48 <= c && c <= 55;
}
function isDecCode(c) {
    return 48 <= c && c <= 57;
}
function resolveYamlInteger(data) {
    const max = data.length;
    let index = 0;
    let hasDigits = false;
    if (!max) return false;
    let ch = data[index];
    if (ch === "-" || ch === "+") {
        ch = data[++index];
    }
    if (ch === "0") {
        if (index + 1 === max) return true;
        ch = data[++index];
        if (ch === "b") {
            index++;
            for(; index < max; index++){
                ch = data[index];
                if (ch === "_") continue;
                if (ch !== "0" && ch !== "1") return false;
                hasDigits = true;
            }
            return hasDigits && ch !== "_";
        }
        if (ch === "x") {
            index++;
            for(; index < max; index++){
                ch = data[index];
                if (ch === "_") continue;
                if (!isHexCode(data.charCodeAt(index))) return false;
                hasDigits = true;
            }
            return hasDigits && ch !== "_";
        }
        for(; index < max; index++){
            ch = data[index];
            if (ch === "_") continue;
            if (!isOctCode(data.charCodeAt(index))) return false;
            hasDigits = true;
        }
        return hasDigits && ch !== "_";
    }
    if (ch === "_") return false;
    for(; index < max; index++){
        ch = data[index];
        if (ch === "_") continue;
        if (ch === ":") break;
        if (!isDecCode(data.charCodeAt(index))) {
            return false;
        }
        hasDigits = true;
    }
    if (!hasDigits || ch === "_") return false;
    if (ch !== ":") return true;
    return /^(:[0-5]?[0-9])+$/.test(data.slice(index));
}
function constructYamlInteger(data) {
    let value = data;
    const digits = [];
    if (value.indexOf("_") !== -1) {
        value = value.replace(/_/g, "");
    }
    let sign = 1;
    let ch = value[0];
    if (ch === "-" || ch === "+") {
        if (ch === "-") sign = -1;
        value = value.slice(1);
        ch = value[0];
    }
    if (value === "0") return 0;
    if (ch === "0") {
        if (value[1] === "b") return sign * parseInt(value.slice(2), 2);
        if (value[1] === "x") return sign * parseInt(value, 16);
        return sign * parseInt(value, 8);
    }
    if (value.indexOf(":") !== -1) {
        value.split(":").forEach((v)=>{
            digits.unshift(parseInt(v, 10));
        });
        let valueInt = 0;
        let base = 1;
        digits.forEach((d)=>{
            valueInt += d * base;
            base *= 60;
        });
        return sign * valueInt;
    }
    return sign * parseInt(value, 10);
}
function isInteger(object) {
    return Object.prototype.toString.call(object) === "[object Number]" && object % 1 === 0 && !isNegativeZero(object);
}
const __int = new Type1("tag:yaml.org,2002:int", {
    construct: constructYamlInteger,
    defaultStyle: "decimal",
    kind: "scalar",
    predicate: isInteger,
    represent: {
        binary (obj) {
            return obj >= 0 ? `0b${obj.toString(2)}` : `-0b${obj.toString(2).slice(1)}`;
        },
        octal (obj) {
            return obj >= 0 ? `0${obj.toString(8)}` : `-0${obj.toString(8).slice(1)}`;
        },
        decimal (obj) {
            return obj.toString(10);
        },
        hexadecimal (obj) {
            return obj >= 0 ? `0x${obj.toString(16).toUpperCase()}` : `-0x${obj.toString(16).toUpperCase().slice(1)}`;
        }
    },
    resolve: resolveYamlInteger,
    styleAliases: {
        binary: [
            2,
            "bin"
        ],
        decimal: [
            10,
            "dec"
        ],
        hexadecimal: [
            16,
            "hex"
        ],
        octal: [
            8,
            "oct"
        ]
    }
});
const map = new Type1("tag:yaml.org,2002:map", {
    construct (data) {
        return data !== null ? data : {
        };
    },
    kind: "mapping"
});
function resolveYamlMerge(data) {
    return data === "<<" || data === null;
}
const merge = new Type1("tag:yaml.org,2002:merge", {
    kind: "scalar",
    resolve: resolveYamlMerge
});
function resolveYamlNull(data) {
    const max = data.length;
    return max === 1 && data === "~" || max === 4 && (data === "null" || data === "Null" || data === "NULL");
}
function constructYamlNull() {
    return null;
}
function isNull(object) {
    return object === null;
}
const nil = new Type1("tag:yaml.org,2002:null", {
    construct: constructYamlNull,
    defaultStyle: "lowercase",
    kind: "scalar",
    predicate: isNull,
    represent: {
        canonical () {
            return "~";
        },
        lowercase () {
            return "null";
        },
        uppercase () {
            return "NULL";
        },
        camelcase () {
            return "Null";
        }
    },
    resolve: resolveYamlNull
});
const _hasOwnProperty = Object.prototype.hasOwnProperty;
const _toString = Object.prototype.toString;
function resolveYamlOmap(data) {
    const objectKeys = [];
    let pairKey = "";
    let pairHasKey = false;
    for (const pair of data){
        pairHasKey = false;
        if (_toString.call(pair) !== "[object Object]") return false;
        for(pairKey in pair){
            if (_hasOwnProperty.call(pair, pairKey)) {
                if (!pairHasKey) pairHasKey = true;
                else return false;
            }
        }
        if (!pairHasKey) return false;
        if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
        else return false;
    }
    return true;
}
function constructYamlOmap(data) {
    return data !== null ? data : [];
}
const omap = new Type1("tag:yaml.org,2002:omap", {
    construct: constructYamlOmap,
    kind: "sequence",
    resolve: resolveYamlOmap
});
const _toString1 = Object.prototype.toString;
function resolveYamlPairs(data) {
    const result = new Array(data.length);
    for(let index = 0; index < data.length; index++){
        const pair = data[index];
        if (_toString1.call(pair) !== "[object Object]") return false;
        const keys = Object.keys(pair);
        if (keys.length !== 1) return false;
        result[index] = [
            keys[0],
            pair[keys[0]]
        ];
    }
    return true;
}
function constructYamlPairs(data) {
    if (data === null) return [];
    const result = new Array(data.length);
    for(let index = 0; index < data.length; index += 1){
        const pair = data[index];
        const keys = Object.keys(pair);
        result[index] = [
            keys[0],
            pair[keys[0]]
        ];
    }
    return result;
}
const pairs = new Type1("tag:yaml.org,2002:pairs", {
    construct: constructYamlPairs,
    kind: "sequence",
    resolve: resolveYamlPairs
});
const REGEXP = /^\/(?<regexp>[\s\S]+)\/(?<modifiers>[gismuy]*)$/;
const regexp = new Type1("tag:yaml.org,2002:js/regexp", {
    kind: "scalar",
    resolve (data) {
        if (data === null || !data.length) {
            return false;
        }
        const regexp = `${data}`;
        if (regexp.charAt(0) === "/") {
            if (!REGEXP.test(data)) {
                return false;
            }
            const modifiers = [
                ...regexp.match(REGEXP)?.groups?.modifiers ?? ""
            ];
            if (new Set(modifiers).size < modifiers.length) {
                return false;
            }
        }
        return true;
    },
    construct (data) {
        const { regexp =`${data}` , modifiers =""  } = `${data}`.match(REGEXP)?.groups ?? {
        };
        return new RegExp(regexp, modifiers);
    },
    predicate (object) {
        return object instanceof RegExp;
    },
    represent (object) {
        return object.toString();
    }
});
const seq = new Type1("tag:yaml.org,2002:seq", {
    construct (data) {
        return data !== null ? data : [];
    },
    kind: "sequence"
});
const _hasOwnProperty1 = Object.prototype.hasOwnProperty;
function resolveYamlSet(data) {
    if (data === null) return true;
    for(const key in data){
        if (_hasOwnProperty1.call(data, key)) {
            if (data[key] !== null) return false;
        }
    }
    return true;
}
function constructYamlSet(data) {
    return data !== null ? data : {
    };
}
const set = new Type1("tag:yaml.org,2002:set", {
    construct: constructYamlSet,
    kind: "mapping",
    resolve: resolveYamlSet
});
const str = new Type1("tag:yaml.org,2002:str", {
    construct (data) {
        return data !== null ? data : "";
    },
    kind: "scalar"
});
const YAML_DATE_REGEXP = new RegExp("^([0-9][0-9][0-9][0-9])" + "-([0-9][0-9])" + "-([0-9][0-9])$");
const YAML_TIMESTAMP_REGEXP = new RegExp("^([0-9][0-9][0-9][0-9])" + "-([0-9][0-9]?)" + "-([0-9][0-9]?)" + "(?:[Tt]|[ \\t]+)" + "([0-9][0-9]?)" + ":([0-9][0-9])" + ":([0-9][0-9])" + "(?:\\.([0-9]*))?" + "(?:[ \\t]*(Z|([-+])([0-9][0-9]?)" + "(?::([0-9][0-9]))?))?$");
function resolveYamlTimestamp(data) {
    if (data === null) return false;
    if (YAML_DATE_REGEXP.exec(data) !== null) return true;
    if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
    return false;
}
function constructYamlTimestamp(data) {
    let match = YAML_DATE_REGEXP.exec(data);
    if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);
    if (match === null) throw new Error("Date resolve error");
    const year = +match[1];
    const month = +match[2] - 1;
    const day = +match[3];
    if (!match[4]) {
        return new Date(Date.UTC(year, month, day));
    }
    const hour = +match[4];
    const minute = +match[5];
    const second = +match[6];
    let fraction = 0;
    if (match[7]) {
        let partFraction = match[7].slice(0, 3);
        while(partFraction.length < 3){
            partFraction += "0";
        }
        fraction = +partFraction;
    }
    let delta = null;
    if (match[9]) {
        const tzHour = +match[10];
        const tzMinute = +(match[11] || 0);
        delta = (tzHour * 60 + tzMinute) * 60000;
        if (match[9] === "-") delta = -delta;
    }
    const date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
    if (delta) date.setTime(date.getTime() - delta);
    return date;
}
function representYamlTimestamp(date) {
    return date.toISOString();
}
const timestamp = new Type1("tag:yaml.org,2002:timestamp", {
    construct: constructYamlTimestamp,
    instanceOf: Date,
    kind: "scalar",
    represent: representYamlTimestamp,
    resolve: resolveYamlTimestamp
});
const undefinedType = new Type1("tag:yaml.org,2002:js/undefined", {
    kind: "scalar",
    resolve () {
        return true;
    },
    construct () {
        return undefined;
    },
    predicate (object) {
        return typeof object === "undefined";
    },
    represent () {
        return "";
    }
});
const failsafe = new Schema({
    explicit: [
        str,
        seq,
        map
    ]
});
const json1 = new Schema({
    implicit: [
        nil,
        bool,
        __int,
        __float
    ],
    include: [
        failsafe
    ]
});
const core = new Schema({
    include: [
        json1
    ]
});
const def = new Schema({
    explicit: [
        binary,
        omap,
        pairs,
        set
    ],
    implicit: [
        timestamp,
        merge
    ],
    include: [
        core
    ]
});
new Schema({
    explicit: [
        func,
        regexp,
        undefinedType
    ],
    include: [
        def
    ]
});
class State {
    schema;
    constructor(schema = def){
        this.schema = schema;
    }
}
class LoaderState extends State {
    input;
    documents = [];
    length;
    lineIndent = 0;
    lineStart = 0;
    position = 0;
    line = 0;
    filename;
    onWarning;
    legacy;
    json;
    listener;
    implicitTypes;
    typeMap;
    version;
    checkLineBreaks;
    tagMap;
    anchorMap;
    tag;
    anchor;
    kind;
    result = "";
    constructor(input, { filename , schema , onWarning , legacy =false , json =false , listener =null  }){
        super(schema);
        this.input = input;
        this.filename = filename;
        this.onWarning = onWarning;
        this.legacy = legacy;
        this.json = json;
        this.listener = listener;
        this.implicitTypes = this.schema.compiledImplicit;
        this.typeMap = this.schema.compiledTypeMap;
        this.length = input.length;
    }
}
const _hasOwnProperty2 = Object.prototype.hasOwnProperty;
const CONTEXT_BLOCK_IN = 3;
const CONTEXT_BLOCK_OUT = 4;
const CHOMPING_STRIP = 2;
const CHOMPING_KEEP = 3;
const PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
const PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
const PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
const PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
const PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function _class(obj) {
    return Object.prototype.toString.call(obj);
}
function isEOL(c) {
    return c === 10 || c === 13;
}
function isWhiteSpace(c) {
    return c === 9 || c === 32;
}
function isWsOrEol(c) {
    return c === 9 || c === 32 || c === 10 || c === 13;
}
function isFlowIndicator(c) {
    return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
}
function fromHexCode(c) {
    if (48 <= c && c <= 57) {
        return c - 48;
    }
    const lc = c | 32;
    if (97 <= lc && lc <= 102) {
        return lc - 97 + 10;
    }
    return -1;
}
function escapedHexLen(c) {
    if (c === 120) {
        return 2;
    }
    if (c === 117) {
        return 4;
    }
    if (c === 85) {
        return 8;
    }
    return 0;
}
function fromDecimalCode(c) {
    if (48 <= c && c <= 57) {
        return c - 48;
    }
    return -1;
}
function simpleEscapeSequence(c) {
    return c === 48 ? "\x00" : c === 97 ? "\x07" : c === 98 ? "\x08" : c === 116 ? "\x09" : c === 9 ? "\x09" : c === 110 ? "\x0A" : c === 118 ? "\x0B" : c === 102 ? "\x0C" : c === 114 ? "\x0D" : c === 101 ? "\x1B" : c === 32 ? " " : c === 34 ? "\x22" : c === 47 ? "/" : c === 92 ? "\x5C" : c === 78 ? "\x85" : c === 95 ? "\xA0" : c === 76 ? "\u2028" : c === 80 ? "\u2029" : "";
}
function charFromCodepoint(c) {
    if (c <= 65535) {
        return String.fromCharCode(c);
    }
    return String.fromCharCode((c - 65536 >> 10) + 55296, (c - 65536 & 1023) + 56320);
}
const simpleEscapeCheck = new Array(256);
const simpleEscapeMap = new Array(256);
for(let i = 0; i < 256; i++){
    simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
    simpleEscapeMap[i] = simpleEscapeSequence(i);
}
function generateError(state, message) {
    return new YAMLError(message, new Mark(state.filename, state.input, state.position, state.line, state.position - state.lineStart));
}
function throwError(state, message) {
    throw generateError(state, message);
}
function throwWarning(state, message) {
    if (state.onWarning) {
        state.onWarning.call(null, generateError(state, message));
    }
}
const directiveHandlers = {
    YAML (state, _name, ...args) {
        if (state.version !== null) {
            return throwError(state, "duplication of %YAML directive");
        }
        if (args.length !== 1) {
            return throwError(state, "YAML directive accepts exactly one argument");
        }
        const match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
        if (match === null) {
            return throwError(state, "ill-formed argument of the YAML directive");
        }
        const major = parseInt(match[1], 10);
        const minor = parseInt(match[2], 10);
        if (major !== 1) {
            return throwError(state, "unacceptable YAML version of the document");
        }
        state.version = args[0];
        state.checkLineBreaks = minor < 2;
        if (minor !== 1 && minor !== 2) {
            return throwWarning(state, "unsupported YAML version of the document");
        }
    },
    TAG (state, _name, ...args) {
        if (args.length !== 2) {
            return throwError(state, "TAG directive accepts exactly two arguments");
        }
        const handle = args[0];
        const prefix = args[1];
        if (!PATTERN_TAG_HANDLE.test(handle)) {
            return throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
        }
        if (_hasOwnProperty2.call(state.tagMap, handle)) {
            return throwError(state, `there is a previously declared suffix for "${handle}" tag handle`);
        }
        if (!PATTERN_TAG_URI.test(prefix)) {
            return throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
        }
        if (typeof state.tagMap === "undefined") {
            state.tagMap = {
            };
        }
        state.tagMap[handle] = prefix;
    }
};
function captureSegment(state, start, end, checkJson) {
    let result;
    if (start < end) {
        result = state.input.slice(start, end);
        if (checkJson) {
            for(let position = 0, length = result.length; position < length; position++){
                const character = result.charCodeAt(position);
                if (!(character === 9 || 32 <= character && character <= 1114111)) {
                    return throwError(state, "expected valid JSON character");
                }
            }
        } else if (PATTERN_NON_PRINTABLE.test(result)) {
            return throwError(state, "the stream contains non-printable characters");
        }
        state.result += result;
    }
}
function mergeMappings(state, destination, source, overridableKeys) {
    if (!isObject(source)) {
        return throwError(state, "cannot merge mappings; the provided source object is unacceptable");
    }
    const keys = Object.keys(source);
    for(let i = 0, len = keys.length; i < len; i++){
        const key = keys[i];
        if (!_hasOwnProperty2.call(destination, key)) {
            destination[key] = source[key];
            overridableKeys[key] = true;
        }
    }
}
function storeMappingPair(state, result, overridableKeys, keyTag, keyNode, valueNode, startLine, startPos) {
    if (Array.isArray(keyNode)) {
        keyNode = Array.prototype.slice.call(keyNode);
        for(let index = 0, quantity = keyNode.length; index < quantity; index++){
            if (Array.isArray(keyNode[index])) {
                return throwError(state, "nested arrays are not supported inside keys");
            }
            if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") {
                keyNode[index] = "[object Object]";
            }
        }
    }
    if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
        keyNode = "[object Object]";
    }
    keyNode = String(keyNode);
    if (result === null) {
        result = {
        };
    }
    if (keyTag === "tag:yaml.org,2002:merge") {
        if (Array.isArray(valueNode)) {
            for(let index = 0, quantity = valueNode.length; index < quantity; index++){
                mergeMappings(state, result, valueNode[index], overridableKeys);
            }
        } else {
            mergeMappings(state, result, valueNode, overridableKeys);
        }
    } else {
        if (!state.json && !_hasOwnProperty2.call(overridableKeys, keyNode) && _hasOwnProperty2.call(result, keyNode)) {
            state.line = startLine || state.line;
            state.position = startPos || state.position;
            return throwError(state, "duplicated mapping key");
        }
        result[keyNode] = valueNode;
        delete overridableKeys[keyNode];
    }
    return result;
}
function readLineBreak(state) {
    const ch = state.input.charCodeAt(state.position);
    if (ch === 10) {
        state.position++;
    } else if (ch === 13) {
        state.position++;
        if (state.input.charCodeAt(state.position) === 10) {
            state.position++;
        }
    } else {
        return throwError(state, "a line break is expected");
    }
    state.line += 1;
    state.lineStart = state.position;
}
function skipSeparationSpace(state, allowComments, checkIndent) {
    let lineBreaks = 0, ch = state.input.charCodeAt(state.position);
    while(ch !== 0){
        while(isWhiteSpace(ch)){
            ch = state.input.charCodeAt(++state.position);
        }
        if (allowComments && ch === 35) {
            do {
                ch = state.input.charCodeAt(++state.position);
            }while (ch !== 10 && ch !== 13 && ch !== 0)
        }
        if (isEOL(ch)) {
            readLineBreak(state);
            ch = state.input.charCodeAt(state.position);
            lineBreaks++;
            state.lineIndent = 0;
            while(ch === 32){
                state.lineIndent++;
                ch = state.input.charCodeAt(++state.position);
            }
        } else {
            break;
        }
    }
    if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
        throwWarning(state, "deficient indentation");
    }
    return lineBreaks;
}
function testDocumentSeparator(state) {
    let _position = state.position;
    let ch = state.input.charCodeAt(_position);
    if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
        _position += 3;
        ch = state.input.charCodeAt(_position);
        if (ch === 0 || isWsOrEol(ch)) {
            return true;
        }
    }
    return false;
}
function writeFoldedLines(state, count) {
    if (count === 1) {
        state.result += " ";
    } else if (count > 1) {
        state.result += repeat("\n", count - 1);
    }
}
function readPlainScalar(state, nodeIndent, withinFlowCollection) {
    const kind = state.kind;
    const result = state.result;
    let ch = state.input.charCodeAt(state.position);
    if (isWsOrEol(ch) || isFlowIndicator(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) {
        return false;
    }
    let following;
    if (ch === 63 || ch === 45) {
        following = state.input.charCodeAt(state.position + 1);
        if (isWsOrEol(following) || withinFlowCollection && isFlowIndicator(following)) {
            return false;
        }
    }
    state.kind = "scalar";
    state.result = "";
    let captureEnd, captureStart = captureEnd = state.position;
    let hasPendingContent = false;
    let line = 0;
    while(ch !== 0){
        if (ch === 58) {
            following = state.input.charCodeAt(state.position + 1);
            if (isWsOrEol(following) || withinFlowCollection && isFlowIndicator(following)) {
                break;
            }
        } else if (ch === 35) {
            const preceding = state.input.charCodeAt(state.position - 1);
            if (isWsOrEol(preceding)) {
                break;
            }
        } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && isFlowIndicator(ch)) {
            break;
        } else if (isEOL(ch)) {
            line = state.line;
            const lineStart = state.lineStart;
            const lineIndent = state.lineIndent;
            skipSeparationSpace(state, false, -1);
            if (state.lineIndent >= nodeIndent) {
                hasPendingContent = true;
                ch = state.input.charCodeAt(state.position);
                continue;
            } else {
                state.position = captureEnd;
                state.line = line;
                state.lineStart = lineStart;
                state.lineIndent = lineIndent;
                break;
            }
        }
        if (hasPendingContent) {
            captureSegment(state, captureStart, captureEnd, false);
            writeFoldedLines(state, state.line - line);
            captureStart = captureEnd = state.position;
            hasPendingContent = false;
        }
        if (!isWhiteSpace(ch)) {
            captureEnd = state.position + 1;
        }
        ch = state.input.charCodeAt(++state.position);
    }
    captureSegment(state, captureStart, captureEnd, false);
    if (state.result) {
        return true;
    }
    state.kind = kind;
    state.result = result;
    return false;
}
function readSingleQuotedScalar(state, nodeIndent) {
    let ch, captureStart, captureEnd;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 39) {
        return false;
    }
    state.kind = "scalar";
    state.result = "";
    state.position++;
    captureStart = captureEnd = state.position;
    while((ch = state.input.charCodeAt(state.position)) !== 0){
        if (ch === 39) {
            captureSegment(state, captureStart, state.position, true);
            ch = state.input.charCodeAt(++state.position);
            if (ch === 39) {
                captureStart = state.position;
                state.position++;
                captureEnd = state.position;
            } else {
                return true;
            }
        } else if (isEOL(ch)) {
            captureSegment(state, captureStart, captureEnd, true);
            writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
            captureStart = captureEnd = state.position;
        } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
            return throwError(state, "unexpected end of the document within a single quoted scalar");
        } else {
            state.position++;
            captureEnd = state.position;
        }
    }
    return throwError(state, "unexpected end of the stream within a single quoted scalar");
}
function readDoubleQuotedScalar(state, nodeIndent) {
    let ch = state.input.charCodeAt(state.position);
    if (ch !== 34) {
        return false;
    }
    state.kind = "scalar";
    state.result = "";
    state.position++;
    let captureEnd, captureStart = captureEnd = state.position;
    let tmp;
    while((ch = state.input.charCodeAt(state.position)) !== 0){
        if (ch === 34) {
            captureSegment(state, captureStart, state.position, true);
            state.position++;
            return true;
        }
        if (ch === 92) {
            captureSegment(state, captureStart, state.position, true);
            ch = state.input.charCodeAt(++state.position);
            if (isEOL(ch)) {
                skipSeparationSpace(state, false, nodeIndent);
            } else if (ch < 256 && simpleEscapeCheck[ch]) {
                state.result += simpleEscapeMap[ch];
                state.position++;
            } else if ((tmp = escapedHexLen(ch)) > 0) {
                let hexLength = tmp;
                let hexResult = 0;
                for(; hexLength > 0; hexLength--){
                    ch = state.input.charCodeAt(++state.position);
                    if ((tmp = fromHexCode(ch)) >= 0) {
                        hexResult = (hexResult << 4) + tmp;
                    } else {
                        return throwError(state, "expected hexadecimal character");
                    }
                }
                state.result += charFromCodepoint(hexResult);
                state.position++;
            } else {
                return throwError(state, "unknown escape sequence");
            }
            captureStart = captureEnd = state.position;
        } else if (isEOL(ch)) {
            captureSegment(state, captureStart, captureEnd, true);
            writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
            captureStart = captureEnd = state.position;
        } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
            return throwError(state, "unexpected end of the document within a double quoted scalar");
        } else {
            state.position++;
            captureEnd = state.position;
        }
    }
    return throwError(state, "unexpected end of the stream within a double quoted scalar");
}
function readFlowCollection(state, nodeIndent) {
    let ch = state.input.charCodeAt(state.position);
    let terminator;
    let isMapping = true;
    let result = {
    };
    if (ch === 91) {
        terminator = 93;
        isMapping = false;
        result = [];
    } else if (ch === 123) {
        terminator = 125;
    } else {
        return false;
    }
    if (state.anchor !== null && typeof state.anchor != "undefined" && typeof state.anchorMap != "undefined") {
        state.anchorMap[state.anchor] = result;
    }
    ch = state.input.charCodeAt(++state.position);
    const tag = state.tag, anchor = state.anchor;
    let readNext = true;
    let valueNode, keyNode, keyTag = keyNode = valueNode = null, isExplicitPair, isPair = isExplicitPair = false;
    let following = 0, line = 0;
    const overridableKeys = {
    };
    while(ch !== 0){
        skipSeparationSpace(state, true, nodeIndent);
        ch = state.input.charCodeAt(state.position);
        if (ch === terminator) {
            state.position++;
            state.tag = tag;
            state.anchor = anchor;
            state.kind = isMapping ? "mapping" : "sequence";
            state.result = result;
            return true;
        }
        if (!readNext) {
            return throwError(state, "missed comma between flow collection entries");
        }
        keyTag = keyNode = valueNode = null;
        isPair = isExplicitPair = false;
        if (ch === 63) {
            following = state.input.charCodeAt(state.position + 1);
            if (isWsOrEol(following)) {
                isPair = isExplicitPair = true;
                state.position++;
                skipSeparationSpace(state, true, nodeIndent);
            }
        }
        line = state.line;
        composeNode(state, nodeIndent, 1, false, true);
        keyTag = state.tag || null;
        keyNode = state.result;
        skipSeparationSpace(state, true, nodeIndent);
        ch = state.input.charCodeAt(state.position);
        if ((isExplicitPair || state.line === line) && ch === 58) {
            isPair = true;
            ch = state.input.charCodeAt(++state.position);
            skipSeparationSpace(state, true, nodeIndent);
            composeNode(state, nodeIndent, 1, false, true);
            valueNode = state.result;
        }
        if (isMapping) {
            storeMappingPair(state, result, overridableKeys, keyTag, keyNode, valueNode);
        } else if (isPair) {
            result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode));
        } else {
            result.push(keyNode);
        }
        skipSeparationSpace(state, true, nodeIndent);
        ch = state.input.charCodeAt(state.position);
        if (ch === 44) {
            readNext = true;
            ch = state.input.charCodeAt(++state.position);
        } else {
            readNext = false;
        }
    }
    return throwError(state, "unexpected end of the stream within a flow collection");
}
function readBlockScalar(state, nodeIndent) {
    let chomping = 1, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false;
    let ch = state.input.charCodeAt(state.position);
    let folding = false;
    if (ch === 124) {
        folding = false;
    } else if (ch === 62) {
        folding = true;
    } else {
        return false;
    }
    state.kind = "scalar";
    state.result = "";
    let tmp = 0;
    while(ch !== 0){
        ch = state.input.charCodeAt(++state.position);
        if (ch === 43 || ch === 45) {
            if (1 === chomping) {
                chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
            } else {
                return throwError(state, "repeat of a chomping mode identifier");
            }
        } else if ((tmp = fromDecimalCode(ch)) >= 0) {
            if (tmp === 0) {
                return throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
            } else if (!detectedIndent) {
                textIndent = nodeIndent + tmp - 1;
                detectedIndent = true;
            } else {
                return throwError(state, "repeat of an indentation width identifier");
            }
        } else {
            break;
        }
    }
    if (isWhiteSpace(ch)) {
        do {
            ch = state.input.charCodeAt(++state.position);
        }while (isWhiteSpace(ch))
        if (ch === 35) {
            do {
                ch = state.input.charCodeAt(++state.position);
            }while (!isEOL(ch) && ch !== 0)
        }
    }
    while(ch !== 0){
        readLineBreak(state);
        state.lineIndent = 0;
        ch = state.input.charCodeAt(state.position);
        while((!detectedIndent || state.lineIndent < textIndent) && ch === 32){
            state.lineIndent++;
            ch = state.input.charCodeAt(++state.position);
        }
        if (!detectedIndent && state.lineIndent > textIndent) {
            textIndent = state.lineIndent;
        }
        if (isEOL(ch)) {
            emptyLines++;
            continue;
        }
        if (state.lineIndent < textIndent) {
            if (chomping === 3) {
                state.result += repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
            } else if (chomping === 1) {
                if (didReadContent) {
                    state.result += "\n";
                }
            }
            break;
        }
        if (folding) {
            if (isWhiteSpace(ch)) {
                atMoreIndented = true;
                state.result += repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
            } else if (atMoreIndented) {
                atMoreIndented = false;
                state.result += repeat("\n", emptyLines + 1);
            } else if (emptyLines === 0) {
                if (didReadContent) {
                    state.result += " ";
                }
            } else {
                state.result += repeat("\n", emptyLines);
            }
        } else {
            state.result += repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
        }
        didReadContent = true;
        detectedIndent = true;
        emptyLines = 0;
        const captureStart = state.position;
        while(!isEOL(ch) && ch !== 0){
            ch = state.input.charCodeAt(++state.position);
        }
        captureSegment(state, captureStart, state.position, false);
    }
    return true;
}
function readBlockSequence(state, nodeIndent) {
    let line, following, detected = false, ch;
    const tag = state.tag, anchor = state.anchor, result = [];
    if (state.anchor !== null && typeof state.anchor !== "undefined" && typeof state.anchorMap !== "undefined") {
        state.anchorMap[state.anchor] = result;
    }
    ch = state.input.charCodeAt(state.position);
    while(ch !== 0){
        if (ch !== 45) {
            break;
        }
        following = state.input.charCodeAt(state.position + 1);
        if (!isWsOrEol(following)) {
            break;
        }
        detected = true;
        state.position++;
        if (skipSeparationSpace(state, true, -1)) {
            if (state.lineIndent <= nodeIndent) {
                result.push(null);
                ch = state.input.charCodeAt(state.position);
                continue;
            }
        }
        line = state.line;
        composeNode(state, nodeIndent, 3, false, true);
        result.push(state.result);
        skipSeparationSpace(state, true, -1);
        ch = state.input.charCodeAt(state.position);
        if ((state.line === line || state.lineIndent > nodeIndent) && ch !== 0) {
            return throwError(state, "bad indentation of a sequence entry");
        } else if (state.lineIndent < nodeIndent) {
            break;
        }
    }
    if (detected) {
        state.tag = tag;
        state.anchor = anchor;
        state.kind = "sequence";
        state.result = result;
        return true;
    }
    return false;
}
function readBlockMapping(state, nodeIndent, flowIndent) {
    const tag = state.tag, anchor = state.anchor, result = {
    }, overridableKeys = {
    };
    let following, allowCompact = false, line, pos, keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
    if (state.anchor !== null && typeof state.anchor !== "undefined" && typeof state.anchorMap !== "undefined") {
        state.anchorMap[state.anchor] = result;
    }
    ch = state.input.charCodeAt(state.position);
    while(ch !== 0){
        following = state.input.charCodeAt(state.position + 1);
        line = state.line;
        pos = state.position;
        if ((ch === 63 || ch === 58) && isWsOrEol(following)) {
            if (ch === 63) {
                if (atExplicitKey) {
                    storeMappingPair(state, result, overridableKeys, keyTag, keyNode, null);
                    keyTag = keyNode = valueNode = null;
                }
                detected = true;
                atExplicitKey = true;
                allowCompact = true;
            } else if (atExplicitKey) {
                atExplicitKey = false;
                allowCompact = true;
            } else {
                return throwError(state, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
            }
            state.position += 1;
            ch = following;
        } else if (composeNode(state, flowIndent, 2, false, true)) {
            if (state.line === line) {
                ch = state.input.charCodeAt(state.position);
                while(isWhiteSpace(ch)){
                    ch = state.input.charCodeAt(++state.position);
                }
                if (ch === 58) {
                    ch = state.input.charCodeAt(++state.position);
                    if (!isWsOrEol(ch)) {
                        return throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
                    }
                    if (atExplicitKey) {
                        storeMappingPair(state, result, overridableKeys, keyTag, keyNode, null);
                        keyTag = keyNode = valueNode = null;
                    }
                    detected = true;
                    atExplicitKey = false;
                    allowCompact = false;
                    keyTag = state.tag;
                    keyNode = state.result;
                } else if (detected) {
                    return throwError(state, "can not read an implicit mapping pair; a colon is missed");
                } else {
                    state.tag = tag;
                    state.anchor = anchor;
                    return true;
                }
            } else if (detected) {
                return throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
            } else {
                state.tag = tag;
                state.anchor = anchor;
                return true;
            }
        } else {
            break;
        }
        if (state.line === line || state.lineIndent > nodeIndent) {
            if (composeNode(state, nodeIndent, 4, true, allowCompact)) {
                if (atExplicitKey) {
                    keyNode = state.result;
                } else {
                    valueNode = state.result;
                }
            }
            if (!atExplicitKey) {
                storeMappingPair(state, result, overridableKeys, keyTag, keyNode, valueNode, line, pos);
                keyTag = keyNode = valueNode = null;
            }
            skipSeparationSpace(state, true, -1);
            ch = state.input.charCodeAt(state.position);
        }
        if (state.lineIndent > nodeIndent && ch !== 0) {
            return throwError(state, "bad indentation of a mapping entry");
        } else if (state.lineIndent < nodeIndent) {
            break;
        }
    }
    if (atExplicitKey) {
        storeMappingPair(state, result, overridableKeys, keyTag, keyNode, null);
    }
    if (detected) {
        state.tag = tag;
        state.anchor = anchor;
        state.kind = "mapping";
        state.result = result;
    }
    return detected;
}
function readTagProperty(state) {
    let position, isVerbatim = false, isNamed = false, tagHandle = "", tagName, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 33) return false;
    if (state.tag !== null) {
        return throwError(state, "duplication of a tag property");
    }
    ch = state.input.charCodeAt(++state.position);
    if (ch === 60) {
        isVerbatim = true;
        ch = state.input.charCodeAt(++state.position);
    } else if (ch === 33) {
        isNamed = true;
        tagHandle = "!!";
        ch = state.input.charCodeAt(++state.position);
    } else {
        tagHandle = "!";
    }
    position = state.position;
    if (isVerbatim) {
        do {
            ch = state.input.charCodeAt(++state.position);
        }while (ch !== 0 && ch !== 62)
        if (state.position < state.length) {
            tagName = state.input.slice(position, state.position);
            ch = state.input.charCodeAt(++state.position);
        } else {
            return throwError(state, "unexpected end of the stream within a verbatim tag");
        }
    } else {
        while(ch !== 0 && !isWsOrEol(ch)){
            if (ch === 33) {
                if (!isNamed) {
                    tagHandle = state.input.slice(position - 1, state.position + 1);
                    if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
                        return throwError(state, "named tag handle cannot contain such characters");
                    }
                    isNamed = true;
                    position = state.position + 1;
                } else {
                    return throwError(state, "tag suffix cannot contain exclamation marks");
                }
            }
            ch = state.input.charCodeAt(++state.position);
        }
        tagName = state.input.slice(position, state.position);
        if (PATTERN_FLOW_INDICATORS.test(tagName)) {
            return throwError(state, "tag suffix cannot contain flow indicator characters");
        }
    }
    if (tagName && !PATTERN_TAG_URI.test(tagName)) {
        return throwError(state, `tag name cannot contain such characters: ${tagName}`);
    }
    if (isVerbatim) {
        state.tag = tagName;
    } else if (typeof state.tagMap !== "undefined" && _hasOwnProperty2.call(state.tagMap, tagHandle)) {
        state.tag = state.tagMap[tagHandle] + tagName;
    } else if (tagHandle === "!") {
        state.tag = `!${tagName}`;
    } else if (tagHandle === "!!") {
        state.tag = `tag:yaml.org,2002:${tagName}`;
    } else {
        return throwError(state, `undeclared tag handle "${tagHandle}"`);
    }
    return true;
}
function readAnchorProperty(state) {
    let ch = state.input.charCodeAt(state.position);
    if (ch !== 38) return false;
    if (state.anchor !== null) {
        return throwError(state, "duplication of an anchor property");
    }
    ch = state.input.charCodeAt(++state.position);
    const position = state.position;
    while(ch !== 0 && !isWsOrEol(ch) && !isFlowIndicator(ch)){
        ch = state.input.charCodeAt(++state.position);
    }
    if (state.position === position) {
        return throwError(state, "name of an anchor node must contain at least one character");
    }
    state.anchor = state.input.slice(position, state.position);
    return true;
}
function readAlias(state) {
    let ch = state.input.charCodeAt(state.position);
    if (ch !== 42) return false;
    ch = state.input.charCodeAt(++state.position);
    const _position = state.position;
    while(ch !== 0 && !isWsOrEol(ch) && !isFlowIndicator(ch)){
        ch = state.input.charCodeAt(++state.position);
    }
    if (state.position === _position) {
        return throwError(state, "name of an alias node must contain at least one character");
    }
    const alias = state.input.slice(_position, state.position);
    if (typeof state.anchorMap !== "undefined" && !Object.prototype.hasOwnProperty.call(state.anchorMap, alias)) {
        return throwError(state, `unidentified alias "${alias}"`);
    }
    if (typeof state.anchorMap !== "undefined") {
        state.result = state.anchorMap[alias];
    }
    skipSeparationSpace(state, true, -1);
    return true;
}
function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
    let allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, type, flowIndent, blockIndent;
    if (state.listener && state.listener !== null) {
        state.listener("open", state);
    }
    state.tag = null;
    state.anchor = null;
    state.kind = null;
    state.result = null;
    const allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
    if (allowToSeek) {
        if (skipSeparationSpace(state, true, -1)) {
            atNewLine = true;
            if (state.lineIndent > parentIndent) {
                indentStatus = 1;
            } else if (state.lineIndent === parentIndent) {
                indentStatus = 0;
            } else if (state.lineIndent < parentIndent) {
                indentStatus = -1;
            }
        }
    }
    if (indentStatus === 1) {
        while(readTagProperty(state) || readAnchorProperty(state)){
            if (skipSeparationSpace(state, true, -1)) {
                atNewLine = true;
                allowBlockCollections = allowBlockStyles;
                if (state.lineIndent > parentIndent) {
                    indentStatus = 1;
                } else if (state.lineIndent === parentIndent) {
                    indentStatus = 0;
                } else if (state.lineIndent < parentIndent) {
                    indentStatus = -1;
                }
            } else {
                allowBlockCollections = false;
            }
        }
    }
    if (allowBlockCollections) {
        allowBlockCollections = atNewLine || allowCompact;
    }
    if (indentStatus === 1 || 4 === nodeContext) {
        const cond = 1 === nodeContext || 2 === nodeContext;
        flowIndent = cond ? parentIndent : parentIndent + 1;
        blockIndent = state.position - state.lineStart;
        if (indentStatus === 1) {
            if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
                hasContent = true;
            } else {
                if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
                    hasContent = true;
                } else if (readAlias(state)) {
                    hasContent = true;
                    if (state.tag !== null || state.anchor !== null) {
                        return throwError(state, "alias node should not have Any properties");
                    }
                } else if (readPlainScalar(state, flowIndent, 1 === nodeContext)) {
                    hasContent = true;
                    if (state.tag === null) {
                        state.tag = "?";
                    }
                }
                if (state.anchor !== null && typeof state.anchorMap !== "undefined") {
                    state.anchorMap[state.anchor] = state.result;
                }
            }
        } else if (indentStatus === 0) {
            hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
        }
    }
    if (state.tag !== null && state.tag !== "!") {
        if (state.tag === "?") {
            for(let typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex++){
                type = state.implicitTypes[typeIndex];
                if (type.resolve(state.result)) {
                    state.result = type.construct(state.result);
                    state.tag = type.tag;
                    if (state.anchor !== null && typeof state.anchorMap !== "undefined") {
                        state.anchorMap[state.anchor] = state.result;
                    }
                    break;
                }
            }
        } else if (_hasOwnProperty2.call(state.typeMap[state.kind || "fallback"], state.tag)) {
            type = state.typeMap[state.kind || "fallback"][state.tag];
            if (state.result !== null && type.kind !== state.kind) {
                return throwError(state, `unacceptable node kind for !<${state.tag}> tag; it should be "${type.kind}", not "${state.kind}"`);
            }
            if (!type.resolve(state.result)) {
                return throwError(state, `cannot resolve a node with !<${state.tag}> explicit tag`);
            } else {
                state.result = type.construct(state.result);
                if (state.anchor !== null && typeof state.anchorMap !== "undefined") {
                    state.anchorMap[state.anchor] = state.result;
                }
            }
        } else {
            return throwError(state, `unknown tag !<${state.tag}>`);
        }
    }
    if (state.listener && state.listener !== null) {
        state.listener("close", state);
    }
    return state.tag !== null || state.anchor !== null || hasContent;
}
function readDocument(state) {
    const documentStart = state.position;
    let position, directiveName, directiveArgs, hasDirectives = false, ch;
    state.version = null;
    state.checkLineBreaks = state.legacy;
    state.tagMap = {
    };
    state.anchorMap = {
    };
    while((ch = state.input.charCodeAt(state.position)) !== 0){
        skipSeparationSpace(state, true, -1);
        ch = state.input.charCodeAt(state.position);
        if (state.lineIndent > 0 || ch !== 37) {
            break;
        }
        hasDirectives = true;
        ch = state.input.charCodeAt(++state.position);
        position = state.position;
        while(ch !== 0 && !isWsOrEol(ch)){
            ch = state.input.charCodeAt(++state.position);
        }
        directiveName = state.input.slice(position, state.position);
        directiveArgs = [];
        if (directiveName.length < 1) {
            return throwError(state, "directive name must not be less than one character in length");
        }
        while(ch !== 0){
            while(isWhiteSpace(ch)){
                ch = state.input.charCodeAt(++state.position);
            }
            if (ch === 35) {
                do {
                    ch = state.input.charCodeAt(++state.position);
                }while (ch !== 0 && !isEOL(ch))
                break;
            }
            if (isEOL(ch)) break;
            position = state.position;
            while(ch !== 0 && !isWsOrEol(ch)){
                ch = state.input.charCodeAt(++state.position);
            }
            directiveArgs.push(state.input.slice(position, state.position));
        }
        if (ch !== 0) readLineBreak(state);
        if (_hasOwnProperty2.call(directiveHandlers, directiveName)) {
            directiveHandlers[directiveName](state, directiveName, ...directiveArgs);
        } else {
            throwWarning(state, `unknown document directive "${directiveName}"`);
        }
    }
    skipSeparationSpace(state, true, -1);
    if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45) {
        state.position += 3;
        skipSeparationSpace(state, true, -1);
    } else if (hasDirectives) {
        return throwError(state, "directives end mark is expected");
    }
    composeNode(state, state.lineIndent - 1, 4, false, true);
    skipSeparationSpace(state, true, -1);
    if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
        throwWarning(state, "non-ASCII line breaks are interpreted as content");
    }
    state.documents.push(state.result);
    if (state.position === state.lineStart && testDocumentSeparator(state)) {
        if (state.input.charCodeAt(state.position) === 46) {
            state.position += 3;
            skipSeparationSpace(state, true, -1);
        }
        return;
    }
    if (state.position < state.length - 1) {
        return throwError(state, "end of the stream or a document separator is expected");
    } else {
        return;
    }
}
function loadDocuments(input, options) {
    input = String(input);
    options = options || {
    };
    if (input.length !== 0) {
        if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) {
            input += "\n";
        }
        if (input.charCodeAt(0) === 65279) {
            input = input.slice(1);
        }
    }
    const state = new LoaderState(input, options);
    state.input += "\0";
    while(state.input.charCodeAt(state.position) === 32){
        state.lineIndent += 1;
        state.position += 1;
    }
    while(state.position < state.length - 1){
        readDocument(state);
    }
    return state.documents;
}
function load(input, options) {
    const documents = loadDocuments(input, options);
    if (documents.length === 0) {
        return;
    }
    if (documents.length === 1) {
        return documents[0];
    }
    throw new YAMLError("expected a single document in the stream, but found more");
}
function parse8(content, options) {
    return load(content, options);
}
Object.prototype.hasOwnProperty;
const _toString2 = Object.prototype.toString;
const _hasOwnProperty3 = Object.prototype.hasOwnProperty;
const ESCAPE_SEQUENCES = {
};
ESCAPE_SEQUENCES[0] = "\\0";
ESCAPE_SEQUENCES[7] = "\\a";
ESCAPE_SEQUENCES[8] = "\\b";
ESCAPE_SEQUENCES[9] = "\\t";
ESCAPE_SEQUENCES[10] = "\\n";
ESCAPE_SEQUENCES[11] = "\\v";
ESCAPE_SEQUENCES[12] = "\\f";
ESCAPE_SEQUENCES[13] = "\\r";
ESCAPE_SEQUENCES[27] = "\\e";
ESCAPE_SEQUENCES[34] = '\\"';
ESCAPE_SEQUENCES[92] = "\\\\";
ESCAPE_SEQUENCES[133] = "\\N";
ESCAPE_SEQUENCES[160] = "\\_";
ESCAPE_SEQUENCES[8232] = "\\L";
ESCAPE_SEQUENCES[8233] = "\\P";
const DEPRECATED_BOOLEANS_SYNTAX = [
    "y",
    "Y",
    "yes",
    "Yes",
    "YES",
    "on",
    "On",
    "ON",
    "n",
    "N",
    "no",
    "No",
    "NO",
    "off",
    "Off",
    "OFF", 
];
function encodeHex(character) {
    const string = character.toString(16).toUpperCase();
    let handle;
    let length;
    if (character <= 255) {
        handle = "x";
        length = 2;
    } else if (character <= 65535) {
        handle = "u";
        length = 4;
    } else if (character <= 4294967295) {
        handle = "U";
        length = 8;
    } else {
        throw new YAMLError("code point within a string may not be greater than 0xFFFFFFFF");
    }
    return `\\${handle}${repeat("0", length - string.length)}${string}`;
}
function indentString(string, spaces) {
    const ind = repeat(" ", spaces), length = string.length;
    let position = 0, next = -1, result = "", line;
    while(position < length){
        next = string.indexOf("\n", position);
        if (next === -1) {
            line = string.slice(position);
            position = length;
        } else {
            line = string.slice(position, next + 1);
            position = next + 1;
        }
        if (line.length && line !== "\n") result += ind;
        result += line;
    }
    return result;
}
function generateNextLine(state, level) {
    return `\n${repeat(" ", state.indent * level)}`;
}
function testImplicitResolving(state, str) {
    let type;
    for(let index = 0, length = state.implicitTypes.length; index < length; index += 1){
        type = state.implicitTypes[index];
        if (type.resolve(str)) {
            return true;
        }
    }
    return false;
}
function isWhitespace(c) {
    return c === 32 || c === 9;
}
function isPrintable(c) {
    return 32 <= c && c <= 126 || 161 <= c && c <= 55295 && c !== 8232 && c !== 8233 || 57344 <= c && c <= 65533 && c !== 65279 || 65536 <= c && c <= 1114111;
}
function isPlainSafe(c) {
    return isPrintable(c) && c !== 65279 && c !== 44 && c !== 91 && c !== 93 && c !== 123 && c !== 125 && c !== 58 && c !== 35;
}
function isPlainSafeFirst(c) {
    return isPrintable(c) && c !== 65279 && !isWhitespace(c) && c !== 45 && c !== 63 && c !== 58 && c !== 44 && c !== 91 && c !== 93 && c !== 123 && c !== 125 && c !== 35 && c !== 38 && c !== 42 && c !== 33 && c !== 124 && c !== 62 && c !== 39 && c !== 34 && c !== 37 && c !== 64 && c !== 96;
}
function needIndentIndicator(string) {
    const leadingSpaceRe = /^\n* /;
    return leadingSpaceRe.test(string);
}
const STYLE_PLAIN = 1, STYLE_SINGLE = 2, STYLE_LITERAL = 3, STYLE_FOLDED = 4, STYLE_DOUBLE = 5;
function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType) {
    const shouldTrackWidth = lineWidth !== -1;
    let hasLineBreak = false, hasFoldableLine = false, previousLineBreak = -1, plain = isPlainSafeFirst(string.charCodeAt(0)) && !isWhitespace(string.charCodeAt(string.length - 1));
    let __char, i;
    if (singleLineOnly) {
        for(i = 0; i < string.length; i++){
            __char = string.charCodeAt(i);
            if (!isPrintable(__char)) {
                return 5;
            }
            plain = plain && isPlainSafe(__char);
        }
    } else {
        for(i = 0; i < string.length; i++){
            __char = string.charCodeAt(i);
            if (__char === 10) {
                hasLineBreak = true;
                if (shouldTrackWidth) {
                    hasFoldableLine = hasFoldableLine || i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
                    previousLineBreak = i;
                }
            } else if (!isPrintable(__char)) {
                return 5;
            }
            plain = plain && isPlainSafe(__char);
        }
        hasFoldableLine = hasFoldableLine || shouldTrackWidth && i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
    }
    if (!hasLineBreak && !hasFoldableLine) {
        return plain && !testAmbiguousType(string) ? 1 : 2;
    }
    if (indentPerLevel > 9 && needIndentIndicator(string)) {
        return 5;
    }
    return hasFoldableLine ? 4 : 3;
}
function foldLine(line, width) {
    if (line === "" || line[0] === " ") return line;
    const breakRe = / [^ ]/g;
    let match;
    let start = 0, end, curr = 0, next = 0;
    let result = "";
    while(match = breakRe.exec(line)){
        next = match.index;
        if (next - start > width) {
            end = curr > start ? curr : next;
            result += `\n${line.slice(start, end)}`;
            start = end + 1;
        }
        curr = next;
    }
    result += "\n";
    if (line.length - start > width && curr > start) {
        result += `${line.slice(start, curr)}\n${line.slice(curr + 1)}`;
    } else {
        result += line.slice(start);
    }
    return result.slice(1);
}
function dropEndingNewline(string) {
    return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
}
function foldString(string, width) {
    const lineRe = /(\n+)([^\n]*)/g;
    let result = (()=>{
        let nextLF = string.indexOf("\n");
        nextLF = nextLF !== -1 ? nextLF : string.length;
        lineRe.lastIndex = nextLF;
        return foldLine(string.slice(0, nextLF), width);
    })();
    let prevMoreIndented = string[0] === "\n" || string[0] === " ";
    let moreIndented;
    let match;
    while(match = lineRe.exec(string)){
        const prefix = match[1], line = match[2];
        moreIndented = line[0] === " ";
        result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
        prevMoreIndented = moreIndented;
    }
    return result;
}
function escapeString(string) {
    let result = "";
    let __char, nextChar;
    let escapeSeq;
    for(let i = 0; i < string.length; i++){
        __char = string.charCodeAt(i);
        if (__char >= 55296 && __char <= 56319) {
            nextChar = string.charCodeAt(i + 1);
            if (nextChar >= 56320 && nextChar <= 57343) {
                result += encodeHex((__char - 55296) * 1024 + nextChar - 56320 + 65536);
                i++;
                continue;
            }
        }
        escapeSeq = ESCAPE_SEQUENCES[__char];
        result += !escapeSeq && isPrintable(__char) ? string[i] : escapeSeq || encodeHex(__char);
    }
    return result;
}
function blockHeader(string, indentPerLevel) {
    const indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : "";
    const clip = string[string.length - 1] === "\n";
    const keep = clip && (string[string.length - 2] === "\n" || string === "\n");
    const chomp = keep ? "+" : clip ? "" : "-";
    return `${indentIndicator}${chomp}\n`;
}
function writeScalar(state, string, level, iskey) {
    state.dump = (()=>{
        if (string.length === 0) {
            return "''";
        }
        if (!state.noCompatMode && DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1) {
            return `'${string}'`;
        }
        const indent = state.indent * Math.max(1, level);
        const lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
        const singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
        function testAmbiguity(str) {
            return testImplicitResolving(state, str);
        }
        switch(chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth, testAmbiguity)){
            case STYLE_PLAIN:
                return string;
            case STYLE_SINGLE:
                return `'${string.replace(/'/g, "''")}'`;
            case STYLE_LITERAL:
                return `|${blockHeader(string, state.indent)}${dropEndingNewline(indentString(string, indent))}`;
            case STYLE_FOLDED:
                return `>${blockHeader(string, state.indent)}${dropEndingNewline(indentString(foldString(string, lineWidth), indent))}`;
            case STYLE_DOUBLE:
                return `"${escapeString(string)}"`;
            default:
                throw new YAMLError("impossible error: invalid scalar style");
        }
    })();
}
function writeFlowSequence(state, level, object) {
    let _result = "";
    const _tag = state.tag;
    for(let index = 0, length = object.length; index < length; index += 1){
        if (writeNode(state, level, object[index], false, false)) {
            if (index !== 0) _result += `,${!state.condenseFlow ? " " : ""}`;
            _result += state.dump;
        }
    }
    state.tag = _tag;
    state.dump = `[${_result}]`;
}
function writeBlockSequence(state, level, object, compact = false) {
    let _result = "";
    const _tag = state.tag;
    for(let index = 0, length = object.length; index < length; index += 1){
        if (writeNode(state, level + 1, object[index], true, true)) {
            if (!compact || index !== 0) {
                _result += generateNextLine(state, level);
            }
            if (state.dump && 10 === state.dump.charCodeAt(0)) {
                _result += "-";
            } else {
                _result += "- ";
            }
            _result += state.dump;
        }
    }
    state.tag = _tag;
    state.dump = _result || "[]";
}
function writeFlowMapping(state, level, object) {
    let _result = "";
    const _tag = state.tag, objectKeyList = Object.keys(object);
    let pairBuffer, objectKey, objectValue;
    for(let index = 0, length = objectKeyList.length; index < length; index += 1){
        pairBuffer = state.condenseFlow ? '"' : "";
        if (index !== 0) pairBuffer += ", ";
        objectKey = objectKeyList[index];
        objectValue = object[objectKey];
        if (!writeNode(state, level, objectKey, false, false)) {
            continue;
        }
        if (state.dump.length > 1024) pairBuffer += "? ";
        pairBuffer += `${state.dump}${state.condenseFlow ? '"' : ""}:${state.condenseFlow ? "" : " "}`;
        if (!writeNode(state, level, objectValue, false, false)) {
            continue;
        }
        pairBuffer += state.dump;
        _result += pairBuffer;
    }
    state.tag = _tag;
    state.dump = `{${_result}}`;
}
function writeBlockMapping(state, level, object, compact = false) {
    const _tag = state.tag, objectKeyList = Object.keys(object);
    let _result = "";
    if (state.sortKeys === true) {
        objectKeyList.sort();
    } else if (typeof state.sortKeys === "function") {
        objectKeyList.sort(state.sortKeys);
    } else if (state.sortKeys) {
        throw new YAMLError("sortKeys must be a boolean or a function");
    }
    let pairBuffer = "", objectKey, objectValue, explicitPair;
    for(let index = 0, length = objectKeyList.length; index < length; index += 1){
        pairBuffer = "";
        if (!compact || index !== 0) {
            pairBuffer += generateNextLine(state, level);
        }
        objectKey = objectKeyList[index];
        objectValue = object[objectKey];
        if (!writeNode(state, level + 1, objectKey, true, true, true)) {
            continue;
        }
        explicitPair = state.tag !== null && state.tag !== "?" || state.dump && state.dump.length > 1024;
        if (explicitPair) {
            if (state.dump && 10 === state.dump.charCodeAt(0)) {
                pairBuffer += "?";
            } else {
                pairBuffer += "? ";
            }
        }
        pairBuffer += state.dump;
        if (explicitPair) {
            pairBuffer += generateNextLine(state, level);
        }
        if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
            continue;
        }
        if (state.dump && 10 === state.dump.charCodeAt(0)) {
            pairBuffer += ":";
        } else {
            pairBuffer += ": ";
        }
        pairBuffer += state.dump;
        _result += pairBuffer;
    }
    state.tag = _tag;
    state.dump = _result || "{}";
}
function detectType(state, object, explicit = false) {
    const typeList = explicit ? state.explicitTypes : state.implicitTypes;
    let type;
    let style;
    let _result;
    for(let index = 0, length = typeList.length; index < length; index += 1){
        type = typeList[index];
        if ((type.instanceOf || type.predicate) && (!type.instanceOf || typeof object === "object" && object instanceof type.instanceOf) && (!type.predicate || type.predicate(object))) {
            state.tag = explicit ? type.tag : "?";
            if (type.represent) {
                style = state.styleMap[type.tag] || type.defaultStyle;
                if (_toString2.call(type.represent) === "[object Function]") {
                    _result = type.represent(object, style);
                } else if (_hasOwnProperty3.call(type.represent, style)) {
                    _result = type.represent[style](object, style);
                } else {
                    throw new YAMLError(`!<${type.tag}> tag resolver accepts not "${style}" style`);
                }
                state.dump = _result;
            }
            return true;
        }
    }
    return false;
}
function writeNode(state, level, object, block, compact, iskey = false) {
    state.tag = null;
    state.dump = object;
    if (!detectType(state, object, false)) {
        detectType(state, object, true);
    }
    const type = _toString2.call(state.dump);
    if (block) {
        block = state.flowLevel < 0 || state.flowLevel > level;
    }
    const objectOrArray = type === "[object Object]" || type === "[object Array]";
    let duplicateIndex = -1;
    let duplicate = false;
    if (objectOrArray) {
        duplicateIndex = state.duplicates.indexOf(object);
        duplicate = duplicateIndex !== -1;
    }
    if (state.tag !== null && state.tag !== "?" || duplicate || state.indent !== 2 && level > 0) {
        compact = false;
    }
    if (duplicate && state.usedDuplicates[duplicateIndex]) {
        state.dump = `*ref_${duplicateIndex}`;
    } else {
        if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
            state.usedDuplicates[duplicateIndex] = true;
        }
        if (type === "[object Object]") {
            if (block && Object.keys(state.dump).length !== 0) {
                writeBlockMapping(state, level, state.dump, compact);
                if (duplicate) {
                    state.dump = `&ref_${duplicateIndex}${state.dump}`;
                }
            } else {
                writeFlowMapping(state, level, state.dump);
                if (duplicate) {
                    state.dump = `&ref_${duplicateIndex} ${state.dump}`;
                }
            }
        } else if (type === "[object Array]") {
            const arrayLevel = state.noArrayIndent && level > 0 ? level - 1 : level;
            if (block && state.dump.length !== 0) {
                writeBlockSequence(state, arrayLevel, state.dump, compact);
                if (duplicate) {
                    state.dump = `&ref_${duplicateIndex}${state.dump}`;
                }
            } else {
                writeFlowSequence(state, arrayLevel, state.dump);
                if (duplicate) {
                    state.dump = `&ref_${duplicateIndex} ${state.dump}`;
                }
            }
        } else if (type === "[object String]") {
            if (state.tag !== "?") {
                writeScalar(state, state.dump, level, iskey);
            }
        } else {
            if (state.skipInvalid) return false;
            throw new YAMLError(`unacceptable kind of an object to dump ${type}`);
        }
        if (state.tag !== null && state.tag !== "?") {
            state.dump = `!<${state.tag}> ${state.dump}`;
        }
    }
    return true;
}
const cache1 = {
};
function isHexColor(color) {
    return /^([0-9A-F]{6}|[0-9A-F]{3})$/i.test(color);
}
function hexColorDelta(hex1, hex2) {
    const r1 = parseInt(hex1.substring(0, 2), 16);
    const g1 = parseInt(hex1.substring(2, 4), 16);
    const b1 = parseInt(hex1.substring(4, 6), 16);
    const r2 = parseInt(hex2.substring(0, 2), 16);
    const g2 = parseInt(hex2.substring(2, 4), 16);
    const b2 = parseInt(hex2.substring(4, 6), 16);
    let r = 255 - Math.abs(r1 - r2);
    let g = 255 - Math.abs(g1 - g2);
    let b = 255 - Math.abs(b1 - b2);
    r /= 255;
    g /= 255;
    b /= 255;
    return (r + g + b) / 3;
}
function hexterm(hex) {
    if (typeof hex !== 'string') {
        throw new Error('hex value has to be a string');
    }
    hex = hex.trim();
    if (hex.startsWith('#')) {
        hex = hex.slice(1);
    }
    if (!isHexColor(hex)) {
        throw new Error('wrong hexadecimal color code');
    }
    if (hex.length === 3) {
        hex = '' + hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    hex = hex.toLowerCase();
    const direct = xtermcolors.findIndex((color)=>color === hex
    );
    if (direct !== -1) return direct;
    const cached = cache1[hex];
    if (cached) return cached;
    let similar = 0;
    const closest = {
    };
    xtermcolors.forEach((hexcode, i)=>{
        const res = hexColorDelta(hex, hexcode);
        if (res > similar) {
            similar = res;
            closest.hex = hexcode;
            closest.x = i;
        }
    });
    cache1[closest.hex] = closest.x;
    return closest.x;
}
const xtermcolors = [
    '000000',
    '800000',
    '008000',
    '808000',
    '000080',
    '800080',
    '008080',
    'c0c0c0',
    '808080',
    'ff0000',
    '00ff00',
    'ffff00',
    '0000ff',
    'ff00ff',
    '00ffff',
    'ffffff',
    '000000',
    '00005f',
    '000087',
    '0000af',
    '0000d7',
    '0000ff',
    '005f00',
    '005f5f',
    '005f87',
    '005faf',
    '005fd7',
    '005fff',
    '008700',
    '00875f',
    '008787',
    '0087af',
    '0087d7',
    '0087ff',
    '00af00',
    '00af5f',
    '00af87',
    '00afaf',
    '00afd7',
    '00afff',
    '00d700',
    '00d75f',
    '00d787',
    '00d7af',
    '00d7d7',
    '00d7ff',
    '00ff00',
    '00ff5f',
    '00ff87',
    '00ffaf',
    '00ffd7',
    '00ffff',
    '5f0000',
    '5f005f',
    '5f0087',
    '5f00af',
    '5f00d7',
    '5f00ff',
    '5f5f00',
    '5f5f5f',
    '5f5f87',
    '5f5faf',
    '5f5fd7',
    '5f5fff',
    '5f8700',
    '5f875f',
    '5f8787',
    '5f87af',
    '5f87d7',
    '5f87ff',
    '5faf00',
    '5faf5f',
    '5faf87',
    '5fafaf',
    '5fafd7',
    '5fafff',
    '5fd700',
    '5fd75f',
    '5fd787',
    '5fd7af',
    '5fd7d7',
    '5fd7ff',
    '5fff00',
    '5fff5f',
    '5fff87',
    '5fffaf',
    '5fffd7',
    '5fffff',
    '870000',
    '87005f',
    '870087',
    '8700af',
    '8700d7',
    '8700ff',
    '875f00',
    '875f5f',
    '875f87',
    '875faf',
    '875fd7',
    '875fff',
    '878700',
    '87875f',
    '878787',
    '8787af',
    '8787d7',
    '8787ff',
    '87af00',
    '87af5f',
    '87af87',
    '87afaf',
    '87afd7',
    '87afff',
    '87d700',
    '87d75f',
    '87d787',
    '87d7af',
    '87d7d7',
    '87d7ff',
    '87ff00',
    '87ff5f',
    '87ff87',
    '87ffaf',
    '87ffd7',
    '87ffff',
    'af0000',
    'af005f',
    'af0087',
    'af00af',
    'af00d7',
    'af00ff',
    'af5f00',
    'af5f5f',
    'af5f87',
    'af5faf',
    'af5fd7',
    'af5fff',
    'af8700',
    'af875f',
    'af8787',
    'af87af',
    'af87d7',
    'af87ff',
    'afaf00',
    'afaf5f',
    'afaf87',
    'afafaf',
    'afafd7',
    'afafff',
    'afd700',
    'afd75f',
    'afd787',
    'afd7af',
    'afd7d7',
    'afd7ff',
    'afff00',
    'afff5f',
    'afff87',
    'afffaf',
    'afffd7',
    'afffff',
    'd70000',
    'd7005f',
    'd70087',
    'd700af',
    'd700d7',
    'd700ff',
    'd75f00',
    'd75f5f',
    'd75f87',
    'd75faf',
    'd75fd7',
    'd75fff',
    'd78700',
    'd7875f',
    'd78787',
    'd787af',
    'd787d7',
    'd787ff',
    'd7af00',
    'd7af5f',
    'd7af87',
    'd7afaf',
    'd7afd7',
    'd7afff',
    'd7d700',
    'd7d75f',
    'd7d787',
    'd7d7af',
    'd7d7d7',
    'd7d7ff',
    'd7ff00',
    'd7ff5f',
    'd7ff87',
    'd7ffaf',
    'd7ffd7',
    'd7ffff',
    'ff0000',
    'ff005f',
    'ff0087',
    'ff00af',
    'ff00d7',
    'ff00ff',
    'ff5f00',
    'ff5f5f',
    'ff5f87',
    'ff5faf',
    'ff5fd7',
    'ff5fff',
    'ff8700',
    'ff875f',
    'ff8787',
    'ff87af',
    'ff87d7',
    'ff87ff',
    'ffaf00',
    'ffaf5f',
    'ffaf87',
    'ffafaf',
    'ffafd7',
    'ffafff',
    'ffd700',
    'ffd75f',
    'ffd787',
    'ffd7af',
    'ffd7d7',
    'ffd7ff',
    'ffff00',
    'ffff5f',
    'ffff87',
    'ffffaf',
    'ffffd7',
    'ffffff',
    '080808',
    '121212',
    '1c1c1c',
    '262626',
    '303030',
    '3a3a3a',
    '444444',
    '4e4e4e',
    '585858',
    '606060',
    '666666',
    '767676',
    '808080',
    '8a8a8a',
    '949494',
    '9e9e9e',
    'a8a8a8',
    'b2b2b2',
    'bcbcbc',
    'c6c6c6',
    'd0d0d0',
    'dadada',
    'e4e4e4',
    'eeeeee'
];
function crash(message, data) {
    console.log(red("Error: " + message));
    if (data) console.log(red(dataToText(data)));
    Deno.exit(1);
}
function dataToText(data) {
    return Object.keys(data).map((key)=>`- ${key}: ${data[key]}`
    ).join("\n");
}
const __default1 = {
    "mustaches": {
        "lightline.ejs": "<% const info = it.info; %>\n\"\"\n\" Lightline_theme: <%= info.name %>\n\n<% if(info.description){ %>\" Description: <%= info.description %>\n<% } %>\n\n<% if(info.url){ %>\" URL: <%= info.url %>\n<% } %>\n\n<% if(info.author){ %>\" Author: <%= info.author %>\n<% } %>\n\n<% if(info.license){ %>\" License: <%= info.license %>\n<% } %>\n\n\"\"\n\nlet s:p = {\"normal\": {}, \"inactive\": {}, \"insert\": {}, \"replace\": {}, \"visual\": {}, \"tabline\": {} }\n\nlet s:p.normal.left = [[[\"<%= it.normal1.fg.hex %>\", <%= it.normal1.fg.xterm %>], [\"<%= it.normal1.bg.hex %>\", <%= it.normal1.bg.xterm %>]], [[\"<%= it.normal2.fg.hex %>\", <%= it.normal2.fg.xterm %>], [\"<%= it.normal2.bg.hex %>\", <%= it.normal2.bg.xterm %>]]]\nlet s:p.normal.middle = [[[\"<%= it.normal3.fg.hex %>\", <%= it.normal3.fg.xterm %>], [\"<%= it.normal3.bg.hex %>\", <%= it.normal3.bg.xterm %>]]]\nlet s:p.normal.right = [[[\"<%= it.normal4.fg.hex %>\", <%= it.normal4.fg.xterm %>], [\"<%= it.normal4.bg.hex %>\", <%= it.normal4.bg.xterm %>]], [[\"<%= it.normal5.fg.hex %>\", <%= it.normal5.fg.xterm %>], [\"<%= it.normal5.bg.hex %>\", <%= it.normal5.bg.xterm %>]]]\nlet s:p.normal.error = [[[\"<%= it.normalError.fg.hex %>\", <%= it.normalError.fg.xterm %>], [\"<%= it.normalError.bg.hex %>\", <%= it.normalError.bg.xterm %>]]]\nlet s:p.normal.warning = [[[\"<%= it.normalWarning.fg.hex %>\", <%= it.normalWarning.fg.xterm %>], [\"<%= it.normalWarning.bg.hex %>\", <%= it.normalWarning.bg.xterm %>]]]\n\nlet s:p.inactive.left = [[[\"<%= it.inactive1.fg.hex %>\", <%= it.inactive1.fg.xterm %>], [\"<%= it.inactive1.bg.hex %>\", <%= it.inactive1.bg.xterm %>]], [[\"<%= it.inactive2.fg.hex %>\", <%= it.inactive2.fg.xterm %>], [\"<%= it.inactive2.bg.hex %>\", <%= it.inactive2.bg.xterm %>]]]\nlet s:p.inactive.middle = [[[\"<%= it.inactive3.fg.hex %>\", <%= it.inactive3.fg.xterm %>], [\"<%= it.inactive3.bg.hex %>\", <%= it.inactive3.bg.xterm %>]]]\nlet s:p.inactive.right = [[[\"<%= it.inactive4.fg.hex %>\", <%= it.inactive4.fg.xterm %>], [\"<%= it.inactive4.bg.hex %>\", <%= it.inactive4.bg.xterm %>]], [[\"<%= it.inactive5.fg.hex %>\", <%= it.inactive5.fg.xterm %>], [\"<%= it.inactive5.bg.hex %>\", <%= it.inactive5.bg.xterm %>]]]\n\nlet s:p.insert.left = [[[\"<%= it.insert1.fg.hex %>\", <%= it.insert1.fg.xterm %>], [\"<%= it.insert1.bg.hex %>\", <%= it.insert1.bg.xterm %>]], [[\"<%= it.insert2.fg.hex %>\", <%= it.insert2.fg.xterm %>], [\"<%= it.insert2.bg.hex %>\", <%= it.insert2.bg.xterm %>]]]\nlet s:p.insert.middle = [[[\"<%= it.insert3.fg.hex %>\", <%= it.insert3.fg.xterm %>], [\"<%= it.insert3.bg.hex %>\", <%= it.insert3.bg.xterm %>]]]\nlet s:p.insert.right = [[[\"<%= it.insert4.fg.hex %>\", <%= it.insert4.fg.xterm %>], [\"<%= it.insert4.bg.hex %>\", <%= it.insert4.bg.xterm %>]], [[\"<%= it.insert5.fg.hex %>\", <%= it.insert5.fg.xterm %>], [\"<%= it.insert5.bg.hex %>\", <%= it.insert5.bg.xterm %>]]]\n\nlet s:p.replace.left = [[[\"<%= it.replace1.fg.hex %>\", <%= it.replace1.fg.xterm %>], [\"<%= it.replace1.bg.hex %>\", <%= it.replace1.bg.xterm %>]], [[\"<%= it.replace2.fg.hex %>\", <%= it.replace2.fg.xterm %>], [\"<%= it.replace2.bg.hex %>\", <%= it.replace2.bg.xterm %>]]]\nlet s:p.replace.middle = [[[\"<%= it.replace3.fg.hex %>\", <%= it.replace3.fg.xterm %>], [\"<%= it.replace3.bg.hex %>\", <%= it.replace3.bg.xterm %>]]]\nlet s:p.replace.right = [[[\"<%= it.replace4.fg.hex %>\", <%= it.replace4.fg.xterm %>], [\"<%= it.replace4.bg.hex %>\", <%= it.replace4.bg.xterm %>]], [[\"<%= it.replace5.fg.hex %>\", <%= it.replace5.fg.xterm %>], [\"<%= it.replace5.bg.hex %>\", <%= it.replace5.bg.xterm %>]]]\n\nlet s:p.visual.left = [[[\"<%= it.visual1.fg.hex %>\", <%= it.visual1.fg.xterm %>], [\"<%= it.visual1.bg.hex %>\", <%= it.visual1.bg.xterm %>]], [[\"<%= it.visual2.fg.hex %>\", <%= it.visual2.fg.xterm %>], [\"<%= it.visual2.bg.hex %>\", <%= it.visual2.bg.xterm %>]]]\nlet s:p.visual.middle = [[[\"<%= it.visual3.fg.hex %>\", <%= it.visual3.fg.xterm %>], [\"<%= it.visual3.bg.hex %>\", <%= it.visual3.bg.xterm %>]]]\nlet s:p.visual.right = [[[\"<%= it.visual4.fg.hex %>\", <%= it.visual4.fg.xterm %>], [\"<%= it.visual4.bg.hex %>\", <%= it.visual4.bg.xterm %>]], [[\"<%= it.visual5.fg.hex %>\", <%= it.visual5.fg.xterm %>], [\"<%= it.visual5.bg.hex %>\", <%= it.visual5.bg.xterm %>]]]\n\nlet s:p.tabline.left = [[[\"<%= it.tablineLeft.fg.hex %>\", <%= it.tablineLeft.fg.xterm %>], [\"<%= it.tablineLeft.bg.hex %>\", <%= it.tablineLeft.bg.xterm %>]]]\nlet s:p.tabline.tabsel = [[[\"<%= it.tablineSelected.fg.hex %>\", <%= it.tablineSelected.fg.xterm %>], [\"<%= it.tablineSelected.bg.hex %>\", <%= it.tablineSelected.bg.xterm %>]]]\nlet s:p.tabline.middle = [[[\"<%= it.tablineMiddle.fg.hex %>\", <%= it.tablineMiddle.fg.xterm %>], [\"<%= it.tablineMiddle.bg.hex %>\", <%= it.tablineMiddle.bg.xterm %>]]]\nlet s:p.tabline.right = [[[\"<%= it.tablineRight.fg.hex %>\", <%= it.tablineRight.fg.xterm %>], [\"<%= it.tablineRight.bg.hex %>\", <%= it.tablineRight.bg.xterm %>]]]\n\nlet g:lightline#colorscheme#<%= info.name %>#palette = lightline#colorscheme#flatten(s:p)\n",
        "project.ejs": "name: '<%= it.name %>'\nversion: '<%= it.version %>'\nlicense: '<%= it.license %>'\nauthor: '<%= it.author %>'\nurl: '<%= it.url %>'\ndescription: '<%= it.description %>'\ncolorschemes:\n- name: '<%= it.name %>'\n  background: 'dark'\n  palette: '<%= it.name %>'\n",
        "colorscheme.ejs": "<% const info = it.info; %>\n\"\"\n\" Colorscheme: <% info.name %>\n<% if(it.info.description) { %>\" Description: <%= it.info.description %>\n<% } %>\n<% if(it.info.url){ %>\" URL: <%= it.info.url %>\n<% } %>\n<% if(it.info.author){ %>\" Author: <%= it.info.author %>\n<% } %>\n<% if(it.info.license){%>\" License: <%= it.info.license %>\n<% } %>\n\"\"\n\nset background=<%= it.info.background %>\nhi clear\nif exists(\"syntax_on\")\n  syntax reset\nendif\nlet g:colors_name=\"<%= it.info.name %>\"\n\n\nlet Italic = \"\"\nif exists('g:<%= it.info.name %>_italic')\n  let Italic = \"italic\"\nendif\nlet g:<%= it.info.name %>_italic = get(g:, '<%= it.info.name %>_italic', 0)\n\nlet Bold = \"\"\nif exists('g:<%= info.name %>_bold')\n  let Bold = \"bold\"\nendif\n\nlet g:<%= it.info.name %>_bold = get(g:, '<%info.name%>_bold', 0)\n\n<% Object.keys(it.stacks).forEach(function (key) {%>\n  <% const { link, fore, back, ui, guisp } = it.stacks[key]; %>\n  <% if(link){ %>hi link <%= key %> <%= link%>\n  <%- } else { -%>hi <%= key %>\n    <%- if(fore){ %> guifg=<%fore.hex%> ctermfg=<%= fore.xterm%><% } %>\n    <%- if(back){ %> guibg=<%back.hex%> ctermbg=<%= back.xterm%><% } %>\n    <%- if(ui){ %> gui=<%= ui %> cterm=<%= ui %> <% } %>\n    <%- if(guisp){ %> guisp=<%= guisp%><% } %>\n  <% } %>\n<% }) %>\n\n<% if(it.term.color_0){ %>\nif has('terminal')\n  let g:terminal_ansi_colors = [\n  \\ \"<%= it.term.color_0 %>\",\n  \\ \"<%= it.term.color_1 %>\",\n  \\ \"<%= it.term.color_2 %>\",\n  \\ \"<%= it.term.color_3 %>\",\n  \\ \"<%= it.term.color_4 %>\",\n  \\ \"<%= it.term.color_5 %>\",\n  \\ \"<%= it.term.color_6 %>\",\n  \\ \"<%= it.term.color_7 %>\",\n  \\ \"<%= it.term.color_8 %>\",\n  \\ \"<%= it.term.color_9 %>\",\n  \\ \"<%= it.term.color_10 %>\",\n  \\ \"<%= it.term.color_11 %>\",\n  \\ \"<%= it.term.color_12 %>\",\n  \\ \"<%= it.term.color_13 %>\",\n  \\ \"<%= it.term.color_14 %>\",\n  \\ \"<%= it.term.color_15 %>\"\n  \\ ]\nendif\n\nif has('nvim')\n<% Object.keys(it.term).forEach(function (key) { %>\n  let g:terminal_<%= key %> = \"<%= it.term[key] %>\"\n<% }) %>\nendif\n<% } %>\n",
        "airline.ejs": "<% const info = it.info; %>\n\"\"\n\" Airline_theme: <%= info.name %>\n\n<% if(info.description){ %>\" Description: <%= info.description %>\n<% } %>\n\n<% if(info.url){%>\" URL: <%= info.url %>\n<% } %>\n\n<% if(info.author){%>\" Author: <%= info.author %>\n<% } %>\n\n<% if(info.license){%>\" License: <%= info.license %>\n<% } %>\n\n\"\"\n\nlet g:airline#themes#<%= info.name %>#palette = {}\n\nlet s:normal1 = [ \"<%= it.normal1.fg.hex %>\", \"<%= it.normal1.bg.hex %>\", <%= it.normal1.fg.xterm %>, <%= it.normal1.bg.xterm %> ]\nlet s:normal2 = [ \"<%= it.normal2.fg.hex %>\", \"<%= it.normal2.bg.hex %>\", <%= it.normal2.fg.xterm %>, <%= it.normal2.bg.xterm %> ]\nlet s:normal3 = [ \"<%= it.normal3.fg.hex %>\", \"<%= it.normal3.bg.hex %>\", <%= it.normal3.fg.xterm %>, <%= it.normal3.bg.xterm %> ]\nlet g:airline#themes#<%= it.info.name %>#palette.normal = airline#themes#generate_color_map(s:normal1, s:normal2, s:normal3)\n\nlet s:insert1 = [ \"<%= it.insert1.fg.hex %>\", \"<%= it.insert1.bg.hex %>\", <%= it.insert1.fg.xterm %>, <%= it.insert1.bg.xterm %> ]\nlet s:insert2 = [ \"<%= it.insert2.fg.hex %>\", \"<%= it.insert2.bg.hex %>\", <%= it.insert2.fg.xterm %>, <%= it.insert2.bg.xterm %> ]\nlet s:insert3 = [ \"<%= it.insert3.fg.hex %>\", \"<%= it.insert3.bg.hex %>\", <%= it.insert3.fg.xterm %>, <%= it.insert3.bg.xterm %> ]\nlet g:airline#themes#<%= it.info.name %>#palette.insert = airline#themes#generate_color_map(s:insert1, s:insert2, s:insert3)\n\nlet s:replace1 = [ \"<%= it.replace1.fg.hex %>\", \"<%= it.replace1.bg.hex %>\", <%= it.replace1.fg.xterm %>, <%= it.replace1.bg.xterm %> ]\nlet s:replace2 = [ \"<%= it.replace2.fg.hex %>\", \"<%= it.replace2.bg.hex %>\", <%= it.replace2.fg.xterm %>, <%= it.replace2.bg.xterm %> ]\nlet s:replace3 = [ \"<%= it.replace3.fg.hex %>\", \"<%= it.replace3.bg.hex %>\", <%= it.replace3.fg.xterm %>, <%= it.replace3.bg.xterm %> ]\nlet g:airline#themes#<%= it.info.name %>#palette.replace = airline#themes#generate_color_map(s:replace1, s:replace2, s:replace3)\n\nlet s:visual1 = [ \"<%= it.visual1.fg.hex %>\", \"<%= it.visual1.bg.hex %>\", <%= it.visual1.fg.xterm %>, <%= it.visual1.bg.xterm %> ]\nlet s:visual2 = [ \"<%= it.visual2.fg.hex %>\", \"<%= it.visual2.bg.hex %>\", <%= it.visual2.fg.xterm %>, <%= it.visual2.bg.xterm %> ]\nlet s:visual3 = [ \"<%= it.visual3.fg.hex %>\", \"<%= it.visual3.bg.hex %>\", <%= it.visual3.fg.xterm %>, <%= it.visual3.bg.xterm %> ]\nlet g:airline#themes#<%= it.info.name %>#palette.visual = airline#themes#generate_color_map(s:visual1, s:visual2, s:visual3)\n\nlet s:inactive1 = [ \"<%= it.inactive1.fg.hex %>\", \"<%= it.inactive1.bg.hex %>\", <%= it.inactive1.fg.xterm %>, <%= it.inactive1.bg.xterm %> ]\nlet s:inactive2 = [ \"<%= it.inactive2.fg.hex %>\", \"<%= it.inactive2.bg.hex %>\", <%= it.inactive2.fg.xterm %>, <%= it.inactive2.bg.xterm %> ]\nlet s:inactive3 = [ \"<%= it.inactive3.fg.hex %>\", \"<%= it.inactive3.bg.hex %>\", <%= it.inactive3.fg.xterm %>, <%= it.inactive3.bg.xterm %> ]\nlet g:airline#themes#<%= it.info.name %>#palette.inactive = airline#themes#generate_color_map(s:inactive1, s:inactive2, s:inactive3)\n\n<% if(it.ctrlp1){ %>\nif !get(g:, 'loaded_ctrlp', 0)\n  finish\nendif\n\nlet s:CP1 = [ \"<%= it.ctrlp1.fg.hex %>\", \"<%= it.ctrlp1.bg.hex %>\", <%= it.ctrlp1.fg.xterm %>, <%= it.ctrlp1.bg.xterm %> ]\nlet s:CP2 = [ \"<%= it.ctrlp2.fg.hex %>\", \"<%= it.ctrlp2.bg.hex %>\", <%= it.ctrlp2.fg.xterm %>, <%= it.ctrlp2.bg.xterm %> ]\nlet s:CP3 = [ \"<%= it.ctrlp3.fg.hex %>\", \"<%= it.ctrlp3.bg.hex %>\", <%= it.ctrlp3.fg.xterm %>, <%= it.ctrlp3.bg.xterm %> ]\n\nlet g:airline#themes#<%= it.info.name %>#palette.ctrlp = airline#extensions#ctrlp#generate_color_map(s:CP1, s:CP2, s:CP3)\n<% } %>\n"
    },
    "syntax": {
        "json.yml": "jsonPadding: '' # Operator\njsonString: '' # String\njsonTest: '' # Label\njsonEscape: '' # Special\njsonNumber: '' # Number\njsonBraces: '' # Delimiter\njsonNull: '' # Function\njsonBoolean: '' # Boolean\njsonKeyword: '' # Label\njsonNumError: '' # Error\njsonCommentError: '' # Error\njsonSemicolonError: '' # Error\njsonTrailingCommaError: '' # Error\njsonMissingCommaError: '' # Error\njsonStringSQError: '' # Error\njsonNoQuotesError: '' # Error\njsonTripleQuotesError: '' # Error\njsonQuote: '' # Quote\njsonNoise: '' # Noise\n",
        "help.yml": "helpIgnore: '' # Ignore\nhelpHyperTextJump: '' # Identifier\nhelpBar: '' # Ignore\nhelpBacktick: '' # Ignore\nhelpStar: '' # Ignore\nhelpHyperTextEntry: '' # String\nhelpHeadline: '' # Statement\nhelpHeader: '' # PreProc\nhelpSectionDelim: '' # PreProc\nhelpVim: '' # Identifier\nhelpCommand: '' # Comment\nhelpExample: '' # Comment\nhelpOption: '' # Type\nhelpSpecial: '' # Special\nhelpNote: '' # Todo\nhelpComment: '' # Comment\nhelpConstant: '' # Constant\nhelpString: '' # String\nhelpCharacter: '' # Character\nhelpNumber: '' # Number\nhelpBoolean: '' # Boolean\nhelpFloat: '' # Float\nhelpIdentifier: '' # Identifier\nhelpFunction: '' # Function\nhelpStatement: '' # Statement\nhelpConditional: '' # Conditional\nhelpRepeat: '' # Repeat\nhelpLabel: '' # Label\nhelpOperator: '' # Operator\nhelpKeyword: '' # Keyword\nhelpException: '' # Exception\nhelpPreProc: '' # PreProc\nhelpInclude: '' # Include\nhelpDefine: '' # Define\nhelpMacro: '' # Macro\nhelpPreCondit: '' # PreCondit\nhelpType: '' # Type\nhelpStorageClass: '' # StorageClass\nhelpStructure: '' # Structure\nhelpTypedef: '' # Typedef\nhelpSpecialChar: '' # SpecialChar\nhelpTag: '' # Tag\nhelpDelimiter: '' # Delimiter\nhelpSpecialComment: '' # SpecialComment\nhelpDebug: '' # Debug\nhelpUnderlined: '' # Underlined\nhelpError: '' # Error\nhelpTodo: '' # Todo\nhelpURL: '' # String\n",
        "base.yml": "# BASE UI\nColorColumn: ''\nConceal: ''\nCursor: ''\nCursorIM: ''\nCursorColumn: ''\nCursorLine: ''\nCursorLineNr: ''\nDirectory: ''\nDiffAdd: ''\nDiffChange: ''\nDiffDelete: ''\nDiffText: ''\nErrorMsg: ''\nVertSplit: ''\nFolded: ''\nFoldColumn: ''\nSignColumn: ''\nIncSearch: ''\nLineNr: ''\nMatchParen: ''\nModeMsg: ''\nMoreMsg: ''\nNonText: ''\nNormal: ''\nPMenu: ''\nPMenuSel: ''\nPmenuSbar: ''\nPmenuThumb: ''\nQuestion: ''\nSearch: ''\nSpecialKey: ''\nSpellBad: ''\nSpellLocal: ''\nSpellCap: ''\nSpellRare: ''\nStatusLine: ''\nStatusLineNC: ''\nTabLine: ''\nTabLineFill: ''\nTabLineSel: ''\nTitle: ''\nVisual: ''\nVisualNOS: ''\nWarningMsg: ''\nWildMenu: ''\n# BASE SYNTAX\nComment: ''\nConstant: ''\nString: '' # Constant\nCharacter: '' # Constant\nBoolean: '' # Constant\nNumber: '' # Constant\nFloat: '' # Constant\nIdentifier: ''\nFunction: '' # Identifier\nStatement: ''\nConditional: '' # Statement\nRepeat: '' # Statement\nLabel: '' # Statement\nOperator: '' # Statement\nKeyword: '' # Statement\nException: '' # Statement\nPreProc: ''\nInclude: '' # PreProc\nDefine: '' # PreProc\nMacro: '' # PreProc\nPreCondit: '' # PreProc\nType: ''\nStorageClass: '' # Type\nStructure: '' # Type\nTypedef: '' # Type\nSpecial: ''\nSpecialChar: '' # Special\nTag: '' # Special\nDelimiter: '' # Special\nSpecialComment: '' # Special\nDebug: '' # Special\nUnderlined: ''\nIgnore: ''\nError: ''\nTodo: ''\n",
        "xml.yml": "xmlTodo: '' # Todo\nxmlTag: '' # Function\nxmlTagName: '' # Function\nxmlEndTag: '' # Identifier\nxmlNamespace: '' # Tag\nxmlEntity: '' # Statement\nxmlEntityPunct: '' # Type\nxmlAttribPunct: '' # Comment\nxmlAttrib: '' # Type\nxmlString: '' # String\nxmlComment: '' # Comment\nxmlCommentStart: '' # xmlComment\nxmlCommentPart: '' # Comment\nxmlCommentError: '' # Error\nxmlError: '' # Error\nxmlProcessingDelim: '' # Comment\nxmlProcessing: '' # Type\nxmlCdata: '' # String\nxmlCdataCdata: '' # Statement\nxmlCdataStart: '' # Type\nxmlCdataEnd: '' # Type\nxmlDocTypeDecl: '' # Function\nxmlDocTypeKeyword: '' # Statement\nxmlInlineDTD: '' # Function\n",
        "css.yml": "cssComment: '' # Comment\ncssVendor: '' # Comment\ncssHacks: '' # Comment\ncssTagName: '' # Statement\ncssDeprecated: '' # Error\ncssSelectorOp: '' # Special\ncssSelectorOp2: '' # Special\ncssAttrComma: '' # Special\ncssAnimationProp: '' # cssProp\ncssBackgroundProp: '' # cssProp\ncssBorderProp: '' # cssProp\ncssBoxProp: '' # cssProp\ncssColorProp: '' # cssProp\ncssContentForPagedMediaProp: '' # cssProp\ncssDimensionProp: '' # cssProp\ncssFlexibleBoxProp: '' # cssProp\ncssFontProp: '' # cssProp\ncssGeneratedContentProp: '' # cssProp\ncssGridProp: '' # cssProp\ncssHyerlinkProp: '' # cssProp\ncssLineboxProp: '' # cssProp\ncssListProp: '' # cssProp\ncssMarqueeProp: '' # cssProp\ncssMultiColumnProp: '' # cssProp\ncssPagedMediaProp: '' # cssProp\ncssPositioningProp: '' # cssProp\ncssPrintProp: '' # cssProp\ncssRubyProp: '' # cssProp\ncssSpeechProp: '' # cssProp\ncssTableProp: '' # cssProp\ncssTextProp: '' # cssProp\ncssTransformProp: '' # cssProp\ncssTransitionProp: '' # cssProp\ncssUIProp: '' # cssProp\ncssIEUIProp: '' # cssProp\ncssAuralProp: '' # cssProp\ncssRenderProp: '' # cssProp\ncssMobileTextProp: '' # cssProp\ncssAnimationAttr: '' # cssAttr\ncssBackgroundAttr: '' # cssAttr\ncssBorderAttr: '' # cssAttr\ncssBoxAttr: '' # cssAttr\ncssContentForPagedMediaAttr: '' # cssAttr\ncssDimensionAttr: '' # cssAttr\ncssFlexibleBoxAttr: '' # cssAttr\ncssFontAttr: '' # cssAttr\ncssGeneratedContentAttr: '' # cssAttr\ncssGridAttr: '' # cssAttr\ncssHyerlinkAttr: '' # cssAttr\ncssLineboxAttr: '' # cssAttr\ncssListAttr: '' # cssAttr\ncssMarginAttr: '' # cssAttr\ncssMarqueeAttr: '' # cssAttr\ncssMultiColumnAttr: '' # cssAttr\ncssPaddingAttr: '' # cssAttr\ncssPagedMediaAttr: '' # cssAttr\ncssPositioningAttr: '' # cssAttr\ncssGradientAttr: '' # cssAttr\ncssPrintAttr: '' # cssAttr\ncssRubyAttr: '' # cssAttr\ncssSpeechAttr: '' # cssAttr\ncssTableAttr: '' # cssAttr\ncssTextAttr: '' # cssAttr\ncssTransformAttr: '' # cssAttr\ncssTransitionAttr: '' # cssAttr\ncssUIAttr: '' # cssAttr\ncssIEUIAttr: '' # cssAttr\ncssAuralAttr: '' # cssAttr\ncssRenderAttr: '' # cssAttr\ncssCommonAttr: '' # cssAttr\ncssPseudoClassId: '' # PreProc\ncssPseudoClassLang: '' # Constant\ncssValueLength: '' # Number\ncssValueInteger: '' # Number\ncssValueNumber: '' # Number\ncssValueAngle: '' # Number\ncssValueTime: '' # Number\ncssValueFrequency: '' # Number\ncssFunction: '' # Constant\ncssURL: '' # String\ncssFunctionName: '' # Function\ncssFunctionComma: '' # Function\ncssColor: '' # Constant\ncssIdentifier: '' # Function\ncssInclude: '' # Include\ncssIncludeKeyword: '' # atKeyword\ncssImportant: '' # Special\ncssBraces: '' # Function\ncssBraceError: '' # Error\ncssError: '' # Error\ncssUnicodeEscape: '' # Special\ncssStringQQ: '' # String\ncssStringQ: '' # String\ncssAttributeSelector: '' # String\ncssMedia: '' # atKeyword\ncssMediaType: '' # Special\ncssMediaComma: '' # Normal\ncssMediaKeyword: '' # Statement\ncssMediaProp: '' # cssProp\ncssMediaAttr: '' # cssAttr\ncssPage: '' # atKeyword\ncssPagePseudo: '' # PreProc\ncssPageMargin: '' # atKeyword\ncssPageProp: '' # cssProp\ncssKeyFrame: '' # atKeyword\ncssKeyFrameSelector: '' # Constant\ncssFontDescriptor: '' # Special\ncssFontDescriptorFunction: '' # Constant\ncssFontDescriptorProp: '' # cssProp\ncssFontDescriptorAttr: '' # cssAttr\ncssUnicodeRange: '' # Constant\ncssClassName: '' # Function\ncssClassNameDot: '' # Function\ncssProp: '' # StorageClass\ncssAttr: '' # Constant\ncssUnitDecorators: '' # Number\ncssNoise: '' # Noise\natKeyword: '' # PreProc\n",
        "vim-stylus.yml": "stylusComment: '' # Comment\nstylusVariable: '' # Identifier\nstylusControl: '' # PreProc\nstylusFunction: '' # Function\nstylusInterpolation: '' # Delimiter\nstylusAmpersand: '' # Character\nstylusClass: '' # Type\nstylusClassChar: '' # Special\nstylusEscape: '' # Special\nstylusId: '' # Identifier\nstylusIdChar: '' # Special\n",
        "vim-mustache-handlebars.yml": "mustacheVariable: '' # Number\nmustacheVariableUnescape: '' # Number\nmustachePartial: '' # Number\nmustacheSection: '' # Number\nmustacheMarkerSet: '' # Number\nmustacheComment: '' # Comment\nmustacheBlockComment: '' # Comment\nmustacheError: '' # Error\nmustacheInsideError: '' # Error\nmustacheHandlebars: '' # Special\nmustacheUnescape: '' # Identifier\nmustacheOperators: '' # Operator\nmustacheConditionals: '' # Conditional\nmustacheHelpers: '' # Repeat\nmustacheQString: '' # String\nmustacheDQString: '' # String\n",
        "vim-signify.yml": "# mhinz/vim-signify\nSignifyLineAdd: ''\nSignifyLineDelete: ''\nSignifyLineDeleteFirstLine: ''\nSignifyLineChange: ''\nSignifyLineChangeDelete: ''\n\nSignifySignAdd: ''\nSignifySignDelete: ''\nSignifySignDeleteFirstLine: ''\nSignifySignChange: ''\nSignifySignChangeDelete: ''\n",
        "diff.yml": "diffOldFile: '' # diffFile\ndiffNewFile: '' # diffFile\ndiffFile: '' # Type\ndiffOnly: '' # Constant\ndiffIdentical: '' # Constant\ndiffDiffer: '' # Constant\ndiffBDiffer: '' # Constant\ndiffIsA: '' # Constant\ndiffNoEOL: '' # Constant\ndiffCommon: '' # Constant\ndiffRemoved: '' # Special\ndiffChanged: '' # PreProc\ndiffAdded: '' # Identifier\ndiffLine: '' # Statement\ndiffSubname: '' # PreProc\ndiffComment: '' # Comment\n",
        "vim-plug.yml": "plug1: '' # Title\nplug2: '' # Repeat\nplugH2: '' # Type\nplugX: '' # Exception\nplugBracket: '' # Structure\nplugNumber: '' # Number\nplugDash: '' # Special\nplugPlus: '' # Constant\nplugStar: '' # Boolean\nplugMessage: '' # Function\nplugName: '' # Label\nplugInstall: '' # Function\nplugUpdate: '' # Type\nplugError: '' # Error\nplugRelDate: '' # Comment\nplugEdge: '' # PreProc\nplugSha: '' # Identifier\nplugTag: '' # Constant\nplugNotLoaded: '' # Comment\n",
        "pug.yml": "pugPlainChar: '' # Special\npugScriptConditional: '' # PreProc\npugScriptLoopKeywords: '' # PreProc\npugScriptStatement: '' # PreProc\npugHtmlArg: '' # htmlArg\npugAttributeString: '' # String\npugAttributesDelimiter: '' # Identifier\npugIdChar: '' # Special\npugClassChar: '' # Special\npugBlockExpansionChar: '' # Special\npugPipeChar: '' # Special\npugTagBlockChar: '' # Special\npugId: '' # Identifier\npugClass: '' # Type\npugInterpolationDelimiter: '' # Delimiter\npugInlineDelimiter: '' # Delimiter\npugFilter: '' # PreProc\npugDocType: '' # PreProc\npugComment: '' # Comment\npugCommentBlock: '' # Comment\npugHtmlConditionalComment: '' # pugComment\n",
        "git.yml": "gitDateHeader: '' # gitIdentityHeader\ngitIdentityHeader: '' # gitIdentityKeyword\ngitIdentityKeyword: '' # Label\ngitNotesHeader: '' # gitKeyword\ngitReflogHeader: '' # gitKeyword\ngitKeyword: '' # Keyword\ngitIdentity: '' # String\ngitEmailDelimiter: '' # Delimiter\ngitEmail: '' # Special\ngitDate: '' # Number\ngitMode: '' # Number\ngitHashAbbrev: '' # gitHash\ngitHash: '' # Identifier\ngitReflogMiddle: '' # gitReference\ngitReference: '' # Function\ngitStage: '' # gitType\ngitType: '' # Type\ngitDiffAdded: '' # diffAdded\ngitDiffRemoved: '' # diffRemoved\n",
        "elixir.yml": "# Elixir\nelixirComment: '' # Comment\nelixirUnusedVariable: '' # Comment\nelixirAtom: '' # Constant\nelixirBoolean: '' # Constant\nelixirPseudoVariable: '' # Constant\nelixirNumber: '' # Constant\nelixirString: '' # Constant\nelixirRegex: '' # Constant\nelixirDocString: '' # Constant\nelixirAtomInterpolated: '' # Constant\nelixirSigil: '' # Constant\nelixirRegexDelimiter: '' # Delimiter\nelixirStringDelimiter: '' # Delimiter\nelixirInterpolationDelimiter: '' # Delimiter\nelixirSigilDelimiter: '' # Delimiter\nelixirSpecial: '' # Delimiter\nelixirRegexEscape: '' # Delimiter\nelixirRegexEscapePunctuation: '' # Delimiter\nelixirRegexQuantifier: '' # Delimiter\nelixirRegexCharClass: '' # Delimiter\nelixirSelf: '' # Identifier\nelixirVariable: '' # Identifier\nelixirFunctionDeclaration: '' # Identifier\nelixirBlockDefinition: '' # Statement\nelixirKeyword: '' # Statement\nelixirOperator: '' # Statement\nelixirInclude: '' # Preproc\nelixirDefine: '' # Preproc\nelixirPrivateDefine: '' # Preproc\nelixirModuleDefine: '' # Preproc\nelixirProtocolDefine: '' # Preproc\nelixirImplDefine: '' # Preproc\nelixirRecordDefine: '' # Preproc\nelixirPrivateRecordDefine: '' # Preproc\nelixirMacroDefine: '' # Preproc\nelixirMacroDeclaration: '' # Preproc\nelixirPrivateMacroDefine: '' # Preproc\nelixirDelegateDefine: '' # Preproc\nelixirOverridableDefine: '' # Preproc\nelixirExceptionDefine: '' # Preproc\nelixirCallbackDefine: '' # Preproc\nelixirStructDefine: '' # Preproc\nelixirAlias: '' # Type\nelixirTodo: '' # Todo\nelixirArguments: ''\nelixirGuard: ''\nelixirId: ''\nelixirInterpolation: ''\nelixirDocStringStar: ''\nelixirBlock: ''\nelixirAnonymousFunction: ''\nelixirDelimEscape: ''\nelixirModuleDeclaration: ''\nelixirProtocolDeclaration: ''\nelixirImplDeclaration: ''\nelixirRecordDeclaration: ''\nelixirDelegateDeclaration: ''\nelixirOverridableDeclaratio: ''\nelixirExceptionDeclaration: ''\nelixirCallbackDeclaration: ''\nelixirStructDeclaration: ''\n",
        "elm-vim.yml": "elmTopLevelDecl: '' # Function\nelmTupleFunction: '' # Normal\nelmTodo: '' # Todo\nelmComment: '' # Comment\nelmLineComment: '' # Comment\nelmString: '' # String\nelmTripleString: '' # String\nelmChar: '' # String\nelmStringEscape: '' # Special\nelmInt: '' # Number\nelmFloat: '' # Float\nelmDelimiter: '' # Comment\nelmTypedef: '' # Keyword\nelmImport: '' # Keyword\nelmConditional: '' # Keyword\nelmAlias: '' # Keyword\nelmOperator: '' # Operator\nelmType: '' # Type\nelmNumberType: '' # Type\nelmBraces: '' # Delimiter\n",
        "markdown.yml": "markdownH1: '' # htmlH1\nmarkdownH2: '' # htmlH2\nmarkdownH3: '' # htmlH3\nmarkdownH4: '' # htmlH4\nmarkdownH5: '' # htmlH5\nmarkdownH6: '' # htmlH6\nmarkdownHeadingRule: '' # markdownRule\nmarkdownHeadingDelimiter: '' # Delimiter\nmarkdownOrderedListMarker: '' # markdownListMarker\nmarkdownListMarker: '' # htmlTagName\nmarkdownBlockquote: '' # Comment\nmarkdownRule: '' # PreProc\nmarkdownLinkText: '' # htmlLink\nmarkdownIdDeclaration: '' # Typedef\nmarkdownId: '' # Type\nmarkdownAutomaticLink: '' # markdownUrl\nmarkdownUrl: '' # Float\nmarkdownUrlTitle: '' # String\nmarkdownIdDelimiter: '' # markdownLinkDelimiter\nmarkdownUrlDelimiter: '' # htmlTag\nmarkdownUrlTitleDelimiter: '' # Delimiter\nmarkdownItalic: '' # htmlItalic\nmarkdownBold: '' # htmlBold\nmarkdownBoldItalic: '' # htmlBoldItalic\nmarkdownCodeDelimiter: '' # Delimiter\nmarkdownEscape: '' # Special\nmarkdownError: '' # Error\n",
        "sh.yml": "shArithRegion: '' # shShellVariables\nshAtExpr: '' # shSetList\nshBeginHere: '' # shRedir\nshCaseBar: '' # shConditional\nshCaseCommandSub: '' # shCommandSub\nshCaseDoubleQuote: '' # shDoubleQuote\nshCaseIn: '' # shConditional\nshQuote: '' # shOperator\nshCaseSingleQuote: '' # shSingleQuote\nshCaseStart: '' # shConditional\nshCmdSubRegion: '' # shShellVariables\nshColon: '' # shComment\nshDerefOp: '' # shOperator\nshDerefPOL: '' # shDerefOp\nshDerefPPS: '' # shDerefOp\nshDeref: '' # shShellVariables\nshDerefDelim: '' # shOperator\nshDerefSimple: '' # shDeref\nshDerefSpecial: '' # shDeref\nshDerefString: '' # shDoubleQuote\nshDerefVar: '' # shDeref\nshDoubleQuote: '' # shString\nshEcho: '' # shString\nshEchoDelim: '' # shOperator\nshEchoQuote: '' # shString\nshForPP: '' # shLoop\nshEmbeddedEcho: '' # shString\nshEscape: '' # shCommandSub\nshExDoubleQuote: '' # shDoubleQuote\nshExSingleQuote: '' # shSingleQuote\nshFunction: '' # Function\nshHereDoc: '' # shString\nshHerePayload: '' # shHereDoc\nshLoop: '' # shStatement\nshMoreSpecial: '' # shSpecial\nshOption: '' # shCommandSub\nshPattern: '' # shString\nshParen: '' # shArithmetic\nshPosnParm: '' # shShellVariables\nshQuickComment: '' # shComment\nshRange: '' # shOperator\nshRedir: '' # shOperator\nshSetListDelim: '' # shOperator\nshSetOption: '' # shOption\nshSingleQuote: '' # shString\nshSource: '' # shOperator\nshStringSpecial: '' # shSpecial\nshSubShRegion: '' # shOperator\nshTestOpr: '' # shConditional\nshTestPattern: '' # shString\nshTestDoubleQuote: '' # shString\nshTestSingleQuote: '' # shString\nshVariable: '' # shSetList\nshWrapLineOperator: '' # shOperator\nbashAdminStatement: '' # shStatement if exists(\"b:is_bash\")\nbashSpecialVariables: '' # shShellVariables if exists(\"b:is_bash\")\nbashStatement: '' # shStatement if exists(\"b:is_bash\")\nshFunctionParen: '' # Delimiter if exists(\"b:is_bash\")\nshFunctionDelim: '' # Delimiter if exists(\"b:is_bash\")\nkshSpecialVariables: '' # shShellVariables if exists(\"b:is_kornshell\")\nkshStatement: '' # shStatement if exists(\"b:is_kornshell\")\nshCaseError: '' # Error if !exists(\"g:sh_no_error\")\nshCondError: '' # Error if !exists(\"g:sh_no_error\")\nshCurlyError: '' # Error if !exists(\"g:sh_no_error\")\nshDerefError: '' # Error if !exists(\"g:sh_no_error\")\nshDerefOpError: '' # Error if !exists(\"g:sh_no_error\")\nshDerefWordError: '' # Error if !exists(\"g:sh_no_error\")\nshDoError: '' # Error if !exists(\"g:sh_no_error\")\nshEsacError: '' # Error if !exists(\"g:sh_no_error\")\nshIfError: '' # Error if !exists(\"g:sh_no_error\")\nshInError: '' # Error if !exists(\"g:sh_no_error\")\nshParenError: '' # Error if !exists(\"g:sh_no_error\")\nshTestError: '' # Error if !exists(\"g:sh_no_error\")\nshDTestError: '' # Error if exists(\"b:is_kornshell\")\nshArithmetic: '' # Special\nshCharClass: '' # Identifier\nshSnglCase: '' # Statement\nshCommandSub: '' # Special\nshComment: '' # Comment\nshConditional: '' # Conditional\nshCtrlSeq: '' # Special\nshExprRegion: '' # Delimiter\nshFunctionKey: '' # Function\nshFunctionName: '' # Function\nshNumber: '' # Number\nshOperator: '' # Operator\nshRepeat: '' # Repeat\nshSet: '' # Statement\nshSetList: '' # Identifier\nshShellVariables: '' # PreProc\nshSpecial: '' # Special\nshStatement: '' # Statement\nshString: '' # String\nshTodo: '' # Todo\nshAlias: '' # Identifier\nshHereDoc01: '' # shRedir\nshHereDoc02: '' # shRedir\nshHereDoc03: '' # shRedir\nshHereDoc04: '' # shRedir\nshHereDoc05: '' # shRedir\nshHereDoc06: '' # shRedir\nshHereDoc07: '' # shRedir\nshHereDoc08: '' # shRedir\nshHereDoc09: '' # shRedir\nshHereDoc10: '' # shRedir\nshHereDoc11: '' # shRedir\nshHereDoc12: '' # shRedir\nshHereDoc13: '' # shRedir\nshHereDoc14: '' # shRedir\nshHereDoc15: '' # shRedir\nshHereDoc16: '' # shRedir\nshHereDoc17: '' # shRedir\nshHereDoc18: '' # shRedir\nshHereDoc19: '' # shRedir\nshHereDoc20: '' # shRedir\nshHereDoc21: '' # shRedir\nshHereDoc22: '' # shRedir\nshHereDoc23: '' # shRedir\nshHereDoc24: '' # shRedir\nshHereDoc25: '' # shRedir\nshHereDoc26: '' # shRedir\nshHereDoc27: '' # shRedir\nshHereDoc28: '' # shRedir\nshHereDoc29: '' # shRedir\nshHereDoc30: '' # shRedir\nshHereDoc31: '' # shRedir\nshHereDoc32: '' # shRedir\n",
        "elm.vim.yml": "elmKeyword: '' # Keyword\nelmBuiltinOp: '' # Special\nelmType: '' # Type\nelmTodo: '' # Todo\nelmLineComment: '' # Comment\nelmComment: '' # Comment\nelmString: '' # String\nelmNumber: '' # Number\nspecialName: '' # Special\n",
        "vim-gitgutter.yml": "# GitGutter airblade/vim-gitgutter\nGitGutterAdd: ''\nGitGutterChange: ''\nGitGutterDelete: ''\nGitGutterChangeDelete: ''\n",
        "html.yml": "htmlTag: '' # Function\nhtmlEndTag: '' # Identifier\nhtmlArg: '' # Type\nhtmlTagName: '' # htmlStatement\nhtmlSpecialTagName: '' # Exception\nhtmlValue: '' # String\nhtmlH1: '' # Title\nhtmlH2: '' # htmlH1\nhtmlH3: '' # htmlH2\nhtmlH4: '' # htmlH3\nhtmlH5: '' # htmlH4\nhtmlH6: '' # htmlH5\nhtmlHead: '' # PreProc\nhtmlTitle: '' # Title\nhtmlBoldItalicUnderline: '' # htmlBoldUnderlineItalic\nhtmlUnderlineBold: '' # htmlBoldUnderline\nhtmlUnderlineItalicBold: '' # htmlBoldUnderlineItalic\nhtmlUnderlineBoldItalic: '' # htmlBoldUnderlineItalic\nhtmlItalicUnderline: '' # htmlUnderlineItalic\nhtmlItalicBold: '' # htmlBoldItalic\nhtmlItalicBoldUnderline: '' # htmlBoldUnderlineItalic\nhtmlItalicUnderlineBold: '' # htmlBoldUnderlineItalic\nhtmlLink: '' # Underlined\nhtmlLeadingSpace: '' # None\nhtmlPreStmt: '' # PreProc\nhtmlPreError: '' # Error\nhtmlPreProc: '' # PreProc\nhtmlPreAttr: '' # String\nhtmlPreProcAttrName: '' # PreProc\nhtmlPreProcAttrError: '' # Error\nhtmlSpecial: '' # Special\nhtmlSpecialChar: '' # Special\nhtmlString: '' # String\nhtmlStatement: '' # Statement\nhtmlComment: '' # Comment\nhtmlCommentPart: '' # Comment\nhtmlCommentError: '' # htmlError\nhtmlTagError: '' # htmlError\nhtmlEvent: '' # javaScript\nhtmlError: '' # Error\njavaScript: '' # Special\njavaScriptExpression: '' # javaScript\nhtmlCssStyleComment: '' # Comment\nhtmlCssDefinition: '' # Special\n",
        "viminfo.yml": "viminfoComment: '' # Comment\nviminfoError: '' # Error\nviminfoStatement: '' # Statement\n",
        "php.yml": "phpConstant: '' # Constant\nphpCoreConstant: '' # Constant\nphpComment: '' # Comment\nphpDocTags: '' # PreProc\nphpDocCustomTags: '' # Type\nphpException: '' # Exception\nphpBoolean: '' # Boolean\nphpStorageClass: '' # StorageClass\nphpSCKeyword: '' # StorageClass\nphpFCKeyword: '' # Define\nphpStructure: '' # Structure\nphpStringSingle: '' # String\nphpStringDouble: '' # String\nphpBacktick: '' # String\nphpNumber: '' # Number\nphpFloat: '' # Float\nphpMethods: '' # Function\nphpFunctions: '' # Function\nphpBaselib: '' # Function\nphpRepeat: '' # Repeat\nphpConditional: '' # Conditional\nphpLabel: '' # Label\nphpStatement: '' # Statement\nphpKeyword: '' # Statement\nphpType: '' # Type\nphpInclude: '' # Include\nphpDefine: '' # Define\nphpBackslashSequences: '' # SpecialChar\nphpBackslashDoubleQuote: '' # SpecialChar\nphpBackslashSingleQuote: '' # SpecialChar\nphpParent: '' # Delimiter\nphpBrackets: '' # Delimiter\nphpIdentifierConst: '' # Delimiter\nphpParentError: '' # Error\nphpOctalError: '' # Error\nphpInterpSimpleError: '' # Error\nphpInterpBogusDollarCurley: '' # Error\nphpInterpDollarCurly1: '' # Error\nphpInterpDollarCurly2: '' # Error\nphpInterpSimpleBracketsInner: '' # String\nphpInterpSimpleCurly: '' # Delimiter\nphpInterpVarname: '' # Identifier\nphpTodo: '' # Todo\nphpDocTodo: '' # Todo\nphpMemberSelector: '' # Structure\nphpIntVar: '' # Identifier\nphpEnvVar: '' # Identifier\nphpOperator: '' # Operator\nphpVarSelector: '' # Operator\nphpRelation: '' # Operator\nphpIdentifier: '' # Identifier\nphpIdentifierSimply: '' # Identifier\n",
        "nerdtree.yml": "NERDTreePart: '' # Special\nNERDTreePartFile: '' # Type\nNERDTreeExecFile: '' # Title\nNERDTreeDirSlash: '' # Identifier\nNERDTreeBookmarksHeader: '' # statement\nNERDTreeBookmarksLeader: '' # ignore\nNERDTreeBookmarkName: '' # Identifier\nNERDTreeBookmark: '' # normal\nNERDTreeHelp: '' # String\nNERDTreeHelpKey: '' # Identifier\nNERDTreeHelpCommand: '' # Identifier\nNERDTreeHelpTitle: '' # Macro\nNERDTreeToggleOn: '' # Question\nNERDTreeToggleOff: '' # WarningMsg\nNERDTreeLinkTarget: '' # Type\nNERDTreeLinkFile: '' # Macro\nNERDTreeLinkDir: '' # Macro\nNERDTreeDir: '' # Directory\nNERDTreeUp: '' # Directory\nNERDTreeFile: '' # Normal\nNERDTreeCWD: '' # Statement\nNERDTreeOpenable: '' # Title\nNERDTreeClosable: '' # Title\nNERDTreeIgnore: '' # ignore\nNERDTreeRO: '' # WarningMsg\nNERDTreeFlags: '' # Number\n",
        "fugitive.yml": "FugitiveblameBoundary: '' # Keyword\nFugitiveblameHash: '' # Identifier\nFugitiveblameUncommitted: '' # Ignore\nFugitiveblameTime: '' # PreProc\nFugitiveblameLineNumber: '' # Number\nFugitiveblameOriginalFile: '' # String\nFugitiveblameOriginalLineNumber: '' #\nFugitiveblameShort: '' # FugitiveblameDelimiter\nFugitiveblameDelimiter: '' # Delimiter\nFugitiveblameNotCommittedYet: '' # Comment\n",
        "ruby.yml": "rubyClass: '' # rubyDefine\nrubyModule: '' # rubyDefine\nrubyMethodExceptional: '' # rubyDefine\nrubyDefine: '' # Define\nrubyFunction: '' # Function\nrubyConditional: '' # Conditional\nrubyConditionalModifier: '' # rubyConditional\nrubyExceptional: '' # rubyConditional\nrubyRepeat: '' # Repeat\nrubyRepeatModifier: '' # rubyRepeat\nrubyOptionalDo: '' # rubyRepeat\nrubyControl: '' # Statement\nrubyInclude: '' # Include\nrubyInteger: '' # Number\nrubyASCIICode: '' # Character\nrubyFloat: '' # Float\nrubyBoolean: '' # Boolean\nrubyException: '' # Exception\nrubyIdentifier: '' # Identifier\nrubyClassVariable: '' # rubyIdentifier\nrubyConstant: '' # Type\nrubyGlobalVariable: '' # rubyIdentifier\nrubyBlockParameter: '' # rubyIdentifier\nrubyInstanceVariable: '' # rubyIdentifier\nrubyPredefinedIdentifier: '' # rubyIdentifier\nrubyPredefinedConstant: '' # rubyPredefinedIdentifier\nrubyPredefinedVariable: '' # rubyPredefinedIdentifier\nrubySymbol: '' # Constant\nrubyKeyword: '' # Keyword\nrubyOperator: '' # Operator\nrubyBeginEnd: '' # Statement\nrubyAccess: '' # Statement\nrubyAttribute: '' # Statement\nrubyEval: '' # Statement\nrubyPseudoVariable: '' # Constant\nrubyComment: '' # Comment\nrubyData: '' # Comment\nrubyDataDirective: '' # Delimiter\nrubyDocumentation: '' # Comment\nrubyTodo: '' # Todo\nrubyQuoteEscape: '' # rubyStringEscape\nrubyStringEscape: '' # Special\nrubyInterpolationDelimiter: '' # Delimiter\nrubyNoInterpolation: '' # rubyString\nrubySharpBang: '' # PreProc\nrubyRegexpDelimiter: '' # rubyStringDelimiter\nrubySymbolDelimiter: '' # rubyStringDelimiter\nrubyStringDelimiter: '' # Delimiter\nrubyHeredoc: '' # rubyString\nrubyString: '' # String\nrubyRegexpEscape: '' # rubyRegexpSpecial\nrubyRegexpQuantifier: '' # rubyRegexpSpecial\nrubyRegexpAnchor: '' # rubyRegexpSpecial\nrubyRegexpDot: '' # rubyRegexpCharClass\nrubyRegexpCharClass: '' # rubyRegexpSpecial\nrubyRegexpSpecial: '' # Special\nrubyRegexpComment: '' # Comment\nrubyRegexp: '' # rubyString\nrubyInvalidVariable: '' # Error\nrubyError: '' # Error\nrubySpaceError: '' # rubyError\n",
        "yajs.yml": "javascriptReserved: '' # Error\njavascriptReservedCase: '' # Error\njavascriptInvalidOp: '' # Error\njavascriptEndColons: '' # Statement\njavascriptOpSymbol: '' # Normal\njavascriptBraces: '' # Function\njavascriptBrackets: '' # Function\njavascriptParens: '' # Normal\njavascriptComment: '' # Comment\njavascriptLineComment: '' # Comment\njavascriptDocComment: '' # Comment\njavascriptCommentTodo: '' # Todo\njavascriptDocNotation: '' # SpecialComment\njavascriptDocTags: '' # SpecialComment\njavascriptDocNGParam: '' # javascriptDocParam\njavascriptDocParam: '' # Function\njavascriptDocNumParam: '' # Function\njavascriptDocEventRef: '' # Function\njavascriptDocNamedParamType: '' # Type\njavascriptDocParamName: '' # Type\njavascriptDocParamType: '' # Type\njavascriptString: '' # String\njavascriptTemplate: '' # String\njavascriptEventString: '' # String\njavascriptASCII: '' # Label\njavascriptTemplateSubstitution: '' # Label\njavascriptTemplateSB: '' # javascriptTemplateSubstitution\njavascriptRegexpString: '' # String\njavascriptGlobal: '' # Constant\njavascriptCharacter: '' # Character\njavascriptPrototype: '' # Type\njavascriptConditional: '' # Conditional\njavascriptConditionalElse: '' # Conditional\njavascriptSwitch: '' # Conditional\njavascriptCase: '' # Conditional\njavascriptDefault: '' # javascriptCase\njavascriptExportDefault: '' # javascriptCase\njavascriptBranch: '' # Conditional\njavascriptIdentifier: '' # Structure\njavascriptVariable: '' # Identifier\njavascriptRepeat: '' # Repeat\njavascriptForComprehension: '' # Repeat\njavascriptIfComprehension: '' # Repeat\njavascriptOfComprehension: '' # Repeat\njavascriptForOperator: '' # Repeat\njavascriptStatementKeyword: '' # Statement\njavascriptReturn: '' # Statement\njavascriptYield: '' # Statement\njavascriptYieldGen: '' # Statement\njavascriptMessage: '' # Keyword\njavascriptOperator: '' # Identifier\njavascriptTarget: '' # Identifier\njavascriptNull: '' # Boolean\njavascriptNumber: '' # Number\njavascriptBoolean: '' # Boolean\njavascriptObjectLabel: '' # javascriptLabel\njavascriptObjectLabelColon: '' # javascriptLabel\njavascriptLabel: '' # Label\njavascriptPropertyName: '' # Label\njavascriptImport: '' # Special\njavascriptExport: '' # Special\njavascriptTry: '' # Statement\njavascriptExceptions: '' # Statement\njavascriptMethodName: '' # Function\njavascriptMethodAccessor: '' # Operator\njavascriptObjectMethodName: '' # Function\njavascriptFuncKeyword: '' # Keyword\njavascriptAsyncFunc: '' # Keyword\njavascriptArrowFunc: '' # Type\njavascriptFuncName: '' # Function\njavascriptFuncArg: '' # Special\njavascriptArrowFuncArg: '' # javascriptFuncArg\njavascriptComma: '' # Normal\njavascriptClassKeyword: '' # Keyword\njavascriptClassExtends: '' # Keyword\njavascriptClassName: '' # Function\njavascriptClassSuperName: '' # Function\njavascriptClassStatic: '' # StorageClass\njavascriptClassSuper: '' # keyword\nshellbang: '' # Comment\n",
        "less.yml": "lessEndOfLineComment: '' # lessComment\nlessCssComment: '' # lessComment\nlessComment: '' # Comment\nlessDefault: '' # cssImportant\nlessVariable: '' # Identifier\nlessFunction: '' # PreProc\nlessTodo: '' # Todo\nlessInclude: '' # Include\nlessIdChar: '' # Special\nlessClassChar: '' # Special\nlessAmpersand: '' # Character\nlessId: '' # Identifier\nlessClass: '' # Type\nlessCssAttribute: '' # PreProc\nlessClassCall: '' # Type\nlessClassIdCall: '' # Type\nlessTagName: '' # cssTagName\nlessDeprecated: '' # cssDeprecated\nlessMedia: '' # cssMedia\n",
        "python.yml": "pythonStatement: '' # Statement\npythonConditional: '' # Conditional\npythonRepeat: '' # Repeat\npythonOperator: '' # Operator\npythonException: '' # Exception\npythonInclude: '' # Include\npythonDecorator: '' # Define\npythonFunction: '' # Function\npythonComment: '' # Comment\npythonTodo: '' # Todo\npythonString: '' # String\npythonRawString: '' # String\npythonQuotes: '' # String\npythonTripleQuotes: '' # pythonQuotes\npythonEscape: '' # Special\npythonNumber: '' # Number\npythonBuiltin: '' # Function\npythonExceptions: '' # Structure\npythonSpaceError: '' # Error\npythonDoctest: '' # Special\npythonDoctestValue: '' # Define\n",
        "gitconfig.yml": "gitconfigComment: '' # Comment\ngitconfigSection: '' # Keyword\ngitconfigVariable: '' # Identifier\ngitconfigBoolean: '' # Boolean\ngitconfigNumber: '' # Number\ngitconfigString: '' # String\ngitconfigDelim: '' # Delimiter\ngitconfigEscape: '' # Delimiter\ngitconfigError: '' # Error\n",
        "gitcommit.yml": "gitcommitSummary: '' # Keyword\ngitcommitComment: '' # Comment\ngitcommitUntracked: '' # gitcommitComment\ngitcommitDiscarded: '' # gitcommitComment\ngitcommitSelected: '' # gitcommitComment\ngitcommitUnmerged: '' # gitcommitComment\ngitcommitOnBranch: '' # Comment\ngitcommitBranch: '' # Special\ngitcommitNoBranch: '' # gitCommitBranch\ngitcommitDiscardedType: '' # gitcommitType\ngitcommitSelectedType: '' # gitcommitType\ngitcommitUnmergedType: '' # gitcommitType\ngitcommitType: '' # Type\ngitcommitNoChanges: '' # gitcommitHeader\ngitcommitHeader: '' # PreProc\ngitcommitUntrackedFile: '' # gitcommitFile\ngitcommitDiscardedFile: '' # gitcommitFile\ngitcommitSelectedFile: '' # gitcommitFile\ngitcommitUnmergedFile: '' # gitcommitFile\ngitcommitFile: '' # Constant\ngitcommitDiscardedArrow: '' # gitcommitArrow\ngitcommitSelectedArrow: '' # gitcommitArrow\ngitcommitUnmergedArrow: '' # gitcommitArrow\ngitcommitArrow: '' # gitcommitComment\ngitcommitOverflow: '' # none\ngitcommitBlank: '' # Error\n",
        "vim-javascript-syntax.yml": "# jelera/vim-javascript-syntax\njavaScriptEndColons: '' # Operator\njavaScriptOpSymbols: '' # Operator\njavaScriptLogicSymbols: '' # Boolean\njavaScriptParens: '' # Operator\njavaScriptTemplateDelim: '' # Operator\njavaScriptDocComment: '' # Comment\njavaScriptDocTags: '' # Special\njavaScriptDocSeeTag: '' # Function\njavaScriptDocParam: '' # Function\njavaScriptString: '' # String\njavaScriptTemplateString: '' # String\njavaScriptFloat: '' # Number\njavaScriptPrototype: '' # Type\njavaScriptSpecial: '' # Special\njavaScriptSource: '' # Special\njavaScriptGlobalObjects: '' # Special\njavaScriptExceptions: '' # Special\njavaScriptParensErrA: '' # Error\njavaScriptParensErrB: '' # Error\njavaScriptParensErrC: '' # Error\njavaScriptDomErrNo: '' # Error\njavaScriptDomNodeConsts: '' # Constant\njavaScriptDomElemAttrs: '' # Label\njavaScriptDomElemFuncs: '' # Type\njavaScriptWebAPI: '' # Type\njavaScriptHtmlElemAttrs: '' # Label\njavaScriptHtmlElemFuncs: '' # Type\njavaScriptCssStyles: '' # Type\njavaScriptBrowserObjects: '' # Constant\njavaScriptDOMObjects: '' # Constant\njavaScriptDOMMethods: '' # Type\njavaScriptDOMProperties: '' # Label\njavaScriptAjaxObjects: '' # Constant\njavaScriptAjaxMethods: '' # Type\njavaScriptAjaxProperties: '' # Label\njavaScriptFuncKeyword: '' # Function\njavaScriptFuncDef: '' # PreProc\njavaScriptFuncExp: '' # Title\njavaScriptFuncArg: '' # Special\njavaScriptFuncComma: '' # Operator\njavaScriptFuncEq: '' # Operator\njavaScriptHtmlEvents: '' # Constant\njavaScriptHtmlElemProperties: '' # Label\njavaScriptEventListenerKeywords: '' # Type\njavaScriptPropietaryObjects: '' # Constant\n",
        "gitrebase.yml": "gitrebaseCommit: '' # gitrebaseHash\ngitrebaseHash: '' # Identifier\ngitrebasePick: '' # Statement\ngitrebaseReword: '' # Number\ngitrebaseEdit: '' # PreProc\ngitrebaseSquash: '' # Type\ngitrebaseFixup: '' # Special\ngitrebaseExec: '' # Function\ngitrebaseSummary: '' # String\ngitrebaseComment: '' # Comment\ngitrebaseSquashError: '' # Error\n",
        "javascript.yml": "javaScriptComment: '' # Comment\njavaScriptLineComment: '' # Comment\njavaScriptCommentTodo: '' # Todo\njavaScriptSpecial: '' # Special\njavaScriptStringS: '' # String\njavaScriptStringD: '' # String\njavaScriptCharacter: '' # Character\njavaScriptSpecialCharacter: '' # javaScriptSpecial\njavaScriptNumber: '' # javaScriptValue\njavaScriptConditional: '' # Conditional\njavaScriptRepeat: '' # Repeat\njavaScriptBranch: '' # Conditional\njavaScriptOperator: '' # Operator\njavaScriptType: '' # Type\njavaScriptStatement: '' # Statement\njavaScriptFunction: '' # Function\njavaScriptBraces: '' # Function\njavaScriptError: '' # Error\njavaScriptParensError: '' # Error\njavaScriptNull: '' # Keyword\njavaScriptBoolean: '' # Boolean\njavaScriptRegexpString: '' # String\njavaScriptIdentifier: '' # Identifier\njavaScriptLabel: '' # Label\njavaScriptException: '' # Exception\njavaScriptMessage: '' # Keyword\njavaScriptGlobal: '' # Keyword\njavaScriptMember: '' # Keyword\njavaScriptDeprecated: '' # Exception\njavaScriptReserved: '' # Keyword\njavaScriptDebug: '' # Debug\njavaScriptConstant: '' # Label\n",
        "yaml.yml": "yamlTodo: '' # Todo\nyamlComment: '' # Comment\nyamlDocumentStart: '' # PreProc\nyamlDocumentEnd: '' # PreProc\nyamlDirectiveName: '' # Keyword\nyamlTAGDirective: '' # yamlDirectiveName\nyamlTagHandle: '' # String\nyamlTagPrefix: '' # String\nyamlYAMLDirective: '' # yamlDirectiveName\nyamlReservedDirective: '' # Error\nyamlYAMLVersion: '' # Number\nyamlString: '' # String\nyamlFlowString: '' # yamlString\nyamlFlowStringDelimiter: '' # yamlString\nyamlEscape: '' # SpecialChar\nyamlSingleEscape: '' # SpecialChar\nyamlBlockCollectionItemStart: '' # Label\nyamlBlockMappingKey: '' # Identifier\nyamlBlockMappingMerge: '' # Special\nyamlFlowMappingKey: '' # Identifier\nyamlFlowMappingMerge: '' # Special\nyamlMappingKeyStart: '' # Special\nyamlFlowIndicator: '' # Special\nyamlKeyValueDelimiter: '' # Special\nyamlConstant: '' # Constant\nyamlNull: '' # yamlConstant\nyamlBool: '' # yamlConstant\nyamlAnchor: '' # Type\nyamlAlias: '' # Type\nyamlNodeTag: '' # Type\nyamlInteger: '' # Number\nyamlFloat: '' # Float\nyamlTimestamp: '' # Number\n",
        "go.yml": "goDirective: '' # Statement\ngoDeclaration: '' # Keyword\ngoDeclType: '' # Keyword\ngoStatement: '' # Statement\ngoConditional: '' # Conditional\ngoLabel: '' # Label\ngoRepeat: '' # Repeat\ngoType: '' # Type\ngoSignedInts: '' # Type\ngoUnsignedInts: '' # Type\ngoFloats: '' # Type\ngoComplexes: '' # Type\ngoBuiltins: '' # Keyword\ngoConstants: '' # Keyword\ngoComment: '' # Comment\ngoTodo: '' # Todo\ngoEscapeOctal: '' # goSpecialString\ngoEscapeC: '' # goSpecialString\ngoEscapeX: '' # goSpecialString\ngoEscapeU: '' # goSpecialString\ngoEscapeBigU: '' # goSpecialString\ngoSpecialString: '' # Special\ngoEscapeError: '' # Error\ngoString: '' # String\ngoRawString: '' # String\ngoCharacter: '' # Character\ngoDecimalInt: '' # Integer\ngoHexadecimalInt: '' # Integer\ngoOctalInt: '' # Integer\nInteger: '' # Number\ngoFloat: '' # Float\ngoImaginary: '' # Number\ngoExtraType: '' # Type\ngoSpaceError: '' # Error\n",
        "unite.yml": "uniteError: '' # Error\nuniteMarkedLine: '' # Statement\nuniteCandidateSourceName: '' # Type\nuniteQuickMatchText: '' # Special\nuniteCandidateIcon: '' # Special\nuniteMarkedIcon: '' # Statement\nuniteCandidateInputKeyword: '' # Function\nuniteChooseAction: '' # NONE\nuniteChooseCandidate: '' # NONE\nuniteChooseKey: '' # SpecialKey\nuniteChooseMessage: '' # NONE\nuniteChoosePrompt: '' # uniteSourcePrompt\nuniteChooseSource: '' # uniteSourceNames\nuniteInputPrompt: '' # Normal\nuniteInputLine: '' # Identifier\nuniteInputCommand: '' # Statement\nuniteStatusNormal: '' # StatusLine\nuniteStatusHead: '' # Statement\nuniteStatusSourceNames: '' # PreProc\nuniteStatusSourceCandidates: '' # Constant\nuniteStatusMessage: '' # Comment\nuniteStatusLineNR: '' # LineNR\n"
    },
    "addons": {
        "terminal.yml": "color_foreground: ''\ncolor_background: ''\ncolor_0: ''\ncolor_1: ''\ncolor_2: ''\ncolor_3: ''\ncolor_4: ''\ncolor_5: ''\ncolor_6: ''\ncolor_7: ''\ncolor_8: ''\ncolor_9: ''\ncolor_10: ''\ncolor_11: ''\ncolor_12: ''\ncolor_13: ''\ncolor_14: ''\ncolor_15: ''\n",
        "lightline.yml": "normal1: ''\nnormal2: ''\nnormal3: ''\nnormal4: ''\nnormal5: ''\nnormalError: ''\nnormalWarning: ''\ninactive1: ''\ninactive2: ''\ninactive3: ''\ninactive4: ''\ninactive5: ''\ninsert1: ''\ninsert2: ''\ninsert3: ''\ninsert4: ''\ninsert5: ''\nreplace1: ''\nreplace2: ''\nreplace3: ''\nreplace4: ''\nreplace5: ''\nvisual1: ''\nvisual2: ''\nvisual3: ''\nvisual4: ''\nvisual5: ''\ntablineLeft: ''\ntablineSelected: ''\ntablineMiddle: ''\ntablineRight: ''\n",
        "airline.yml": "normal1: ''\nnormal2: ''\nnormal3: ''\ninactive1: ''\ninactive2: ''\ninactive3: ''\ninsert1: ''\ninsert2: ''\ninsert3: ''\nreplace1: ''\nreplace2: ''\nreplace3: ''\nvisual1: ''\nvisual2: ''\nvisual3: ''\nctrlp1: '' # optional\nctrlp2: '' # optional\nctrlp3: '' # optional\n"
    }
};
const tick = green("✓");
function installTemplates(projectPath, templates) {
    templates.forEach((name)=>{
        const destination = resolve5(projectPath, "estilos/syntax", name);
        try {
            Deno.writeTextFileSync(destination, __default1.syntax[name]);
        } catch (err) {
            console.error(err);
        }
    });
    console.log(green(`Added ${templates.length} templates:`));
    console.log(templates.map((name)=>name.slice(0, -4)
    ).map((name)=>`${tick} ${name}\n`
    ).join(""));
}
const defaultPalette = "myblue: '#99ccff'";
async function createProject(projectPath, noQuestions) {
    const options = noQuestions ? getDefaultConfig(projectPath) : await askConfig(projectPath);
    await createBoilerplate(projectPath, options);
}
function getDefaultConfig(projectPath) {
    return {
        name: basename5(projectPath),
        author: "",
        version: "1.0.0",
        url: "",
        license: "MIT",
        description: "A (neo)vim colorscheme"
    };
}
async function askConfig(projectPath) {
    const folderName = basename5(projectPath);
    return await prompt([
        {
            type: Input,
            name: "name",
            message: "Project name:",
            default: folderName
        },
        {
            type: Input,
            name: "version",
            message: "Version:",
            default: "1.0.0"
        },
        {
            type: Input,
            name: "license",
            message: "License:",
            default: "MIT"
        },
        {
            type: Input,
            name: "author",
            message: "Author:"
        },
        {
            type: Input,
            name: "url",
            message: "Project url:"
        },
        {
            type: Input,
            name: "description",
            message: "Description:"
        }, 
    ]);
}
async function createBoilerplate(projectPath, options) {
    const estiloStr = await renderConfigFile(options);
    const estilosFolder = resolve5(projectPath, "estilos");
    const syntaxFolder = resolve5(estilosFolder, "syntax");
    const palettesFolder = resolve5(estilosFolder, "palettes");
    ensureDirSync(estilosFolder);
    ensureDirSync(syntaxFolder);
    ensureDirSync(palettesFolder);
    Deno.writeTextFileSync(resolve5(projectPath, "estilo.yml"), estiloStr);
    Deno.writeTextFileSync(resolve5(estilosFolder, "terminal.yml"), __default1.addons["terminal.yml"]);
    Deno.writeTextFileSync(resolve5(palettesFolder, options.name + ".yml"), defaultPalette);
    installTemplates(projectPath, [
        "base.yml"
    ]);
    console.log(green("✓  Your project is ready\n"));
}
async function renderConfigFile(options) {
    return await render(__default1.mustaches["project.ejs"], options);
}
function isHexColor1(color) {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
}
function loadYml(folderPath, filename) {
    const filepath = resolve5(folderPath, filename || "");
    const content = parse8(Deno.readTextFileSync(filepath));
    if (typeof content !== "object") {
        crash("Content of file is not an object", {
            filepath
        });
    }
    return {
        filepath,
        content
    };
}
function buildPalettes(paletteFiles, common = {
}) {
    const commonPalette = buildMainPalette(common);
    const paleteEntries = paletteFiles.map((paletteFile)=>{
        const palette = buildPalette(paletteFile, commonPalette);
        return [
            palette.name,
            palette
        ];
    });
    return Object.fromEntries(paleteEntries);
}
function buildMainPalette(content) {
    const colors = Object.keys(content).map((name)=>{
        const hexcolor = content[name].trim();
        if (!isHexColor1(hexcolor)) {
            crash("Wrong color in common palette", {
                name
            });
        }
        return [
            name,
            getColorObj(hexcolor)
        ];
    });
    return Object.fromEntries(colors);
}
function getColorObj(hexcolor) {
    return {
        hex: hexcolor.startsWith("#") ? hexcolor : "#" + hexcolor,
        xterm: hexterm(hexcolor).toString()
    };
}
function buildPalette(paletteFile, common) {
    const { filepath , content  } = paletteFile;
    const palette = {
        filepath,
        name: basename5(filepath, ".yml"),
        colors: {
        }
    };
    Object.entries(content).forEach(([name, value])=>{
        const hexcolor = value.trim();
        if (hexcolor.startsWith("@")) {
            const propName = hexcolor.slice(1);
            const color = common[propName];
            if (!color) crash("Missing common color", {
                color: propName
            });
            palette.colors[name] = color;
            return;
        }
        if (!isHexColor1(hexcolor)) crash("Wrong color", {
            filepath,
            name,
            hexcolor
        });
        palette.colors[name] = {
            hex: hexcolor.startsWith("#") ? hexcolor : "#" + hexcolor,
            xterm: hexterm(hexcolor).toString()
        };
    });
    palette.colors = Object.assign({
    }, common, palette.colors);
    return palette;
}
function formatSyntaxFile(file) {
    const filepath = file.filepath;
    return Object.entries(file.content).map(([name, value])=>({
            filepath,
            name,
            rule: value.trim()
        })
    ).filter((rule)=>rule.rule
    );
}
function formatSyntax(syntaxFiles) {
    return syntaxFiles.map((syntaxFile)=>formatSyntaxFile(syntaxFile)
    ).flat();
}
function formatTerminal(data) {
    return Object.fromEntries(Object.keys(data).map((prop)=>[
            prop,
            data[prop].trim()
        ]
    ).filter(([_, colorname])=>colorname
    ));
}
const statusParts = {
    airline: [
        "normal1",
        "normal2",
        "normal3",
        "insert1",
        "insert2",
        "insert3",
        "replace1",
        "replace2",
        "replace3",
        "visual1",
        "visual2",
        "visual3",
        "inactive1",
        "inactive2",
        "inactive3", 
    ],
    lightline: [
        "normal1",
        "normal2",
        "normal3",
        "normal4",
        "normal5",
        "normalError",
        "normalWarning",
        "inactive1",
        "inactive2",
        "inactive3",
        "inactive4",
        "inactive5",
        "insert1",
        "insert2",
        "insert3",
        "insert4",
        "insert5",
        "replace1",
        "replace2",
        "replace3",
        "replace4",
        "replace5",
        "visual1",
        "visual2",
        "visual3",
        "visual4",
        "visual5",
        "tablineLeft",
        "tablineSelected",
        "tablineMiddle",
        "tablineRight", 
    ]
};
function formatStatusStyles(statusFiles, brand) {
    const files = statusFiles.map(({ filepath , content  })=>{
        const style = formatStatusStyle(content, brand, filepath);
        return [
            style.name,
            style
        ];
    });
    return Object.fromEntries(files);
}
function formatStatusStyle(content, brand, filepath) {
    const statusStyle = {
        name: basename5(filepath, ".yml"),
        filepath,
        syntax: {
        }
    };
    Object.keys(content).forEach((name)=>{
        const txt = content[name].trim();
        statusStyle.syntax[name] = txt.split(/\s+/);
    });
    statusParts[brand].forEach((part)=>{
        const block = statusStyle.syntax[part];
        if (!block) crash("Missing block in status", {
            filepath,
            block: part
        });
        if (!block[0]) {
            crash("Missing foreground in status block", {
                filepath,
                block: part
            });
        }
        if (!block[1]) {
            crash("Missing background in status block", {
                filepath,
                block: part
            });
        }
    });
    return statusStyle;
}
function loadProjectFiles(projectUrl) {
    const config = loadYml(projectUrl, "estilo.yml").content;
    const airlineFiles = loadYmlsInFolder(projectUrl, "airline");
    const lightlineFiles = loadYmlsInFolder(projectUrl, "lightline");
    const syntaxFiles = loadYmlsInFolder(projectUrl, "syntax");
    const paletteFiles = loadYmlsInFolder(projectUrl, "palettes");
    const terminalFile = loadYml(projectUrl, "estilos/terminal.yml");
    return {
        projectUrl,
        config,
        palettes: buildPalettes(paletteFiles, config.commonPalette),
        syntax: formatSyntax(syntaxFiles),
        terminalSyntax: formatTerminal(terminalFile.content),
        airlineStyles: formatStatusStyles(airlineFiles, "airline"),
        lightlineStyles: formatStatusStyles(lightlineFiles, "lightline")
    };
}
function loadYmlsInFolder(projectUrl, folder) {
    const folderUrl = resolve5(projectUrl, "estilos", folder);
    return ymlsInFolder(folderUrl).map((filepath)=>loadYml(filepath)
    );
}
function ymlsInFolder(folderPath, folder2) {
    const finalPath = resolve5(folderPath, folder2 || "");
    if (!existsSync1(finalPath)) return [];
    return Array.from(Deno.readDirSync(finalPath)).filter((file)=>file.name.endsWith(".yml")
    ).map((file)=>resolve5(finalPath, file.name)
    );
}
async function selectSyntax(projectPath, all = false) {
    const destFolder = resolve5(projectPath, "estilos/syntax");
    const libFiles = Object.keys(__default1.syntax);
    const destFiles = getFileNamesFromFolder(destFolder);
    const templates = all ? getMissingTemplates(libFiles, destFiles) : (await askForTemplates(libFiles, destFiles)).templates;
    installTemplates(projectPath, templates);
}
function getFileNamesFromFolder(folder) {
    return Array.from(Deno.readDirSync(folder)).map((file)=>file.name
    );
}
function getMissingTemplates(libFiles, destFiles) {
    return libFiles.filter((template)=>!destFiles.includes(template)
    );
}
async function askForTemplates(libFiles, destFiles) {
    const options = libFiles.map((value)=>{
        const disabled = destFiles.includes(value);
        const name = value.slice(0, -4);
        return {
            name: name + (disabled ? " (installed)" : ""),
            value,
            disabled
        };
    });
    return await prompt([
        {
            type: Checkbox,
            message: "Select some extra syntax templates",
            name: "templates",
            options
        }, 
    ]);
}
const uis = new Set([
    "u",
    "b",
    "r",
    "i",
    "c",
    "s"
]);
const uiValues = {
    u: "underline",
    b: "Bold",
    i: "Italic",
    r: "reverse",
    c: "undercurl",
    s: "standout"
};
function isLegacyUi(value) {
    return !value.split("").some((character)=>{
        return !uis.has(character);
    });
}
function parseLegacyUi(style) {
    return style.split("").map((val)=>uiValues[val]
    ).join(",");
}
async function renderColorscheme(config, project) {
    const palette = project.palettes[config.palette];
    if (!palette) {
        crash("Colorscheme palette does not exist", {
            colorscheme: config.name,
            palette: config.palette
        });
    }
    return await render(__default1.mustaches["colorscheme.ejs"], {
        info: {
            name: config.name,
            description: config.description,
            url: project.config.url,
            author: project.config.author,
            license: project.config.license,
            background: config.background,
            estiloVersion: __default
        },
        stacks: parseSyntaxColors(project.syntax, palette),
        term: parseTermColors(project.terminalSyntax, palette)
    });
}
function parseTermColors(termSyntax, palette) {
    const values = Object.keys(termSyntax).map((prop)=>{
        const colorName = termSyntax[prop];
        const value = palette.colors[colorName];
        if (!value) {
            crash("Missing terminal color", {
                colorName,
                property: prop,
                palette: palette.filepath
            });
        }
        return [
            prop,
            value.hex
        ];
    });
    return Object.fromEntries(values);
}
function parseSyntaxColors(syntax, palette) {
    const values = {
    };
    syntax.forEach((rule)=>{
        const [fgColor, bgColor, ui, curlColor] = rule.rule.split(/\s+/);
        const filepath = rule.filepath;
        if (fgColor.startsWith("@")) {
            values[rule.name] = {
                link: fgColor.slice(1)
            };
        } else {
            values[rule.name] = {
                fore: getColorCode(fgColor, palette, filepath),
                back: getColorCode(bgColor, palette, filepath),
                ui: getUI(ui),
                guisp: getCurlColor(curlColor, palette, filepath)
            };
        }
    });
    return values;
}
function getColorCode(color, palette, filepath) {
    if (color === ".") return false;
    if (!color || color === "-") return {
        hex: "NONE",
        xterm: "NONE"
    };
    const colorcodes = palette.colors[color];
    if (colorcodes) return colorcodes;
    if (isHexColor1(color)) {
        const finalcolor = color.startsWith("#") ? color : color.slice(1);
        return {
            hex: finalcolor,
            xterm: hexterm(color).toString()
        };
    }
    crash("Color does not exist", {
        filepath,
        color
    });
}
function getUI(ui) {
    if (ui === ".") return false;
    if (!ui) return "NONE";
    if (ui === "NONE") return "NONE";
    if (isLegacyUi(ui)) return parseLegacyUi(ui);
    return ui;
}
function getCurlColor(color, palette, filepath) {
    const curlParsed = getColorCode(color, palette, filepath);
    let curlColor;
    if (!curlParsed || curlParsed.hex === "NONE") {
        curlColor = false;
    } else {
        curlColor = curlParsed;
    }
    return curlColor;
}
function parseStatusColors(syntax, palette) {
    const out = {
    };
    Object.keys(syntax).forEach((partName)=>{
        const [fgName, bgName] = syntax[partName];
        const fg = palette.colors[fgName];
        const bg = palette.colors[bgName];
        if (!fg) {
            crash("Missing foreground color", {
                palette: palette.filepath,
                color: fgName
            });
        }
        if (!bg) {
            crash("Missing background color", {
                palette: palette.filepath,
                color: bgName
            });
        }
        out[partName] = {
            fg,
            bg
        };
    });
    return out;
}
async function renderStatus(config, project, brand) {
    const palette = project.palettes[config.palette];
    if (!palette) {
        crash("Palette does not exist", {
            palette: config.palette,
            brand,
            style: config.style
        });
    }
    const brandStyles = {
        airline: project.airlineStyles,
        lightline: project.lightlineStyles
    };
    const syntaxFile = brandStyles[brand][config.style];
    if (!syntaxFile) {
        crash("Cannot find status style file", {
            name: config.name
        });
    }
    const syntax = syntaxFile.syntax;
    const c = parseStatusColors(syntax, palette);
    const info = {
        name: config.name,
        description: config.description,
        url: project.config.url,
        author: project.config.author,
        license: project.config.license,
        estiloVersion: __default
    };
    const context = Object.assign(c, {
        info
    });
    return await render(__default1.mustaches[brand + ".ejs"], context);
}
async function renderProject(project) {
    const { config: projectConfig  } = project;
    for (const config of projectConfig.colorschemes){
        const rendered = await renderColorscheme(config, project);
        writeScheme(rendered, config.name, project.projectUrl);
    }
    if (projectConfig.airline) {
        for (const config of projectConfig.airline){
            const rendered = await renderStatus(config, project, "airline");
            writeStatus("airline", rendered, config.name, project.projectUrl);
        }
    }
    if (projectConfig.lightline) {
        for (const config of projectConfig.lightline){
            const rendered = await renderStatus(config, project, "lightline");
            writeStatus("lightline", rendered, config.name, project.projectUrl);
        }
    }
    console.log(green("✓  Done, your theme is ready\n"));
}
const paths = {
    airline: "autoload/airline/themes",
    lightline: "autoload/lightline/colorscheme"
};
function writeScheme(txt, name, projectPath) {
    const folderPath = resolve5(projectPath, "colors");
    const filepath = resolve5(folderPath, name + ".vim");
    ensureDirSync(folderPath);
    Deno.writeTextFileSync(filepath, txt);
}
function writeStatus(kind, txt, name, projectPath) {
    const folderPath = resolve5(projectPath, paths[kind]);
    const filepath = resolve5(folderPath, name + ".vim");
    ensureDirSync(folderPath);
    Deno.writeTextFileSync(filepath, txt);
}
async function installStatus(projectPath, brand, styleName) {
    const statusFolderPath = resolve5(projectPath, "estilos", brand);
    ensureDirSync(statusFolderPath);
    if (styleName) {
        return addStatus(projectPath, brand, styleName);
    }
    const installedStyles = Array.from(Deno.readDirSync(statusFolderPath)).map((n)=>n.name.slice(0, -4)
    );
    const answers = await prompt([
        {
            type: Input,
            message: `Enter ${brand} style name:`,
            name: "stylename",
            validate: (input)=>{
                const stylename = input.trim();
                if (!stylename) return "That's not a name";
                return installedStyles.includes(stylename) ? "That style already exists" : true;
            }
        }, 
    ]);
    addStatus(projectPath, brand, answers.stylename);
}
function addStatus(projectPath, brand, styleName) {
    const folderPath = resolve5(projectPath, "estilos", brand);
    ensureDirSync(folderPath);
    const filepath = resolve5(folderPath, styleName + ".yml");
    Deno.writeTextFileSync(filepath, __default1.addons[brand + ".yml"]);
    console.log(green(`New ${brand} style: ${styleName}`));
    console.log(`==> ${filepath}`);
}
const estiloCommand = new Command();
const result1 = await estiloCommand.command("help", new HelpCommand().global()).reset().name("estilo").version(__default).description("Generate colorschemes for (neo)vim, airline and lightline").command("create [folder]").description("Initialize an estilo project in [folder] or current folder").option("-y, --yes", "Skip questions").action((options, folder = ".")=>{
    createProject(resolve5(folder), !!options.yes);
}).reset().command("render [folder]").description("Render project").action((_, folder = ".")=>{
    const projectPath = resolve5(folder);
    checkProject(projectPath);
    const project = loadProjectFiles(projectPath);
    renderProject(project);
}).reset().command("add-syntax").description("Add syntax templates.").option("-a, --all [all:boolean]", "Add add available syntax templates").action((options)=>{
    selectSyntax(".", !!options.all);
}).reset().command("add-lightline [styleName]").description("Add new Lightline style").action((_, styleName)=>{
    installStatus(".", "lightline", styleName);
}).reset().command("add-airline [styleName]").description("Add new Airline style").action((_, styleName)=>{
    installStatus(".", "airline", styleName);
}).reset().parse(Deno.args);
if (!Object.entries(result1.options).length && result1.cmd._name === "estilo") {
    estiloCommand.showHelp();
}
function checkProject(projectPath) {
    const paths = [
        "estilo.yml",
        "estilos/syntax",
        "estilos/palettes",
        "estilos/terminal.yml", 
    ];
    const notOk = paths.map((path)=>resolve5(projectPath, path)
    ).filter((path)=>!existsSync1(path)
    );
    if (notOk.length) {
        if (existsSync1(resolve5(projectPath, "estilo"))) {
            crash(`⚠ Wrong project folder. Follow upgrade instructions please`);
        } else {
            crash(`⚠ Wrong project folder. Missing paths:\n${notOk.join("\n")}`);
        }
    }
}
