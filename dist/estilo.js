// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const { Deno: Deno1 } = globalThis;
const noColor = typeof Deno1?.noColor === "boolean" ? Deno1.noColor : false;
let enabled = !noColor;
function setColorEnabled(value) {
    if (Deno1?.noColor) {
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
function brightBlue(str) {
    return run(str, code([
        94
    ], 39));
}
function brightMagenta(str) {
    return run(str, code([
        95
    ], 39));
}
const ANSI_PATTERN = new RegExp([
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"
].join("|"), "g");
function stripColor(string) {
    return string.replace(ANSI_PATTERN, "");
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
    for(let i = 1; i <= b.length; i++){
        for(let j = 1; j <= a.length; j++){
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
            }
        }
    }
    return matrix[b.length][a.length];
}
function paramCaseToCamelCase(str) {
    return str.replace(/-([a-z])/g, (g)=>g[1].toUpperCase());
}
function underscoreToCamelCase(str) {
    return str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase().replace(/_([a-z])/g, (g)=>g[1].toUpperCase());
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
        ]).flat().map((option)=>getFlag(option));
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
function matchWildCardOptions(name, flags) {
    for (const option of flags){
        if (option.name.indexOf("*") === -1) {
            continue;
        }
        let matched = matchWildCardOption(name, option);
        if (matched) {
            matched = {
                ...matched,
                name
            };
            flags.push(matched);
            return matched;
        }
    }
}
function matchWildCardOption(name, option) {
    const parts = option.name.split(".");
    const parts2 = name.split(".");
    if (parts.length !== parts2.length) {
        return false;
    }
    const count = Math.max(parts.length, parts2.length);
    for(let i = 0; i < count; i++){
        if (parts[i] !== parts2[i] && parts[i] !== "*") {
            return false;
        }
    }
    return option;
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
class UnknownRequiredOptionError extends FlagsError {
    constructor(option, options){
        super(`Unknown required option "${getFlag(option)}".${didYouMeanOption(option, options)}`);
        Object.setPrototypeOf(this, UnknownRequiredOptionError.prototype);
    }
}
class UnknownConflictingOptionError extends FlagsError {
    constructor(option, options){
        super(`Unknown conflicting option "${getFlag(option)}".${didYouMeanOption(option, options)}`);
        Object.setPrototypeOf(this, UnknownConflictingOptionError.prototype);
    }
}
class UnknownTypeError extends FlagsError {
    constructor(type, types){
        super(`Unknown type "${type}".${didYouMeanType(type, types)}`);
        Object.setPrototypeOf(this, UnknownTypeError.prototype);
    }
}
class ValidationError extends FlagsError {
    constructor(message){
        super(message);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
class DuplicateOptionError extends ValidationError {
    constructor(name){
        super(`Option "${getFlag(name).replace(/^--no-/, "--")}" can only occur once, but was found several times.`);
        Object.setPrototypeOf(this, DuplicateOptionError.prototype);
    }
}
class InvalidOptionError extends ValidationError {
    constructor(option, options){
        super(`Invalid option "${getFlag(option)}".${didYouMeanOption(option, options)}`);
        Object.setPrototypeOf(this, InvalidOptionError.prototype);
    }
}
class UnknownOptionError extends ValidationError {
    constructor(option, options){
        super(`Unknown option "${getFlag(option)}".${didYouMeanOption(option, options)}`);
        Object.setPrototypeOf(this, UnknownOptionError.prototype);
    }
}
class MissingOptionValueError extends ValidationError {
    constructor(option){
        super(`Missing value for option "${getFlag(option)}".`);
        Object.setPrototypeOf(this, MissingOptionValueError.prototype);
    }
}
class InvalidOptionValueError extends ValidationError {
    constructor(option, expected, value){
        super(`Option "${getFlag(option)}" must be of type "${expected}", but got "${value}".`);
        Object.setPrototypeOf(this, InvalidOptionValueError.prototype);
    }
}
class UnexpectedOptionValueError extends ValidationError {
    constructor(option, value){
        super(`Option "${getFlag(option)}" doesn't take a value, but got "${value}".`);
        Object.setPrototypeOf(this, InvalidOptionValueError.prototype);
    }
}
class OptionNotCombinableError extends ValidationError {
    constructor(option){
        super(`Option "${getFlag(option)}" cannot be combined with other options.`);
        Object.setPrototypeOf(this, OptionNotCombinableError.prototype);
    }
}
class ConflictingOptionError extends ValidationError {
    constructor(option, conflictingOption){
        super(`Option "${getFlag(option)}" conflicts with option "${getFlag(conflictingOption)}".`);
        Object.setPrototypeOf(this, ConflictingOptionError.prototype);
    }
}
class DependingOptionError extends ValidationError {
    constructor(option, dependingOption){
        super(`Option "${getFlag(option)}" depends on option "${getFlag(dependingOption)}".`);
        Object.setPrototypeOf(this, DependingOptionError.prototype);
    }
}
class MissingRequiredOptionError extends ValidationError {
    constructor(option){
        super(`Missing required option "${getFlag(option)}".`);
        Object.setPrototypeOf(this, MissingRequiredOptionError.prototype);
    }
}
class UnexpectedRequiredArgumentError extends ValidationError {
    constructor(arg){
        super(`An required argument cannot follow an optional argument, but "${arg}"  is defined as required.`);
        Object.setPrototypeOf(this, UnexpectedRequiredArgumentError.prototype);
    }
}
class UnexpectedArgumentAfterVariadicArgumentError extends ValidationError {
    constructor(arg){
        super(`An argument cannot follow an variadic argument, but got "${arg}".`);
        Object.setPrototypeOf(this, UnexpectedArgumentAfterVariadicArgumentError.prototype);
    }
}
class InvalidTypeError extends ValidationError {
    constructor({ label, name, value, type }, expected){
        super(`${label} "${name}" must be of type "${type}", but got "${value}".` + (expected ? ` Expected values: ${expected.map((value)=>`"${value}"`).join(", ")}` : ""));
        Object.setPrototypeOf(this, MissingOptionValueError.prototype);
    }
}
var OptionType;
(function(OptionType) {
    OptionType["STRING"] = "string";
    OptionType["NUMBER"] = "number";
    OptionType["INTEGER"] = "integer";
    OptionType["BOOLEAN"] = "boolean";
})(OptionType || (OptionType = {}));
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
    throw new InvalidTypeError(type, [
        "true",
        "false",
        "1",
        "0"
    ]);
};
const number = (type)=>{
    const value = Number(type.value);
    if (Number.isFinite(value)) {
        return value;
    }
    throw new InvalidTypeError(type);
};
const string = ({ value })=>{
    return value;
};
function validateFlags(ctx, opts, options = new Map()) {
    if (!opts.flags) {
        return;
    }
    setDefaultValues(ctx, opts);
    const optionNames = Object.keys(ctx.flags);
    if (!optionNames.length && opts.allowEmpty) {
        return;
    }
    if (ctx.standalone) {
        validateStandaloneOption(ctx, options, optionNames);
        return;
    }
    for (const [name, option] of options){
        validateUnknownOption(option, opts);
        validateConflictingOptions(ctx, option);
        validateDependingOptions(ctx, option);
        validateRequiredValues(ctx, option, name);
    }
    validateRequiredOptions(ctx, options, opts);
}
function validateUnknownOption(option, opts) {
    if (!getOption(opts.flags ?? [], option.name)) {
        throw new UnknownOptionError(option.name, opts.flags ?? []);
    }
}
function setDefaultValues(ctx, opts) {
    if (!opts.flags?.length) {
        return;
    }
    for (const option of opts.flags){
        let name;
        let defaultValue = undefined;
        if (option.name.startsWith("no-")) {
            const propName = option.name.replace(/^no-/, "");
            if (typeof ctx.flags[propName] !== "undefined") {
                continue;
            }
            const positiveOption = getOption(opts.flags, propName);
            if (positiveOption) {
                continue;
            }
            name = paramCaseToCamelCase(propName);
            defaultValue = true;
        }
        if (!name) {
            name = paramCaseToCamelCase(option.name);
        }
        const hasDefaultValue = (!opts.ignoreDefaults || typeof opts.ignoreDefaults[name] === "undefined") && typeof ctx.flags[name] === "undefined" && (typeof option.default !== "undefined" || typeof defaultValue !== "undefined");
        if (hasDefaultValue) {
            ctx.flags[name] = getDefaultValue(option) ?? defaultValue;
            ctx.defaults[option.name] = true;
            if (typeof option.value === "function") {
                ctx.flags[name] = option.value(ctx.flags[name]);
            }
        }
    }
}
function validateStandaloneOption(ctx, options, optionNames) {
    if (!ctx.standalone || optionNames.length === 1) {
        return;
    }
    for (const [_, opt] of options){
        if (!ctx.defaults[opt.name] && opt !== ctx.standalone) {
            throw new OptionNotCombinableError(ctx.standalone.name);
        }
    }
}
function validateConflictingOptions(ctx, option) {
    if (!option.conflicts?.length) {
        return;
    }
    for (const flag of option.conflicts){
        if (isset(flag, ctx.flags)) {
            throw new ConflictingOptionError(option.name, flag);
        }
    }
}
function validateDependingOptions(ctx, option) {
    if (!option.depends) {
        return;
    }
    for (const flag of option.depends){
        if (!isset(flag, ctx.flags) && !ctx.defaults[option.name]) {
            throw new DependingOptionError(option.name, flag);
        }
    }
}
function validateRequiredValues(ctx, option, name) {
    if (!option.args) {
        return;
    }
    const isArray = option.args.length > 1;
    for(let i = 0; i < option.args.length; i++){
        const arg = option.args[i];
        if (arg.optional) {
            continue;
        }
        const hasValue = isArray ? typeof ctx.flags[name][i] !== "undefined" : typeof ctx.flags[name] !== "undefined";
        if (!hasValue) {
            throw new MissingOptionValueError(option.name);
        }
    }
}
function validateRequiredOptions(ctx, options, opts) {
    if (!opts.flags?.length) {
        return;
    }
    const optionsValues = [
        ...options.values()
    ];
    for (const option of opts.flags){
        if (!option.required || paramCaseToCamelCase(option.name) in ctx.flags) {
            continue;
        }
        const conflicts = option.conflicts ?? [];
        const hasConflict = conflicts.find((flag)=>!!ctx.flags[flag]);
        const hasConflicts = hasConflict || optionsValues.find((opt)=>opt.conflicts?.find((flag)=>flag === option.name));
        if (hasConflicts) {
            continue;
        }
        throw new MissingRequiredOptionError(option.name);
    }
}
function isset(flagName, flags) {
    const name = paramCaseToCamelCase(flagName);
    return typeof flags[name] !== "undefined";
}
const integer = (type)=>{
    const value = Number(type.value);
    if (Number.isInteger(value)) {
        return value;
    }
    throw new InvalidTypeError(type);
};
const DefaultTypes = {
    string,
    number,
    integer,
    boolean: __boolean
};
function parseFlags(argsOrCtx, opts = {}) {
    let args;
    let ctx;
    if (Array.isArray(argsOrCtx)) {
        ctx = {};
        args = argsOrCtx;
    } else {
        ctx = argsOrCtx;
        args = argsOrCtx.unknown;
        argsOrCtx.unknown = [];
    }
    args = args.slice();
    ctx.flags ??= {};
    ctx.literal ??= [];
    ctx.unknown ??= [];
    ctx.stopEarly = false;
    ctx.stopOnUnknown = false;
    ctx.defaults ??= {};
    opts.dotted ??= true;
    validateOptions(opts);
    const options = parseArgs(ctx, args, opts);
    validateFlags(ctx, opts, options);
    if (opts.dotted) {
        parseDottedOptions(ctx);
    }
    return ctx;
}
function validateOptions(opts) {
    opts.flags?.forEach((opt)=>{
        opt.depends?.forEach((flag)=>{
            if (!opts.flags || !getOption(opts.flags, flag)) {
                throw new UnknownRequiredOptionError(flag, opts.flags ?? []);
            }
        });
        opt.conflicts?.forEach((flag)=>{
            if (!opts.flags || !getOption(opts.flags, flag)) {
                throw new UnknownConflictingOptionError(flag, opts.flags ?? []);
            }
        });
    });
}
function parseArgs(ctx, args, opts) {
    const optionsMap = new Map();
    let inLiteral = false;
    for(let argsIndex = 0; argsIndex < args.length; argsIndex++){
        let option;
        let current = args[argsIndex];
        let currentValue;
        let negate = false;
        if (inLiteral) {
            ctx.literal.push(current);
            continue;
        } else if (current === "--") {
            inLiteral = true;
            continue;
        } else if (ctx.stopEarly || ctx.stopOnUnknown) {
            ctx.unknown.push(current);
            continue;
        }
        const isFlag = current.length > 1 && current[0] === "-";
        if (!isFlag) {
            if (opts.stopEarly) {
                ctx.stopEarly = true;
            }
            ctx.unknown.push(current);
            continue;
        }
        const isShort = current[1] !== "-";
        const isLong = isShort ? false : current.length > 3 && current[2] !== "-";
        if (!isShort && !isLong) {
            throw new InvalidOptionError(current, opts.flags ?? []);
        }
        if (isShort && current.length > 2 && current[2] !== ".") {
            args.splice(argsIndex, 1, ...splitFlags(current));
            current = args[argsIndex];
        } else if (isLong && current.startsWith("--no-")) {
            negate = true;
        }
        const equalSignIndex = current.indexOf("=");
        if (equalSignIndex !== -1) {
            currentValue = current.slice(equalSignIndex + 1) || undefined;
            current = current.slice(0, equalSignIndex);
        }
        if (opts.flags) {
            option = getOption(opts.flags, current);
            if (!option) {
                const name = current.replace(/^-+/, "");
                option = matchWildCardOptions(name, opts.flags);
                if (!option) {
                    if (opts.stopOnUnknown) {
                        ctx.stopOnUnknown = true;
                        ctx.unknown.push(args[argsIndex]);
                        continue;
                    }
                    throw new UnknownOptionError(current, opts.flags);
                }
            }
        } else {
            option = {
                name: current.replace(/^-+/, ""),
                optionalValue: true,
                type: OptionType.STRING
            };
        }
        if (option.standalone) {
            ctx.standalone = option;
        }
        const positiveName = negate ? option.name.replace(/^no-?/, "") : option.name;
        const propName = paramCaseToCamelCase(positiveName);
        if (typeof ctx.flags[propName] !== "undefined") {
            if (!opts.flags?.length) {
                option.collect = true;
            } else if (!option.collect && !ctx.defaults[option.name]) {
                throw new DuplicateOptionError(current);
            }
        }
        if (option.type && !option.args?.length) {
            option.args = [
                {
                    type: option.type,
                    optional: option.optionalValue,
                    variadic: option.variadic,
                    list: option.list,
                    separator: option.separator
                }
            ];
        }
        if (opts.flags?.length && !option.args?.length && typeof currentValue !== "undefined") {
            throw new UnexpectedOptionValueError(option.name, currentValue);
        }
        let optionArgsIndex = 0;
        let inOptionalArg = false;
        const next = ()=>currentValue ?? args[argsIndex + 1];
        const previous = ctx.flags[propName];
        parseNext(option);
        if (typeof ctx.flags[propName] === "undefined") {
            if (option.args?.length && !option.args?.[optionArgsIndex].optional) {
                throw new MissingOptionValueError(option.name);
            } else if (typeof option.default !== "undefined" && (option.type || option.value || option.args?.length)) {
                ctx.flags[propName] = getDefaultValue(option);
            } else {
                setFlagValue(true);
            }
        }
        if (option.value) {
            const value = option.value(ctx.flags[propName], previous);
            setFlagValue(value);
        } else if (option.collect) {
            const value = typeof previous !== "undefined" ? Array.isArray(previous) ? previous : [
                previous
            ] : [];
            value.push(ctx.flags[propName]);
            setFlagValue(value);
        }
        optionsMap.set(propName, option);
        opts.option?.(option, ctx.flags[propName]);
        function parseNext(option) {
            if (negate) {
                setFlagValue(false);
                return;
            } else if (!option.args?.length) {
                setFlagValue(undefined);
                return;
            }
            const arg = option.args[optionArgsIndex];
            if (!arg) {
                const flag = next();
                throw new UnknownOptionError(flag, opts.flags ?? []);
            }
            if (!arg.type) {
                arg.type = OptionType.BOOLEAN;
            }
            if (!option.args?.length && arg.type === OptionType.BOOLEAN && arg.optional === undefined) {
                arg.optional = true;
            }
            if (arg.optional) {
                inOptionalArg = true;
            } else if (inOptionalArg) {
                throw new UnexpectedRequiredArgumentError(option.name);
            }
            let result;
            let increase = false;
            if (arg.list && hasNext(arg)) {
                const parsed = next().split(arg.separator || ",").map((nextValue)=>{
                    const value = parseValue(option, arg, nextValue);
                    if (typeof value === "undefined") {
                        throw new InvalidOptionValueError(option.name, arg.type ?? "?", nextValue);
                    }
                    return value;
                });
                if (parsed?.length) {
                    result = parsed;
                }
            } else {
                if (hasNext(arg)) {
                    result = parseValue(option, arg, next());
                } else if (arg.optional && arg.type === OptionType.BOOLEAN) {
                    result = true;
                }
            }
            if (increase && typeof currentValue === "undefined") {
                argsIndex++;
                if (!arg.variadic) {
                    optionArgsIndex++;
                } else if (option.args[optionArgsIndex + 1]) {
                    throw new UnexpectedArgumentAfterVariadicArgumentError(next());
                }
            }
            if (typeof result !== "undefined" && (option.args.length > 1 || arg.variadic)) {
                if (!ctx.flags[propName]) {
                    setFlagValue([]);
                }
                ctx.flags[propName].push(result);
                if (hasNext(arg)) {
                    parseNext(option);
                }
            } else {
                setFlagValue(result);
            }
            function hasNext(arg) {
                if (!option.args?.length) {
                    return false;
                }
                const nextValue = currentValue ?? args[argsIndex + 1];
                if (!nextValue) {
                    return false;
                }
                if (option.args.length > 1 && optionArgsIndex >= option.args.length) {
                    return false;
                }
                if (!arg.optional) {
                    return true;
                }
                if (option.equalsSign && arg.optional && !arg.variadic && typeof currentValue === "undefined") {
                    return false;
                }
                if (arg.optional || arg.variadic) {
                    return nextValue[0] !== "-" || typeof currentValue !== "undefined" || arg.type === OptionType.NUMBER && !isNaN(Number(nextValue));
                }
                return false;
            }
            function parseValue(option, arg, value) {
                const result = opts.parse ? opts.parse({
                    label: "Option",
                    type: arg.type || OptionType.STRING,
                    name: `--${option.name}`,
                    value
                }) : parseDefaultType(option, arg, value);
                if (typeof result !== "undefined") {
                    increase = true;
                }
                return result;
            }
        }
        function setFlagValue(value) {
            ctx.flags[propName] = value;
            if (ctx.defaults[propName]) {
                delete ctx.defaults[propName];
            }
        }
    }
    return optionsMap;
}
function parseDottedOptions(ctx) {
    ctx.flags = Object.keys(ctx.flags).reduce((result, key)=>{
        if (~key.indexOf(".")) {
            key.split(".").reduce((result, subKey, index, parts)=>{
                if (index === parts.length - 1) {
                    result[subKey] = ctx.flags[key];
                } else {
                    result[subKey] = result[subKey] ?? {};
                }
                return result[subKey];
            }, result);
        } else {
            result[key] = ctx.flags[key];
        }
        return result;
    }, {});
}
function splitFlags(flag) {
    flag = flag.slice(1);
    const normalized = [];
    const index = flag.indexOf("=");
    const flags = (index !== -1 ? flag.slice(0, index) : flag).split("");
    if (isNaN(Number(flag[flag.length - 1]))) {
        flags.forEach((val)=>normalized.push(`-${val}`));
    } else {
        normalized.push(`-${flags.shift()}`);
        if (flags.length) {
            normalized.push(flags.join(""));
        }
    }
    if (index !== -1) {
        normalized[normalized.length - 1] += flag.slice(index);
    }
    return normalized;
}
function parseDefaultType(option, arg, value) {
    const type = arg.type || OptionType.STRING;
    const parseType = DefaultTypes[type];
    if (!parseType) {
        throw new UnknownTypeError(type, Object.keys(DefaultTypes));
    }
    return parseType({
        label: "Option",
        type,
        name: `--${option.name}`,
        value
    });
}
function didYouMeanCommand(command, commands, excludes = []) {
    const commandNames = commands.map((command)=>command.getName()).filter((command)=>!excludes.includes(command));
    return didYouMean(" Did you mean command", command, commandNames);
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
        typeDefinition,
        equalsSign: args.includes("=")
    };
}
function parseArgumentsDefinition(argsDefinition, validate = true, all) {
    const argumentDetails = [];
    let hasOptional = false;
    let hasVariadic = false;
    const parts = argsDefinition.split(/ +/);
    for (const arg of parts){
        if (validate && hasVariadic) {
            throw new UnexpectedArgumentAfterVariadicArgumentError(arg);
        }
        const parts = arg.split(ARGUMENT_DETAILS_REGEX);
        if (!parts[1]) {
            if (all) {
                argumentDetails.push(parts[0]);
            }
            continue;
        }
        const type = parts[2] || OptionType.STRING;
        const details = {
            optional: arg[0] === "[",
            name: parts[1],
            action: parts[3] || type,
            variadic: false,
            list: type ? arg.indexOf(type + "[]") !== -1 : false,
            type
        };
        if (validate && !details.optional && hasOptional) {
            throw new UnexpectedRequiredArgumentError(details.name);
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
        argumentDetails.push(details);
    }
    return argumentDetails;
}
function dedent(str) {
    const lines = str.split(/\r?\n|\r/g);
    let text = "";
    let indent = 0;
    for (const line of lines){
        if (text || line.trim()) {
            if (!text) {
                text = line.trimStart();
                indent = line.length - text.length;
            } else {
                text += line.slice(indent);
            }
            text += "\n";
        }
    }
    return text.trimEnd();
}
function getDescription(description, __short) {
    return __short ? description.trim().split("\n", 1)[0].trim() : dedent(description);
}
class CommandError extends Error {
    constructor(message){
        super(message);
        Object.setPrototypeOf(this, CommandError.prototype);
    }
}
class ValidationError1 extends CommandError {
    exitCode;
    cmd;
    constructor(message, { exitCode } = {}){
        super(message);
        Object.setPrototypeOf(this, ValidationError1.prototype);
        this.exitCode = exitCode ?? 2;
    }
}
class DuplicateOptionNameError extends CommandError {
    constructor(optionName, commandName){
        super(`An option with name '${bold(getFlag(optionName))}' is already registered on command '${bold(commandName)}'. If it is intended to override the option, set the '${bold("override")}' option of the '${bold("option")}' method to true.`);
        Object.setPrototypeOf(this, DuplicateOptionNameError.prototype);
    }
}
class MissingCommandNameError extends CommandError {
    constructor(){
        super("Missing command name.");
        Object.setPrototypeOf(this, MissingCommandNameError.prototype);
    }
}
class DuplicateCommandNameError extends CommandError {
    constructor(name){
        super(`Duplicate command name "${name}".`);
        Object.setPrototypeOf(this, DuplicateCommandNameError.prototype);
    }
}
class DuplicateCommandAliasError extends CommandError {
    constructor(alias){
        super(`Duplicate command alias "${alias}".`);
        Object.setPrototypeOf(this, DuplicateCommandAliasError.prototype);
    }
}
class CommandNotFoundError extends CommandError {
    constructor(name, commands, excluded){
        super(`Unknown command "${name}".${didYouMeanCommand(name, commands, excluded)}`);
        Object.setPrototypeOf(this, CommandNotFoundError.prototype);
    }
}
class DuplicateTypeError extends CommandError {
    constructor(name){
        super(`Type with name "${name}" already exists.`);
        Object.setPrototypeOf(this, DuplicateTypeError.prototype);
    }
}
class DuplicateCompletionError extends CommandError {
    constructor(name){
        super(`Completion with name "${name}" already exists.`);
        Object.setPrototypeOf(this, DuplicateCompletionError.prototype);
    }
}
class DuplicateExampleError extends CommandError {
    constructor(name){
        super(`Example with name "${name}" already exists.`);
        Object.setPrototypeOf(this, DuplicateExampleError.prototype);
    }
}
class DuplicateEnvVarError extends CommandError {
    constructor(name){
        super(`Environment variable with name "${name}" already exists.`);
        Object.setPrototypeOf(this, DuplicateEnvVarError.prototype);
    }
}
class MissingRequiredEnvVarError extends ValidationError1 {
    constructor(envVar){
        super(`Missing required environment variable "${envVar.names[0]}".`);
        Object.setPrototypeOf(this, MissingRequiredEnvVarError.prototype);
    }
}
class TooManyEnvVarValuesError extends CommandError {
    constructor(name){
        super(`An environment variable can only have one value, but "${name}" has more than one.`);
        Object.setPrototypeOf(this, TooManyEnvVarValuesError.prototype);
    }
}
class UnexpectedOptionalEnvVarValueError extends CommandError {
    constructor(name){
        super(`An environment variable cannot have an optional value, but "${name}" is defined as optional.`);
        Object.setPrototypeOf(this, UnexpectedOptionalEnvVarValueError.prototype);
    }
}
class UnexpectedVariadicEnvVarValueError extends CommandError {
    constructor(name){
        super(`An environment variable cannot have an variadic value, but "${name}" is defined as variadic.`);
        Object.setPrototypeOf(this, UnexpectedVariadicEnvVarValueError.prototype);
    }
}
class DefaultCommandNotFoundError extends CommandError {
    constructor(name, commands){
        super(`Default command "${name}" not found.${didYouMeanCommand(name, commands)}`);
        Object.setPrototypeOf(this, DefaultCommandNotFoundError.prototype);
    }
}
class CommandExecutableNotFoundError extends CommandError {
    constructor(name){
        super(`Command executable not found: ${name}`);
        Object.setPrototypeOf(this, CommandExecutableNotFoundError.prototype);
    }
}
class UnknownCommandError extends ValidationError1 {
    constructor(name, commands, excluded){
        super(`Unknown command "${name}".${didYouMeanCommand(name, commands, excluded)}`);
        Object.setPrototypeOf(this, UnknownCommandError.prototype);
    }
}
class NoArgumentsAllowedError extends ValidationError1 {
    constructor(name){
        super(`No arguments allowed for command "${name}".`);
        Object.setPrototypeOf(this, NoArgumentsAllowedError.prototype);
    }
}
class MissingArgumentsError extends ValidationError1 {
    constructor(names){
        super(`Missing argument(s): ${names.join(", ")}`);
        Object.setPrototypeOf(this, MissingArgumentsError.prototype);
    }
}
class MissingArgumentError extends ValidationError1 {
    constructor(name){
        super(`Missing argument: ${name}`);
        Object.setPrototypeOf(this, MissingArgumentError.prototype);
    }
}
class TooManyArgumentsError extends ValidationError1 {
    constructor(args){
        super(`Too many arguments: ${args.join(" ")}`);
        Object.setPrototypeOf(this, TooManyArgumentsError.prototype);
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
class StringType extends Type {
    parse(type) {
        return string(type);
    }
}
class FileType extends StringType {
    constructor(){
        super();
    }
}
class IntegerType extends Type {
    parse(type) {
        return integer(type);
    }
}
class NumberType extends Type {
    parse(type) {
        return number(type);
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
    options;
    get length() {
        return this.toString().length;
    }
    static from(value) {
        let cell;
        if (value instanceof Cell) {
            cell = new this(value.getValue());
            cell.options = {
                ...value.options
            };
        } else {
            cell = new this(value);
        }
        return cell;
    }
    constructor(value){
        this.value = value;
        this.options = {};
    }
    toString() {
        return this.value.toString();
    }
    getValue() {
        return this.value;
    }
    setValue(value) {
        this.value = value;
        return this;
    }
    clone(value) {
        return Cell.from(value ?? this);
    }
    border(enable = true, override = true) {
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
class Column {
    static from(options) {
        const opts = options instanceof Column ? options.opts : options;
        return new Column().options(opts);
    }
    opts = {};
    options(options) {
        Object.assign(this.opts, options);
        return this;
    }
    minWidth(width) {
        this.opts.minWidth = width;
        return this;
    }
    maxWidth(width) {
        this.opts.maxWidth = width;
        return this;
    }
    border(border = true) {
        this.opts.border = border;
        return this;
    }
    padding(padding) {
        this.opts.padding = padding;
        return this;
    }
    align(direction) {
        this.opts.align = direction;
        return this;
    }
    getMinWidth() {
        return this.opts.minWidth;
    }
    getMaxWidth() {
        return this.opts.maxWidth;
    }
    getBorder() {
        return this.opts.border;
    }
    getPadding() {
        return this.opts.padding;
    }
    getAlign() {
        return this.opts.align;
    }
}
const __default = JSON.parse("{\n  \"UNICODE_VERSION\": \"15.0.0\",\n  \"tables\": [\n    {\n      \"d\": \"AAECAwQFBgcICQoLDA0OAw8DDwkQCRESERIA\",\n      \"r\": \"AQEBAgEBAQEBAQEBAQEBBwEHAVABBwcBBwF4\"\n    },\n    {\n      \"d\": \"AAECAwQFBgcGCAYJCgsMDQ4PEAYREhMUBhUWFxgZGhscHR4fICEiIyIkJSYnKCkqJSssLS4vMDEyMzQ1Njc4OToGOzwKBj0GPj9AQUIGQwZEBkVGR0hJSktMTQZOBgoGT1BRUlNUVVZXWFkGWgZbBlxdXl1fYGFiY2RlZmdoBmlqBmsGAQZsBm1uO29wcXI7czt0dXZ3OwY7eHkGent8Bn0Gfn+AgYKDhIWGBoc7iAZdO4kGiosGAXGMBo0GjgaPBpAGkQaSBpMGlJUGlpcGmJmam5ydnp+gLgahLKIGo6SlpganqKmqqwasBq0Grq8GsLGyswa0BrUGtre4Brm6uwZHvAa9vga/wME7wjvDxAbFO8bHO8gGyQbKywbMzQbOBs/Q0QbSBr8GvgbT1AbUBtUG1gbXBtjZ2tsG3N0G3t/g4eLjO+Tl5ufoO+k76gbrBuztOwbu7/AGO+XxCgYKCwZd8g==\",\n      \"r\": \"AQEBAQEBAQEBAQEBAQEBAQEBAQMBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECBQEOAQEBAQEBAQEBAwEBAQEBAQEBAQIBAwEIAQEBAQEBAQEBAQEBAQIBAQEBAQEBAQEBAQEBAQEBDQEBBQEBAQEBAgEBAwEBAQEBAQEBAQEBbQHaAQEFAQEBBAECAQEBAQEBAQEBAwGuASFkCAELAQEBAQEBAQEHAQMBAQEaAQIBCAEFAQEBAQEBAQEBAQEBAQEBAQEBAQECAQEBAQIBAQEBAQEBAwEDAQEBAQEBAQUBAQEBAQEBBAEBAVIBAdkBARABAQFfARMBAYoBBAEBBQEmAUkBAQcBAQIBHgEBARUBAQEBAQUBAQcBDwEBARoBAgEBAQEBAQECAQEBAQEBAQEBAQEBAQEBAQMBBAEBAgEBAQEUfwEBAQIDAXj/AQ==\"\n    },\n    {\n      \"d\": \"AFUVAF3Xd3X/93//VXVVV9VX9V91f1/31X93XVXdVdVV9dVV/VVX1X9X/131VfXVVXV3V1VdVV1V1/1dV1X/3VUAVf3/3/9fVf3/3/9fVV1V/11VFQBQVQEAEEEQVQBQVQBAVFUVAFVUVQUAEAAUBFBVFVFVAEBVBQBUVRUAVVFVBRAAAVBVAVVQVQBVBQBAVUVUAQBUUQEAVQVVUVVUAVRVUVUFVUVBVVRBFRRQUVVQUVUBEFRRVQVVBQBRVRQBVFVRVUFVBVVFVVRVUVVUVQRUBQRQVUFVBVVFVVBVBVVQVRVUAVRVUVUFVVFVRVUFRFVRAEBVFQBAVVEAVFUAQFVQVRFRVQEAQAAEVQEAAQBUVUVVAQQAQVVQBVRVAVRVRUFVUVVRVaoAVQFVBVRVBVUFVQVVEABQVUUBAFVRVRUAVUFVUVVAFVRVRVUBVRUUVUUAQEQBAFQVABRVAEBVAFUEQFRFVRUAVVBVBVAQUFVFUBFQVQAFVUAABABUUVVUUFUVANd/X3//BUD3XdV1VQAEAFVXVdX9V1VXVQBUVdVdVdV1VX111VXVV9V//1X/X1VdVf9fVV9VdVdV1VX31dfVXXX9193/d1X/VV9VV3VVX//1VfVVXVVdVdVVdVWlVWlVqVaWVf/f/1X/Vf/1X1Xf/19V9VVf9df1X1X1X1XVVWlVfV31VVpVd1V3VapV33/fVZVVlVX1WVWlVelV+v/v//7/31Xv/6/77/tVWaVVVlVdVWaVmlX1/1WpVVZVlVWVVlVW+V9VFVBVAKqaqlWqWlWqVaoKoKpqqapqgapVqaqpqmqqVapqqv+qVqpqVRVAAFBVBVVQVUUVVUFVVFVQVQBQVRVVBQBQVRUAUFWqVkBVFQVQVVFVAUBBVRVVVFVUVQQUVAVRVVBVRVVRVFFVqlVFVQCqWlUAqmqqaqpVqlZVqmpVAV1VUVVUVQVAVQFBVQBVQBVVQVUAVRVUVQFVBQBUVQVQVVFVAEBVFFRVFVBVFUBBUUVVUVVAVRUAAQBUVRVVUFUFAEBVARRVFVAEVUVVFQBAVVRVBQBUAFRVAAVEVUVVFQBEFQRVBVBVEFRVUFUVAEARVFUVUQAQVQEFEABVFQBBVRVEFVUABVVUVQEAQFUVABRAVRVVAUABVQUAQFBVAEAAEFUFAAUABEFVAUBFEAAQVVARVRVUVVBVBUBVRFVUFQBQVQBUVQBAVRVVFUBVqlRVWlWqVapaVapWVaqpqmmqalVlVWpZVapVqlVBAFUAUABAVRVQVRUAQAEAVQVQVQVUVQBAFQBUVVFVVFUVAAEAVQBAABQAEARAVUVVAFUAQFUAQFVWVZVV/39V/1//X1X/76uq6v9XVWpVqlWqVlVaVapaVapWVamqmqqmqlWqapWqVapWqmqmqpaqWlWVaqpVZVVpVVZVlapVqlpVVmqpVapVlVZVqlZVqlVWVapqqpqqVapWqlZVqpqqWlWlqlWqVlWqVlVRVQD/Xw==\",\n      \"r\": \"CBcBCAEBAQEBAQEBAQECAQEBAQEBAQEBAQEBAQMBAQECAQEBAQEBAQEBAQEBBAEBGAEDAQwBAwEIAQEBAQEBAQgcCAEDAQEBAQEDAQEBDQEDEAELAQEBEQEKAQEBDgEBAgIBAQoBBQQBCAEBAQEBAQEHAQEHBgEWAQIBDQECAgEFAQECAgEKAQ0BAQIKAQ0BDQEBAQEBAQEBAgEHAQ4BAQEBAQQBBgEBDgEBAQEBAQcBAQIBAQEBBAEFAQEBDgEBAQEBAQECAQcBDwECAQwCDQEBAQEBAQECAQgBAQEEAQcBDQEBAQEBAQQBBwERAQEBARYBAQECAQEBGAECAQIBARIBBgEBDQECAQEBAQECAQgBAQEZAQEBAgYBAQEDAQECAQEBAQMBCBgIBwEMAQEGAQcBBwEQAQEBAQEBAgIBCgEBDQEIAQ0BAQEBAQEBBgEBDgEBAQEBAQEBAgEMBwEMAQwBAQEBCQECAwEHAQEBAQ0BAQEBDgIBBgEDAQEBAQEBAQMBAQEBAgEBAQEBAQEBCAEBAgEBAQEBAQkBCAgBAwECAQEBAgEBAQkBAQEBAwECAQMBAQIBBwEFAQEDAQYBAQEBAgEBAQEBAQEBAQECAgEDAQECBAIDAgIBBQEEAQEBAwEPAQEBCyIBCAEJAwQBAQIBAQEBAgECAQEBAQMBAQEBAwEBAQEBAQEBAQgBAQMDAgEBAwEEAQIBAQEBBAEBAQEBAQECAQEBAQEBAQEBAQEHAQQBAwEBAQcBAgUBBgECAQYBAQwBAQEUAQELCAYBFgMFAQYDAQoBAQMBARQBAQkBAQoBBgEVAwsBCgIPAQ0BGQEBAgEHARQBAwIBBgEBAQUBBgQBAgEJAQEBBQECAQMHAQELAQECCQEQAQECAgECAQsBDAEBAQEBCgEBAQsBAQEECQ4BCAQCAQEECAEEAQEFCAEPAQEEAQEPAQgBFAEBAQEBAQEKAQEJAQ8BEAEBEwEBAQIBCwEBDgENAwEKAQEBAQELAQEBAQECAQwBCAEBAQEBDgEDAQwBAQECAQEXAQEBAQEHAgEBBQEIAQEBAQEQAgEBBQEUAQEBAQEbAQEBAQEGARQBAQEBARkBAQEBCQEBAQEQAQIBDwEBARQBAQEBBwEBAQkBAQEBAQECAQEBCwECAQEVAQEBAQQBBQEBAQEOAQEBAQEBEgEBFgEBAgEMAQEBAQ8BAQMBFgEBDgEBBQEPAQETAQECAQMOAgUBCgIBGQEBAQEIAQMBBwEBAwECEwgBAQcLAQUBFwEBAQEDAQEBBwEBBAEBDg0BAQwBAQEDAQQBAQEDBAEBBAEBAQEBEAEPAQgBAQsBAQ4BEQEMAgEBBwEOAQEHAQEBAQQBBAEDCwECAQEBAwEBBggBAgEBAREBBQMKAQEBAwQCEQEBHgEPAQIBAQYEAQYBAwEUAQUMAQEBAQEBAQECAQEBAgEIAwEBBgsBAgEODAMBAgEBCwEBAQEBAwECAQECAQEBBwgPAQ==\"\n    }\n  ]\n}");
class AssertionError extends Error {
    name = "AssertionError";
    constructor(message){
        super(message);
    }
}
function assert(expr, msg = "") {
    if (!expr) {
        throw new AssertionError(msg);
    }
}
function runLengthDecode({ d, r }) {
    const data = atob(d);
    const runLengths = atob(r);
    let out = "";
    for (const [i, ch] of [
        ...runLengths
    ].entries()){
        out += data[i].repeat(ch.codePointAt(0));
    }
    return Uint8Array.from([
        ...out
    ].map((x)=>x.codePointAt(0)));
}
let tables = null;
function lookupWidth(cp) {
    if (!tables) tables = __default.tables.map(runLengthDecode);
    const t1Offset = tables[0][cp >> 13 & 0xff];
    const t2Offset = tables[1][128 * t1Offset + (cp >> 6 & 0x7f)];
    const packedWidths = tables[2][16 * t2Offset + (cp >> 2 & 0xf)];
    const width = packedWidths >> 2 * (cp & 0b11) & 0b11;
    return width === 3 ? 1 : width;
}
const cache = new Map();
function charWidth(ch) {
    if (cache.has(ch)) return cache.get(ch);
    const cp = ch.codePointAt(0);
    let v = null;
    if (cp < 0x7f) {
        v = cp >= 0x20 ? 1 : cp === 0 ? 0 : null;
    } else if (cp >= 0xa0) {
        v = lookupWidth(cp);
    } else {
        v = null;
    }
    cache.set(ch, v);
    return v;
}
function unicodeWidth(str) {
    return [
        ...str
    ].map((ch)=>charWidth(ch) ?? 0).reduce((a, b)=>a + b, 0);
}
const strLength = (str)=>{
    return unicodeWidth(stripColor(str));
};
function consumeWords(length, content) {
    let consumed = "";
    const words = content.split("\n")[0]?.split(/ /g);
    for(let i = 0; i < words.length; i++){
        const word = words[i];
        if (consumed) {
            const nextLength = strLength(word);
            const consumedLength = strLength(consumed);
            if (consumedLength + nextLength >= length) {
                break;
            }
        }
        consumed += (i > 0 ? " " : "") + word;
    }
    return consumed;
}
function longest(index, rows, maxWidth) {
    const cellLengths = rows.map((row)=>{
        const cell = row[index];
        const cellValue = cell instanceof Cell && cell.getColSpan() > 1 ? "" : cell?.toString() || "";
        return cellValue.split("\n").map((line)=>{
            const str = typeof maxWidth === "undefined" ? line : consumeWords(maxWidth, line);
            return strLength(str) || 0;
        });
    }).flat();
    return Math.max(...cellLengths);
}
class Row extends Array {
    options = {};
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
        const row = new Row(...this.map((cell)=>cell instanceof Cell ? cell.clone() : cell));
        row.options = {
            ...this.options
        };
        return row;
    }
    border(enable = true, override = true) {
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
        return this.getBorder() || this.some((cell)=>cell instanceof Cell && cell.getBorder());
    }
    getAlign() {
        return this.options.align ?? "left";
    }
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
        const rows = this.#getRows();
        const columns = Math.max(...rows.map((row)=>row.length));
        for(let rowIndex = 0; rowIndex < rows.length; rowIndex++){
            const row = rows[rowIndex];
            const length = row.length;
            if (length < columns) {
                const diff = columns - length;
                for(let i = 0; i < diff; i++){
                    row.push(this.createCell(null, row, rowIndex, length + i));
                }
            }
        }
        const padding = [];
        const width = [];
        for(let colIndex = 0; colIndex < columns; colIndex++){
            const column = this.options.columns.at(colIndex);
            const minColWidth = column?.getMinWidth() ?? (Array.isArray(this.options.minColWidth) ? this.options.minColWidth[colIndex] : this.options.minColWidth);
            const maxColWidth = column?.getMaxWidth() ?? (Array.isArray(this.options.maxColWidth) ? this.options.maxColWidth[colIndex] : this.options.maxColWidth);
            const colWidth = longest(colIndex, rows, maxColWidth);
            width[colIndex] = Math.min(maxColWidth, Math.max(minColWidth, colWidth));
            padding[colIndex] = column?.getPadding() ?? (Array.isArray(this.options.padding) ? this.options.padding[colIndex] : this.options.padding);
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
    #getRows() {
        const header = this.table.getHeader();
        const rows = header ? [
            header,
            ...this.table
        ] : this.table.slice();
        const hasSpan = rows.some((row)=>row.some((cell)=>cell instanceof Cell && (cell.getColSpan() > 1 || cell.getRowSpan() > 1)));
        if (hasSpan) {
            return this.spanRows(rows);
        }
        return rows.map((row, rowIndex)=>{
            const newRow = this.createRow(row);
            for(let colIndex = 0; colIndex < row.length; colIndex++){
                newRow[colIndex] = this.createCell(row[colIndex], newRow, rowIndex, colIndex);
            }
            return newRow;
        });
    }
    spanRows(rows) {
        const rowSpan = [];
        let colSpan = 1;
        let rowIndex = -1;
        while(true){
            rowIndex++;
            if (rowIndex === rows.length && rowSpan.every((span)=>span === 1)) {
                break;
            }
            const row = rows[rowIndex] = this.createRow(rows[rowIndex] || []);
            let colIndex = -1;
            while(true){
                colIndex++;
                if (colIndex === row.length && colIndex === rowSpan.length && colSpan === 1) {
                    break;
                }
                if (colSpan > 1) {
                    colSpan--;
                    rowSpan[colIndex] = rowSpan[colIndex - 1];
                    row.splice(colIndex, this.getDeleteCount(rows, rowIndex, colIndex), row[colIndex - 1]);
                    continue;
                }
                if (rowSpan[colIndex] > 1) {
                    rowSpan[colIndex]--;
                    rows[rowIndex].splice(colIndex, this.getDeleteCount(rows, rowIndex, colIndex), rows[rowIndex - 1][colIndex]);
                    continue;
                }
                const cell = row[colIndex] = this.createCell(row[colIndex] || null, row, rowIndex, colIndex);
                colSpan = cell.getColSpan();
                rowSpan[colIndex] = cell.getRowSpan();
            }
        }
        return rows;
    }
    getDeleteCount(rows, rowIndex, colIndex) {
        return colIndex <= rows[rowIndex].length - 1 && typeof rows[rowIndex][colIndex] === "undefined" ? 1 : 0;
    }
    createRow(row) {
        return Row.from(row).border(this.table.getBorder(), false).align(this.table.getAlign(), false);
    }
    createCell(cell, row, rowIndex, colIndex) {
        const column = this.options.columns.at(colIndex);
        const isHeaderRow = this.isHeaderRow(rowIndex);
        return Cell.from(cell ?? "").border((isHeaderRow ? null : column?.getBorder()) ?? row.getBorder(), false).align((isHeaderRow ? null : column?.getAlign()) ?? row.getAlign(), false);
    }
    isHeaderRow(rowIndex) {
        return rowIndex === 0 && this.table.getHeader() !== undefined;
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
        if (opts.rows.length > 1 && (rowIndex === 0 && opts.hasHeaderBorder || rowIndex < opts.rows.length - 1 && opts.hasBodyBorder)) {
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
        const { current, next } = this.renderCellValue(cell, maxLength);
        row[colIndex].setValue(next.getValue());
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
        const length = Math.min(maxLength, strLength(cell.toString()));
        let words = consumeWords(length, cell.toString());
        const breakWord = strLength(words) > length;
        if (breakWord) {
            words = words.slice(0, length);
        }
        const next = cell.toString().slice(words.length + (breakWord ? 0 : 1));
        const fillLength = maxLength - strLength(words);
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
        const hasColSpan = (cell)=>(cell?.getColSpan() ?? 1) > 1;
        const hasRowSpan = (cell)=>(cell?.getRowSpan() ?? 1) > 1;
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
        },
        columns: []
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
        this.body(rows.map((row)=>Object.values(row)));
        return this;
    }
    columns(columns) {
        this.options.columns = columns.map((column)=>column instanceof Column ? column : Column.from(column));
        return this;
    }
    column(index, column) {
        if (column instanceof Column) {
            this.options.columns[index] = column;
        } else if (this.options.columns[index]) {
            this.options.columns[index].options(column);
        } else {
            this.options.columns[index] = Column.from(column);
        }
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
        const table = new Table(...this.map((row)=>row instanceof Row ? row.clone() : Row.from(row).clone()));
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
        console.log(this.toString());
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
    border(enable = true, override = true) {
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
        return this.getBorder() || this.options.columns.some((column)=>column.getBorder()) || this.some((row)=>row instanceof Row ? row.hasBorder() : row.some((cell)=>cell instanceof Cell ? cell.getBorder() : false));
    }
    hasBorder() {
        return this.hasHeaderBorder() || this.hasBodyBorder();
    }
    getAlign() {
        return this.options.align ?? "left";
    }
    getColumns() {
        return this.options.columns;
    }
    getColumn(index) {
        return this.options.columns[index] ??= new Column();
    }
}
class HelpGenerator {
    cmd;
    indent;
    options;
    static generate(cmd, options) {
        return new HelpGenerator(cmd, options).generate();
    }
    constructor(cmd, options = {}){
        this.cmd = cmd;
        this.indent = 2;
        this.options = {
            types: false,
            hints: true,
            colors: true,
            long: false,
            ...options
        };
    }
    generate() {
        const areColorsEnabled = getColorEnabled();
        setColorEnabled(this.options.colors);
        const result = this.generateHeader() + this.generateMeta() + this.generateDescription() + this.generateOptions() + this.generateCommands() + this.generateEnvironmentVariables() + this.generateExamples();
        setColorEnabled(areColorsEnabled);
        return result;
    }
    generateHeader() {
        const usage = this.cmd.getUsage();
        const rows = [
            [
                bold("Usage:"),
                brightMagenta(this.cmd.getPath() + (usage ? " " + highlightArguments(usage, this.options.types) : ""))
            ]
        ];
        const version = this.cmd.getVersion();
        if (version) {
            rows.push([
                bold("Version:"),
                yellow(`${this.cmd.getVersion()}`)
            ]);
        }
        return "\n" + Table.from(rows).padding(1).toString() + "\n";
    }
    generateMeta() {
        const meta = Object.entries(this.cmd.getMeta());
        if (!meta.length) {
            return "";
        }
        const rows = [];
        for (const [name, value] of meta){
            rows.push([
                bold(`${name}: `) + value
            ]);
        }
        return "\n" + Table.from(rows).padding(1).toString() + "\n";
    }
    generateDescription() {
        if (!this.cmd.getDescription()) {
            return "";
        }
        return this.label("Description") + Table.from([
            [
                dedent(this.cmd.getDescription())
            ]
        ]).indent(this.indent).maxColWidth(140).padding(1).toString() + "\n";
    }
    generateOptions() {
        const options = this.cmd.getOptions(false);
        if (!options.length) {
            return "";
        }
        let groups = [];
        const hasGroups = options.some((option)=>option.groupName);
        if (hasGroups) {
            for (const option of options){
                let group = groups.find((group)=>group.name === option.groupName);
                if (!group) {
                    group = {
                        name: option.groupName,
                        options: []
                    };
                    groups.push(group);
                }
                group.options.push(option);
            }
        } else {
            groups = [
                {
                    name: "Options",
                    options
                }
            ];
        }
        let result = "";
        for (const group of groups){
            result += this.generateOptionGroup(group);
        }
        return result;
    }
    generateOptionGroup(group) {
        if (!group.options.length) {
            return "";
        }
        const hasTypeDefinitions = !!group.options.find((option)=>!!option.typeDefinition);
        if (hasTypeDefinitions) {
            return this.label(group.name ?? "Options") + Table.from([
                ...group.options.map((option)=>[
                        option.flags.map((flag)=>brightBlue(flag)).join(", "),
                        highlightArguments(option.typeDefinition || "", this.options.types),
                        red(bold("-")),
                        getDescription(option.description, !this.options.long),
                        this.generateHints(option)
                    ])
            ]).padding([
                2,
                2,
                1,
                2
            ]).indent(this.indent).maxColWidth([
                60,
                60,
                1,
                80,
                60
            ]).toString() + "\n";
        }
        return this.label(group.name ?? "Options") + Table.from([
            ...group.options.map((option)=>[
                    option.flags.map((flag)=>brightBlue(flag)).join(", "),
                    red(bold("-")),
                    getDescription(option.description, !this.options.long),
                    this.generateHints(option)
                ])
        ]).indent(this.indent).maxColWidth([
            60,
            1,
            80,
            60
        ]).padding([
            2,
            1,
            2
        ]).toString() + "\n";
    }
    generateCommands() {
        const commands = this.cmd.getCommands(false);
        if (!commands.length) {
            return "";
        }
        const hasTypeDefinitions = !!commands.find((command)=>!!command.getArgsDefinition());
        if (hasTypeDefinitions) {
            return this.label("Commands") + Table.from([
                ...commands.map((command)=>[
                        [
                            command.getName(),
                            ...command.getAliases()
                        ].map((name)=>brightBlue(name)).join(", "),
                        highlightArguments(command.getArgsDefinition() || "", this.options.types),
                        red(bold("-")),
                        command.getShortDescription()
                    ])
            ]).indent(this.indent).maxColWidth([
                60,
                60,
                1,
                80
            ]).padding([
                2,
                2,
                1,
                2
            ]).toString() + "\n";
        }
        return this.label("Commands") + Table.from([
            ...commands.map((command)=>[
                    [
                        command.getName(),
                        ...command.getAliases()
                    ].map((name)=>brightBlue(name)).join(", "),
                    red(bold("-")),
                    command.getShortDescription()
                ])
        ]).maxColWidth([
            60,
            1,
            80
        ]).padding([
            2,
            1,
            2
        ]).indent(this.indent).toString() + "\n";
    }
    generateEnvironmentVariables() {
        const envVars = this.cmd.getEnvVars(false);
        if (!envVars.length) {
            return "";
        }
        return this.label("Environment variables") + Table.from([
            ...envVars.map((envVar)=>[
                    envVar.names.map((name)=>brightBlue(name)).join(", "),
                    highlightArgumentDetails(envVar.details, this.options.types),
                    red(bold("-")),
                    this.options.long ? dedent(envVar.description) : envVar.description.trim().split("\n", 1)[0],
                    envVar.required ? `(${yellow(`required`)})` : ""
                ])
        ]).padding([
            2,
            2,
            1,
            2
        ]).indent(this.indent).maxColWidth([
            60,
            60,
            1,
            80,
            10
        ]).toString() + "\n";
    }
    generateExamples() {
        const examples = this.cmd.getExamples();
        if (!examples.length) {
            return "";
        }
        return this.label("Examples") + Table.from(examples.map((example)=>[
                dim(bold(`${capitalize(example.name)}:`)),
                dedent(example.description)
            ])).padding(1).indent(this.indent).maxColWidth(150).toString() + "\n";
    }
    generateHints(option) {
        if (!this.options.hints) {
            return "";
        }
        const hints = [];
        option.required && hints.push(yellow(`required`));
        if (typeof option.default !== "undefined") {
            const defaultValue = getDefaultValue(option);
            if (typeof defaultValue !== "undefined") {
                hints.push(bold(`Default: `) + inspect(defaultValue, this.options.colors));
            }
        }
        option.depends?.length && hints.push(yellow(bold(`Depends: `)) + italic(option.depends.map(getFlag).join(", ")));
        option.conflicts?.length && hints.push(red(bold(`Conflicts: `)) + italic(option.conflicts.map(getFlag).join(", ")));
        const type = this.cmd.getType(option.args[0]?.type)?.handler;
        if (type instanceof Type) {
            const possibleValues = type.values?.(this.cmd, this.cmd.getParent());
            if (possibleValues?.length) {
                hints.push(bold(`Values: `) + possibleValues.map((value)=>inspect(value, this.options.colors)).join(", "));
            }
        }
        if (hints.length) {
            return `(${hints.join(", ")})`;
        }
        return "";
    }
    label(label) {
        return "\n" + bold(`${label}:`) + "\n\n";
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
    return parseArgumentsDefinition(argsDefinition, false, true).map((arg)=>typeof arg === "string" ? arg : highlightArgumentDetails(arg, types)).join(" ");
}
function highlightArgumentDetails(arg, types = true) {
    let str = "";
    str += yellow(arg.optional ? "[" : "<");
    let name = "";
    name += arg.name;
    if (arg.variadic) {
        name += "...";
    }
    name = brightMagenta(name);
    str += name;
    if (types) {
        str += yellow(":");
        str += red(arg.type);
        if (arg.list) {
            str += green("[]");
        }
    }
    str += yellow(arg.optional ? "]" : ">");
    return str;
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
    _usage;
    actionHandler;
    globalActionHandler;
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
    _allowEmpty = false;
    _stopEarly = false;
    defaultCommand;
    _useRawArgs = false;
    args = [];
    isHidden = false;
    isGlobal = false;
    hasDefaults = false;
    _versionOptions;
    _helpOptions;
    _versionOption;
    _helpOption;
    _help;
    _shouldExit;
    _meta = {};
    _groupName = null;
    _noGlobals = false;
    errorHandler;
    versionOption(flags, desc, opts) {
        this._versionOptions = flags === false ? flags : {
            flags,
            desc,
            opts: typeof opts === "function" ? {
                action: opts
            } : opts
        };
        return this;
    }
    helpOption(flags, desc, opts) {
        this._helpOptions = flags === false ? flags : {
            flags,
            desc,
            opts: typeof opts === "function" ? {
                action: opts
            } : opts
        };
        return this;
    }
    command(nameAndArguments, cmdOrDescription, override) {
        this.reset();
        const result = splitArguments(nameAndArguments);
        const name = result.flags.shift();
        const aliases = result.flags;
        if (!name) {
            throw new MissingCommandNameError();
        }
        if (this.getBaseCommand(name, true)) {
            if (!override) {
                throw new DuplicateCommandNameError(name);
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
        aliases.forEach((alias)=>cmd.alias(alias));
        this.commands.set(name, cmd);
        this.select(name);
        return this;
    }
    alias(alias) {
        if (this.cmd._name === alias || this.cmd.aliases.includes(alias)) {
            throw new DuplicateCommandAliasError(alias);
        }
        this.cmd.aliases.push(alias);
        return this;
    }
    reset() {
        this._groupName = null;
        this.cmd = this;
        return this;
    }
    select(name) {
        const cmd = this.getBaseCommand(name, true);
        if (!cmd) {
            throw new CommandNotFoundError(name, this.getBaseCommands(true));
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
            this.cmd.ver = ()=>version;
        } else if (typeof version === "function") {
            this.cmd.ver = version;
        }
        return this;
    }
    meta(name, value) {
        this.cmd._meta[name] = value;
        return this;
    }
    getMeta(name) {
        return typeof name === "undefined" ? this._meta : this._meta[name];
    }
    help(help) {
        if (typeof help === "string") {
            this.cmd._help = ()=>help;
        } else if (typeof help === "function") {
            this.cmd._help = help;
        } else {
            this.cmd._help = (cmd, options)=>HelpGenerator.generate(cmd, {
                    ...help,
                    ...options
                });
        }
        return this;
    }
    description(description) {
        this.cmd.desc = description;
        return this;
    }
    usage(usage) {
        this.cmd._usage = usage;
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
        this.cmd.actionHandler = fn;
        return this;
    }
    globalAction(fn) {
        this.cmd.globalActionHandler = fn;
        return this;
    }
    allowEmpty(allowEmpty) {
        this.cmd._allowEmpty = allowEmpty !== false;
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
    globalType(name, handler, options) {
        return this.type(name, handler, {
            ...options,
            global: true
        });
    }
    type(name, handler, options) {
        if (this.cmd.types.get(name) && !options?.override) {
            throw new DuplicateTypeError(name);
        }
        this.cmd.types.set(name, {
            ...options,
            name,
            handler: handler
        });
        if (handler instanceof Type && (typeof handler.complete !== "undefined" || typeof handler.values !== "undefined")) {
            const completeHandler = (cmd, parent)=>handler.complete?.(cmd, parent) || [];
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
            throw new DuplicateCompletionError(name);
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
    error(handler) {
        this.cmd.errorHandler = handler;
        return this;
    }
    getErrorHandler() {
        return this.errorHandler ?? this._parent?.errorHandler;
    }
    noExit() {
        this.cmd._shouldExit = false;
        this.throwErrors();
        return this;
    }
    noGlobals() {
        this.cmd._noGlobals = true;
        return this;
    }
    shouldThrowErrors() {
        return this.throwOnError || !!this._parent?.shouldThrowErrors();
    }
    shouldExit() {
        return this._shouldExit ?? this._parent?.shouldExit() ?? true;
    }
    group(name) {
        this.cmd._groupName = name;
        return this;
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
            opts = {
                value: opts
            };
        }
        const result = splitArguments(flags);
        const args = result.typeDefinition ? parseArgumentsDefinition(result.typeDefinition) : [];
        const option = {
            ...opts,
            name: "",
            description: desc,
            args,
            flags: result.flags,
            equalsSign: result.equalsSign,
            typeDefinition: result.typeDefinition,
            groupName: this._groupName ?? undefined
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
                    throw new DuplicateOptionNameError(name, this.getPath());
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
            throw new DuplicateExampleError(name);
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
        if (result.flags.some((envName)=>this.cmd.getBaseEnvVar(envName, true))) {
            throw new DuplicateEnvVarError(name);
        }
        const details = parseArgumentsDefinition(result.typeDefinition);
        if (details.length > 1) {
            throw new TooManyEnvVarValuesError(name);
        } else if (details.length && details[0].optional) {
            throw new UnexpectedOptionalEnvVarValueError(name);
        } else if (details.length && details[0].variadic) {
            throw new UnexpectedVariadicEnvVarValueError(name);
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
    parse(args = Deno.args) {
        const ctx = {
            unknown: args.slice(),
            flags: {},
            env: {},
            literal: [],
            stopEarly: false,
            stopOnUnknown: false,
            defaults: {},
            actions: []
        };
        return this.parseCommand(ctx);
    }
    async parseCommand(ctx) {
        try {
            this.reset();
            this.registerDefaults();
            this.rawArgs = ctx.unknown.slice();
            if (this.isExecutable) {
                await this.executeExecutable(ctx.unknown);
                return {
                    options: {},
                    args: [],
                    cmd: this,
                    literal: []
                };
            } else if (this._useRawArgs) {
                await this.parseEnvVars(ctx, this.envVars);
                return await this.execute(ctx.env, ctx.unknown);
            }
            let preParseGlobals = false;
            let subCommand;
            if (ctx.unknown.length > 0) {
                subCommand = this.getSubCommand(ctx);
                if (!subCommand) {
                    const optionName = ctx.unknown[0].replace(/^-+/, "");
                    const option = this.getOption(optionName, true);
                    if (option?.global) {
                        preParseGlobals = true;
                        await this.parseGlobalOptionsAndEnvVars(ctx);
                    }
                }
            }
            if (subCommand || ctx.unknown.length > 0) {
                subCommand ??= this.getSubCommand(ctx);
                if (subCommand) {
                    subCommand._globalParent = this;
                    return subCommand.parseCommand(ctx);
                }
            }
            await this.parseOptionsAndEnvVars(ctx, preParseGlobals);
            const options = {
                ...ctx.env,
                ...ctx.flags
            };
            const args = this.parseArguments(ctx, options);
            this.literalArgs = ctx.literal;
            if (ctx.actions.length) {
                await Promise.all(ctx.actions.map((action)=>action.call(this, options, ...args)));
            }
            if (ctx.standalone) {
                return {
                    options,
                    args,
                    cmd: this,
                    literal: this.literalArgs
                };
            }
            return await this.execute(options, args);
        } catch (error) {
            this.handleError(error);
        }
    }
    getSubCommand(ctx) {
        const subCommand = this.getCommand(ctx.unknown[0], true);
        if (subCommand) {
            ctx.unknown.shift();
        }
        return subCommand;
    }
    async parseGlobalOptionsAndEnvVars(ctx) {
        const isHelpOption = this.getHelpOption()?.flags.includes(ctx.unknown[0]);
        const envVars = [
            ...this.envVars.filter((envVar)=>envVar.global),
            ...this.getGlobalEnvVars(true)
        ];
        await this.parseEnvVars(ctx, envVars, !isHelpOption);
        const options = [
            ...this.options.filter((option)=>option.global),
            ...this.getGlobalOptions(true)
        ];
        this.parseOptions(ctx, options, {
            stopEarly: true,
            stopOnUnknown: true,
            dotted: false
        });
    }
    async parseOptionsAndEnvVars(ctx, preParseGlobals) {
        const helpOption = this.getHelpOption();
        const isVersionOption = this._versionOption?.flags.includes(ctx.unknown[0]);
        const isHelpOption = helpOption && ctx.flags?.[helpOption.name] === true;
        const envVars = preParseGlobals ? this.envVars.filter((envVar)=>!envVar.global) : this.getEnvVars(true);
        await this.parseEnvVars(ctx, envVars, !isHelpOption && !isVersionOption);
        const options = this.getOptions(true);
        this.parseOptions(ctx, options);
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
        !this.types.has("file") && this.type("file", new FileType(), {
            global: true
        });
        if (!this._help) {
            this.help({});
        }
        if (this._versionOptions !== false && (this._versionOptions || this.ver)) {
            this.option(this._versionOptions?.flags || "-V, --version", this._versionOptions?.desc || "Show the version number for this program.", {
                standalone: true,
                prepend: true,
                action: async function() {
                    const __long = this.getRawArgs().includes(`--${this._versionOption?.name}`);
                    if (__long) {
                        await checkVersion(this);
                        this.showLongVersion();
                    } else {
                        this.showVersion();
                    }
                    this.exit();
                },
                ...this._versionOptions?.opts ?? {}
            });
            this._versionOption = this.options[0];
        }
        if (this._helpOptions !== false) {
            this.option(this._helpOptions?.flags || "-h, --help", this._helpOptions?.desc || "Show this help.", {
                standalone: true,
                global: true,
                prepend: true,
                action: async function() {
                    const __long = this.getRawArgs().includes(`--${this.getHelpOption()?.name}`);
                    await checkVersion(this);
                    this.showHelp({
                        long: __long
                    });
                    this.exit();
                },
                ...this._helpOptions?.opts ?? {}
            });
            this._helpOption = this.options[0];
        }
        return this;
    }
    async execute(options, args) {
        if (this.defaultCommand) {
            const cmd = this.getCommand(this.defaultCommand, true);
            if (!cmd) {
                throw new DefaultCommandNotFoundError(this.defaultCommand, this.getCommands());
            }
            cmd._globalParent = this;
            return cmd.execute(options, args);
        }
        await this.executeGlobalAction(options, args);
        if (this.actionHandler) {
            await this.actionHandler(options, ...args);
        }
        return {
            options,
            args,
            cmd: this,
            literal: this.literalArgs
        };
    }
    async executeGlobalAction(options, args) {
        if (!this._noGlobals) {
            await this._parent?.executeGlobalAction(options, args);
        }
        await this.globalActionHandler?.(options, ...args);
    }
    async executeExecutable(args) {
        const command = this.getPath().replace(/\s+/g, "-");
        await Deno.permissions.request({
            name: "run",
            command
        });
        try {
            const cmd = new Deno.Command(command, {
                args
            });
            const output = await cmd.output();
            if (!output.success) {
                Deno.exit(output.code);
            }
        } catch (error) {
            if (error instanceof Deno.errors.NotFound) {
                throw new CommandExecutableNotFoundError(command);
            }
            throw error;
        }
    }
    parseOptions(ctx, options, { stopEarly = this._stopEarly, stopOnUnknown = false, dotted = true } = {}) {
        parseFlags(ctx, {
            stopEarly,
            stopOnUnknown,
            dotted,
            allowEmpty: this._allowEmpty,
            flags: options,
            ignoreDefaults: ctx.env,
            parse: (type)=>this.parseType(type),
            option: (option)=>{
                if (option.action) {
                    ctx.actions.push(option.action);
                }
            }
        });
    }
    parseType(type) {
        const typeSettings = this.getType(type.type);
        if (!typeSettings) {
            throw new UnknownTypeError(type.type, this.getTypes().map((type)=>type.name));
        }
        return typeSettings.handler instanceof Type ? typeSettings.handler.parse(type) : typeSettings.handler(type);
    }
    async parseEnvVars(ctx, envVars, validate = true) {
        for (const envVar of envVars){
            const env = await this.findEnvVar(envVar.names);
            if (env) {
                const parseType = (value)=>{
                    return this.parseType({
                        label: "Environment variable",
                        type: envVar.type,
                        name: env.name,
                        value
                    });
                };
                const propertyName = underscoreToCamelCase(envVar.prefix ? envVar.names[0].replace(new RegExp(`^${envVar.prefix}`), "") : envVar.names[0]);
                if (envVar.details.list) {
                    ctx.env[propertyName] = env.value.split(envVar.details.separator ?? ",").map(parseType);
                } else {
                    ctx.env[propertyName] = parseType(env.value);
                }
                if (envVar.value && typeof ctx.env[propertyName] !== "undefined") {
                    ctx.env[propertyName] = envVar.value(ctx.env[propertyName]);
                }
            } else if (envVar.required && validate) {
                throw new MissingRequiredEnvVarError(envVar);
            }
        }
    }
    async findEnvVar(names) {
        for (const name of names){
            const status = await Deno.permissions.query({
                name: "env",
                variable: name
            });
            if (status.state === "granted") {
                const value = Deno.env.get(name);
                if (value) {
                    return {
                        name,
                        value
                    };
                }
            }
        }
        return undefined;
    }
    parseArguments(ctx, options) {
        const params = [];
        const args = ctx.unknown.slice();
        if (!this.hasArguments()) {
            if (args.length) {
                if (this.hasCommands(true)) {
                    if (this.hasCommand(args[0], true)) {
                        throw new TooManyArgumentsError(args);
                    } else {
                        throw new UnknownCommandError(args[0], this.getCommands());
                    }
                } else {
                    throw new NoArgumentsAllowedError(this.getPath());
                }
            }
        } else {
            if (!args.length) {
                const required = this.getArguments().filter((expectedArg)=>!expectedArg.optional).map((expectedArg)=>expectedArg.name);
                if (required.length) {
                    const optionNames = Object.keys(options);
                    const hasStandaloneOption = !!optionNames.find((name)=>this.getOption(name, true)?.standalone);
                    if (!hasStandaloneOption) {
                        throw new MissingArgumentsError(required);
                    }
                }
            } else {
                for (const expectedArg of this.getArguments()){
                    if (!args.length) {
                        if (expectedArg.optional) {
                            break;
                        }
                        throw new MissingArgumentError(expectedArg.name);
                    }
                    let arg;
                    const parseArgValue = (value)=>{
                        return expectedArg.list ? value.split(",").map((value)=>parseArgType(value)) : parseArgType(value);
                    };
                    const parseArgType = (value)=>{
                        return this.parseType({
                            label: "Argument",
                            type: expectedArg.type,
                            name: expectedArg.name,
                            value
                        });
                    };
                    if (expectedArg.variadic) {
                        arg = args.splice(0, args.length).map((value)=>parseArgValue(value));
                    } else {
                        arg = parseArgValue(args.shift());
                    }
                    if (expectedArg.variadic && Array.isArray(arg)) {
                        params.push(...arg);
                    } else if (typeof arg !== "undefined") {
                        params.push(arg);
                    }
                }
                if (args.length) {
                    throw new TooManyArgumentsError(args);
                }
            }
        }
        return params;
    }
    handleError(error) {
        this.throw(error instanceof ValidationError ? new ValidationError1(error.message) : error instanceof Error ? error : new Error(`[non-error-thrown] ${error}`));
    }
    throw(error) {
        if (error instanceof ValidationError1) {
            error.cmd = this;
        }
        this.getErrorHandler()?.(error, this);
        if (this.shouldThrowErrors() || !(error instanceof ValidationError1)) {
            throw error;
        }
        this.showHelp();
        console.error(red(`  ${bold("error")}: ${error.message}\n`));
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
    getPath(name) {
        return this._parent ? this._parent.getPath(name) + " " + this._name : name || this._name;
    }
    getArgsDefinition() {
        return this.argsDefinition;
    }
    getArgument(name) {
        return this.getArguments().find((arg)=>arg.name === name);
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
    getUsage() {
        return this._usage ?? [
            this.getArgsDefinition(),
            this.getRequiredOptionsDefinition()
        ].join(" ").trim();
    }
    getRequiredOptionsDefinition() {
        return this.getOptions().filter((option)=>option.required).map((option)=>[
                findFlag(option.flags),
                option.typeDefinition
            ].filter((v)=>v).join(" ").trim()).join(" ");
    }
    getShortDescription() {
        return getDescription(this.getDescription(), true);
    }
    getRawArgs() {
        return this.rawArgs;
    }
    getLiteralArgs() {
        return this.literalArgs;
    }
    showVersion() {
        console.log(this.getVersion());
    }
    getLongVersion() {
        return `${bold(this.getMainCommand().getName())} ${brightBlue(this.getVersion() ?? "")}` + Object.entries(this.getMeta()).map(([k, v])=>`\n${bold(k)} ${brightBlue(v)}`).join("");
    }
    showLongVersion() {
        console.log(this.getLongVersion());
    }
    showHelp(options) {
        console.log(this.getHelp(options));
    }
    getHelp(options) {
        this.registerDefaults();
        return this.getHelpHandler().call(this, this, options ?? {});
    }
    getHelpHandler() {
        return this._help ?? this._parent?.getHelpHandler();
    }
    exit(code = 0) {
        if (this.shouldExit()) {
            Deno.exit(code);
        }
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
        return hidden ? this.options.slice(0) : this.options.filter((opt)=>!opt.hidden);
    }
    getGlobalOptions(hidden) {
        const helpOption = this.getHelpOption();
        const getGlobals = (cmd, noGlobals, options = [], names = [])=>{
            if (cmd.options.length) {
                for (const option of cmd.options){
                    if (option.global && !this.options.find((opt)=>opt.name === option.name) && names.indexOf(option.name) === -1 && (hidden || !option.hidden)) {
                        if (noGlobals && option !== helpOption) {
                            continue;
                        }
                        names.push(option.name);
                        options.push(option);
                    }
                }
            }
            return cmd._parent ? getGlobals(cmd._parent, noGlobals || cmd._noGlobals, options, names) : options;
        };
        return this._parent ? getGlobals(this._parent, this._noGlobals) : [];
    }
    hasOption(name, hidden) {
        return !!this.getOption(name, hidden);
    }
    getOption(name, hidden) {
        return this.getBaseOption(name, hidden) ?? this.getGlobalOption(name, hidden);
    }
    getBaseOption(name, hidden) {
        const option = this.options.find((option)=>option.name === name || option.aliases?.includes(name));
        return option && (hidden || !option.hidden) ? option : undefined;
    }
    getGlobalOption(name, hidden) {
        const helpOption = this.getHelpOption();
        const getGlobalOption = (parent, noGlobals)=>{
            const option = parent.getBaseOption(name, hidden);
            if (!option?.global) {
                return parent._parent && getGlobalOption(parent._parent, noGlobals || parent._noGlobals);
            }
            if (noGlobals && option !== helpOption) {
                return;
            }
            return option;
        };
        return this._parent && getGlobalOption(this._parent, this._noGlobals);
    }
    removeOption(name) {
        const index = this.options.findIndex((option)=>option.name === name);
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
        return hidden ? commands : commands.filter((cmd)=>!cmd.isHidden);
    }
    getGlobalCommands(hidden) {
        const getCommands = (command, noGlobals, commands = [], names = [])=>{
            if (command.commands.size) {
                for (const [_, cmd] of command.commands){
                    if (cmd.isGlobal && this !== cmd && !this.commands.has(cmd._name) && names.indexOf(cmd._name) === -1 && (hidden || !cmd.isHidden)) {
                        if (noGlobals && cmd?.getName() !== "help") {
                            continue;
                        }
                        names.push(cmd._name);
                        commands.push(cmd);
                    }
                }
            }
            return command._parent ? getCommands(command._parent, noGlobals || command._noGlobals, commands, names) : commands;
        };
        return this._parent ? getCommands(this._parent, this._noGlobals) : [];
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
        const getGlobalCommand = (parent, noGlobals)=>{
            const cmd = parent.getBaseCommand(name, hidden);
            if (!cmd?.isGlobal) {
                return parent._parent && getGlobalCommand(parent._parent, noGlobals || parent._noGlobals);
            }
            if (noGlobals && cmd.getName() !== "help") {
                return;
            }
            return cmd;
        };
        return this._parent && getGlobalCommand(this._parent, this._noGlobals);
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
        return hidden ? this.envVars.slice(0) : this.envVars.filter((env)=>!env.hidden);
    }
    getGlobalEnvVars(hidden) {
        if (this._noGlobals) {
            return [];
        }
        const getEnvVars = (cmd, envVars = [], names = [])=>{
            if (cmd) {
                if (cmd.envVars.length) {
                    cmd.envVars.forEach((envVar)=>{
                        if (envVar.global && !this.envVars.find((env)=>env.names[0] === envVar.names[0]) && names.indexOf(envVar.names[0]) === -1 && (hidden || !envVar.hidden)) {
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
        const envVar = this.envVars.find((env)=>env.names.indexOf(name) !== -1);
        return envVar && (hidden || !envVar.hidden) ? envVar : undefined;
    }
    getGlobalEnvVar(name, hidden) {
        if (!this._parent || this._noGlobals) {
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
        return this.examples.find((example)=>example.name === name);
    }
    getHelpOption() {
        return this._helpOption ?? this._parent?.getHelpOption();
    }
}
async function checkVersion(cmd) {
    const mainCommand = cmd.getMainCommand();
    const upgradeCommand = mainCommand.getCommand("upgrade");
    if (!isUpgradeCommand(upgradeCommand)) {
        return;
    }
    const latestVersion = await upgradeCommand.getLatestVersion();
    const currentVersion = mainCommand.getVersion();
    if (currentVersion === latestVersion) {
        return;
    }
    const versionHelpText = `(New version available: ${latestVersion}. Run '${mainCommand.getName()} upgrade' to upgrade to the latest version!)`;
    mainCommand.version(`${currentVersion}  ${bold(yellow(versionHelpText))}`);
}
function findFlag(flags) {
    for (const flag of flags){
        if (flag.startsWith("--")) {
            return flag;
        }
    }
    return flags[0];
}
function isUpgradeCommand(command) {
    return command instanceof Command && "getLatestVersion" in command;
}
class CommandType extends StringType {
    complete(_cmd, parent) {
        return parent?.getCommands(false).map((cmd)=>cmd.getName()) || [];
    }
}
class HelpCommand extends Command {
    constructor(cmd){
        super();
        return this.type("command", new CommandType()).arguments("[command:command]").description("Show this help or the help of a sub-command.").noGlobals().action(async (_, name)=>{
            if (!cmd) {
                cmd = name ? this.getGlobalParent()?.getBaseCommand(name) : this.getGlobalParent();
            }
            if (!cmd) {
                const cmds = this.getGlobalParent()?.getCommands();
                throw new UnknownCommandError(name ?? "", cmds ?? [], [
                    this.getName(),
                    ...this.getAliases()
                ]);
            }
            await checkVersion(cmd);
            cmd.showHelp();
            if (this.shouldExit()) {
                Deno.exit(0);
            }
        });
    }
}
function assertPath(path) {
    if (typeof path !== "string") {
        throw new TypeError(`Path must be a string. Received ${JSON.stringify(path)}`);
    }
}
function stripSuffix(name, suffix) {
    if (suffix.length >= name.length) {
        return name;
    }
    const lenDiff = name.length - suffix.length;
    for(let i = suffix.length - 1; i >= 0; --i){
        if (name.charCodeAt(lenDiff + i) !== suffix.charCodeAt(i)) {
            return name;
        }
    }
    return name.slice(0, -suffix.length);
}
function lastPathSegment(path, isSep, start = 0) {
    let matchedNonSeparator = false;
    let end = path.length;
    for(let i = path.length - 1; i >= start; --i){
        if (isSep(path.charCodeAt(i))) {
            if (matchedNonSeparator) {
                start = i + 1;
                break;
            }
        } else if (!matchedNonSeparator) {
            matchedNonSeparator = true;
            end = i + 1;
        }
    }
    return path.slice(start, end);
}
function assertArgs(path, suffix) {
    assertPath(path);
    if (path.length === 0) return path;
    if (typeof suffix !== "string") {
        throw new TypeError(`Suffix must be a string. Received ${JSON.stringify(suffix)}`);
    }
}
const CHAR_FORWARD_SLASH = 47;
function stripTrailingSeparators(segment, isSep) {
    if (segment.length <= 1) {
        return segment;
    }
    let end = segment.length;
    for(let i = segment.length - 1; i > 0; i--){
        if (isSep(segment.charCodeAt(i))) {
            end = i;
        } else {
            break;
        }
    }
    return segment.slice(0, end);
}
function isPathSeparator(code) {
    return code === 47 || code === 92;
}
function isWindowsDeviceRoot(code) {
    return code >= 97 && code <= 122 || code >= 65 && code <= 90;
}
function basename(path, suffix = "") {
    assertArgs(path, suffix);
    let start = 0;
    if (path.length >= 2) {
        const drive = path.charCodeAt(0);
        if (isWindowsDeviceRoot(drive)) {
            if (path.charCodeAt(1) === 58) start = 2;
        }
    }
    const lastSegment = lastPathSegment(path, isPathSeparator, start);
    const strippedSegment = stripTrailingSeparators(lastSegment, isPathSeparator);
    return suffix ? stripSuffix(strippedSegment, suffix) : strippedSegment;
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
            if (lastSlash === i - 1 || dots === 1) {} else if (lastSlash !== i - 1 && dots === 2) {
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
function resolve(...pathSegments) {
    let resolvedDevice = "";
    let resolvedTail = "";
    let resolvedAbsolute = false;
    for(let i = pathSegments.length - 1; i >= -1; i--){
        let path;
        const { Deno: Deno1 } = globalThis;
        if (i >= 0) {
            path = pathSegments[i];
        } else if (!resolvedDevice) {
            if (typeof Deno1?.cwd !== "function") {
                throw new TypeError("Resolved a drive-letter-less path without a CWD.");
            }
            path = Deno1.cwd();
        } else {
            if (typeof Deno1?.env?.get !== "function" || typeof Deno1?.cwd !== "function") {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path = Deno1.cwd();
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
function isPosixPathSeparator(code) {
    return code === 47;
}
function basename1(path, suffix = "") {
    assertArgs(path, suffix);
    const lastSegment = lastPathSegment(path, isPosixPathSeparator);
    const strippedSegment = stripTrailingSeparators(lastSegment, isPosixPathSeparator);
    return suffix ? stripSuffix(strippedSegment, suffix) : strippedSegment;
}
function resolve1(...pathSegments) {
    let resolvedPath = "";
    let resolvedAbsolute = false;
    for(let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--){
        let path;
        if (i >= 0) path = pathSegments[i];
        else {
            const { Deno: Deno1 } = globalThis;
            if (typeof Deno1?.cwd !== "function") {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path = Deno1.cwd();
        }
        assertPath(path);
        if (path.length === 0) {
            continue;
        }
        resolvedPath = `${path}/${resolvedPath}`;
        resolvedAbsolute = isPosixPathSeparator(path.charCodeAt(0));
    }
    resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute, "/", isPosixPathSeparator);
    if (resolvedAbsolute) {
        if (resolvedPath.length > 0) return `/${resolvedPath}`;
        else return "/";
    } else if (resolvedPath.length > 0) return resolvedPath;
    else return ".";
}
const osType = (()=>{
    const { Deno: Deno1 } = globalThis;
    if (typeof Deno1?.build?.os === "string") {
        return Deno1.build.os;
    }
    const { navigator } = globalThis;
    if (navigator?.appVersion?.includes?.("Win")) {
        return "windows";
    }
    return "linux";
})();
const isWindows = osType === "windows";
function basename2(path, suffix = "") {
    return isWindows ? basename(path, suffix) : basename1(path, suffix);
}
function resolve2(...pathSegments) {
    return isWindows ? resolve(...pathSegments) : resolve1(...pathSegments);
}
function crash(message, data) {
    console.log("Error: " + message, "color: red");
    if (data) {
        console.log("%c" + Object.keys(data).map((key)=>`- ${key}: ${data[key]}`).join("\n"), "color: red");
    }
    Deno.exit(1);
}
const version = "2.0.0-beta-7";
function isHexColor(color) {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
}
function assertIsObject(input, filepath) {
    if (typeof input !== "object" || input === null) {
        crash("Content of file is not a list of strings", {
            filepath
        });
    }
}
function assertIsList(input, filepath) {
    assertIsObject(input, filepath);
    const content = input;
    for (const key of Object.keys(input)){
        const value = content[key];
        if (typeof value !== "string") {
            crash("Content of file is not a list of strings", {
                filepath
            });
        }
    }
}
function existsSync(path) {
    try {
        Deno.statSync(path);
    } catch (e) {
        return !e;
    }
    return true;
}
function getFileInfoType(fileInfo) {
    return fileInfo.isFile ? "file" : fileInfo.isDirectory ? "dir" : fileInfo.isSymlink ? "symlink" : undefined;
}
function ensureDirSync(dir) {
    try {
        const fileInfo = Deno.lstatSync(dir);
        if (!fileInfo.isDirectory) {
            throw new Error(`Ensure path exists, expected 'dir', got '${getFileInfoType(fileInfo)}'`);
        }
        return;
    } catch (err) {
        if (!(err instanceof Deno.errors.NotFound)) {
            throw err;
        }
    }
    try {
        Deno.mkdirSync(dir, {
            recursive: true
        });
    } catch (err) {
        if (!(err instanceof Deno.errors.AlreadyExists)) {
            throw err;
        }
        const fileInfo = Deno.lstatSync(dir);
        if (!fileInfo.isDirectory) {
            throw new Error(`Ensure path exists, expected 'dir', got '${getFileInfoType(fileInfo)}'`);
        }
    }
}
Deno.build.os === "windows";
Deno.build.os === "windows";
new Deno.errors.AlreadyExists("dest already exists.");
Deno.build.os === "windows";
const LF = "\n";
const CRLF = "\r\n";
Deno?.build.os === "windows" ? CRLF : LF;
const osType1 = (()=>{
    const { Deno: Deno1 } = globalThis;
    if (typeof Deno1?.build?.os === "string") {
        return Deno1.build.os;
    }
    const { navigator } = globalThis;
    if (navigator?.appVersion?.includes?.("Win")) {
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
            if (lastSlash === i - 1 || dots === 1) {} else if (lastSlash !== i - 1 && dots === 2) {
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
    if (base === sep) return dir;
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
function lastPathSegment1(path, isSep, start = 0) {
    let matchedNonSeparator = false;
    let end = path.length;
    for(let i = path.length - 1; i >= start; --i){
        if (isSep(path.charCodeAt(i))) {
            if (matchedNonSeparator) {
                start = i + 1;
                break;
            }
        } else if (!matchedNonSeparator) {
            matchedNonSeparator = true;
            end = i + 1;
        }
    }
    return path.slice(start, end);
}
function stripTrailingSeparators1(segment, isSep) {
    if (segment.length <= 1) {
        return segment;
    }
    let end = segment.length;
    for(let i = segment.length - 1; i > 0; i--){
        if (isSep(segment.charCodeAt(i))) {
            end = i;
        } else {
            break;
        }
    }
    return segment.slice(0, end);
}
function stripSuffix1(name, suffix) {
    if (suffix.length >= name.length) {
        return name;
    }
    const lenDiff = name.length - suffix.length;
    for(let i = suffix.length - 1; i >= 0; --i){
        if (name.charCodeAt(lenDiff + i) !== suffix.charCodeAt(i)) {
            return name;
        }
    }
    return name.slice(0, -suffix.length);
}
const sep = "\\";
const delimiter = ";";
function resolve3(...pathSegments) {
    let resolvedDevice = "";
    let resolvedTail = "";
    let resolvedAbsolute = false;
    for(let i = pathSegments.length - 1; i >= -1; i--){
        let path;
        const { Deno: Deno1 } = globalThis;
        if (i >= 0) {
            path = pathSegments[i];
        } else if (!resolvedDevice) {
            if (typeof Deno1?.cwd !== "function") {
                throw new TypeError("Resolved a drive-letter-less path without a CWD.");
            }
            path = Deno1.cwd();
        } else {
            if (typeof Deno1?.env?.get !== "function" || typeof Deno1?.cwd !== "function") {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path = Deno1.cwd();
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
function normalize(path) {
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
function isAbsolute(path) {
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
function join(...paths) {
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
    assert(firstPart != null);
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
    return normalize(joined);
}
function relative(from, to) {
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
function toNamespacedPath(path) {
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
function dirname(path) {
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
    return stripTrailingSeparators1(path.slice(0, end), isPosixPathSeparator1);
}
function basename3(path, suffix = "") {
    assertPath1(path);
    if (path.length === 0) return path;
    if (typeof suffix !== "string") {
        throw new TypeError(`Suffix must be a string. Received ${JSON.stringify(suffix)}`);
    }
    let start = 0;
    if (path.length >= 2) {
        const drive = path.charCodeAt(0);
        if (isWindowsDeviceRoot1(drive)) {
            if (path.charCodeAt(1) === 58) start = 2;
        }
    }
    const lastSegment = lastPathSegment1(path, isPathSeparator1, start);
    const strippedSegment = stripTrailingSeparators1(lastSegment, isPathSeparator1);
    return suffix ? stripSuffix1(strippedSegment, suffix) : strippedSegment;
}
function extname(path) {
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
function format(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
    }
    return _format("\\", pathObject);
}
function parse(path) {
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
                            ret.base = "\\";
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
        ret.base = "\\";
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
    ret.base = ret.base || "\\";
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
    resolve: resolve3,
    normalize: normalize,
    isAbsolute: isAbsolute,
    join: join,
    relative: relative,
    toNamespacedPath: toNamespacedPath,
    dirname: dirname,
    basename: basename3,
    extname: extname,
    format: format,
    parse: parse,
    fromFileUrl: fromFileUrl,
    toFileUrl: toFileUrl
};
const sep1 = "/";
const delimiter1 = ":";
function resolve4(...pathSegments) {
    let resolvedPath = "";
    let resolvedAbsolute = false;
    for(let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--){
        let path;
        if (i >= 0) path = pathSegments[i];
        else {
            const { Deno: Deno1 } = globalThis;
            if (typeof Deno1?.cwd !== "function") {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path = Deno1.cwd();
        }
        assertPath1(path);
        if (path.length === 0) {
            continue;
        }
        resolvedPath = `${path}/${resolvedPath}`;
        resolvedAbsolute = isPosixPathSeparator1(path.charCodeAt(0));
    }
    resolvedPath = normalizeString1(resolvedPath, !resolvedAbsolute, "/", isPosixPathSeparator1);
    if (resolvedAbsolute) {
        if (resolvedPath.length > 0) return `/${resolvedPath}`;
        else return "/";
    } else if (resolvedPath.length > 0) return resolvedPath;
    else return ".";
}
function normalize1(path) {
    assertPath1(path);
    if (path.length === 0) return ".";
    const isAbsolute = isPosixPathSeparator1(path.charCodeAt(0));
    const trailingSeparator = isPosixPathSeparator1(path.charCodeAt(path.length - 1));
    path = normalizeString1(path, !isAbsolute, "/", isPosixPathSeparator1);
    if (path.length === 0 && !isAbsolute) path = ".";
    if (path.length > 0 && trailingSeparator) path += "/";
    if (isAbsolute) return `/${path}`;
    return path;
}
function isAbsolute1(path) {
    assertPath1(path);
    return path.length > 0 && isPosixPathSeparator1(path.charCodeAt(0));
}
function join1(...paths) {
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
    return normalize1(joined);
}
function relative1(from, to) {
    assertPath1(from);
    assertPath1(to);
    if (from === to) return "";
    from = resolve4(from);
    to = resolve4(to);
    if (from === to) return "";
    let fromStart = 1;
    const fromEnd = from.length;
    for(; fromStart < fromEnd; ++fromStart){
        if (!isPosixPathSeparator1(from.charCodeAt(fromStart))) break;
    }
    const fromLen = fromEnd - fromStart;
    let toStart = 1;
    const toEnd = to.length;
    for(; toStart < toEnd; ++toStart){
        if (!isPosixPathSeparator1(to.charCodeAt(toStart))) break;
    }
    const toLen = toEnd - toStart;
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i = 0;
    for(; i <= length; ++i){
        if (i === length) {
            if (toLen > length) {
                if (isPosixPathSeparator1(to.charCodeAt(toStart + i))) {
                    return to.slice(toStart + i + 1);
                } else if (i === 0) {
                    return to.slice(toStart + i);
                }
            } else if (fromLen > length) {
                if (isPosixPathSeparator1(from.charCodeAt(fromStart + i))) {
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
        else if (isPosixPathSeparator1(fromCode)) lastCommonSep = i;
    }
    let out = "";
    for(i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i){
        if (i === fromEnd || isPosixPathSeparator1(from.charCodeAt(i))) {
            if (out.length === 0) out += "..";
            else out += "/..";
        }
    }
    if (out.length > 0) return out + to.slice(toStart + lastCommonSep);
    else {
        toStart += lastCommonSep;
        if (isPosixPathSeparator1(to.charCodeAt(toStart))) ++toStart;
        return to.slice(toStart);
    }
}
function toNamespacedPath1(path) {
    return path;
}
function dirname1(path) {
    if (path.length === 0) return ".";
    let end = -1;
    let matchedNonSeparator = false;
    for(let i = path.length - 1; i >= 1; --i){
        if (isPosixPathSeparator1(path.charCodeAt(i))) {
            if (matchedNonSeparator) {
                end = i;
                break;
            }
        } else {
            matchedNonSeparator = true;
        }
    }
    if (end === -1) {
        return isPosixPathSeparator1(path.charCodeAt(0)) ? "/" : ".";
    }
    return stripTrailingSeparators1(path.slice(0, end), isPosixPathSeparator1);
}
function basename4(path, suffix = "") {
    assertPath1(path);
    if (path.length === 0) return path;
    if (typeof suffix !== "string") {
        throw new TypeError(`Suffix must be a string. Received ${JSON.stringify(suffix)}`);
    }
    const lastSegment = lastPathSegment1(path, isPosixPathSeparator1);
    const strippedSegment = stripTrailingSeparators1(lastSegment, isPosixPathSeparator1);
    return suffix ? stripSuffix1(strippedSegment, suffix) : strippedSegment;
}
function extname1(path) {
    assertPath1(path);
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    for(let i = path.length - 1; i >= 0; --i){
        const code = path.charCodeAt(i);
        if (isPosixPathSeparator1(code)) {
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
function parse1(path) {
    assertPath1(path);
    const ret = {
        root: "",
        dir: "",
        base: "",
        ext: "",
        name: ""
    };
    if (path.length === 0) return ret;
    const isAbsolute = isPosixPathSeparator1(path.charCodeAt(0));
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
        if (isPosixPathSeparator1(code)) {
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
        ret.base = ret.base || "/";
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
    if (startPart > 0) {
        ret.dir = stripTrailingSeparators1(path.slice(0, startPart - 1), isPosixPathSeparator1);
    } else if (isAbsolute) ret.dir = "/";
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
    resolve: resolve4,
    normalize: normalize1,
    isAbsolute: isAbsolute1,
    join: join1,
    relative: relative1,
    toNamespacedPath: toNamespacedPath1,
    dirname: dirname1,
    basename: basename4,
    extname: extname1,
    format: format1,
    parse: parse1,
    fromFileUrl: fromFileUrl1,
    toFileUrl: toFileUrl1
};
const path = isWindows1 ? mod : mod1;
const { join: join2, normalize: normalize2 } = path;
const path1 = isWindows1 ? mod : mod1;
const { basename: basename5, delimiter: delimiter2, dirname: dirname2, extname: extname2, format: format2, fromFileUrl: fromFileUrl2, isAbsolute: isAbsolute2, join: join3, normalize: normalize3, parse: parse2, relative: relative2, resolve: resolve5, toFileUrl: toFileUrl2, toNamespacedPath: toNamespacedPath2 } = path1;
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
    POINTER_SMALL_LEFT: "‹",
    LINE: "─",
    POINTER: "❯",
    POINTER_LEFT: "❮",
    INFO: "ℹ",
    TAB_LEFT: "⇤",
    TAB_RIGHT: "⇥",
    ESCAPE: "⎋",
    BACKSPACE: "⌫",
    PAGE_UP: "⇞",
    PAGE_DOWN: "⇟",
    ENTER: "↵",
    SEARCH: "🔎",
    FOLDER: "📁",
    FOLDER_OPEN: "📂"
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
const keyMap = {
    up: "ARROW_UP",
    down: "ARROW_DOWN",
    left: "ARROW_LEFT",
    right: "ARROW_RIGHT",
    pageup: "PAGE_UP",
    pagedown: "PAGE_DOWN",
    tab: "TAB_RIGHT",
    enter: "ENTER",
    return: "ENTER"
};
function getFiguresByKeys(keys) {
    const figures = [];
    for (const key of keys){
        const figure = Figures[keyMap[key]] ?? key;
        if (!figures.includes(figure)) {
            figures.push(figure);
        }
    }
    return figures;
}
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
        result += base64abc[(uint8[i - 2] & 0x03) << 4 | uint8[i - 1] >> 4];
        result += base64abc[(uint8[i - 1] & 0x0f) << 2 | uint8[i] >> 6];
        result += base64abc[uint8[i] & 0x3f];
    }
    if (i === l + 1) {
        result += base64abc[uint8[i - 2] >> 2];
        result += base64abc[(uint8[i - 2] & 0x03) << 4];
        result += "==";
    }
    if (i === l) {
        result += base64abc[uint8[i - 2] >> 2];
        result += base64abc[(uint8[i - 2] & 0x03) << 4 | uint8[i - 1] >> 4];
        result += base64abc[(uint8[i - 1] & 0x0f) << 2];
        result += "=";
    }
    return result;
}
const ESC = "\x1B";
const CSI = `${ESC}[`;
const OSC = `${ESC}]`;
const SEP = ";";
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
        SEP,
        SEP,
        url,
        bel,
        text,
        OSC,
        "8",
        SEP,
        SEP,
        bel
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
const mod2 = {
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
const encoder = new TextEncoder();
const decoder = new TextDecoder();
function getCursorPosition({ reader = Deno.stdin, writer = Deno.stdout } = {}) {
    const data = new Uint8Array(8);
    reader.setRaw(true);
    writer.writeSync(encoder.encode(cursorPosition));
    reader.readSync(data);
    reader.setRaw(false);
    const [y, x] = decoder.decode(data).match(/\[(\d+);(\d+)R/)?.slice(1, 3).map(Number) ?? [
        0,
        0
    ];
    return {
        x,
        y
    };
}
const tty = factory();
const encoder1 = new TextEncoder();
function factory(options) {
    let result = "";
    let stack = [];
    const writer = options?.writer ?? Deno.stdout;
    const reader = options?.reader ?? Deno.stdin;
    const tty = function(...args) {
        if (this) {
            update(args);
            writer.writeSync(encoder1.encode(result));
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
        writer.writeSync(encoder1.encode(result));
        return this;
    };
    tty.getCursorPosition = ()=>getCursorPosition({
            writer,
            reader
        });
    const methodList = Object.entries(mod2);
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
        result = stack.reduce((prev, [cur, args])=>prev + (typeof cur === "string" ? cur : cur.call(tty, ...args)), "");
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
function parse3(data) {
    let index = -1;
    const keys = [];
    const input = data instanceof Uint8Array ? new TextDecoder().decode(data) : data;
    const hasNext = ()=>input.length - 1 >= index + 1;
    const next = ()=>input[++index];
    parseNext();
    return keys;
    function parseNext() {
        let ch = next();
        let s = ch;
        let escaped = false;
        const key = {
            name: undefined,
            char: undefined,
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
            if (key.name === "space") {
                key.char = ch;
            }
        } else if (!escaped && ch <= "\x1a") {
            key.name = String.fromCharCode(ch.charCodeAt(0) + "a".charCodeAt(0) - 1);
            key.ctrl = true;
            key.char = key.name;
        } else if (/^[0-9A-Za-z]$/.test(ch)) {
            key.name = ch.toLowerCase();
            key.shift = /^[A-Z]$/.test(ch);
            key.meta = escaped;
            key.char = ch;
        } else if (escaped) {
            key.name = ch.length ? undefined : "escape";
            key.meta = true;
        } else {
            key.name = ch;
            key.char = ch;
        }
        key.sequence = s;
        if (s.length !== 0 && (key.name !== undefined || escaped) || charLengthAt(s, 0) === s.length) {
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
    return pos >= 0x10000 ? 2 : 1;
}
class GenericPrompt {
    static injectedValue;
    cursor = {
        x: 0,
        y: 0
    };
    #value;
    #lastError;
    #isFirstRun = true;
    #encoder = new TextEncoder();
    static inject(value) {
        GenericPrompt.injectedValue = value;
    }
    getDefaultSettings(options) {
        return {
            ...options,
            tty: tty({
                reader: Deno.stdin,
                writer: options.writer ?? Deno.stdout
            }),
            cbreak: options.cbreak ?? false,
            reader: options.reader ?? Deno.stdin,
            writer: options.writer ?? Deno.stdout,
            pointer: options.pointer ?? brightBlue(Figures.POINTER_SMALL),
            prefix: options.prefix ?? yellow("? "),
            indent: options.indent ?? "",
            keys: {
                submit: [
                    "enter",
                    "return"
                ],
                ...options.keys ?? {}
            }
        };
    }
    async prompt() {
        try {
            return await this.#execute();
        } finally{
            this.settings.tty.cursorShow();
        }
    }
    clear() {
        this.settings.tty.cursorLeft.eraseDown();
    }
    #execute = async ()=>{
        if (typeof GenericPrompt.injectedValue !== "undefined" && this.#lastError) {
            throw new Error(this.error());
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
            this.settings.writer.writeSync(this.#encoder.encode(successMessage + "\n"));
        }
        GenericPrompt.injectedValue = undefined;
        this.settings.tty.cursorShow();
        return this.#value;
    };
    async render() {
        const result = await Promise.all([
            this.message(),
            this.body?.(),
            this.footer()
        ]);
        const content = result.filter(Boolean).join("\n");
        const lines = content.split("\n");
        const columns = getColumns();
        const linesCount = columns ? lines.reduce((prev, next)=>{
            const length = stripColor(next).length;
            return prev + (length > columns ? Math.ceil(length / columns) : 1);
        }, 0) : content.split("\n").length;
        const y = linesCount - this.cursor.y - 1;
        if (!this.#isFirstRun || this.#lastError) {
            this.clear();
        }
        this.#isFirstRun = false;
        this.settings.writer.writeSync(this.#encoder.encode(content));
        if (y) {
            this.settings.tty.cursorUp(y);
        }
        this.settings.tty.cursorTo(this.cursor.x);
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
        if (typeof this.settings.default !== "undefined" && !this.settings.hideDefault) {
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
        return this.settings.hint ? this.settings.indent + italic(brightBlue(dim(`${Figures.POINTER} `) + this.settings.hint)) : undefined;
    }
    setErrorMessage(message) {
        this.#lastError = message;
    }
    async handleEvent(event) {
        switch(true){
            case event.name === "c" && event.ctrl:
                this.clear();
                this.settings.tty.cursorShow();
                Deno.exit(130);
                return;
            case this.isKey(this.settings.keys, "submit", event):
                await this.submit();
                break;
        }
    }
    #readKey = async ()=>{
        const data = await this.#readChar();
        return data.length ? parse3(data) : [];
    };
    #readChar = async ()=>{
        const buffer = new Uint8Array(8);
        const isTty = Deno.isatty(this.settings.reader.rid);
        if (isTty) {
            this.settings.reader.setRaw(true, {
                cbreak: this.settings.cbreak
            });
        }
        const nread = await this.settings.reader.read(buffer);
        if (isTty) {
            this.settings.reader.setRaw(false);
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
function getColumns() {
    try {
        return Deno.consoleSize().columns ?? null;
    } catch (_error) {
        return null;
    }
}
class GenericInput extends GenericPrompt {
    inputValue = "";
    inputIndex = 0;
    getDefaultSettings(options) {
        const settings = super.getDefaultSettings(options);
        return {
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
                ...settings.keys ?? {}
            }
        };
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
    highlight(value, color1 = dim, color2 = brightBlue) {
        value = value.toString();
        const inputLowerCase = this.getCurrentInputValue().toLowerCase();
        const valueLowerCase = value.toLowerCase();
        const index = valueLowerCase.indexOf(inputLowerCase);
        const matched = value.slice(index, index + inputLowerCase.length);
        return index >= 0 ? color1(value.slice(0, index)) + color2(matched) + color1(value.slice(index + inputLowerCase.length)) : value;
    }
    async handleEvent(event) {
        switch(true){
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
            case event.char && !event.meta && !event.ctrl:
                this.addChar(event.char);
                break;
            default:
                await super.handleEvent(event);
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
class GenericList extends GenericInput {
    parentOptions = [];
    get selectedOption() {
        return this.options.at(this.listIndex);
    }
    static separator(label = "------------") {
        return {
            name: label
        };
    }
    getDefaultSettings({ groupIcon = true, groupOpenIcon = groupIcon, ...options }) {
        const settings = super.getDefaultSettings(options);
        return {
            ...settings,
            listPointer: options.listPointer ?? brightBlue(Figures.POINTER),
            searchLabel: options.searchLabel ?? brightBlue(Figures.SEARCH),
            backPointer: options.backPointer ?? brightBlue(Figures.POINTER_LEFT),
            groupPointer: options.groupPointer ?? options.listPointer ?? brightBlue(Figures.POINTER),
            groupIcon: !groupIcon ? false : typeof groupIcon === "string" ? groupIcon : Figures.FOLDER,
            groupOpenIcon: !groupOpenIcon ? false : typeof groupOpenIcon === "string" ? groupOpenIcon : Figures.FOLDER_OPEN,
            maxBreadcrumbItems: options.maxBreadcrumbItems ?? 5,
            breadcrumbSeparator: options.breadcrumbSeparator ?? ` ${Figures.POINTER_SMALL} `,
            maxRows: options.maxRows ?? 10,
            options: this.mapOptions(options, options.options),
            keys: {
                next: options.search ? [
                    "down"
                ] : [
                    "down",
                    "d",
                    "n",
                    "2"
                ],
                previous: options.search ? [
                    "up"
                ] : [
                    "up",
                    "u",
                    "p",
                    "8"
                ],
                nextPage: [
                    "pagedown",
                    "right"
                ],
                previousPage: [
                    "pageup",
                    "left"
                ],
                open: [
                    "right",
                    "enter",
                    "return"
                ],
                back: [
                    "left",
                    "escape",
                    "enter",
                    "return"
                ],
                ...settings.keys ?? {}
            }
        };
    }
    mapOption(options, option) {
        if (isOption1(option)) {
            return {
                value: option.value,
                name: typeof option.name === "undefined" ? options.format?.(option.value) ?? String(option.value) : option.name,
                disabled: "disabled" in option && option.disabled === true,
                indentLevel: 0
            };
        } else {
            return {
                value: null,
                name: option.name,
                disabled: true,
                indentLevel: 0
            };
        }
    }
    mapOptionGroup(options, option, recursive = true) {
        return {
            name: option.name,
            disabled: !!option.disabled,
            indentLevel: 0,
            options: recursive ? this.mapOptions(options, option.options) : []
        };
    }
    match() {
        const input = this.getCurrentInputValue().toLowerCase();
        let options = this.getCurrentOptions().slice();
        if (input.length) {
            const matches = matchOptions(input, this.getCurrentOptions());
            options = flatMatchedOptions(matches);
        }
        this.setOptions(options);
    }
    setOptions(options) {
        this.options = [
            ...options
        ];
        const parent = this.getParentOption();
        if (parent && this.options[0] !== parent) {
            this.options.unshift(parent);
        }
        this.listIndex = Math.max(0, Math.min(this.options.length - 1, this.listIndex));
        this.listOffset = Math.max(0, Math.min(this.options.length - this.getListHeight(), this.listOffset));
    }
    getCurrentOptions() {
        return this.getParentOption()?.options ?? this.settings.options;
    }
    getParentOption(index = -1) {
        return this.parentOptions.at(index);
    }
    submitBackButton() {
        const parentOption = this.parentOptions.pop();
        if (!parentOption) {
            return;
        }
        this.match();
        this.listIndex = this.options.indexOf(parentOption);
    }
    submitGroupOption(selectedOption) {
        this.parentOptions.push(selectedOption);
        this.match();
        this.listIndex = 1;
    }
    isBackButton(option) {
        return option === this.getParentOption();
    }
    hasParent() {
        return this.parentOptions.length > 0;
    }
    isSearching() {
        return this.getCurrentInputValue() !== "";
    }
    message() {
        let message = `${this.settings.indent}${this.settings.prefix}` + bold(this.settings.message) + this.defaults();
        if (this.settings.search) {
            const input = this.isSearchSelected() ? this.input() : dim(this.input());
            message += " " + this.settings.searchLabel + " ";
            this.cursor.x = stripColor(message).length + this.inputIndex + 1;
            message += input;
        }
        return message;
    }
    body() {
        return this.getList() + this.getInfo();
    }
    getInfo() {
        if (!this.settings.info) {
            return "";
        }
        const selected = this.listIndex + 1;
        const hasGroups = this.options.some((option)=>isOptionGroup(option));
        const groupActions = hasGroups ? [
            [
                "Open",
                getFiguresByKeys(this.settings.keys.open ?? [])
            ],
            [
                "Back",
                getFiguresByKeys(this.settings.keys.back ?? [])
            ]
        ] : [];
        const actions = [
            [
                "Next",
                getFiguresByKeys(this.settings.keys.next ?? [])
            ],
            [
                "Previous",
                getFiguresByKeys(this.settings.keys.previous ?? [])
            ],
            ...groupActions,
            [
                "Next Page",
                getFiguresByKeys(this.settings.keys.nextPage ?? [])
            ],
            [
                "Previous Page",
                getFiguresByKeys(this.settings.keys.previousPage ?? [])
            ],
            [
                "Submit",
                getFiguresByKeys(this.settings.keys.submit ?? [])
            ]
        ];
        return "\n" + this.settings.indent + brightBlue(Figures.INFO) + bold(` ${selected}/${this.options.length} `) + actions.map((cur)=>`${cur[0]}: ${bold(cur[1].join(", "))}`).join(", ");
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
    getListItem(option, isSelected) {
        let line = this.getListItemIndent(option);
        line += this.getListItemPointer(option, isSelected);
        line += this.getListItemIcon(option);
        line += this.getListItemLabel(option, isSelected);
        return line;
    }
    getListItemIndent(option) {
        const indentLevel = this.isSearching() ? option.indentLevel : this.hasParent() && !this.isBackButton(option) ? 1 : 0;
        return this.settings.indent + " ".repeat(indentLevel);
    }
    getListItemPointer(option, isSelected) {
        if (!isSelected) {
            return "  ";
        }
        if (this.isBackButton(option)) {
            return this.settings.backPointer + " ";
        } else if (isOptionGroup(option)) {
            return this.settings.groupPointer + " ";
        }
        return this.settings.listPointer + " ";
    }
    getListItemIcon(option) {
        if (this.isBackButton(option)) {
            return this.settings.groupOpenIcon ? this.settings.groupOpenIcon + " " : "";
        } else if (isOptionGroup(option)) {
            return this.settings.groupIcon ? this.settings.groupIcon + " " : "";
        }
        return "";
    }
    getListItemLabel(option, isSelected) {
        let label = option.name;
        if (this.isBackButton(option)) {
            label = this.getBreadCrumb();
            label = isSelected && !option.disabled ? label : yellow(label);
        } else {
            label = isSelected && !option.disabled ? this.highlight(label, (val)=>val) : this.highlight(label);
        }
        if (this.isBackButton(option) || isOptionGroup(option)) {
            label = bold(label);
        }
        return label;
    }
    getBreadCrumb() {
        if (!this.parentOptions.length || !this.settings.maxBreadcrumbItems) {
            return "";
        }
        const names = this.parentOptions.map((option)=>option.name);
        const breadCrumb = names.length > this.settings.maxBreadcrumbItems ? [
            names[0],
            "..",
            ...names.slice(-this.settings.maxBreadcrumbItems + 1)
        ] : names;
        return breadCrumb.join(this.settings.breadcrumbSeparator);
    }
    getListHeight() {
        return Math.min(this.options.length, this.settings.maxRows || this.options.length);
    }
    getListIndex(value) {
        return Math.max(0, typeof value === "undefined" ? this.options.findIndex((option)=>!option.disabled) || 0 : this.options.findIndex((option)=>isOption1(option) && option.value === value) || 0);
    }
    getPageOffset(index) {
        if (index === 0) {
            return 0;
        }
        const height = this.getListHeight();
        return Math.floor(index / height) * height;
    }
    getOptionByValue(value) {
        const option = this.options.find((option)=>isOption1(option) && option.value === value);
        return option && isOptionGroup(option) ? undefined : option;
    }
    read() {
        if (!this.settings.search) {
            this.settings.tty.cursorHide();
        }
        return super.read();
    }
    selectSearch() {
        this.listIndex = -1;
    }
    isSearchSelected() {
        return this.listIndex === -1;
    }
    async handleEvent(event) {
        if (this.isKey(this.settings.keys, "open", event) && isOptionGroup(this.selectedOption) && !this.isBackButton(this.selectedOption) && !this.isSearchSelected()) {
            this.submitGroupOption(this.selectedOption);
        } else if (this.isKey(this.settings.keys, "back", event) && (this.isBackButton(this.selectedOption) || event.name === "escape") && !this.isSearchSelected()) {
            this.submitBackButton();
        } else if (this.isKey(this.settings.keys, "next", event)) {
            this.selectNext();
        } else if (this.isKey(this.settings.keys, "previous", event)) {
            this.selectPrevious();
        } else if (this.isKey(this.settings.keys, "nextPage", event) && !this.isSearchSelected()) {
            this.selectNextPage();
        } else if (this.isKey(this.settings.keys, "previousPage", event) && !this.isSearchSelected()) {
            this.selectPreviousPage();
        } else {
            await super.handleEvent(event);
        }
    }
    async submit() {
        if (this.isSearchSelected()) {
            this.selectNext();
            return;
        }
        await super.submit();
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
    selectPrevious(loop = true) {
        if (this.options.length < 2 && !this.isSearchSelected()) {
            return;
        }
        if (this.listIndex > 0) {
            this.listIndex--;
            if (this.listIndex < this.listOffset) {
                this.listOffset--;
            }
            if (this.selectedOption?.disabled) {
                this.selectPrevious();
            }
        } else if (this.settings.search && this.listIndex === 0 && this.getCurrentInputValue().length) {
            this.listIndex = -1;
        } else if (loop) {
            this.listIndex = this.options.length - 1;
            this.listOffset = this.options.length - this.getListHeight();
            if (this.selectedOption?.disabled) {
                this.selectPrevious();
            }
        }
    }
    selectNext(loop = true) {
        if (this.options.length < 2 && !this.isSearchSelected()) {
            return;
        }
        if (this.listIndex < this.options.length - 1) {
            this.listIndex++;
            if (this.listIndex >= this.listOffset + this.getListHeight()) {
                this.listOffset++;
            }
            if (this.selectedOption?.disabled) {
                this.selectNext();
            }
        } else if (this.settings.search && this.listIndex === this.options.length - 1 && this.getCurrentInputValue().length) {
            this.listIndex = -1;
        } else if (loop) {
            this.listIndex = this.listOffset = 0;
            if (this.selectedOption?.disabled) {
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
            } else {
                this.listIndex = 0;
            }
            if (this.selectedOption?.disabled) {
                this.selectPrevious(false);
            }
            if (this.selectedOption?.disabled) {
                this.selectNext(false);
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
            } else {
                this.listIndex = this.options.length - 1;
            }
            if (this.selectedOption?.disabled) {
                this.selectNext(false);
            }
            if (this.selectedOption?.disabled) {
                this.selectPrevious(false);
            }
        }
    }
}
function isOption1(option) {
    return !!option && typeof option === "object" && "value" in option;
}
function isOptionGroup(option) {
    return option !== null && typeof option === "object" && "options" in option && Array.isArray(option.options);
}
function matchOptions(searchInput, options) {
    const matched = [];
    for (const option of options){
        if (isOptionGroup(option)) {
            const children = matchOptions(searchInput, option.options).sort(sortByDistance);
            if (children.length) {
                matched.push({
                    option,
                    distance: Math.min(...children.map((item)=>item.distance)),
                    children
                });
                continue;
            }
        }
        if (matchOption(searchInput, option)) {
            matched.push({
                option,
                distance: distance(option.name, searchInput),
                children: []
            });
        }
    }
    return matched.sort(sortByDistance);
    function sortByDistance(a, b) {
        return a.distance - b.distance;
    }
}
function matchOption(inputString, option) {
    return matchInput(inputString, option.name) || isOption1(option) && option.name !== option.value && matchInput(inputString, String(option.value));
}
function matchInput(inputString, value) {
    return stripColor(value).toLowerCase().includes(inputString);
}
function flatMatchedOptions(matches, indentLevel = 0, result = []) {
    for (const { option, children } of matches){
        option.indentLevel = indentLevel;
        result.push(option);
        flatMatchedOptions(children, indentLevel + 1, result);
    }
    return result;
}
class Checkbox extends GenericList {
    settings;
    options;
    listIndex;
    listOffset;
    confirmSubmit = false;
    static prompt(options) {
        return new this(options).prompt();
    }
    static inject(value) {
        GenericPrompt.inject(value);
    }
    constructor(options){
        super();
        this.settings = this.getDefaultSettings(options);
        this.options = this.settings.options.slice();
        this.listIndex = this.getListIndex();
        this.listOffset = this.getPageOffset(this.listIndex);
    }
    getDefaultSettings(options) {
        const settings = super.getDefaultSettings(options);
        return {
            confirmSubmit: true,
            ...settings,
            check: options.check ?? green(Figures.TICK),
            uncheck: options.uncheck ?? red(Figures.CROSS),
            partialCheck: options.partialCheck ?? green(Figures.RADIO_ON),
            minOptions: options.minOptions ?? 0,
            maxOptions: options.maxOptions ?? Infinity,
            options: this.mapOptions(options, options.options),
            keys: {
                check: [
                    "space"
                ],
                checkAll: [
                    "a"
                ],
                ...settings.keys ?? {},
                open: options.keys?.open ?? [
                    "right"
                ],
                back: options.keys?.back ?? [
                    "left",
                    "escape"
                ]
            }
        };
    }
    mapOptions(promptOptions, options) {
        return options.map((option)=>typeof option === "string" || typeof option === "number" ? this.mapOption(promptOptions, {
                value: option
            }) : isCheckboxOptionGroup(option) ? this.mapOptionGroup(promptOptions, option) : this.mapOption(promptOptions, option));
    }
    mapOption(options, option) {
        if (isOption1(option)) {
            return {
                ...super.mapOption(options, option),
                checked: typeof option.checked === "undefined" && options.default && options.default.indexOf(option.value) !== -1 ? true : !!option.checked,
                icon: typeof option.icon === "undefined" ? true : option.icon
            };
        } else {
            return {
                ...super.mapOption(options, option),
                checked: false,
                icon: false
            };
        }
    }
    mapOptionGroup(promptOptions, option) {
        const options = this.mapOptions(promptOptions, option.options);
        return {
            ...super.mapOptionGroup(promptOptions, option, false),
            get checked () {
                return areAllChecked(options);
            },
            options,
            icon: typeof option.icon === "undefined" ? true : option.icon
        };
    }
    match() {
        super.match();
        if (this.isSearching()) {
            this.selectSearch();
        }
    }
    getListItemIcon(option) {
        return this.getCheckboxIcon(option) + super.getListItemIcon(option);
    }
    getCheckboxIcon(option) {
        if (!option.icon) {
            return "";
        }
        const icon = option.checked ? this.settings.check + " " : isOptionGroup(option) && areSomeChecked(option.options) ? this.settings.partialCheck + " " : this.settings.uncheck + " ";
        return option.disabled ? dim(icon) : icon;
    }
    getValue() {
        return flatOptions(this.settings.options).filter((option)=>option.checked).map((option)=>option.value);
    }
    async handleEvent(event) {
        const hasConfirmed = this.confirmSubmit;
        this.confirmSubmit = false;
        switch(true){
            case this.isKey(this.settings.keys, "check", event) && !this.isSearchSelected():
                this.checkValue();
                break;
            case this.isKey(this.settings.keys, "submit", event):
                await this.submit(hasConfirmed);
                break;
            case event.ctrl && this.isKey(this.settings.keys, "checkAll", event):
                this.checkAllOption();
                break;
            default:
                await super.handleEvent(event);
        }
    }
    hint() {
        if (this.confirmSubmit) {
            const info = this.isBackButton(this.selectedOption) ? ` To leave the current group press ${getFiguresByKeys(this.settings.keys.back ?? []).join(", ")}.` : isOptionGroup(this.selectedOption) ? ` To open the selected group press ${getFiguresByKeys(this.settings.keys.open ?? []).join(", ")}.` : ` To check or uncheck the selected option press ${getFiguresByKeys(this.settings.keys.check ?? []).join(", ")}.`;
            return this.settings.indent + brightBlue(`Press ${getFiguresByKeys(this.settings.keys.submit ?? [])} again to submit.${info}`);
        }
        return super.hint();
    }
    async submit(hasConfirmed) {
        if (!hasConfirmed && this.settings.confirmSubmit && !this.isSearchSelected()) {
            this.confirmSubmit = true;
            return;
        }
        await super.submit();
    }
    checkValue() {
        const option = this.options.at(this.listIndex);
        if (!option) {
            this.setErrorMessage("No option available to select.");
            return;
        } else if (option.disabled) {
            this.setErrorMessage("This option is disabled and cannot be changed.");
            return;
        }
        this.checkOption(option, !option.checked);
    }
    checkOption(option, checked) {
        if (isOption1(option)) {
            option.checked = checked;
        } else {
            for (const childOption of option.options){
                this.checkOption(childOption, checked);
            }
        }
    }
    checkAllOption() {
        const checked = this.options.some((option)=>option.checked);
        for (const option of this.options){
            this.checkOption(option, !checked);
        }
    }
    validate(value) {
        const options = flatOptions(this.settings.options);
        const isValidValue = Array.isArray(value) && value.every((val)=>options.findIndex((option)=>option.value === val) !== -1);
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
        return value;
    }
    format(value) {
        return value.map((val)=>this.settings.format?.(val) ?? this.getOptionByValue(val)?.name ?? String(val)).join(", ");
    }
}
function areSomeChecked(options) {
    return options.some((option)=>isOptionGroup(option) ? areSomeChecked(option.options) : option.checked);
}
function areAllChecked(options) {
    return options.every((option)=>isOptionGroup(option) ? areAllChecked(option.options) : option.checked);
}
function flatOptions(options) {
    return flat(options);
    function flat(options, indentLevel = 0, opts = []) {
        for (const option of options){
            option.indentLevel = indentLevel;
            if (isOption1(option)) {
                opts.push(option);
            }
            if (isOptionGroup(option)) {
                flat(option.options, ++indentLevel, opts);
            }
        }
        return opts;
    }
}
function isCheckboxOptionGroup(option) {
    return isOptionGroup(option);
}
const sep2 = Deno.build.os === "windows" ? "\\" : "/";
class GenericSuggestions extends GenericInput {
    suggestionsIndex = -1;
    suggestionsOffset = 0;
    suggestions = [];
    #hasReadPermissions;
    getDefaultSettings(options) {
        const settings = super.getDefaultSettings(options);
        return {
            ...settings,
            listPointer: options.listPointer ?? brightBlue(Figures.POINTER),
            maxRows: options.maxRows ?? 8,
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
                ...settings.keys ?? {}
            }
        };
    }
    get localStorage() {
        if (this.settings.id && "localStorage" in window) {
            try {
                return window.localStorage;
            } catch (_) {}
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
                ...this.loadSuggestions()
            ].filter(uniqueSuggestions)));
        }
    }
    async render() {
        if (this.settings.files && this.#hasReadPermissions === undefined) {
            const status = await Deno.permissions.request({
                name: "read"
            });
            this.#hasReadPermissions = status.state === "granted";
        }
        await this.match();
        return super.render();
    }
    async match() {
        this.suggestions = await this.getSuggestions();
        this.suggestionsIndex = Math.max(this.getCurrentInputValue().trim().length === 0 ? -1 : 0, Math.min(this.suggestions.length - 1, this.suggestionsIndex));
        this.suggestionsOffset = Math.max(0, Math.min(this.suggestions.length - this.getListHeight(), this.suggestionsOffset));
    }
    input() {
        return super.input() + dim(this.getSuggestion());
    }
    getSuggestion() {
        return this.suggestions[this.suggestionsIndex]?.toString().substr(this.getCurrentInputValue().length) ?? "";
    }
    async getUserSuggestions(input) {
        return typeof this.settings.suggestions === "function" ? await this.settings.suggestions(input) : this.settings.suggestions ?? [];
    }
    #isFileModeEnabled() {
        return !!this.settings.files && this.#hasReadPermissions === true;
    }
    async getFileSuggestions(input) {
        if (!this.#isFileModeEnabled()) {
            return [];
        }
        const path = await Deno.stat(input).then((file)=>file.isDirectory ? input : dirname2(input)).catch(()=>dirname2(input));
        return await listDir(path, this.settings.files);
    }
    async getSuggestions() {
        const input = this.getCurrentInputValue();
        const suggestions = [
            ...this.loadSuggestions(),
            ...await this.getUserSuggestions(input),
            ...await this.getFileSuggestions(input)
        ].filter(uniqueSuggestions);
        if (!input.length) {
            return suggestions;
        }
        return suggestions.filter((value)=>stripColor(value.toString()).toLowerCase().startsWith(input.toLowerCase())).sort((a, b)=>distance((a || a).toString(), input) - distance((b || b).toString(), input));
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
        if (this.suggestions.length) {
            if (this.settings.list) {
                actions.push([
                    "Next",
                    getFiguresByKeys(this.settings.keys?.next ?? [])
                ], [
                    "Previous",
                    getFiguresByKeys(this.settings.keys?.previous ?? [])
                ], [
                    "Next Page",
                    getFiguresByKeys(this.settings.keys?.nextPage ?? [])
                ], [
                    "Previous Page",
                    getFiguresByKeys(this.settings.keys?.previousPage ?? [])
                ]);
            } else {
                actions.push([
                    "Next",
                    getFiguresByKeys(this.settings.keys?.next ?? [])
                ], [
                    "Previous",
                    getFiguresByKeys(this.settings.keys?.previous ?? [])
                ]);
            }
            actions.push([
                "Complete",
                getFiguresByKeys(this.settings.keys?.complete ?? [])
            ]);
        }
        actions.push([
            "Submit",
            getFiguresByKeys(this.settings.keys?.submit ?? [])
        ]);
        let info = this.settings.indent;
        if (this.suggestions.length) {
            info += brightBlue(Figures.INFO) + bold(` ${selected}/${matched} `);
        }
        info += actions.map((cur)=>`${cur[0]}: ${bold(cur[1].join(" "))}`).join(", ");
        return info;
    }
    getList() {
        if (!this.suggestions.length || !this.settings.list) {
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
                await this.#completeValue();
                break;
            case this.isKey(this.settings.keys, "moveCursorRight", event):
                if (this.inputIndex < this.inputValue.length) {
                    this.moveCursorRight();
                } else {
                    await this.#completeValue();
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
    async #completeValue() {
        this.inputValue = await this.complete();
        this.inputIndex = this.inputValue.length;
        this.suggestionsIndex = 0;
        this.suggestionsOffset = 0;
    }
    async complete() {
        let input = this.getCurrentInputValue();
        const suggestion = this.suggestions[this.suggestionsIndex]?.toString();
        if (this.settings.complete) {
            input = await this.settings.complete(input, suggestion);
        } else if (this.#isFileModeEnabled() && input.at(-1) !== sep2 && await isDirectory(input) && (this.getCurrentInputValue().at(-1) !== "." || this.getCurrentInputValue().endsWith(".."))) {
            input += sep2;
        } else if (suggestion) {
            input = suggestion;
        }
        return this.#isFileModeEnabled() ? normalize3(input) : input;
    }
    selectPreviousSuggestion() {
        if (this.suggestions.length) {
            if (this.suggestionsIndex > -1) {
                this.suggestionsIndex--;
                if (this.suggestionsIndex < this.suggestionsOffset) {
                    this.suggestionsOffset--;
                }
            }
        }
    }
    selectNextSuggestion() {
        if (this.suggestions.length) {
            if (this.suggestionsIndex < this.suggestions.length - 1) {
                this.suggestionsIndex++;
                if (this.suggestionsIndex >= this.suggestionsOffset + this.getListHeight()) {
                    this.suggestionsOffset++;
                }
            }
        }
    }
    selectPreviousSuggestionsPage() {
        if (this.suggestions.length) {
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
        if (this.suggestions.length) {
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
function isDirectory(path) {
    return Deno.stat(path).then((file)=>file.isDirectory).catch(()=>false);
}
async function listDir(path, mode) {
    const fileNames = [];
    for await (const file of Deno.readDir(path || ".")){
        if (mode === true && (file.name.startsWith(".") || file.name.endsWith("~"))) {
            continue;
        }
        const filePath = join3(path, file.name);
        if (mode instanceof RegExp && !mode.test(filePath)) {
            continue;
        }
        fileNames.push(filePath);
    }
    return fileNames.sort(function(a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });
}
class Input extends GenericSuggestions {
    settings;
    static prompt(options) {
        return new this(options).prompt();
    }
    static inject(value) {
        GenericPrompt.inject(value);
    }
    constructor(options){
        super();
        if (typeof options === "string") {
            options = {
                message: options
            };
        }
        this.settings = this.getDefaultSettings(options);
    }
    getDefaultSettings(options) {
        return {
            ...super.getDefaultSettings(options),
            minLength: options.minLength ?? 0,
            maxLength: options.maxLength ?? Infinity
        };
    }
    success(value) {
        this.saveSuggestions(value);
        return super.success(value);
    }
    getValue() {
        return this.settings.files ? normalize3(this.inputValue) : this.inputValue;
    }
    validate(value) {
        if (typeof value !== "string") {
            return false;
        }
        if (value.length < this.settings.minLength) {
            return `Value must be longer than ${this.settings.minLength} but has a length of ${value.length}.`;
        }
        if (value.length > this.settings.maxLength) {
            return `Value can't be longer than ${this.settings.maxLength} but has a length of ${value.length}.`;
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
let injected = {};
function prompt(prompts, options) {
    return new PromptList(prompts, options).run(options?.initial);
}
class PromptList {
    prompts;
    options;
    result;
    index;
    names;
    isInBeforeHook;
    tty;
    get prompt() {
        return this.prompts[this.index];
    }
    constructor(prompts, options){
        this.prompts = prompts;
        this.options = options;
        this.result = {};
        this.index = -1;
        this.isInBeforeHook = false;
        this.names = this.prompts.map((prompt)=>prompt.name);
        this.tty = tty({
            writer: options?.writer ?? Deno.stdout
        });
    }
    async run(name) {
        this.index = -1;
        this.result = {};
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
                reader: this.options?.reader,
                writer: this.options?.writer,
                cbreak: this.options?.cbreak,
                ...this.prompt
            });
        } finally{
            this.tty.cursorShow();
        }
    }
    async runAfterHook() {
        if (this.options?.after) {
            await this.options.after(this.prompt.name, this.result, async (name)=>{
                if (name) {
                    return this.next(name);
                } else if (this.prompt.after) {
                    await this.prompt.after(this.result, (name)=>this.next(name));
                } else {
                    await this.next();
                }
            });
        } else if (this.prompt.after) {
            await this.prompt.after(this.result, (name)=>this.next(name));
        } else {
            await this.next();
        }
    }
}
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
    return (async function() {}).constructor;
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
function parse4(str, config) {
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
        parseOptions.raw
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
    const buffer = parse4(str, config);
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
        this.cache = {};
    }
    load(cacheObj) {
        copyProps(this.cache, cacheObj);
    }
}
const templates = new Cacher({});
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
    const res = {};
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
    const options = getConfig(config || {});
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
const osType2 = (()=>{
    if (globalThis.Deno != null) {
        return Deno.build.os;
    }
    const navigator = globalThis.navigator;
    if (navigator?.appVersion?.includes?.("Win") ?? false) {
        return "windows";
    }
    return "linux";
})();
const isWindows2 = osType2 === "windows";
const CHAR_FORWARD_SLASH2 = 47;
function assertPath2(path) {
    if (typeof path !== "string") {
        throw new TypeError(`Path must be a string. Received ${JSON.stringify(path)}`);
    }
}
function isPosixPathSeparator2(code) {
    return code === 47;
}
function isPathSeparator2(code) {
    return isPosixPathSeparator2(code) || code === 92;
}
function isWindowsDeviceRoot2(code) {
    return code >= 97 && code <= 122 || code >= 65 && code <= 90;
}
function normalizeString2(path, allowAboveRoot, separator, isPathSeparator) {
    let res = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let code;
    for(let i = 0, len = path.length; i <= len; ++i){
        if (i < len) code = path.charCodeAt(i);
        else if (isPathSeparator(code)) break;
        else code = CHAR_FORWARD_SLASH2;
        if (isPathSeparator(code)) {
            if (lastSlash === i - 1 || dots === 1) {} else if (lastSlash !== i - 1 && dots === 2) {
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
class DenoStdInternalError extends Error {
    constructor(message){
        super(message);
        this.name = "DenoStdInternalError";
    }
}
function assert1(expr, msg = "") {
    if (!expr) {
        throw new DenoStdInternalError(msg);
    }
}
const sep3 = "\\";
const delimiter3 = ";";
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
        assertPath2(path);
        const len = path.length;
        if (len === 0) continue;
        let rootEnd = 0;
        let device = "";
        let isAbsolute = false;
        const code = path.charCodeAt(0);
        if (len > 1) {
            if (isPathSeparator2(code)) {
                isAbsolute = true;
                if (isPathSeparator2(path.charCodeAt(1))) {
                    let j = 2;
                    let last = j;
                    for(; j < len; ++j){
                        if (isPathSeparator2(path.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        const firstPart = path.slice(last, j);
                        last = j;
                        for(; j < len; ++j){
                            if (!isPathSeparator2(path.charCodeAt(j))) break;
                        }
                        if (j < len && j !== last) {
                            last = j;
                            for(; j < len; ++j){
                                if (isPathSeparator2(path.charCodeAt(j))) break;
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
            } else if (isWindowsDeviceRoot2(code)) {
                if (path.charCodeAt(1) === 58) {
                    device = path.slice(0, 2);
                    rootEnd = 2;
                    if (len > 2) {
                        if (isPathSeparator2(path.charCodeAt(2))) {
                            isAbsolute = true;
                            rootEnd = 3;
                        }
                    }
                }
            }
        } else if (isPathSeparator2(code)) {
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
    resolvedTail = normalizeString2(resolvedTail, !resolvedAbsolute, "\\", isPathSeparator2);
    return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
function normalize4(path) {
    assertPath2(path);
    const len = path.length;
    if (len === 0) return ".";
    let rootEnd = 0;
    let device;
    let isAbsolute = false;
    const code = path.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator2(code)) {
            isAbsolute = true;
            if (isPathSeparator2(path.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator2(path.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    const firstPart = path.slice(last, j);
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator2(path.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator2(path.charCodeAt(j))) break;
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
        } else if (isWindowsDeviceRoot2(code)) {
            if (path.charCodeAt(1) === 58) {
                device = path.slice(0, 2);
                rootEnd = 2;
                if (len > 2) {
                    if (isPathSeparator2(path.charCodeAt(2))) {
                        isAbsolute = true;
                        rootEnd = 3;
                    }
                }
            }
        }
    } else if (isPathSeparator2(code)) {
        return "\\";
    }
    let tail;
    if (rootEnd < len) {
        tail = normalizeString2(path.slice(rootEnd), !isAbsolute, "\\", isPathSeparator2);
    } else {
        tail = "";
    }
    if (tail.length === 0 && !isAbsolute) tail = ".";
    if (tail.length > 0 && isPathSeparator2(path.charCodeAt(len - 1))) {
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
    assertPath2(path);
    const len = path.length;
    if (len === 0) return false;
    const code = path.charCodeAt(0);
    if (isPathSeparator2(code)) {
        return true;
    } else if (isWindowsDeviceRoot2(code)) {
        if (len > 2 && path.charCodeAt(1) === 58) {
            if (isPathSeparator2(path.charCodeAt(2))) return true;
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
        assertPath2(path);
        if (path.length > 0) {
            if (joined === undefined) joined = firstPart = path;
            else joined += `\\${path}`;
        }
    }
    if (joined === undefined) return ".";
    let needsReplace = true;
    let slashCount = 0;
    assert1(firstPart != null);
    if (isPathSeparator2(firstPart.charCodeAt(0))) {
        ++slashCount;
        const firstLen = firstPart.length;
        if (firstLen > 1) {
            if (isPathSeparator2(firstPart.charCodeAt(1))) {
                ++slashCount;
                if (firstLen > 2) {
                    if (isPathSeparator2(firstPart.charCodeAt(2))) ++slashCount;
                    else {
                        needsReplace = false;
                    }
                }
            }
        }
    }
    if (needsReplace) {
        for(; slashCount < joined.length; ++slashCount){
            if (!isPathSeparator2(joined.charCodeAt(slashCount))) break;
        }
        if (slashCount >= 2) joined = `\\${joined.slice(slashCount)}`;
    }
    return normalize4(joined);
}
function relative3(from, to) {
    assertPath2(from);
    assertPath2(to);
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
function toNamespacedPath3(path) {
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
        } else if (isWindowsDeviceRoot2(resolvedPath.charCodeAt(0))) {
            if (resolvedPath.charCodeAt(1) === 58 && resolvedPath.charCodeAt(2) === 92) {
                return `\\\\?\\${resolvedPath}`;
            }
        }
    }
    return path;
}
function dirname3(path) {
    assertPath2(path);
    const len = path.length;
    if (len === 0) return ".";
    let rootEnd = -1;
    let end = -1;
    let matchedSlash = true;
    let offset = 0;
    const code = path.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator2(code)) {
            rootEnd = offset = 1;
            if (isPathSeparator2(path.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator2(path.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator2(path.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator2(path.charCodeAt(j))) break;
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
        } else if (isWindowsDeviceRoot2(code)) {
            if (path.charCodeAt(1) === 58) {
                rootEnd = offset = 2;
                if (len > 2) {
                    if (isPathSeparator2(path.charCodeAt(2))) rootEnd = offset = 3;
                }
            }
        }
    } else if (isPathSeparator2(code)) {
        return path;
    }
    for(let i = len - 1; i >= offset; --i){
        if (isPathSeparator2(path.charCodeAt(i))) {
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
function basename6(path, ext = "") {
    if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
    }
    assertPath2(path);
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i;
    if (path.length >= 2) {
        const drive = path.charCodeAt(0);
        if (isWindowsDeviceRoot2(drive)) {
            if (path.charCodeAt(1) === 58) start = 2;
        }
    }
    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
        if (ext.length === path.length && ext === path) return "";
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for(i = path.length - 1; i >= start; --i){
            const code = path.charCodeAt(i);
            if (isPathSeparator2(code)) {
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
            if (isPathSeparator2(path.charCodeAt(i))) {
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
    assertPath2(path);
    let start = 0;
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    if (path.length >= 2 && path.charCodeAt(1) === 58 && isWindowsDeviceRoot2(path.charCodeAt(0))) {
        start = startPart = 2;
    }
    for(let i = path.length - 1; i >= start; --i){
        const code = path.charCodeAt(i);
        if (isPathSeparator2(code)) {
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
function parse5(path) {
    assertPath2(path);
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
        if (isPathSeparator2(code)) {
            rootEnd = 1;
            if (isPathSeparator2(path.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator2(path.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator2(path.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator2(path.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            rootEnd = j;
                        } else if (j !== last) {
                            rootEnd = j + 1;
                        }
                    }
                }
            }
        } else if (isWindowsDeviceRoot2(code)) {
            if (path.charCodeAt(1) === 58) {
                rootEnd = 2;
                if (len > 2) {
                    if (isPathSeparator2(path.charCodeAt(2))) {
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
    } else if (isPathSeparator2(code)) {
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
        if (isPathSeparator2(code)) {
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
    resolve: resolve6,
    normalize: normalize4,
    isAbsolute: isAbsolute3,
    join: join4,
    relative: relative3,
    toNamespacedPath: toNamespacedPath3,
    dirname: dirname3,
    basename: basename6,
    extname: extname3,
    format: format3,
    parse: parse5,
    fromFileUrl: fromFileUrl3,
    toFileUrl: toFileUrl3
};
const sep4 = "/";
const delimiter4 = ":";
function resolve7(...pathSegments) {
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
        assertPath2(path);
        if (path.length === 0) {
            continue;
        }
        resolvedPath = `${path}/${resolvedPath}`;
        resolvedAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH2;
    }
    resolvedPath = normalizeString2(resolvedPath, !resolvedAbsolute, "/", isPosixPathSeparator2);
    if (resolvedAbsolute) {
        if (resolvedPath.length > 0) return `/${resolvedPath}`;
        else return "/";
    } else if (resolvedPath.length > 0) return resolvedPath;
    else return ".";
}
function normalize5(path) {
    assertPath2(path);
    if (path.length === 0) return ".";
    const isAbsolute = path.charCodeAt(0) === 47;
    const trailingSeparator = path.charCodeAt(path.length - 1) === 47;
    path = normalizeString2(path, !isAbsolute, "/", isPosixPathSeparator2);
    if (path.length === 0 && !isAbsolute) path = ".";
    if (path.length > 0 && trailingSeparator) path += "/";
    if (isAbsolute) return `/${path}`;
    return path;
}
function isAbsolute4(path) {
    assertPath2(path);
    return path.length > 0 && path.charCodeAt(0) === 47;
}
function join5(...paths) {
    if (paths.length === 0) return ".";
    let joined;
    for(let i = 0, len = paths.length; i < len; ++i){
        const path = paths[i];
        assertPath2(path);
        if (path.length > 0) {
            if (!joined) joined = path;
            else joined += `/${path}`;
        }
    }
    if (!joined) return ".";
    return normalize5(joined);
}
function relative4(from, to) {
    assertPath2(from);
    assertPath2(to);
    if (from === to) return "";
    from = resolve7(from);
    to = resolve7(to);
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
    assertPath2(path);
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
function basename7(path, ext = "") {
    if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
    }
    assertPath2(path);
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
    assertPath2(path);
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
function parse6(path) {
    assertPath2(path);
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
    resolve: resolve7,
    normalize: normalize5,
    isAbsolute: isAbsolute4,
    join: join5,
    relative: relative4,
    toNamespacedPath: toNamespacedPath4,
    dirname: dirname4,
    basename: basename7,
    extname: extname4,
    format: format4,
    parse: parse6,
    fromFileUrl: fromFileUrl4,
    toFileUrl: toFileUrl4
};
const SEP1 = isWindows2 ? "\\" : "/";
const SEP_PATTERN = isWindows2 ? /[\\/]+/ : /\/+/;
function common(paths, sep = SEP1) {
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
const path2 = isWindows2 ? mod3 : mod4;
const { join: join6, normalize: normalize6 } = path2;
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
function globToRegExp(glob, { extended = true, globstar: globstarOption = true, os = osType2, caseInsensitive = false } = {}) {
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
function normalizeGlob(glob, { globstar = false } = {}) {
    if (glob.match(/\0/g)) {
        throw new Error(`Glob contains invalid characters: "${glob}"`);
    }
    if (!globstar) {
        return normalize6(glob);
    }
    const s = SEP_PATTERN.source;
    const badParentPattern = new RegExp(`(?<=(${s}|^)\\*\\*${s})\\.\\.(?=${s}|$)`, "g");
    return normalize6(glob.replace(badParentPattern, "\0")).replace(/\0/g, "..");
}
function joinGlobs(globs, { extended = false, globstar = false } = {}) {
    if (!globstar || globs.length == 0) {
        return join6(...globs);
    }
    if (globs.length === 0) return ".";
    let joined;
    for (const glob of globs){
        const path = glob;
        if (path.length > 0) {
            if (!joined) joined = path;
            else joined += `${SEP1}${path}`;
        }
    }
    if (!joined) return ".";
    return normalizeGlob(joined, {
        extended,
        globstar
    });
}
const path3 = isWindows2 ? mod3 : mod4;
const { basename: basename8, delimiter: delimiter5, dirname: dirname5, extname: extname5, format: format5, fromFileUrl: fromFileUrl5, isAbsolute: isAbsolute5, join: join7, normalize: normalize7, parse: parse7, relative: relative5, resolve: resolve8, sep: sep5, toFileUrl: toFileUrl5, toNamespacedPath: toNamespacedPath5 } = path3;
const mod5 = {
    SEP: SEP1,
    SEP_PATTERN: SEP_PATTERN,
    win32: mod3,
    posix: mod4,
    basename: basename8,
    delimiter: delimiter5,
    dirname: dirname5,
    extname: extname5,
    format: format5,
    fromFileUrl: fromFileUrl5,
    isAbsolute: isAbsolute5,
    join: join7,
    normalize: normalize7,
    parse: parse7,
    relative: relative5,
    resolve: resolve8,
    sep: sep5,
    toFileUrl: toFileUrl5,
    toNamespacedPath: toNamespacedPath5,
    common,
    globToRegExp,
    isGlob,
    normalizeGlob,
    joinGlobs
};
const readFileSync = Deno.readTextFileSync;
const _BOM = /^\uFEFF/;
function getWholeFilePath(name, parentfile, isDirectory) {
    const includePath = mod5.resolve(isDirectory ? parentfile : mod5.dirname(parentfile), name) + (mod5.extname(name) ? "" : ".eta");
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
            return existsSync1(filePath);
        })) {
            return filePath;
        } else if (typeof views === "string") {
            filePath = getWholeFilePath(path, views, true);
            addPathToSearched(filePath);
            if (existsSync1(filePath)) {
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
            if (existsSync1(filePath)) {
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
    const options = getConfig(config || {});
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
config.filepathCache = {};
const __default1 = {
    "syntax": {
        "elm-vim": "elmTopLevelDecl: '' # Function\nelmTupleFunction: '' # Normal\nelmTodo: '' # Todo\nelmComment: '' # Comment\nelmLineComment: '' # Comment\nelmString: '' # String\nelmTripleString: '' # String\nelmChar: '' # String\nelmStringEscape: '' # Special\nelmInt: '' # Number\nelmFloat: '' # Float\nelmDelimiter: '' # Comment\nelmTypedef: '' # Keyword\nelmImport: '' # Keyword\nelmConditional: '' # Keyword\nelmAlias: '' # Keyword\nelmOperator: '' # Operator\nelmType: '' # Type\nelmNumberType: '' # Type\nelmBraces: '' # Delimiter\n",
        "git": "gitDateHeader: '' # gitIdentityHeader\ngitIdentityHeader: '' # gitIdentityKeyword\ngitIdentityKeyword: '' # Label\ngitNotesHeader: '' # gitKeyword\ngitReflogHeader: '' # gitKeyword\ngitKeyword: '' # Keyword\ngitIdentity: '' # String\ngitEmailDelimiter: '' # Delimiter\ngitEmail: '' # Special\ngitDate: '' # Number\ngitMode: '' # Number\ngitHashAbbrev: '' # gitHash\ngitHash: '' # Identifier\ngitReflogMiddle: '' # gitReference\ngitReference: '' # Function\ngitStage: '' # gitType\ngitType: '' # Type\ngitDiffAdded: '' # diffAdded\ngitDiffRemoved: '' # diffRemoved\n",
        "vim-javascript-syntax": "# jelera/vim-javascript-syntax\njavaScriptEndColons: '' # Operator\njavaScriptOpSymbols: '' # Operator\njavaScriptLogicSymbols: '' # Boolean\njavaScriptParens: '' # Operator\njavaScriptTemplateDelim: '' # Operator\njavaScriptDocComment: '' # Comment\njavaScriptDocTags: '' # Special\njavaScriptDocSeeTag: '' # Function\njavaScriptDocParam: '' # Function\njavaScriptString: '' # String\njavaScriptTemplateString: '' # String\njavaScriptFloat: '' # Number\njavaScriptPrototype: '' # Type\njavaScriptSpecial: '' # Special\njavaScriptSource: '' # Special\njavaScriptGlobalObjects: '' # Special\njavaScriptExceptions: '' # Special\njavaScriptParensErrA: '' # Error\njavaScriptParensErrB: '' # Error\njavaScriptParensErrC: '' # Error\njavaScriptDomErrNo: '' # Error\njavaScriptDomNodeConsts: '' # Constant\njavaScriptDomElemAttrs: '' # Label\njavaScriptDomElemFuncs: '' # Type\njavaScriptWebAPI: '' # Type\njavaScriptHtmlElemAttrs: '' # Label\njavaScriptHtmlElemFuncs: '' # Type\njavaScriptCssStyles: '' # Type\njavaScriptBrowserObjects: '' # Constant\njavaScriptDOMObjects: '' # Constant\njavaScriptDOMMethods: '' # Type\njavaScriptDOMProperties: '' # Label\njavaScriptAjaxObjects: '' # Constant\njavaScriptAjaxMethods: '' # Type\njavaScriptAjaxProperties: '' # Label\njavaScriptFuncKeyword: '' # Function\njavaScriptFuncDef: '' # PreProc\njavaScriptFuncExp: '' # Title\njavaScriptFuncArg: '' # Special\njavaScriptFuncComma: '' # Operator\njavaScriptFuncEq: '' # Operator\njavaScriptHtmlEvents: '' # Constant\njavaScriptHtmlElemProperties: '' # Label\njavaScriptEventListenerKeywords: '' # Type\njavaScriptPropietaryObjects: '' # Constant\n",
        "gitrebase": "gitrebaseCommit: '' # gitrebaseHash\ngitrebaseHash: '' # Identifier\ngitrebasePick: '' # Statement\ngitrebaseReword: '' # Number\ngitrebaseEdit: '' # PreProc\ngitrebaseSquash: '' # Type\ngitrebaseFixup: '' # Special\ngitrebaseExec: '' # Function\ngitrebaseSummary: '' # String\ngitrebaseComment: '' # Comment\ngitrebaseSquashError: '' # Error\n",
        "json": "jsonPadding: '' # Operator\njsonString: '' # String\njsonTest: '' # Label\njsonEscape: '' # Special\njsonNumber: '' # Number\njsonBraces: '' # Delimiter\njsonNull: '' # Function\njsonBoolean: '' # Boolean\njsonKeyword: '' # Label\njsonNumError: '' # Error\njsonCommentError: '' # Error\njsonSemicolonError: '' # Error\njsonTrailingCommaError: '' # Error\njsonMissingCommaError: '' # Error\njsonStringSQError: '' # Error\njsonNoQuotesError: '' # Error\njsonTripleQuotesError: '' # Error\njsonQuote: '' # Quote\njsonNoise: '' # Noise\n",
        "php": "phpConstant: '' # Constant\nphpCoreConstant: '' # Constant\nphpComment: '' # Comment\nphpDocTags: '' # PreProc\nphpDocCustomTags: '' # Type\nphpException: '' # Exception\nphpBoolean: '' # Boolean\nphpStorageClass: '' # StorageClass\nphpSCKeyword: '' # StorageClass\nphpFCKeyword: '' # Define\nphpStructure: '' # Structure\nphpStringSingle: '' # String\nphpStringDouble: '' # String\nphpBacktick: '' # String\nphpNumber: '' # Number\nphpFloat: '' # Float\nphpMethods: '' # Function\nphpFunctions: '' # Function\nphpBaselib: '' # Function\nphpRepeat: '' # Repeat\nphpConditional: '' # Conditional\nphpLabel: '' # Label\nphpStatement: '' # Statement\nphpKeyword: '' # Statement\nphpType: '' # Type\nphpInclude: '' # Include\nphpDefine: '' # Define\nphpBackslashSequences: '' # SpecialChar\nphpBackslashDoubleQuote: '' # SpecialChar\nphpBackslashSingleQuote: '' # SpecialChar\nphpParent: '' # Delimiter\nphpBrackets: '' # Delimiter\nphpIdentifierConst: '' # Delimiter\nphpParentError: '' # Error\nphpOctalError: '' # Error\nphpInterpSimpleError: '' # Error\nphpInterpBogusDollarCurley: '' # Error\nphpInterpDollarCurly1: '' # Error\nphpInterpDollarCurly2: '' # Error\nphpInterpSimpleBracketsInner: '' # String\nphpInterpSimpleCurly: '' # Delimiter\nphpInterpVarname: '' # Identifier\nphpTodo: '' # Todo\nphpDocTodo: '' # Todo\nphpMemberSelector: '' # Structure\nphpIntVar: '' # Identifier\nphpEnvVar: '' # Identifier\nphpOperator: '' # Operator\nphpVarSelector: '' # Operator\nphpRelation: '' # Operator\nphpIdentifier: '' # Identifier\nphpIdentifierSimply: '' # Identifier\n",
        "markdown": "markdownH1: '' # htmlH1\nmarkdownH2: '' # htmlH2\nmarkdownH3: '' # htmlH3\nmarkdownH4: '' # htmlH4\nmarkdownH5: '' # htmlH5\nmarkdownH6: '' # htmlH6\nmarkdownHeadingRule: '' # markdownRule\nmarkdownHeadingDelimiter: '' # Delimiter\nmarkdownOrderedListMarker: '' # markdownListMarker\nmarkdownListMarker: '' # htmlTagName\nmarkdownBlockquote: '' # Comment\nmarkdownRule: '' # PreProc\nmarkdownLinkText: '' # htmlLink\nmarkdownIdDeclaration: '' # Typedef\nmarkdownId: '' # Type\nmarkdownAutomaticLink: '' # markdownUrl\nmarkdownUrl: '' # Float\nmarkdownUrlTitle: '' # String\nmarkdownIdDelimiter: '' # markdownLinkDelimiter\nmarkdownUrlDelimiter: '' # htmlTag\nmarkdownUrlTitleDelimiter: '' # Delimiter\nmarkdownItalic: '' # htmlItalic\nmarkdownBold: '' # htmlBold\nmarkdownBoldItalic: '' # htmlBoldItalic\nmarkdownCodeDelimiter: '' # Delimiter\nmarkdownEscape: '' # Special\nmarkdownError: '' # Error\n",
        "pug": "pugPlainChar: '' # Special\npugScriptConditional: '' # PreProc\npugScriptLoopKeywords: '' # PreProc\npugScriptStatement: '' # PreProc\npugHtmlArg: '' # htmlArg\npugAttributeString: '' # String\npugAttributesDelimiter: '' # Identifier\npugIdChar: '' # Special\npugClassChar: '' # Special\npugBlockExpansionChar: '' # Special\npugPipeChar: '' # Special\npugTagBlockChar: '' # Special\npugId: '' # Identifier\npugClass: '' # Type\npugInterpolationDelimiter: '' # Delimiter\npugInlineDelimiter: '' # Delimiter\npugFilter: '' # PreProc\npugDocType: '' # PreProc\npugComment: '' # Comment\npugCommentBlock: '' # Comment\npugHtmlConditionalComment: '' # pugComment\n",
        "css": "cssComment: '' # Comment\ncssVendor: '' # Comment\ncssHacks: '' # Comment\ncssTagName: '' # Statement\ncssDeprecated: '' # Error\ncssSelectorOp: '' # Special\ncssSelectorOp2: '' # Special\ncssAttrComma: '' # Special\ncssAnimationProp: '' # cssProp\ncssBackgroundProp: '' # cssProp\ncssBorderProp: '' # cssProp\ncssBoxProp: '' # cssProp\ncssColorProp: '' # cssProp\ncssContentForPagedMediaProp: '' # cssProp\ncssDimensionProp: '' # cssProp\ncssFlexibleBoxProp: '' # cssProp\ncssFontProp: '' # cssProp\ncssGeneratedContentProp: '' # cssProp\ncssGridProp: '' # cssProp\ncssHyerlinkProp: '' # cssProp\ncssLineboxProp: '' # cssProp\ncssListProp: '' # cssProp\ncssMarqueeProp: '' # cssProp\ncssMultiColumnProp: '' # cssProp\ncssPagedMediaProp: '' # cssProp\ncssPositioningProp: '' # cssProp\ncssPrintProp: '' # cssProp\ncssRubyProp: '' # cssProp\ncssSpeechProp: '' # cssProp\ncssTableProp: '' # cssProp\ncssTextProp: '' # cssProp\ncssTransformProp: '' # cssProp\ncssTransitionProp: '' # cssProp\ncssUIProp: '' # cssProp\ncssIEUIProp: '' # cssProp\ncssAuralProp: '' # cssProp\ncssRenderProp: '' # cssProp\ncssMobileTextProp: '' # cssProp\ncssAnimationAttr: '' # cssAttr\ncssBackgroundAttr: '' # cssAttr\ncssBorderAttr: '' # cssAttr\ncssBoxAttr: '' # cssAttr\ncssContentForPagedMediaAttr: '' # cssAttr\ncssDimensionAttr: '' # cssAttr\ncssFlexibleBoxAttr: '' # cssAttr\ncssFontAttr: '' # cssAttr\ncssGeneratedContentAttr: '' # cssAttr\ncssGridAttr: '' # cssAttr\ncssHyerlinkAttr: '' # cssAttr\ncssLineboxAttr: '' # cssAttr\ncssListAttr: '' # cssAttr\ncssMarginAttr: '' # cssAttr\ncssMarqueeAttr: '' # cssAttr\ncssMultiColumnAttr: '' # cssAttr\ncssPaddingAttr: '' # cssAttr\ncssPagedMediaAttr: '' # cssAttr\ncssPositioningAttr: '' # cssAttr\ncssGradientAttr: '' # cssAttr\ncssPrintAttr: '' # cssAttr\ncssRubyAttr: '' # cssAttr\ncssSpeechAttr: '' # cssAttr\ncssTableAttr: '' # cssAttr\ncssTextAttr: '' # cssAttr\ncssTransformAttr: '' # cssAttr\ncssTransitionAttr: '' # cssAttr\ncssUIAttr: '' # cssAttr\ncssIEUIAttr: '' # cssAttr\ncssAuralAttr: '' # cssAttr\ncssRenderAttr: '' # cssAttr\ncssCommonAttr: '' # cssAttr\ncssPseudoClassId: '' # PreProc\ncssPseudoClassLang: '' # Constant\ncssValueLength: '' # Number\ncssValueInteger: '' # Number\ncssValueNumber: '' # Number\ncssValueAngle: '' # Number\ncssValueTime: '' # Number\ncssValueFrequency: '' # Number\ncssFunction: '' # Constant\ncssURL: '' # String\ncssFunctionName: '' # Function\ncssFunctionComma: '' # Function\ncssColor: '' # Constant\ncssIdentifier: '' # Function\ncssInclude: '' # Include\ncssIncludeKeyword: '' # atKeyword\ncssImportant: '' # Special\ncssBraces: '' # Function\ncssBraceError: '' # Error\ncssError: '' # Error\ncssUnicodeEscape: '' # Special\ncssStringQQ: '' # String\ncssStringQ: '' # String\ncssAttributeSelector: '' # String\ncssMedia: '' # atKeyword\ncssMediaType: '' # Special\ncssMediaComma: '' # Normal\ncssMediaKeyword: '' # Statement\ncssMediaProp: '' # cssProp\ncssMediaAttr: '' # cssAttr\ncssPage: '' # atKeyword\ncssPagePseudo: '' # PreProc\ncssPageMargin: '' # atKeyword\ncssPageProp: '' # cssProp\ncssKeyFrame: '' # atKeyword\ncssKeyFrameSelector: '' # Constant\ncssFontDescriptor: '' # Special\ncssFontDescriptorFunction: '' # Constant\ncssFontDescriptorProp: '' # cssProp\ncssFontDescriptorAttr: '' # cssAttr\ncssUnicodeRange: '' # Constant\ncssClassName: '' # Function\ncssClassNameDot: '' # Function\ncssProp: '' # StorageClass\ncssAttr: '' # Constant\ncssUnitDecorators: '' # Number\ncssNoise: '' # Noise\natKeyword: '' # PreProc\n",
        "gitconfig": "gitconfigComment: '' # Comment\ngitconfigSection: '' # Keyword\ngitconfigVariable: '' # Identifier\ngitconfigBoolean: '' # Boolean\ngitconfigNumber: '' # Number\ngitconfigString: '' # String\ngitconfigDelim: '' # Delimiter\ngitconfigEscape: '' # Delimiter\ngitconfigError: '' # Error\n",
        "vim-plug": "plug1: '' # Title\nplug2: '' # Repeat\nplugH2: '' # Type\nplugX: '' # Exception\nplugBracket: '' # Structure\nplugNumber: '' # Number\nplugDash: '' # Special\nplugPlus: '' # Constant\nplugStar: '' # Boolean\nplugMessage: '' # Function\nplugName: '' # Label\nplugInstall: '' # Function\nplugUpdate: '' # Type\nplugError: '' # Error\nplugRelDate: '' # Comment\nplugEdge: '' # PreProc\nplugSha: '' # Identifier\nplugTag: '' # Constant\nplugNotLoaded: '' # Comment\n",
        "base": "# BASE UI\nColorColumn: ''\nConceal: ''\nCursor: ''\nCursorIM: ''\nCursorColumn: ''\nCursorLine: ''\nCursorLineNr: ''\nDirectory: ''\nDiffAdd: ''\nDiffChange: ''\nDiffDelete: ''\nDiffText: ''\nErrorMsg: ''\nVertSplit: ''\nFolded: ''\nFoldColumn: ''\nSignColumn: ''\nIncSearch: ''\nLineNr: ''\nMatchParen: ''\nModeMsg: ''\nMoreMsg: ''\nNonText: ''\nNormal: ''\nPMenu: ''\nPMenuSel: ''\nPmenuSbar: ''\nPmenuThumb: ''\nQuestion: ''\nSearch: ''\nSpecialKey: ''\nSpellBad: ''\nSpellLocal: ''\nSpellCap: ''\nSpellRare: ''\nStatusLine: ''\nStatusLineNC: ''\nTabLine: ''\nTabLineFill: ''\nTabLineSel: ''\nTitle: ''\nVisual: ''\nVisualNOS: ''\nWarningMsg: ''\nWildMenu: ''\n# BASE SYNTAX\nComment: ''\nConstant: ''\nString: '' # Constant\nCharacter: '' # Constant\nBoolean: '' # Constant\nNumber: '' # Constant\nFloat: '' # Constant\nIdentifier: ''\nFunction: '' # Identifier\nStatement: ''\nConditional: '' # Statement\nRepeat: '' # Statement\nLabel: '' # Statement\nOperator: '' # Statement\nKeyword: '' # Statement\nException: '' # Statement\nPreProc: ''\nInclude: '' # PreProc\nDefine: '' # PreProc\nMacro: '' # PreProc\nPreCondit: '' # PreProc\nType: ''\nStorageClass: '' # Type\nStructure: '' # Type\nTypedef: '' # Type\nSpecial: ''\nSpecialChar: '' # Special\nTag: '' # Special\nDelimiter: '' # Special\nSpecialComment: '' # Special\nDebug: '' # Special\nUnderlined: ''\nIgnore: ''\nError: ''\nTodo: ''\n",
        "nerdtree": "NERDTreePart: '' # Special\nNERDTreePartFile: '' # Type\nNERDTreeExecFile: '' # Title\nNERDTreeDirSlash: '' # Identifier\nNERDTreeBookmarksHeader: '' # statement\nNERDTreeBookmarksLeader: '' # ignore\nNERDTreeBookmarkName: '' # Identifier\nNERDTreeBookmark: '' # normal\nNERDTreeHelp: '' # String\nNERDTreeHelpKey: '' # Identifier\nNERDTreeHelpCommand: '' # Identifier\nNERDTreeHelpTitle: '' # Macro\nNERDTreeToggleOn: '' # Question\nNERDTreeToggleOff: '' # WarningMsg\nNERDTreeLinkTarget: '' # Type\nNERDTreeLinkFile: '' # Macro\nNERDTreeLinkDir: '' # Macro\nNERDTreeDir: '' # Directory\nNERDTreeUp: '' # Directory\nNERDTreeFile: '' # Normal\nNERDTreeCWD: '' # Statement\nNERDTreeOpenable: '' # Title\nNERDTreeClosable: '' # Title\nNERDTreeIgnore: '' # ignore\nNERDTreeRO: '' # WarningMsg\nNERDTreeFlags: '' # Number\n",
        "vim-mustache-handlebars": "mustacheVariable: '' # Number\nmustacheVariableUnescape: '' # Number\nmustachePartial: '' # Number\nmustacheSection: '' # Number\nmustacheMarkerSet: '' # Number\nmustacheComment: '' # Comment\nmustacheBlockComment: '' # Comment\nmustacheError: '' # Error\nmustacheInsideError: '' # Error\nmustacheHandlebars: '' # Special\nmustacheUnescape: '' # Identifier\nmustacheOperators: '' # Operator\nmustacheConditionals: '' # Conditional\nmustacheHelpers: '' # Repeat\nmustacheQString: '' # String\nmustacheDQString: '' # String\n",
        "diff": "diffOldFile: '' # diffFile\ndiffNewFile: '' # diffFile\ndiffFile: '' # Type\ndiffOnly: '' # Constant\ndiffIdentical: '' # Constant\ndiffDiffer: '' # Constant\ndiffBDiffer: '' # Constant\ndiffIsA: '' # Constant\ndiffNoEOL: '' # Constant\ndiffCommon: '' # Constant\ndiffRemoved: '' # Special\ndiffChanged: '' # PreProc\ndiffAdded: '' # Identifier\ndiffLine: '' # Statement\ndiffSubname: '' # PreProc\ndiffComment: '' # Comment\n",
        "yajs": "javascriptReserved: '' # Error\njavascriptReservedCase: '' # Error\njavascriptInvalidOp: '' # Error\njavascriptEndColons: '' # Statement\njavascriptOpSymbol: '' # Normal\njavascriptBraces: '' # Function\njavascriptBrackets: '' # Function\njavascriptParens: '' # Normal\njavascriptComment: '' # Comment\njavascriptLineComment: '' # Comment\njavascriptDocComment: '' # Comment\njavascriptCommentTodo: '' # Todo\njavascriptDocNotation: '' # SpecialComment\njavascriptDocTags: '' # SpecialComment\njavascriptDocNGParam: '' # javascriptDocParam\njavascriptDocParam: '' # Function\njavascriptDocNumParam: '' # Function\njavascriptDocEventRef: '' # Function\njavascriptDocNamedParamType: '' # Type\njavascriptDocParamName: '' # Type\njavascriptDocParamType: '' # Type\njavascriptString: '' # String\njavascriptTemplate: '' # String\njavascriptEventString: '' # String\njavascriptASCII: '' # Label\njavascriptTemplateSubstitution: '' # Label\njavascriptTemplateSB: '' # javascriptTemplateSubstitution\njavascriptRegexpString: '' # String\njavascriptGlobal: '' # Constant\njavascriptCharacter: '' # Character\njavascriptPrototype: '' # Type\njavascriptConditional: '' # Conditional\njavascriptConditionalElse: '' # Conditional\njavascriptSwitch: '' # Conditional\njavascriptCase: '' # Conditional\njavascriptDefault: '' # javascriptCase\njavascriptExportDefault: '' # javascriptCase\njavascriptBranch: '' # Conditional\njavascriptIdentifier: '' # Structure\njavascriptVariable: '' # Identifier\njavascriptRepeat: '' # Repeat\njavascriptForComprehension: '' # Repeat\njavascriptIfComprehension: '' # Repeat\njavascriptOfComprehension: '' # Repeat\njavascriptForOperator: '' # Repeat\njavascriptStatementKeyword: '' # Statement\njavascriptReturn: '' # Statement\njavascriptYield: '' # Statement\njavascriptYieldGen: '' # Statement\njavascriptMessage: '' # Keyword\njavascriptOperator: '' # Identifier\njavascriptTarget: '' # Identifier\njavascriptNull: '' # Boolean\njavascriptNumber: '' # Number\njavascriptBoolean: '' # Boolean\njavascriptObjectLabel: '' # javascriptLabel\njavascriptObjectLabelColon: '' # javascriptLabel\njavascriptLabel: '' # Label\njavascriptPropertyName: '' # Label\njavascriptImport: '' # Special\njavascriptExport: '' # Special\njavascriptTry: '' # Statement\njavascriptExceptions: '' # Statement\njavascriptMethodName: '' # Function\njavascriptMethodAccessor: '' # Operator\njavascriptObjectMethodName: '' # Function\njavascriptFuncKeyword: '' # Keyword\njavascriptAsyncFunc: '' # Keyword\njavascriptArrowFunc: '' # Type\njavascriptFuncName: '' # Function\njavascriptFuncArg: '' # Special\njavascriptArrowFuncArg: '' # javascriptFuncArg\njavascriptComma: '' # Normal\njavascriptClassKeyword: '' # Keyword\njavascriptClassExtends: '' # Keyword\njavascriptClassName: '' # Function\njavascriptClassSuperName: '' # Function\njavascriptClassStatic: '' # StorageClass\njavascriptClassSuper: '' # keyword\nshellbang: '' # Comment\n",
        "less": "lessEndOfLineComment: '' # lessComment\nlessCssComment: '' # lessComment\nlessComment: '' # Comment\nlessDefault: '' # cssImportant\nlessVariable: '' # Identifier\nlessFunction: '' # PreProc\nlessTodo: '' # Todo\nlessInclude: '' # Include\nlessIdChar: '' # Special\nlessClassChar: '' # Special\nlessAmpersand: '' # Character\nlessId: '' # Identifier\nlessClass: '' # Type\nlessCssAttribute: '' # PreProc\nlessClassCall: '' # Type\nlessClassIdCall: '' # Type\nlessTagName: '' # cssTagName\nlessDeprecated: '' # cssDeprecated\nlessMedia: '' # cssMedia\n",
        "python": "pythonStatement: '' # Statement\npythonConditional: '' # Conditional\npythonRepeat: '' # Repeat\npythonOperator: '' # Operator\npythonException: '' # Exception\npythonInclude: '' # Include\npythonDecorator: '' # Define\npythonFunction: '' # Function\npythonComment: '' # Comment\npythonTodo: '' # Todo\npythonString: '' # String\npythonRawString: '' # String\npythonQuotes: '' # String\npythonTripleQuotes: '' # pythonQuotes\npythonEscape: '' # Special\npythonNumber: '' # Number\npythonBuiltin: '' # Function\npythonExceptions: '' # Structure\npythonSpaceError: '' # Error\npythonDoctest: '' # Special\npythonDoctestValue: '' # Define\n",
        "html": "htmlTag: '' # Function\nhtmlEndTag: '' # Identifier\nhtmlArg: '' # Type\nhtmlTagName: '' # htmlStatement\nhtmlSpecialTagName: '' # Exception\nhtmlValue: '' # String\nhtmlH1: '' # Title\nhtmlH2: '' # htmlH1\nhtmlH3: '' # htmlH2\nhtmlH4: '' # htmlH3\nhtmlH5: '' # htmlH4\nhtmlH6: '' # htmlH5\nhtmlHead: '' # PreProc\nhtmlTitle: '' # Title\nhtmlBoldItalicUnderline: '' # htmlBoldUnderlineItalic\nhtmlUnderlineBold: '' # htmlBoldUnderline\nhtmlUnderlineItalicBold: '' # htmlBoldUnderlineItalic\nhtmlUnderlineBoldItalic: '' # htmlBoldUnderlineItalic\nhtmlItalicUnderline: '' # htmlUnderlineItalic\nhtmlItalicBold: '' # htmlBoldItalic\nhtmlItalicBoldUnderline: '' # htmlBoldUnderlineItalic\nhtmlItalicUnderlineBold: '' # htmlBoldUnderlineItalic\nhtmlLink: '' # Underlined\nhtmlLeadingSpace: '' # None\nhtmlPreStmt: '' # PreProc\nhtmlPreError: '' # Error\nhtmlPreProc: '' # PreProc\nhtmlPreAttr: '' # String\nhtmlPreProcAttrName: '' # PreProc\nhtmlPreProcAttrError: '' # Error\nhtmlSpecial: '' # Special\nhtmlSpecialChar: '' # Special\nhtmlString: '' # String\nhtmlStatement: '' # Statement\nhtmlComment: '' # Comment\nhtmlCommentPart: '' # Comment\nhtmlCommentError: '' # htmlError\nhtmlTagError: '' # htmlError\nhtmlEvent: '' # javaScript\nhtmlError: '' # Error\njavaScript: '' # Special\njavaScriptExpression: '' # javaScript\nhtmlCssStyleComment: '' # Comment\nhtmlCssDefinition: '' # Special\n",
        "javascript": "javaScriptComment: '' # Comment\njavaScriptLineComment: '' # Comment\njavaScriptCommentTodo: '' # Todo\njavaScriptSpecial: '' # Special\njavaScriptStringS: '' # String\njavaScriptStringD: '' # String\njavaScriptCharacter: '' # Character\njavaScriptSpecialCharacter: '' # javaScriptSpecial\njavaScriptNumber: '' # javaScriptValue\njavaScriptConditional: '' # Conditional\njavaScriptRepeat: '' # Repeat\njavaScriptBranch: '' # Conditional\njavaScriptOperator: '' # Operator\njavaScriptType: '' # Type\njavaScriptStatement: '' # Statement\njavaScriptFunction: '' # Function\njavaScriptBraces: '' # Function\njavaScriptError: '' # Error\njavaScriptParensError: '' # Error\njavaScriptNull: '' # Keyword\njavaScriptBoolean: '' # Boolean\njavaScriptRegexpString: '' # String\njavaScriptIdentifier: '' # Identifier\njavaScriptLabel: '' # Label\njavaScriptException: '' # Exception\njavaScriptMessage: '' # Keyword\njavaScriptGlobal: '' # Keyword\njavaScriptMember: '' # Keyword\njavaScriptDeprecated: '' # Exception\njavaScriptReserved: '' # Keyword\njavaScriptDebug: '' # Debug\njavaScriptConstant: '' # Label\n",
        "vim-gitgutter": "# GitGutter airblade/vim-gitgutter\nGitGutterAdd: ''\nGitGutterChange: ''\nGitGutterDelete: ''\nGitGutterChangeDelete: ''\n",
        "go": "goDirective: '' # Statement\ngoDeclaration: '' # Keyword\ngoDeclType: '' # Keyword\ngoStatement: '' # Statement\ngoConditional: '' # Conditional\ngoLabel: '' # Label\ngoRepeat: '' # Repeat\ngoType: '' # Type\ngoSignedInts: '' # Type\ngoUnsignedInts: '' # Type\ngoFloats: '' # Type\ngoComplexes: '' # Type\ngoBuiltins: '' # Keyword\ngoConstants: '' # Keyword\ngoComment: '' # Comment\ngoTodo: '' # Todo\ngoEscapeOctal: '' # goSpecialString\ngoEscapeC: '' # goSpecialString\ngoEscapeX: '' # goSpecialString\ngoEscapeU: '' # goSpecialString\ngoEscapeBigU: '' # goSpecialString\ngoSpecialString: '' # Special\ngoEscapeError: '' # Error\ngoString: '' # String\ngoRawString: '' # String\ngoCharacter: '' # Character\ngoDecimalInt: '' # Integer\ngoHexadecimalInt: '' # Integer\ngoOctalInt: '' # Integer\nInteger: '' # Number\ngoFloat: '' # Float\ngoImaginary: '' # Number\ngoExtraType: '' # Type\ngoSpaceError: '' # Error\n",
        "help": "helpIgnore: '' # Ignore\nhelpHyperTextJump: '' # Identifier\nhelpBar: '' # Ignore\nhelpBacktick: '' # Ignore\nhelpStar: '' # Ignore\nhelpHyperTextEntry: '' # String\nhelpHeadline: '' # Statement\nhelpHeader: '' # PreProc\nhelpSectionDelim: '' # PreProc\nhelpVim: '' # Identifier\nhelpCommand: '' # Comment\nhelpExample: '' # Comment\nhelpOption: '' # Type\nhelpSpecial: '' # Special\nhelpNote: '' # Todo\nhelpComment: '' # Comment\nhelpConstant: '' # Constant\nhelpString: '' # String\nhelpCharacter: '' # Character\nhelpNumber: '' # Number\nhelpBoolean: '' # Boolean\nhelpFloat: '' # Float\nhelpIdentifier: '' # Identifier\nhelpFunction: '' # Function\nhelpStatement: '' # Statement\nhelpConditional: '' # Conditional\nhelpRepeat: '' # Repeat\nhelpLabel: '' # Label\nhelpOperator: '' # Operator\nhelpKeyword: '' # Keyword\nhelpException: '' # Exception\nhelpPreProc: '' # PreProc\nhelpInclude: '' # Include\nhelpDefine: '' # Define\nhelpMacro: '' # Macro\nhelpPreCondit: '' # PreCondit\nhelpType: '' # Type\nhelpStorageClass: '' # StorageClass\nhelpStructure: '' # Structure\nhelpTypedef: '' # Typedef\nhelpSpecialChar: '' # SpecialChar\nhelpTag: '' # Tag\nhelpDelimiter: '' # Delimiter\nhelpSpecialComment: '' # SpecialComment\nhelpDebug: '' # Debug\nhelpUnderlined: '' # Underlined\nhelpError: '' # Error\nhelpTodo: '' # Todo\nhelpURL: '' # String\n",
        "unite": "uniteError: '' # Error\nuniteMarkedLine: '' # Statement\nuniteCandidateSourceName: '' # Type\nuniteQuickMatchText: '' # Special\nuniteCandidateIcon: '' # Special\nuniteMarkedIcon: '' # Statement\nuniteCandidateInputKeyword: '' # Function\nuniteChooseAction: '' # NONE\nuniteChooseCandidate: '' # NONE\nuniteChooseKey: '' # SpecialKey\nuniteChooseMessage: '' # NONE\nuniteChoosePrompt: '' # uniteSourcePrompt\nuniteChooseSource: '' # uniteSourceNames\nuniteInputPrompt: '' # Normal\nuniteInputLine: '' # Identifier\nuniteInputCommand: '' # Statement\nuniteStatusNormal: '' # StatusLine\nuniteStatusHead: '' # Statement\nuniteStatusSourceNames: '' # PreProc\nuniteStatusSourceCandidates: '' # Constant\nuniteStatusMessage: '' # Comment\nuniteStatusLineNR: '' # LineNR\n",
        "gitcommit": "gitcommitSummary: '' # Keyword\ngitcommitComment: '' # Comment\ngitcommitUntracked: '' # gitcommitComment\ngitcommitDiscarded: '' # gitcommitComment\ngitcommitSelected: '' # gitcommitComment\ngitcommitUnmerged: '' # gitcommitComment\ngitcommitOnBranch: '' # Comment\ngitcommitBranch: '' # Special\ngitcommitNoBranch: '' # gitCommitBranch\ngitcommitDiscardedType: '' # gitcommitType\ngitcommitSelectedType: '' # gitcommitType\ngitcommitUnmergedType: '' # gitcommitType\ngitcommitType: '' # Type\ngitcommitNoChanges: '' # gitcommitHeader\ngitcommitHeader: '' # PreProc\ngitcommitUntrackedFile: '' # gitcommitFile\ngitcommitDiscardedFile: '' # gitcommitFile\ngitcommitSelectedFile: '' # gitcommitFile\ngitcommitUnmergedFile: '' # gitcommitFile\ngitcommitFile: '' # Constant\ngitcommitDiscardedArrow: '' # gitcommitArrow\ngitcommitSelectedArrow: '' # gitcommitArrow\ngitcommitUnmergedArrow: '' # gitcommitArrow\ngitcommitArrow: '' # gitcommitComment\ngitcommitOverflow: '' # none\ngitcommitBlank: '' # Error\n",
        "elixir": "# Elixir\nelixirComment: '' # Comment\nelixirUnusedVariable: '' # Comment\nelixirAtom: '' # Constant\nelixirBoolean: '' # Constant\nelixirPseudoVariable: '' # Constant\nelixirNumber: '' # Constant\nelixirString: '' # Constant\nelixirRegex: '' # Constant\nelixirDocString: '' # Constant\nelixirAtomInterpolated: '' # Constant\nelixirSigil: '' # Constant\nelixirRegexDelimiter: '' # Delimiter\nelixirStringDelimiter: '' # Delimiter\nelixirInterpolationDelimiter: '' # Delimiter\nelixirSigilDelimiter: '' # Delimiter\nelixirSpecial: '' # Delimiter\nelixirRegexEscape: '' # Delimiter\nelixirRegexEscapePunctuation: '' # Delimiter\nelixirRegexQuantifier: '' # Delimiter\nelixirRegexCharClass: '' # Delimiter\nelixirSelf: '' # Identifier\nelixirVariable: '' # Identifier\nelixirFunctionDeclaration: '' # Identifier\nelixirBlockDefinition: '' # Statement\nelixirKeyword: '' # Statement\nelixirOperator: '' # Statement\nelixirInclude: '' # Preproc\nelixirDefine: '' # Preproc\nelixirPrivateDefine: '' # Preproc\nelixirModuleDefine: '' # Preproc\nelixirProtocolDefine: '' # Preproc\nelixirImplDefine: '' # Preproc\nelixirRecordDefine: '' # Preproc\nelixirPrivateRecordDefine: '' # Preproc\nelixirMacroDefine: '' # Preproc\nelixirMacroDeclaration: '' # Preproc\nelixirPrivateMacroDefine: '' # Preproc\nelixirDelegateDefine: '' # Preproc\nelixirOverridableDefine: '' # Preproc\nelixirExceptionDefine: '' # Preproc\nelixirCallbackDefine: '' # Preproc\nelixirStructDefine: '' # Preproc\nelixirAlias: '' # Type\nelixirTodo: '' # Todo\nelixirArguments: ''\nelixirGuard: ''\nelixirId: ''\nelixirInterpolation: ''\nelixirDocStringStar: ''\nelixirBlock: ''\nelixirAnonymousFunction: ''\nelixirDelimEscape: ''\nelixirModuleDeclaration: ''\nelixirProtocolDeclaration: ''\nelixirImplDeclaration: ''\nelixirRecordDeclaration: ''\nelixirDelegateDeclaration: ''\nelixirOverridableDeclaratio: ''\nelixirExceptionDeclaration: ''\nelixirCallbackDeclaration: ''\nelixirStructDeclaration: ''\n",
        "fugitive": "FugitiveblameBoundary: '' # Keyword\nFugitiveblameHash: '' # Identifier\nFugitiveblameUncommitted: '' # Ignore\nFugitiveblameTime: '' # PreProc\nFugitiveblameLineNumber: '' # Number\nFugitiveblameOriginalFile: '' # String\nFugitiveblameOriginalLineNumber: '' #\nFugitiveblameShort: '' # FugitiveblameDelimiter\nFugitiveblameDelimiter: '' # Delimiter\nFugitiveblameNotCommittedYet: '' # Comment\n",
        "xml": "xmlTodo: '' # Todo\nxmlTag: '' # Function\nxmlTagName: '' # Function\nxmlEndTag: '' # Identifier\nxmlNamespace: '' # Tag\nxmlEntity: '' # Statement\nxmlEntityPunct: '' # Type\nxmlAttribPunct: '' # Comment\nxmlAttrib: '' # Type\nxmlString: '' # String\nxmlComment: '' # Comment\nxmlCommentStart: '' # xmlComment\nxmlCommentPart: '' # Comment\nxmlCommentError: '' # Error\nxmlError: '' # Error\nxmlProcessingDelim: '' # Comment\nxmlProcessing: '' # Type\nxmlCdata: '' # String\nxmlCdataCdata: '' # Statement\nxmlCdataStart: '' # Type\nxmlCdataEnd: '' # Type\nxmlDocTypeDecl: '' # Function\nxmlDocTypeKeyword: '' # Statement\nxmlInlineDTD: '' # Function\n",
        "vim-stylus": "stylusComment: '' # Comment\nstylusVariable: '' # Identifier\nstylusControl: '' # PreProc\nstylusFunction: '' # Function\nstylusInterpolation: '' # Delimiter\nstylusAmpersand: '' # Character\nstylusClass: '' # Type\nstylusClassChar: '' # Special\nstylusEscape: '' # Special\nstylusId: '' # Identifier\nstylusIdChar: '' # Special\n",
        "elm.vim": "elmKeyword: '' # Keyword\nelmBuiltinOp: '' # Special\nelmType: '' # Type\nelmTodo: '' # Todo\nelmLineComment: '' # Comment\nelmComment: '' # Comment\nelmString: '' # String\nelmNumber: '' # Number\nspecialName: '' # Special\n",
        "yaml": "yamlTodo: '' # Todo\nyamlComment: '' # Comment\nyamlDocumentStart: '' # PreProc\nyamlDocumentEnd: '' # PreProc\nyamlDirectiveName: '' # Keyword\nyamlTAGDirective: '' # yamlDirectiveName\nyamlTagHandle: '' # String\nyamlTagPrefix: '' # String\nyamlYAMLDirective: '' # yamlDirectiveName\nyamlReservedDirective: '' # Error\nyamlYAMLVersion: '' # Number\nyamlString: '' # String\nyamlFlowString: '' # yamlString\nyamlFlowStringDelimiter: '' # yamlString\nyamlEscape: '' # SpecialChar\nyamlSingleEscape: '' # SpecialChar\nyamlBlockCollectionItemStart: '' # Label\nyamlBlockMappingKey: '' # Identifier\nyamlBlockMappingMerge: '' # Special\nyamlFlowMappingKey: '' # Identifier\nyamlFlowMappingMerge: '' # Special\nyamlMappingKeyStart: '' # Special\nyamlFlowIndicator: '' # Special\nyamlKeyValueDelimiter: '' # Special\nyamlConstant: '' # Constant\nyamlNull: '' # yamlConstant\nyamlBool: '' # yamlConstant\nyamlAnchor: '' # Type\nyamlAlias: '' # Type\nyamlNodeTag: '' # Type\nyamlInteger: '' # Number\nyamlFloat: '' # Float\nyamlTimestamp: '' # Number\n",
        "ruby": "rubyClass: '' # rubyDefine\nrubyModule: '' # rubyDefine\nrubyMethodExceptional: '' # rubyDefine\nrubyDefine: '' # Define\nrubyFunction: '' # Function\nrubyConditional: '' # Conditional\nrubyConditionalModifier: '' # rubyConditional\nrubyExceptional: '' # rubyConditional\nrubyRepeat: '' # Repeat\nrubyRepeatModifier: '' # rubyRepeat\nrubyOptionalDo: '' # rubyRepeat\nrubyControl: '' # Statement\nrubyInclude: '' # Include\nrubyInteger: '' # Number\nrubyASCIICode: '' # Character\nrubyFloat: '' # Float\nrubyBoolean: '' # Boolean\nrubyException: '' # Exception\nrubyIdentifier: '' # Identifier\nrubyClassVariable: '' # rubyIdentifier\nrubyConstant: '' # Type\nrubyGlobalVariable: '' # rubyIdentifier\nrubyBlockParameter: '' # rubyIdentifier\nrubyInstanceVariable: '' # rubyIdentifier\nrubyPredefinedIdentifier: '' # rubyIdentifier\nrubyPredefinedConstant: '' # rubyPredefinedIdentifier\nrubyPredefinedVariable: '' # rubyPredefinedIdentifier\nrubySymbol: '' # Constant\nrubyKeyword: '' # Keyword\nrubyOperator: '' # Operator\nrubyBeginEnd: '' # Statement\nrubyAccess: '' # Statement\nrubyAttribute: '' # Statement\nrubyEval: '' # Statement\nrubyPseudoVariable: '' # Constant\nrubyComment: '' # Comment\nrubyData: '' # Comment\nrubyDataDirective: '' # Delimiter\nrubyDocumentation: '' # Comment\nrubyTodo: '' # Todo\nrubyQuoteEscape: '' # rubyStringEscape\nrubyStringEscape: '' # Special\nrubyInterpolationDelimiter: '' # Delimiter\nrubyNoInterpolation: '' # rubyString\nrubySharpBang: '' # PreProc\nrubyRegexpDelimiter: '' # rubyStringDelimiter\nrubySymbolDelimiter: '' # rubyStringDelimiter\nrubyStringDelimiter: '' # Delimiter\nrubyHeredoc: '' # rubyString\nrubyString: '' # String\nrubyRegexpEscape: '' # rubyRegexpSpecial\nrubyRegexpQuantifier: '' # rubyRegexpSpecial\nrubyRegexpAnchor: '' # rubyRegexpSpecial\nrubyRegexpDot: '' # rubyRegexpCharClass\nrubyRegexpCharClass: '' # rubyRegexpSpecial\nrubyRegexpSpecial: '' # Special\nrubyRegexpComment: '' # Comment\nrubyRegexp: '' # rubyString\nrubyInvalidVariable: '' # Error\nrubyError: '' # Error\nrubySpaceError: '' # rubyError\n",
        "sh": "shArithRegion: '' # shShellVariables\nshAtExpr: '' # shSetList\nshBeginHere: '' # shRedir\nshCaseBar: '' # shConditional\nshCaseCommandSub: '' # shCommandSub\nshCaseDoubleQuote: '' # shDoubleQuote\nshCaseIn: '' # shConditional\nshQuote: '' # shOperator\nshCaseSingleQuote: '' # shSingleQuote\nshCaseStart: '' # shConditional\nshCmdSubRegion: '' # shShellVariables\nshColon: '' # shComment\nshDerefOp: '' # shOperator\nshDerefPOL: '' # shDerefOp\nshDerefPPS: '' # shDerefOp\nshDeref: '' # shShellVariables\nshDerefDelim: '' # shOperator\nshDerefSimple: '' # shDeref\nshDerefSpecial: '' # shDeref\nshDerefString: '' # shDoubleQuote\nshDerefVar: '' # shDeref\nshDoubleQuote: '' # shString\nshEcho: '' # shString\nshEchoDelim: '' # shOperator\nshEchoQuote: '' # shString\nshForPP: '' # shLoop\nshEmbeddedEcho: '' # shString\nshEscape: '' # shCommandSub\nshExDoubleQuote: '' # shDoubleQuote\nshExSingleQuote: '' # shSingleQuote\nshFunction: '' # Function\nshHereDoc: '' # shString\nshHerePayload: '' # shHereDoc\nshLoop: '' # shStatement\nshMoreSpecial: '' # shSpecial\nshOption: '' # shCommandSub\nshPattern: '' # shString\nshParen: '' # shArithmetic\nshPosnParm: '' # shShellVariables\nshQuickComment: '' # shComment\nshRange: '' # shOperator\nshRedir: '' # shOperator\nshSetListDelim: '' # shOperator\nshSetOption: '' # shOption\nshSingleQuote: '' # shString\nshSource: '' # shOperator\nshStringSpecial: '' # shSpecial\nshSubShRegion: '' # shOperator\nshTestOpr: '' # shConditional\nshTestPattern: '' # shString\nshTestDoubleQuote: '' # shString\nshTestSingleQuote: '' # shString\nshVariable: '' # shSetList\nshWrapLineOperator: '' # shOperator\nbashAdminStatement: '' # shStatement if exists(\"b:is_bash\")\nbashSpecialVariables: '' # shShellVariables if exists(\"b:is_bash\")\nbashStatement: '' # shStatement if exists(\"b:is_bash\")\nshFunctionParen: '' # Delimiter if exists(\"b:is_bash\")\nshFunctionDelim: '' # Delimiter if exists(\"b:is_bash\")\nkshSpecialVariables: '' # shShellVariables if exists(\"b:is_kornshell\")\nkshStatement: '' # shStatement if exists(\"b:is_kornshell\")\nshCaseError: '' # Error if !exists(\"g:sh_no_error\")\nshCondError: '' # Error if !exists(\"g:sh_no_error\")\nshCurlyError: '' # Error if !exists(\"g:sh_no_error\")\nshDerefError: '' # Error if !exists(\"g:sh_no_error\")\nshDerefOpError: '' # Error if !exists(\"g:sh_no_error\")\nshDerefWordError: '' # Error if !exists(\"g:sh_no_error\")\nshDoError: '' # Error if !exists(\"g:sh_no_error\")\nshEsacError: '' # Error if !exists(\"g:sh_no_error\")\nshIfError: '' # Error if !exists(\"g:sh_no_error\")\nshInError: '' # Error if !exists(\"g:sh_no_error\")\nshParenError: '' # Error if !exists(\"g:sh_no_error\")\nshTestError: '' # Error if !exists(\"g:sh_no_error\")\nshDTestError: '' # Error if exists(\"b:is_kornshell\")\nshArithmetic: '' # Special\nshCharClass: '' # Identifier\nshSnglCase: '' # Statement\nshCommandSub: '' # Special\nshComment: '' # Comment\nshConditional: '' # Conditional\nshCtrlSeq: '' # Special\nshExprRegion: '' # Delimiter\nshFunctionKey: '' # Function\nshFunctionName: '' # Function\nshNumber: '' # Number\nshOperator: '' # Operator\nshRepeat: '' # Repeat\nshSet: '' # Statement\nshSetList: '' # Identifier\nshShellVariables: '' # PreProc\nshSpecial: '' # Special\nshStatement: '' # Statement\nshString: '' # String\nshTodo: '' # Todo\nshAlias: '' # Identifier\nshHereDoc01: '' # shRedir\nshHereDoc02: '' # shRedir\nshHereDoc03: '' # shRedir\nshHereDoc04: '' # shRedir\nshHereDoc05: '' # shRedir\nshHereDoc06: '' # shRedir\nshHereDoc07: '' # shRedir\nshHereDoc08: '' # shRedir\nshHereDoc09: '' # shRedir\nshHereDoc10: '' # shRedir\nshHereDoc11: '' # shRedir\nshHereDoc12: '' # shRedir\nshHereDoc13: '' # shRedir\nshHereDoc14: '' # shRedir\nshHereDoc15: '' # shRedir\nshHereDoc16: '' # shRedir\nshHereDoc17: '' # shRedir\nshHereDoc18: '' # shRedir\nshHereDoc19: '' # shRedir\nshHereDoc20: '' # shRedir\nshHereDoc21: '' # shRedir\nshHereDoc22: '' # shRedir\nshHereDoc23: '' # shRedir\nshHereDoc24: '' # shRedir\nshHereDoc25: '' # shRedir\nshHereDoc26: '' # shRedir\nshHereDoc27: '' # shRedir\nshHereDoc28: '' # shRedir\nshHereDoc29: '' # shRedir\nshHereDoc30: '' # shRedir\nshHereDoc31: '' # shRedir\nshHereDoc32: '' # shRedir\n",
        "vim-signify": "# mhinz/vim-signify\nSignifyLineAdd: ''\nSignifyLineDelete: ''\nSignifyLineDeleteFirstLine: ''\nSignifyLineChange: ''\nSignifyLineChangeDelete: ''\n\nSignifySignAdd: ''\nSignifySignDelete: ''\nSignifySignDeleteFirstLine: ''\nSignifySignChange: ''\nSignifySignChangeDelete: ''\n",
        "viminfo": "viminfoComment: '' # Comment\nviminfoError: '' # Error\nviminfoStatement: '' # Statement\n"
    },
    "mustaches": {
        "colorscheme": "<% const info = it.info; %>\n\"\"\n\" Colorscheme: <% info.name %>\n<% if(it.info.description) { %>\" Description: <%= it.info.description %>\n<% } %>\n<% if(it.info.url){ %>\" URL: <%= it.info.url %>\n<% } %>\n<% if(it.info.author){ %>\" Author: <%= it.info.author %>\n<% } %>\n<% if(it.info.license){%>\" License: <%= it.info.license %>\n<% } %>\n\"\"\n\nset background=<%= it.info.background %>\n\nhi clear\n\nif exists(\"syntax_on\")\n  syntax reset\nendif\nlet g:colors_name=\"<%= it.info.name %>\"\n\n\nlet Italic = \"\"\nif exists('g:<%= it.info.name %>_italic')\n  let Italic = \"italic\"\nendif\nlet g:<%= it.info.name %>_italic = get(g:, '<%= it.info.name %>_italic', 0)\n\nlet Bold = \"\"\nif exists('g:<%= info.name %>_bold')\n  let Bold = \"bold\"\nendif\n\nlet g:<%= it.info.name %>_bold = get(g:, '<%info.name%>_bold', 0)\n\n<% Object.keys(it.stacks).forEach(function (key) {%>\n  <% const { link, fore, back, ui, guisp } = it.stacks[key]; %>\n<%- if(link){ -%>\nhi link <%=key%> <%=link%>\n<%- } else { -%>\nhi <%=key%>\n<%- if(fore){ -%> guifg=<%=fore.hex%> ctermfg=<%=fore.xterm%><%}%>\n<%- if(back){ -%> guibg=<%=back.hex%> ctermbg=<%=back.xterm%><%}%>\n<%- if(ui){ -%> gui=<%=ui%> cterm=<%=ui%><%}%>\n<%- if(guisp){ -%> guisp=<%=guisp.hex%><%}%>\n<% } %>\n\n<% }) %>\n\n<% if(it.term.color_0){ %>\nif has('terminal')\n  let g:terminal_ansi_colors = [\n  \\ \"<%= it.term.color_0 %>\",\n  \\ \"<%= it.term.color_1 %>\",\n  \\ \"<%= it.term.color_2 %>\",\n  \\ \"<%= it.term.color_3 %>\",\n  \\ \"<%= it.term.color_4 %>\",\n  \\ \"<%= it.term.color_5 %>\",\n  \\ \"<%= it.term.color_6 %>\",\n  \\ \"<%= it.term.color_7 %>\",\n  \\ \"<%= it.term.color_8 %>\",\n  \\ \"<%= it.term.color_9 %>\",\n  \\ \"<%= it.term.color_10 %>\",\n  \\ \"<%= it.term.color_11 %>\",\n  \\ \"<%= it.term.color_12 %>\",\n  \\ \"<%= it.term.color_13 %>\",\n  \\ \"<%= it.term.color_14 %>\",\n  \\ \"<%= it.term.color_15 %>\"\n  \\ ]\nendif\n\nif has('nvim')\n<% Object.keys(it.term).forEach(function (key) { %>\n  let g:terminal_<%= key %> = \"<%= it.term[key] %>\"\n<% }) %>\nendif\n<% } %>\n",
        "lightline": "<% const info = it.info; %>\n\"\"\n\" Lightline_theme: <%= info.name %>\n\n<% if(info.description){ %>\" Description: <%= info.description %>\n<% } %>\n\n<% if(info.url){ %>\" URL: <%= info.url %>\n<% } %>\n\n<% if(info.author){ %>\" Author: <%= info.author %>\n<% } %>\n\n<% if(info.license){ %>\" License: <%= info.license %>\n<% } %>\n\n\"\"\n\nlet s:p = {\"normal\": {}, \"inactive\": {}, \"insert\": {}, \"replace\": {}, \"visual\": {}, \"tabline\": {} }\n\nlet s:p.normal.left = [[[\"<%= it.normal1.fg.hex %>\", <%= it.normal1.fg.xterm %>], [\"<%= it.normal1.bg.hex %>\", <%= it.normal1.bg.xterm %>]], [[\"<%= it.normal2.fg.hex %>\", <%= it.normal2.fg.xterm %>], [\"<%= it.normal2.bg.hex %>\", <%= it.normal2.bg.xterm %>]]]\nlet s:p.normal.middle = [[[\"<%= it.normal3.fg.hex %>\", <%= it.normal3.fg.xterm %>], [\"<%= it.normal3.bg.hex %>\", <%= it.normal3.bg.xterm %>]]]\nlet s:p.normal.right = [[[\"<%= it.normal4.fg.hex %>\", <%= it.normal4.fg.xterm %>], [\"<%= it.normal4.bg.hex %>\", <%= it.normal4.bg.xterm %>]], [[\"<%= it.normal5.fg.hex %>\", <%= it.normal5.fg.xterm %>], [\"<%= it.normal5.bg.hex %>\", <%= it.normal5.bg.xterm %>]]]\nlet s:p.normal.error = [[[\"<%= it.normalError.fg.hex %>\", <%= it.normalError.fg.xterm %>], [\"<%= it.normalError.bg.hex %>\", <%= it.normalError.bg.xterm %>]]]\nlet s:p.normal.warning = [[[\"<%= it.normalWarning.fg.hex %>\", <%= it.normalWarning.fg.xterm %>], [\"<%= it.normalWarning.bg.hex %>\", <%= it.normalWarning.bg.xterm %>]]]\n\nlet s:p.inactive.left = [[[\"<%= it.inactive1.fg.hex %>\", <%= it.inactive1.fg.xterm %>], [\"<%= it.inactive1.bg.hex %>\", <%= it.inactive1.bg.xterm %>]], [[\"<%= it.inactive2.fg.hex %>\", <%= it.inactive2.fg.xterm %>], [\"<%= it.inactive2.bg.hex %>\", <%= it.inactive2.bg.xterm %>]]]\nlet s:p.inactive.middle = [[[\"<%= it.inactive3.fg.hex %>\", <%= it.inactive3.fg.xterm %>], [\"<%= it.inactive3.bg.hex %>\", <%= it.inactive3.bg.xterm %>]]]\nlet s:p.inactive.right = [[[\"<%= it.inactive4.fg.hex %>\", <%= it.inactive4.fg.xterm %>], [\"<%= it.inactive4.bg.hex %>\", <%= it.inactive4.bg.xterm %>]], [[\"<%= it.inactive5.fg.hex %>\", <%= it.inactive5.fg.xterm %>], [\"<%= it.inactive5.bg.hex %>\", <%= it.inactive5.bg.xterm %>]]]\n\nlet s:p.insert.left = [[[\"<%= it.insert1.fg.hex %>\", <%= it.insert1.fg.xterm %>], [\"<%= it.insert1.bg.hex %>\", <%= it.insert1.bg.xterm %>]], [[\"<%= it.insert2.fg.hex %>\", <%= it.insert2.fg.xterm %>], [\"<%= it.insert2.bg.hex %>\", <%= it.insert2.bg.xterm %>]]]\nlet s:p.insert.middle = [[[\"<%= it.insert3.fg.hex %>\", <%= it.insert3.fg.xterm %>], [\"<%= it.insert3.bg.hex %>\", <%= it.insert3.bg.xterm %>]]]\nlet s:p.insert.right = [[[\"<%= it.insert4.fg.hex %>\", <%= it.insert4.fg.xterm %>], [\"<%= it.insert4.bg.hex %>\", <%= it.insert4.bg.xterm %>]], [[\"<%= it.insert5.fg.hex %>\", <%= it.insert5.fg.xterm %>], [\"<%= it.insert5.bg.hex %>\", <%= it.insert5.bg.xterm %>]]]\n\nlet s:p.replace.left = [[[\"<%= it.replace1.fg.hex %>\", <%= it.replace1.fg.xterm %>], [\"<%= it.replace1.bg.hex %>\", <%= it.replace1.bg.xterm %>]], [[\"<%= it.replace2.fg.hex %>\", <%= it.replace2.fg.xterm %>], [\"<%= it.replace2.bg.hex %>\", <%= it.replace2.bg.xterm %>]]]\nlet s:p.replace.middle = [[[\"<%= it.replace3.fg.hex %>\", <%= it.replace3.fg.xterm %>], [\"<%= it.replace3.bg.hex %>\", <%= it.replace3.bg.xterm %>]]]\nlet s:p.replace.right = [[[\"<%= it.replace4.fg.hex %>\", <%= it.replace4.fg.xterm %>], [\"<%= it.replace4.bg.hex %>\", <%= it.replace4.bg.xterm %>]], [[\"<%= it.replace5.fg.hex %>\", <%= it.replace5.fg.xterm %>], [\"<%= it.replace5.bg.hex %>\", <%= it.replace5.bg.xterm %>]]]\n\nlet s:p.visual.left = [[[\"<%= it.visual1.fg.hex %>\", <%= it.visual1.fg.xterm %>], [\"<%= it.visual1.bg.hex %>\", <%= it.visual1.bg.xterm %>]], [[\"<%= it.visual2.fg.hex %>\", <%= it.visual2.fg.xterm %>], [\"<%= it.visual2.bg.hex %>\", <%= it.visual2.bg.xterm %>]]]\nlet s:p.visual.middle = [[[\"<%= it.visual3.fg.hex %>\", <%= it.visual3.fg.xterm %>], [\"<%= it.visual3.bg.hex %>\", <%= it.visual3.bg.xterm %>]]]\nlet s:p.visual.right = [[[\"<%= it.visual4.fg.hex %>\", <%= it.visual4.fg.xterm %>], [\"<%= it.visual4.bg.hex %>\", <%= it.visual4.bg.xterm %>]], [[\"<%= it.visual5.fg.hex %>\", <%= it.visual5.fg.xterm %>], [\"<%= it.visual5.bg.hex %>\", <%= it.visual5.bg.xterm %>]]]\n\nlet s:p.tabline.left = [[[\"<%= it.tablineLeft.fg.hex %>\", <%= it.tablineLeft.fg.xterm %>], [\"<%= it.tablineLeft.bg.hex %>\", <%= it.tablineLeft.bg.xterm %>]]]\nlet s:p.tabline.tabsel = [[[\"<%= it.tablineSelected.fg.hex %>\", <%= it.tablineSelected.fg.xterm %>], [\"<%= it.tablineSelected.bg.hex %>\", <%= it.tablineSelected.bg.xterm %>]]]\nlet s:p.tabline.middle = [[[\"<%= it.tablineMiddle.fg.hex %>\", <%= it.tablineMiddle.fg.xterm %>], [\"<%= it.tablineMiddle.bg.hex %>\", <%= it.tablineMiddle.bg.xterm %>]]]\nlet s:p.tabline.right = [[[\"<%= it.tablineRight.fg.hex %>\", <%= it.tablineRight.fg.xterm %>], [\"<%= it.tablineRight.bg.hex %>\", <%= it.tablineRight.bg.xterm %>]]]\n\nlet g:lightline#colorscheme#<%= info.name %>#palette = lightline#colorscheme#flatten(s:p)\n",
        "project": "name: '<%= it.name %>'\nversion: '<%= it.version %>'\nlicense: '<%= it.license %>'\nauthor: '<%= it.author %>'\nurl: '<%= it.url %>'\ndescription: '<%= it.description %>'\ncolorschemes:\n- name: '<%= it.name %>'\n  background: 'dark'\n  palette: '<%= it.name %>'\n",
        "airline": "<% const info = it.info; %>\n\"\"\n\" Airline_theme: <%= info.name %>\n\n<% if(info.description){ %>\" Description: <%= info.description %>\n<% } %>\n\n<% if(info.url){%>\" URL: <%= info.url %>\n<% } %>\n\n<% if(info.author){%>\" Author: <%= info.author %>\n<% } %>\n\n<% if(info.license){%>\" License: <%= info.license %>\n<% } %>\n\n\"\"\n\nlet g:airline#themes#<%= info.name %>#palette = {}\n\nlet s:normal1 = [ \"<%= it.normal1.fg.hex %>\", \"<%= it.normal1.bg.hex %>\", <%= it.normal1.fg.xterm %>, <%= it.normal1.bg.xterm %> ]\nlet s:normal2 = [ \"<%= it.normal2.fg.hex %>\", \"<%= it.normal2.bg.hex %>\", <%= it.normal2.fg.xterm %>, <%= it.normal2.bg.xterm %> ]\nlet s:normal3 = [ \"<%= it.normal3.fg.hex %>\", \"<%= it.normal3.bg.hex %>\", <%= it.normal3.fg.xterm %>, <%= it.normal3.bg.xterm %> ]\nlet g:airline#themes#<%= it.info.name %>#palette.normal = airline#themes#generate_color_map(s:normal1, s:normal2, s:normal3)\n\nlet s:insert1 = [ \"<%= it.insert1.fg.hex %>\", \"<%= it.insert1.bg.hex %>\", <%= it.insert1.fg.xterm %>, <%= it.insert1.bg.xterm %> ]\nlet s:insert2 = [ \"<%= it.insert2.fg.hex %>\", \"<%= it.insert2.bg.hex %>\", <%= it.insert2.fg.xterm %>, <%= it.insert2.bg.xterm %> ]\nlet s:insert3 = [ \"<%= it.insert3.fg.hex %>\", \"<%= it.insert3.bg.hex %>\", <%= it.insert3.fg.xterm %>, <%= it.insert3.bg.xterm %> ]\nlet g:airline#themes#<%= it.info.name %>#palette.insert = airline#themes#generate_color_map(s:insert1, s:insert2, s:insert3)\n\nlet s:replace1 = [ \"<%= it.replace1.fg.hex %>\", \"<%= it.replace1.bg.hex %>\", <%= it.replace1.fg.xterm %>, <%= it.replace1.bg.xterm %> ]\nlet s:replace2 = [ \"<%= it.replace2.fg.hex %>\", \"<%= it.replace2.bg.hex %>\", <%= it.replace2.fg.xterm %>, <%= it.replace2.bg.xterm %> ]\nlet s:replace3 = [ \"<%= it.replace3.fg.hex %>\", \"<%= it.replace3.bg.hex %>\", <%= it.replace3.fg.xterm %>, <%= it.replace3.bg.xterm %> ]\nlet g:airline#themes#<%= it.info.name %>#palette.replace = airline#themes#generate_color_map(s:replace1, s:replace2, s:replace3)\n\nlet s:visual1 = [ \"<%= it.visual1.fg.hex %>\", \"<%= it.visual1.bg.hex %>\", <%= it.visual1.fg.xterm %>, <%= it.visual1.bg.xterm %> ]\nlet s:visual2 = [ \"<%= it.visual2.fg.hex %>\", \"<%= it.visual2.bg.hex %>\", <%= it.visual2.fg.xterm %>, <%= it.visual2.bg.xterm %> ]\nlet s:visual3 = [ \"<%= it.visual3.fg.hex %>\", \"<%= it.visual3.bg.hex %>\", <%= it.visual3.fg.xterm %>, <%= it.visual3.bg.xterm %> ]\nlet g:airline#themes#<%= it.info.name %>#palette.visual = airline#themes#generate_color_map(s:visual1, s:visual2, s:visual3)\n\nlet s:inactive1 = [ \"<%= it.inactive1.fg.hex %>\", \"<%= it.inactive1.bg.hex %>\", <%= it.inactive1.fg.xterm %>, <%= it.inactive1.bg.xterm %> ]\nlet s:inactive2 = [ \"<%= it.inactive2.fg.hex %>\", \"<%= it.inactive2.bg.hex %>\", <%= it.inactive2.fg.xterm %>, <%= it.inactive2.bg.xterm %> ]\nlet s:inactive3 = [ \"<%= it.inactive3.fg.hex %>\", \"<%= it.inactive3.bg.hex %>\", <%= it.inactive3.fg.xterm %>, <%= it.inactive3.bg.xterm %> ]\nlet g:airline#themes#<%= it.info.name %>#palette.inactive = airline#themes#generate_color_map(s:inactive1, s:inactive2, s:inactive3)\n\n<% if(it.ctrlp1){ %>\nif !get(g:, 'loaded_ctrlp', 0)\n  finish\nendif\n\nlet s:CP1 = [ \"<%= it.ctrlp1.fg.hex %>\", \"<%= it.ctrlp1.bg.hex %>\", <%= it.ctrlp1.fg.xterm %>, <%= it.ctrlp1.bg.xterm %> ]\nlet s:CP2 = [ \"<%= it.ctrlp2.fg.hex %>\", \"<%= it.ctrlp2.bg.hex %>\", <%= it.ctrlp2.fg.xterm %>, <%= it.ctrlp2.bg.xterm %> ]\nlet s:CP3 = [ \"<%= it.ctrlp3.fg.hex %>\", \"<%= it.ctrlp3.bg.hex %>\", <%= it.ctrlp3.fg.xterm %>, <%= it.ctrlp3.bg.xterm %> ]\n\nlet g:airline#themes#<%= it.info.name %>#palette.ctrlp = airline#extensions#ctrlp#generate_color_map(s:CP1, s:CP2, s:CP3)\n<% } %>\n"
    },
    "addons": {
        "lightline": "normal1: ''\nnormal2: ''\nnormal3: ''\nnormal4: ''\nnormal5: ''\nnormalError: ''\nnormalWarning: ''\ninactive1: ''\ninactive2: ''\ninactive3: ''\ninactive4: ''\ninactive5: ''\ninsert1: ''\ninsert2: ''\ninsert3: ''\ninsert4: ''\ninsert5: ''\nreplace1: ''\nreplace2: ''\nreplace3: ''\nreplace4: ''\nreplace5: ''\nvisual1: ''\nvisual2: ''\nvisual3: ''\nvisual4: ''\nvisual5: ''\ntablineLeft: ''\ntablineSelected: ''\ntablineMiddle: ''\ntablineRight: ''\n",
        "terminal": "color_foreground: ''\ncolor_background: ''\ncolor_0: ''\ncolor_1: ''\ncolor_2: ''\ncolor_3: ''\ncolor_4: ''\ncolor_5: ''\ncolor_6: ''\ncolor_7: ''\ncolor_8: ''\ncolor_9: ''\ncolor_10: ''\ncolor_11: ''\ncolor_12: ''\ncolor_13: ''\ncolor_14: ''\ncolor_15: ''\n",
        "airline": "normal1: ''\nnormal2: ''\nnormal3: ''\ninactive1: ''\ninactive2: ''\ninactive3: ''\ninsert1: ''\ninsert2: ''\ninsert3: ''\nreplace1: ''\nreplace2: ''\nreplace3: ''\nvisual1: ''\nvisual2: ''\nvisual3: ''\nctrlp1: '' # optional\nctrlp2: '' # optional\nctrlp3: '' # optional\n"
    }
};
function installTemplates(projectPath, templates) {
    templates.forEach((name)=>{
        const destination = resolve2(projectPath, "estilos/syntax", name + ".yml");
        try {
            Deno.writeTextFileSync(destination, __default1.syntax[name]);
        } catch (err) {
            console.error(err);
        }
    });
    console.log(`%cAdded ${templates.length} templates:`, "color: green");
    templates.map((name)=>`%c✓ %c${name}`).forEach((line)=>console.log(line, "color: green", "color: default"));
}
const defaultPalette = "myblue: '#99ccff'";
async function createProject(projectPath, noQuestions) {
    const options = noQuestions ? getDefaultConfig(projectPath) : await askConfig(projectPath);
    await createBoilerplate(projectPath, options);
}
function getDefaultConfig(projectPath) {
    return {
        name: basename2(projectPath),
        author: "",
        version: "1.0.0",
        url: "",
        license: "MIT",
        description: "A (neo)vim colorscheme"
    };
}
async function askConfig(projectPath) {
    const folderName = basename2(projectPath);
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
        }
    ]);
}
async function createBoilerplate(projectPath, options) {
    const estiloStr = await renderConfigFile(options);
    const estilosFolder = resolve2(projectPath, "estilos");
    const syntaxFolder = resolve2(estilosFolder, "syntax");
    const palettesFolder = resolve2(estilosFolder, "palettes");
    ensureDirSync(estilosFolder);
    ensureDirSync(syntaxFolder);
    ensureDirSync(palettesFolder);
    Deno.writeTextFileSync(resolve2(projectPath, "estilo.yml"), estiloStr);
    Deno.writeTextFileSync(resolve2(estilosFolder, "terminal.yml"), __default1.addons["terminal"]);
    Deno.writeTextFileSync(resolve2(palettesFolder, options.name + ".yml"), defaultPalette);
    installTemplates(projectPath, [
        "base"
    ]);
    console.log("%c✓  Your project is ready\n", "color: green");
}
async function renderConfigFile(options) {
    return await render(__default1.mustaches["project"], options);
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
    return result.filter((_type, index)=>!exclude.includes(index));
}
function compileMap(...typesList) {
    const result = {
        fallback: {},
        mapping: {},
        scalar: {},
        sequence: {}
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
                ])
            ],
            explicit: [
                ...new Set([
                    ...this.explicit,
                    ...definition?.explicit ?? []
                ])
            ],
            include: [
                ...new Set([
                    ...this.include,
                    ...definition?.include ?? []
                ])
            ]
        });
    }
    static create() {}
}
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
            this.resolve = options.resolve || (()=>true);
            this.construct = options.construct || ((data)=>data);
            this.instanceOf = options.instanceOf;
            this.predicate = options.predicate;
            this.represent = options.represent;
            this.defaultStyle = options.defaultStyle;
            this.styleAliases = options.styleAliases;
        }
    }
    resolve = ()=>true;
    construct = (data)=>data;
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
            result.push(bits >> 16 & 0xff);
            result.push(bits >> 8 & 0xff);
            result.push(bits & 0xff);
        }
        bits = bits << 6 | map.indexOf(input.charAt(idx));
    }
    const tailbits = max % 4 * 6;
    if (tailbits === 0) {
        result.push(bits >> 16 & 0xff);
        result.push(bits >> 8 & 0xff);
        result.push(bits & 0xff);
    } else if (tailbits === 18) {
        result.push(bits >> 10 & 0xff);
        result.push(bits >> 2 & 0xff);
    } else if (tailbits === 12) {
        result.push(bits >> 4 & 0xff);
    }
    return new Uint8Array(result);
}
function representYamlBinary(object) {
    const max = object.length;
    const map = BASE64_MAP;
    let result = "";
    let bits = 0;
    for(let idx = 0; idx < max; idx++){
        if (idx % 3 === 0 && idx) {
            result += map[bits >> 18 & 0x3f];
            result += map[bits >> 12 & 0x3f];
            result += map[bits >> 6 & 0x3f];
            result += map[bits & 0x3f];
        }
        bits = (bits << 8) + object[idx];
    }
    const tail = max % 3;
    if (tail === 0) {
        result += map[bits >> 18 & 0x3f];
        result += map[bits >> 12 & 0x3f];
        result += map[bits >> 6 & 0x3f];
        result += map[bits & 0x3f];
    } else if (tail === 2) {
        result += map[bits >> 10 & 0x3f];
        result += map[bits >> 4 & 0x3f];
        result += map[bits << 2 & 0x3f];
        result += map[64];
    } else if (tail === 1) {
        result += map[bits >> 2 & 0x3f];
        result += map[bits << 4 & 0x3f];
        result += map[64];
        result += map[64];
    }
    return result;
}
function isBinary(obj) {
    return obj instanceof Uint8Array;
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
        let valueNb = 0.0;
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
new Type1("tag:yaml.org,2002:js/function", {
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
    return 0x30 <= c && c <= 0x39 || 0x41 <= c && c <= 0x46 || 0x61 <= c && c <= 0x66;
}
function isOctCode(c) {
    return 0x30 <= c && c <= 0x37;
}
function isDecCode(c) {
    return 0x30 <= c && c <= 0x39;
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
        return data !== null ? data : {};
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
const { hasOwn } = Object;
const _toString = Object.prototype.toString;
function resolveYamlOmap(data) {
    const objectKeys = [];
    let pairKey = "";
    let pairHasKey = false;
    for (const pair of data){
        pairHasKey = false;
        if (_toString.call(pair) !== "[object Object]") return false;
        for(pairKey in pair){
            if (hasOwn(pair, pairKey)) {
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
    const result = Array.from({
        length: data.length
    });
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
    const result = Array.from({
        length: data.length
    });
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
        const { regexp = `${data}`, modifiers = "" } = `${data}`.match(REGEXP)?.groups ?? {};
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
const { hasOwn: hasOwn1 } = Object;
function resolveYamlSet(data) {
    if (data === null) return true;
    for(const key in data){
        if (hasOwn1(data, key)) {
            if (data[key] !== null) return false;
        }
    }
    return true;
}
function constructYamlSet(data) {
    return data !== null ? data : {};
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
const json = new Schema({
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
        json
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
    documents;
    length;
    lineIndent;
    lineStart;
    position;
    line;
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
    result;
    constructor(input, { filename, schema, onWarning, legacy = false, json = false, listener = null }){
        super(schema);
        this.input = input;
        this.documents = [];
        this.lineIndent = 0;
        this.lineStart = 0;
        this.position = 0;
        this.line = 0;
        this.result = "";
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
const { hasOwn: hasOwn2 } = Object;
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
    return c === 0x0a || c === 0x0d;
}
function isWhiteSpace(c) {
    return c === 0x09 || c === 0x20;
}
function isWsOrEol(c) {
    return c === 0x09 || c === 0x20 || c === 0x0a || c === 0x0d;
}
function isFlowIndicator(c) {
    return c === 0x2c || c === 0x5b || c === 0x5d || c === 0x7b || c === 0x7d;
}
function fromHexCode(c) {
    if (0x30 <= c && c <= 0x39) {
        return c - 0x30;
    }
    const lc = c | 0x20;
    if (0x61 <= lc && lc <= 0x66) {
        return lc - 0x61 + 10;
    }
    return -1;
}
function escapedHexLen(c) {
    if (c === 0x78) {
        return 2;
    }
    if (c === 0x75) {
        return 4;
    }
    if (c === 0x55) {
        return 8;
    }
    return 0;
}
function fromDecimalCode(c) {
    if (0x30 <= c && c <= 0x39) {
        return c - 0x30;
    }
    return -1;
}
function simpleEscapeSequence(c) {
    return c === 0x30 ? "\x00" : c === 0x61 ? "\x07" : c === 0x62 ? "\x08" : c === 0x74 ? "\x09" : c === 0x09 ? "\x09" : c === 0x6e ? "\x0A" : c === 0x76 ? "\x0B" : c === 0x66 ? "\x0C" : c === 0x72 ? "\x0D" : c === 0x65 ? "\x1B" : c === 0x20 ? " " : c === 0x22 ? "\x22" : c === 0x2f ? "/" : c === 0x5c ? "\x5C" : c === 0x4e ? "\x85" : c === 0x5f ? "\xA0" : c === 0x4c ? "\u2028" : c === 0x50 ? "\u2029" : "";
}
function charFromCodepoint(c) {
    if (c <= 0xffff) {
        return String.fromCharCode(c);
    }
    return String.fromCharCode((c - 0x010000 >> 10) + 0xd800, (c - 0x010000 & 0x03ff) + 0xdc00);
}
const simpleEscapeCheck = Array.from({
    length: 256
});
const simpleEscapeMap = Array.from({
    length: 256
});
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
        if (state.tagMap && hasOwn2(state.tagMap, handle)) {
            return throwError(state, `there is a previously declared suffix for "${handle}" tag handle`);
        }
        if (!PATTERN_TAG_URI.test(prefix)) {
            return throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
        }
        if (typeof state.tagMap === "undefined") {
            state.tagMap = Object.create(null);
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
                if (!(character === 0x09 || 0x20 <= character && character <= 0x10ffff)) {
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
        if (!hasOwn2(destination, key)) {
            Object.defineProperty(destination, key, {
                value: source[key],
                writable: true,
                enumerable: true,
                configurable: true
            });
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
        result = {};
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
        if (!state.json && !hasOwn2(overridableKeys, keyNode) && hasOwn2(result, keyNode)) {
            state.line = startLine || state.line;
            state.position = startPos || state.position;
            return throwError(state, "duplicated mapping key");
        }
        Object.defineProperty(result, keyNode, {
            value: valueNode,
            writable: true,
            enumerable: true,
            configurable: true
        });
        delete overridableKeys[keyNode];
    }
    return result;
}
function readLineBreak(state) {
    const ch = state.input.charCodeAt(state.position);
    if (ch === 0x0a) {
        state.position++;
    } else if (ch === 0x0d) {
        state.position++;
        if (state.input.charCodeAt(state.position) === 0x0a) {
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
        if (allowComments && ch === 0x23) {
            do {
                ch = state.input.charCodeAt(++state.position);
            }while (ch !== 0x0a && ch !== 0x0d && ch !== 0)
        }
        if (isEOL(ch)) {
            readLineBreak(state);
            ch = state.input.charCodeAt(state.position);
            lineBreaks++;
            state.lineIndent = 0;
            while(ch === 0x20){
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
    if ((ch === 0x2d || ch === 0x2e) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
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
    if (isWsOrEol(ch) || isFlowIndicator(ch) || ch === 0x23 || ch === 0x26 || ch === 0x2a || ch === 0x21 || ch === 0x7c || ch === 0x3e || ch === 0x27 || ch === 0x22 || ch === 0x25 || ch === 0x40 || ch === 0x60) {
        return false;
    }
    let following;
    if (ch === 0x3f || ch === 0x2d) {
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
        if (ch === 0x3a) {
            following = state.input.charCodeAt(state.position + 1);
            if (isWsOrEol(following) || withinFlowCollection && isFlowIndicator(following)) {
                break;
            }
        } else if (ch === 0x23) {
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
    if (ch !== 0x27) {
        return false;
    }
    state.kind = "scalar";
    state.result = "";
    state.position++;
    captureStart = captureEnd = state.position;
    while((ch = state.input.charCodeAt(state.position)) !== 0){
        if (ch === 0x27) {
            captureSegment(state, captureStart, state.position, true);
            ch = state.input.charCodeAt(++state.position);
            if (ch === 0x27) {
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
    if (ch !== 0x22) {
        return false;
    }
    state.kind = "scalar";
    state.result = "";
    state.position++;
    let captureEnd, captureStart = captureEnd = state.position;
    let tmp;
    while((ch = state.input.charCodeAt(state.position)) !== 0){
        if (ch === 0x22) {
            captureSegment(state, captureStart, state.position, true);
            state.position++;
            return true;
        }
        if (ch === 0x5c) {
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
    let result = {};
    if (ch === 0x5b) {
        terminator = 0x5d;
        isMapping = false;
        result = [];
    } else if (ch === 0x7b) {
        terminator = 0x7d;
    } else {
        return false;
    }
    if (state.anchor !== null && typeof state.anchor !== "undefined" && typeof state.anchorMap !== "undefined") {
        state.anchorMap[state.anchor] = result;
    }
    ch = state.input.charCodeAt(++state.position);
    const tag = state.tag, anchor = state.anchor;
    let readNext = true;
    let valueNode, keyNode, keyTag = keyNode = valueNode = null, isExplicitPair, isPair = isExplicitPair = false;
    let following = 0, line = 0;
    const overridableKeys = Object.create(null);
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
        if (ch === 0x3f) {
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
        if ((isExplicitPair || state.line === line) && ch === 0x3a) {
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
        if (ch === 0x2c) {
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
    if (ch === 0x7c) {
        folding = false;
    } else if (ch === 0x3e) {
        folding = true;
    } else {
        return false;
    }
    state.kind = "scalar";
    state.result = "";
    let tmp = 0;
    while(ch !== 0){
        ch = state.input.charCodeAt(++state.position);
        if (ch === 0x2b || ch === 0x2d) {
            if (1 === chomping) {
                chomping = ch === 0x2b ? CHOMPING_KEEP : CHOMPING_STRIP;
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
        if (ch === 0x23) {
            do {
                ch = state.input.charCodeAt(++state.position);
            }while (!isEOL(ch) && ch !== 0)
        }
    }
    while(ch !== 0){
        readLineBreak(state);
        state.lineIndent = 0;
        ch = state.input.charCodeAt(state.position);
        while((!detectedIndent || state.lineIndent < textIndent) && ch === 0x20){
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
        if (ch !== 0x2d) {
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
    const tag = state.tag, anchor = state.anchor, result = {}, overridableKeys = Object.create(null);
    let following, allowCompact = false, line, pos, keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
    if (state.anchor !== null && typeof state.anchor !== "undefined" && typeof state.anchorMap !== "undefined") {
        state.anchorMap[state.anchor] = result;
    }
    ch = state.input.charCodeAt(state.position);
    while(ch !== 0){
        following = state.input.charCodeAt(state.position + 1);
        line = state.line;
        pos = state.position;
        if ((ch === 0x3f || ch === 0x3a) && isWsOrEol(following)) {
            if (ch === 0x3f) {
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
                if (ch === 0x3a) {
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
    if (ch !== 0x21) return false;
    if (state.tag !== null) {
        return throwError(state, "duplication of a tag property");
    }
    ch = state.input.charCodeAt(++state.position);
    if (ch === 0x3c) {
        isVerbatim = true;
        ch = state.input.charCodeAt(++state.position);
    } else if (ch === 0x21) {
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
        }while (ch !== 0 && ch !== 0x3e)
        if (state.position < state.length) {
            tagName = state.input.slice(position, state.position);
            ch = state.input.charCodeAt(++state.position);
        } else {
            return throwError(state, "unexpected end of the stream within a verbatim tag");
        }
    } else {
        while(ch !== 0 && !isWsOrEol(ch)){
            if (ch === 0x21) {
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
    } else if (typeof state.tagMap !== "undefined" && hasOwn2(state.tagMap, tagHandle)) {
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
    if (ch !== 0x26) return false;
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
    if (ch !== 0x2a) return false;
    ch = state.input.charCodeAt(++state.position);
    const _position = state.position;
    while(ch !== 0 && !isWsOrEol(ch) && !isFlowIndicator(ch)){
        ch = state.input.charCodeAt(++state.position);
    }
    if (state.position === _position) {
        return throwError(state, "name of an alias node must contain at least one character");
    }
    const alias = state.input.slice(_position, state.position);
    if (typeof state.anchorMap !== "undefined" && !hasOwn2(state.anchorMap, alias)) {
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
        } else if (hasOwn2(state.typeMap[state.kind || "fallback"], state.tag)) {
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
    state.tagMap = Object.create(null);
    state.anchorMap = Object.create(null);
    while((ch = state.input.charCodeAt(state.position)) !== 0){
        skipSeparationSpace(state, true, -1);
        ch = state.input.charCodeAt(state.position);
        if (state.lineIndent > 0 || ch !== 0x25) {
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
            if (ch === 0x23) {
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
        if (hasOwn2(directiveHandlers, directiveName)) {
            directiveHandlers[directiveName](state, directiveName, ...directiveArgs);
        } else {
            throwWarning(state, `unknown document directive "${directiveName}"`);
        }
    }
    skipSeparationSpace(state, true, -1);
    if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 0x2d && state.input.charCodeAt(state.position + 1) === 0x2d && state.input.charCodeAt(state.position + 2) === 0x2d) {
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
        if (state.input.charCodeAt(state.position) === 0x2e) {
            state.position += 3;
            skipSeparationSpace(state, true, -1);
        }
        return;
    }
    if (state.position < state.length - 1) {
        return throwError(state, "end of the stream or a document separator is expected");
    }
}
function loadDocuments(input, options) {
    input = String(input);
    options = options || {};
    if (input.length !== 0) {
        if (input.charCodeAt(input.length - 1) !== 0x0a && input.charCodeAt(input.length - 1) !== 0x0d) {
            input += "\n";
        }
        if (input.charCodeAt(0) === 0xfeff) {
            input = input.slice(1);
        }
    }
    const state = new LoaderState(input, options);
    state.input += "\0";
    while(state.input.charCodeAt(state.position) === 0x20){
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
        return null;
    }
    if (documents.length === 1) {
        return documents[0];
    }
    throw new YAMLError("expected a single document in the stream, but found more");
}
function parse8(content, options) {
    return load(content, options);
}
const { hasOwn: hasOwn3 } = Object;
Object.prototype.toString;
const { hasOwn: hasOwn4 } = Object;
const ESCAPE_SEQUENCES = {};
ESCAPE_SEQUENCES[0x00] = "\\0";
ESCAPE_SEQUENCES[0x07] = "\\a";
ESCAPE_SEQUENCES[0x08] = "\\b";
ESCAPE_SEQUENCES[0x09] = "\\t";
ESCAPE_SEQUENCES[0x0a] = "\\n";
ESCAPE_SEQUENCES[0x0b] = "\\v";
ESCAPE_SEQUENCES[0x0c] = "\\f";
ESCAPE_SEQUENCES[0x0d] = "\\r";
ESCAPE_SEQUENCES[0x1b] = "\\e";
ESCAPE_SEQUENCES[0x22] = '\\"';
ESCAPE_SEQUENCES[0x5c] = "\\\\";
ESCAPE_SEQUENCES[0x85] = "\\N";
ESCAPE_SEQUENCES[0xa0] = "\\_";
ESCAPE_SEQUENCES[0x2028] = "\\L";
ESCAPE_SEQUENCES[0x2029] = "\\P";
const cache1 = {};
function isHexColor1(color) {
    return /^([0-9A-F]{6}|[0-9A-F]{3})$/i.test(color);
}
function hexColorDelta(hex1, hex2) {
    const r1 = parseInt(hex1.slice(0, 2), 16);
    const g1 = parseInt(hex1.slice(2, 4), 16);
    const b1 = parseInt(hex1.slice(4, 6), 16);
    const r2 = parseInt(hex2.slice(0, 2), 16);
    const g2 = parseInt(hex2.slice(2, 4), 16);
    const b2 = parseInt(hex2.slice(4, 6), 16);
    let r = 255 - Math.abs(r1 - r2);
    let g = 255 - Math.abs(g1 - g2);
    let b = 255 - Math.abs(b1 - b2);
    r /= 255;
    g /= 255;
    b /= 255;
    return (r + g + b) / 3;
}
function hexterm(hex) {
    if (typeof hex !== "string") {
        throw new Error("hex value has to be a string");
    }
    hex = hex.trim();
    if (hex.startsWith("#")) {
        hex = hex.slice(1);
    }
    if (!isHexColor1(hex)) {
        throw new Error("wrong hexadecimal color code");
    }
    if (hex.length === 3) {
        hex = "" + hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    hex = hex.toLowerCase();
    const direct = xtermcolors.findIndex((color)=>color === hex);
    if (direct !== -1) return direct;
    const cached = cache1[hex];
    if (cached) return cached;
    let similar = 0;
    const closest = {};
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
    "000000",
    "800000",
    "008000",
    "808000",
    "000080",
    "800080",
    "008080",
    "c0c0c0",
    "808080",
    "ff0000",
    "00ff00",
    "ffff00",
    "0000ff",
    "ff00ff",
    "00ffff",
    "ffffff",
    "000000",
    "00005f",
    "000087",
    "0000af",
    "0000d7",
    "0000ff",
    "005f00",
    "005f5f",
    "005f87",
    "005faf",
    "005fd7",
    "005fff",
    "008700",
    "00875f",
    "008787",
    "0087af",
    "0087d7",
    "0087ff",
    "00af00",
    "00af5f",
    "00af87",
    "00afaf",
    "00afd7",
    "00afff",
    "00d700",
    "00d75f",
    "00d787",
    "00d7af",
    "00d7d7",
    "00d7ff",
    "00ff00",
    "00ff5f",
    "00ff87",
    "00ffaf",
    "00ffd7",
    "00ffff",
    "5f0000",
    "5f005f",
    "5f0087",
    "5f00af",
    "5f00d7",
    "5f00ff",
    "5f5f00",
    "5f5f5f",
    "5f5f87",
    "5f5faf",
    "5f5fd7",
    "5f5fff",
    "5f8700",
    "5f875f",
    "5f8787",
    "5f87af",
    "5f87d7",
    "5f87ff",
    "5faf00",
    "5faf5f",
    "5faf87",
    "5fafaf",
    "5fafd7",
    "5fafff",
    "5fd700",
    "5fd75f",
    "5fd787",
    "5fd7af",
    "5fd7d7",
    "5fd7ff",
    "5fff00",
    "5fff5f",
    "5fff87",
    "5fffaf",
    "5fffd7",
    "5fffff",
    "870000",
    "87005f",
    "870087",
    "8700af",
    "8700d7",
    "8700ff",
    "875f00",
    "875f5f",
    "875f87",
    "875faf",
    "875fd7",
    "875fff",
    "878700",
    "87875f",
    "878787",
    "8787af",
    "8787d7",
    "8787ff",
    "87af00",
    "87af5f",
    "87af87",
    "87afaf",
    "87afd7",
    "87afff",
    "87d700",
    "87d75f",
    "87d787",
    "87d7af",
    "87d7d7",
    "87d7ff",
    "87ff00",
    "87ff5f",
    "87ff87",
    "87ffaf",
    "87ffd7",
    "87ffff",
    "af0000",
    "af005f",
    "af0087",
    "af00af",
    "af00d7",
    "af00ff",
    "af5f00",
    "af5f5f",
    "af5f87",
    "af5faf",
    "af5fd7",
    "af5fff",
    "af8700",
    "af875f",
    "af8787",
    "af87af",
    "af87d7",
    "af87ff",
    "afaf00",
    "afaf5f",
    "afaf87",
    "afafaf",
    "afafd7",
    "afafff",
    "afd700",
    "afd75f",
    "afd787",
    "afd7af",
    "afd7d7",
    "afd7ff",
    "afff00",
    "afff5f",
    "afff87",
    "afffaf",
    "afffd7",
    "afffff",
    "d70000",
    "d7005f",
    "d70087",
    "d700af",
    "d700d7",
    "d700ff",
    "d75f00",
    "d75f5f",
    "d75f87",
    "d75faf",
    "d75fd7",
    "d75fff",
    "d78700",
    "d7875f",
    "d78787",
    "d787af",
    "d787d7",
    "d787ff",
    "d7af00",
    "d7af5f",
    "d7af87",
    "d7afaf",
    "d7afd7",
    "d7afff",
    "d7d700",
    "d7d75f",
    "d7d787",
    "d7d7af",
    "d7d7d7",
    "d7d7ff",
    "d7ff00",
    "d7ff5f",
    "d7ff87",
    "d7ffaf",
    "d7ffd7",
    "d7ffff",
    "ff0000",
    "ff005f",
    "ff0087",
    "ff00af",
    "ff00d7",
    "ff00ff",
    "ff5f00",
    "ff5f5f",
    "ff5f87",
    "ff5faf",
    "ff5fd7",
    "ff5fff",
    "ff8700",
    "ff875f",
    "ff8787",
    "ff87af",
    "ff87d7",
    "ff87ff",
    "ffaf00",
    "ffaf5f",
    "ffaf87",
    "ffafaf",
    "ffafd7",
    "ffafff",
    "ffd700",
    "ffd75f",
    "ffd787",
    "ffd7af",
    "ffd7d7",
    "ffd7ff",
    "ffff00",
    "ffff5f",
    "ffff87",
    "ffffaf",
    "ffffd7",
    "ffffff",
    "080808",
    "121212",
    "1c1c1c",
    "262626",
    "303030",
    "3a3a3a",
    "444444",
    "4e4e4e",
    "585858",
    "606060",
    "666666",
    "767676",
    "808080",
    "8a8a8a",
    "949494",
    "9e9e9e",
    "a8a8a8",
    "b2b2b2",
    "bcbcbc",
    "c6c6c6",
    "d0d0d0",
    "dadada",
    "e4e4e4",
    "eeeeee"
];
function formatSyntaxFile(file) {
    const filepath = file.filepath;
    const content = file.content;
    assertIsList(content, filepath);
    return Object.entries(content).map(([name, value])=>({
            filepath,
            name,
            rule: value.trim()
        })).filter((rule)=>rule.rule);
}
function formatSyntax(syntaxFiles) {
    return syntaxFiles.map((syntaxFile)=>formatSyntaxFile(syntaxFile)).flat();
}
function formatTerminal(data) {
    const formattedData = {};
    Object.keys(data).forEach((prop)=>{
        const colorname = data[prop].trim();
        if (colorname) formattedData[prop] = colorname;
    });
    return formattedData;
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
        "inactive3"
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
        "tablineRight"
    ]
};
function formatStatusStyles(statusFiles, brand) {
    const statusMap = {};
    statusFiles.forEach(({ filepath, content })=>{
        assertIsList(content, filepath);
        const style = formatStatusStyle(content, brand, filepath);
        statusMap[style.name] = style;
    });
    return statusMap;
}
function formatStatusStyle(content, brand, filepath) {
    const statusStyle = {
        name: basename2(filepath, ".yml"),
        filepath,
        syntax: {}
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
    const folderUrl = resolve2(projectUrl, "estilos", folder);
    if (!existsSync(folderUrl)) return [];
    return Array.from(Deno.readDirSync(folderUrl)).filter((file)=>file.name.endsWith(".yml")).map((file)=>resolve2(folderUrl, file.name)).map((filepath)=>loadYml(filepath));
}
function loadYml(folderPath, filename) {
    const filepath = resolve2(folderPath, filename || "");
    const content = parse8(Deno.readTextFileSync(filepath));
    assertIsObject(content, filepath);
    return {
        filepath,
        content
    };
}
function buildPalettes(paletteFiles, common = {}) {
    const commonPalette = buildMainPalette(common);
    const palettes = {};
    paletteFiles.forEach((paletteFile)=>{
        const palette = buildPalette(paletteFile, commonPalette);
        palettes[palette.name] = palette;
    });
    return palettes;
}
function buildMainPalette(content) {
    const colors = {};
    for (const name of Object.keys(content)){
        const hexcolor = content[name].trim();
        if (!isHexColor(hexcolor)) {
            crash("Wrong color in common palette", {
                name
            });
        }
        colors[name] = {
            hex: hexcolor.startsWith("#") ? hexcolor : "#" + hexcolor,
            xterm: hexterm(hexcolor).toString()
        };
    }
    return colors;
}
function buildPalette(paletteFile, common) {
    const { filepath, content } = paletteFile;
    assertIsList(content, filepath);
    const palette = {
        filepath,
        name: basename2(filepath, ".yml"),
        colors: structuredClone(common)
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
        if (!isHexColor(hexcolor)) {
            crash("Wrong color", {
                filepath,
                name,
                hexcolor
            });
        }
        palette.colors[name] = {
            hex: hexcolor.startsWith("#") ? hexcolor : "#" + hexcolor,
            xterm: hexterm(hexcolor).toString()
        };
    });
    return palette;
}
async function selectSyntax(projectPath, all = false) {
    const destFolder = resolve2(projectPath, "estilos/syntax");
    const libFiles = Object.keys(__default1.syntax);
    const destFiles = getFileNamesFromFolder(destFolder);
    const templates = all ? getMissingTemplates(libFiles, destFiles) : (await askForTemplates(libFiles, destFiles)).templates;
    installTemplates(projectPath, templates);
}
function getFileNamesFromFolder(folder) {
    return Array.from(Deno.readDirSync(folder)).map((file)=>file.name);
}
function getMissingTemplates(libFiles, destFiles) {
    return libFiles.filter((template)=>!destFiles.includes(template));
}
async function askForTemplates(libFiles, destFiles) {
    const options = libFiles.map((value)=>{
        const disabled = destFiles.includes(value);
        return {
            name: value + (disabled ? " (installed)" : ""),
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
        }
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
    return style.split("").map((val)=>uiValues[val]).join(",");
}
async function renderColorscheme(config, project) {
    const palette = project.palettes[config.palette];
    if (!palette) {
        crash("Colorscheme palette does not exist", {
            colorscheme: config.name,
            palette: config.palette
        });
    }
    return await render(__default1.mustaches["colorscheme"], {
        info: {
            name: config.name,
            description: config.description,
            url: project.config.url,
            author: project.config.author,
            license: project.config.license,
            background: config.background,
            estiloVersion: version
        },
        stacks: parseSyntaxColors(project.syntax, palette),
        term: parseTermColors(project.terminalSyntax, palette)
    });
}
function parseTermColors(termSyntax, palette) {
    const colors = {};
    Object.keys(termSyntax).forEach((prop)=>{
        const colorName = termSyntax[prop];
        const value = palette.colors[colorName];
        if (!value) {
            crash("Missing terminal color", {
                colorName,
                property: prop,
                palette: palette.filepath
            });
        }
        colors[prop] = value.hex;
    });
    return colors;
}
function parseSyntaxColors(syntax, palette) {
    const values = {};
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
    if (isHexColor(color)) {
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
    const out = {};
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
    const ctx = parseStatusColors(syntax, palette);
    const info = {
        name: config.name,
        description: config.description,
        url: project.config.url,
        author: project.config.author,
        license: project.config.license,
        estiloVersion: version
    };
    const context = Object.assign(ctx, {
        info
    });
    return await render(__default1.mustaches[brand], context);
}
const paths = {
    airline: "autoload/airline/themes",
    lightline: "autoload/lightline/colorscheme"
};
async function renderProject(project) {
    const { config: projectConfig } = project;
    for (const config of projectConfig.colorschemes){
        const rendered = await renderColorscheme(config, project);
        writeThing("colors", rendered, config.name, project.projectUrl);
    }
    if (projectConfig.airline) {
        for (const config of projectConfig.airline){
            const rendered = await renderStatus(config, project, "airline");
            writeThing(paths.airline, rendered, config.name, project.projectUrl);
        }
    }
    if (projectConfig.lightline) {
        for (const config of projectConfig.lightline){
            const rendered = await renderStatus(config, project, "lightline");
            writeThing(paths.lightline, rendered, config.name, project.projectUrl);
        }
    }
    console.log("%c✓  Done, your theme is ready\n", "color: green");
}
function writeThing(folder, txt, name, projectPath) {
    const folderPath = resolve2(projectPath, folder);
    const filepath = resolve2(folderPath, name + ".vim");
    ensureDirSync(folderPath);
    Deno.writeTextFileSync(filepath, txt);
}
async function installStatus(projectPath, brand, styleName) {
    const statusFolderPath = resolve2(projectPath, "estilos", brand);
    ensureDirSync(statusFolderPath);
    if (styleName) {
        return addStatus(projectPath, brand, styleName);
    }
    const installedStyles = Array.from(Deno.readDirSync(statusFolderPath)).map((n)=>n.name.slice(0, -4));
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
        }
    ]);
    addStatus(projectPath, brand, answers.stylename);
}
function addStatus(projectPath, brand, styleName) {
    const folderPath = resolve2(projectPath, "estilos", brand);
    ensureDirSync(folderPath);
    const filepath = resolve2(folderPath, styleName + ".yml");
    Deno.writeTextFileSync(filepath, __default1.addons[brand]);
    console.log(`%cNew ${brand} style: ${styleName}`, "color: green");
    console.log(`==> ${filepath}`);
}
const estiloCommand = new Command();
await estiloCommand.command("help", new HelpCommand().global()).reset().name("estilo").version(version).description("Generate colorschemes for (neo)vim, airline and lightline").command("create [folder]").description("Initialize an estilo project in [folder] or current folder").option("-y, --yes", "Skip questions").action((options, folder = ".")=>{
    createProject(resolve2(folder), !!options.yes);
}).reset().command("render [folder]").description("Render project").action((_, folder = ".")=>{
    const projectPath = resolve2(folder);
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
if (!Object.entries(Deno.args).length) {
    estiloCommand.showHelp();
}
function checkProject(projectPath) {
    const paths = [
        "estilo.yml",
        "estilos/syntax",
        "estilos/palettes",
        "estilos/terminal.yml"
    ];
    const notOk = paths.map((path)=>resolve2(projectPath, path)).filter((path)=>!existsSync(path));
    if (notOk.length) {
        if (existsSync(resolve2(projectPath, "estilo"))) {
            crash(`⚠ Wrong project folder. Follow upgrade instructions please`);
        } else {
            crash(`⚠ Wrong project folder. Missing paths:\n${notOk.join("\n")}`);
        }
    }
}
