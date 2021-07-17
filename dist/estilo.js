;window["BUCKETS_FS"]={"estilo-key":Object.freeze({"mustaches":{"project.hbs":"name: '{{name}}'\nversion: '{{version}}'\nlicense: '{{license}}'\nauthor: '{{author}}'\nurl: '{{url}}'\ndescription: '{{description}}'\ncolorschemes:\n- name: '{{name}}'\n  background: 'dark'\n  palette: '{{name}}'\n","airline.hbs":"\"\"\n\" Airline_theme: {{ info.name }}\n{{#if info.description}}\" Description: {{ info.description }}\n{{/if~}}\n{{#if info.url}}\" URL: {{ info.url }}\n{{/if~}}\n{{#if info.author}}\" Author: {{ info.author }}\n{{/if~}}\n{{#if info.license}}\" License: {{ info.license }}\n{{/if~}}\n\"\"\n\nlet g:airline#themes#{{info.name}}#palette = {}\n\nlet s:normal1 = [ \"{{normal1.fg.hex}}\", \"{{normal1.bg.hex}}\", {{normal1.fg.xterm}}, {{normal1.bg.xterm}} ]\nlet s:normal2 = [ \"{{normal2.fg.hex}}\", \"{{normal2.bg.hex}}\", {{normal2.fg.xterm}}, {{normal2.bg.xterm}} ]\nlet s:normal3 = [ \"{{normal3.fg.hex}}\", \"{{normal3.bg.hex}}\", {{normal3.fg.xterm}}, {{normal3.bg.xterm}} ]\nlet g:airline#themes#{{info.name}}#palette.normal = airline#themes#generate_color_map(s:normal1, s:normal2, s:normal3)\n\nlet s:insert1 = [ \"{{insert1.fg.hex}}\", \"{{insert1.bg.hex}}\", {{insert1.fg.xterm}}, {{insert1.bg.xterm}} ]\nlet s:insert2 = [ \"{{insert2.fg.hex}}\", \"{{insert2.bg.hex}}\", {{insert2.fg.xterm}}, {{insert2.bg.xterm}} ]\nlet s:insert3 = [ \"{{insert3.fg.hex}}\", \"{{insert3.bg.hex}}\", {{insert3.fg.xterm}}, {{insert3.bg.xterm}} ]\nlet g:airline#themes#{{info.name}}#palette.insert = airline#themes#generate_color_map(s:insert1, s:insert2, s:insert3)\n\nlet s:replace1 = [ \"{{replace1.fg.hex}}\", \"{{replace1.bg.hex}}\", {{replace1.fg.xterm}}, {{replace1.bg.xterm}} ]\nlet s:replace2 = [ \"{{replace2.fg.hex}}\", \"{{replace2.bg.hex}}\", {{replace2.fg.xterm}}, {{replace2.bg.xterm}} ]\nlet s:replace3 = [ \"{{replace3.fg.hex}}\", \"{{replace3.bg.hex}}\", {{replace3.fg.xterm}}, {{replace3.bg.xterm}} ]\nlet g:airline#themes#{{info.name}}#palette.replace = airline#themes#generate_color_map(s:replace1, s:replace2, s:replace3)\n\nlet s:visual1 = [ \"{{visual1.fg.hex}}\", \"{{visual1.bg.hex}}\", {{visual1.fg.xterm}}, {{visual1.bg.xterm}} ]\nlet s:visual2 = [ \"{{visual2.fg.hex}}\", \"{{visual2.bg.hex}}\", {{visual2.fg.xterm}}, {{visual2.bg.xterm}} ]\nlet s:visual3 = [ \"{{visual3.fg.hex}}\", \"{{visual3.bg.hex}}\", {{visual3.fg.xterm}}, {{visual3.bg.xterm}} ]\nlet g:airline#themes#{{info.name}}#palette.visual = airline#themes#generate_color_map(s:visual1, s:visual2, s:visual3)\n\nlet s:inactive1 = [ \"{{inactive1.fg.hex}}\", \"{{inactive1.bg.hex}}\", {{inactive1.fg.xterm}}, {{inactive1.bg.xterm}} ]\nlet s:inactive2 = [ \"{{inactive2.fg.hex}}\", \"{{inactive2.bg.hex}}\", {{inactive2.fg.xterm}}, {{inactive2.bg.xterm}} ]\nlet s:inactive3 = [ \"{{inactive3.fg.hex}}\", \"{{inactive3.bg.hex}}\", {{inactive3.fg.xterm}}, {{inactive3.bg.xterm}} ]\nlet g:airline#themes#{{info.name}}#palette.inactive = airline#themes#generate_color_map(s:inactive1, s:inactive2, s:inactive3)\n\n{{#if ctrlp1}}\nif !get(g:, 'loaded_ctrlp', 0)\n  finish\nendif\n\nlet s:CP1 = [ \"{{ctrlp1.fg.hex}}\", \"{{ctrlp1.bg.hex}}\", {{ctrlp1.fg.xterm}}, {{ctrlp1.bg.xterm}} ]\nlet s:CP2 = [ \"{{ctrlp2.fg.hex}}\", \"{{ctrlp2.bg.hex}}\", {{ctrlp2.fg.xterm}}, {{ctrlp2.bg.xterm}} ]\nlet s:CP3 = [ \"{{ctrlp3.fg.hex}}\", \"{{ctrlp3.bg.hex}}\", {{ctrlp3.fg.xterm}}, {{ctrlp3.bg.xterm}} ]\n\nlet g:airline#themes#{{info.name}}#palette.ctrlp = airline#extensions#ctrlp#generate_color_map(s:CP1, s:CP2, s:CP3)\n{{/if}}\n","colorscheme.hbs":"\"\"\n\" Colorscheme: {{ info.name }}\n{{#if info.description}}\" Description: {{ info.description }}\n{{/if~}}\n{{#if info.url}}\" URL: {{ info.url }}\n{{/if~}}\n{{#if info.author}}\" Author: {{ info.author }}\n{{/if~}}\n{{#if info.license}}\" License: {{ info.license }}\n{{/if~}}\n\"\"\n\nset background={{ info.background }}\nhi clear\nif exists(\"syntax_on\")\n  syntax reset\nendif\nlet g:colors_name=\"{{ info.name }}\"\n\n\nlet Italic = \"\"\nif exists('g:{{info.name}}_italic')\n  let Italic = \"italic\"\nendif\nlet g:{{info.name}}_italic = get(g:, '{{info.name}}_italic', 0)\n\nlet Bold = \"\"\nif exists('g:{{info.name}}_bold')\n  let Bold = \"bold\"\nendif\n\nlet g:{{info.name}}_bold = get(g:, '{{info.name}}_bold', 0)\n\n{{#each stacks~}}\n  {{#if link}}hi link {{@key}} {{link~}}\n  {{~^~}}hi {{ @key }}\n    {{~#if fore}} guifg={{fore.hex}} ctermfg={{fore.xterm}}{{/if}}\n    {{~#if back}} guibg={{back.hex}} ctermbg={{back.xterm}}{{/if}}\n    {{~#if ui}} gui={{ui}} cterm={{ui}}{{/if}}\n    {{~#if guisp}} guisp={{guisp.[0]}}{{/if}}\n  {{~/if}}\n\n{{/each}}\n\n{{#if term.color_0}}\nif has('terminal')\n  let g:terminal_ansi_colors = [\n    \\ \"{{term.color_0}}\",\n    \\ \"{{term.color_1}}\",\n    \\ \"{{term.color_2}}\",\n    \\ \"{{term.color_3}}\",\n    \\ \"{{term.color_4}}\",\n    \\ \"{{term.color_5}}\",\n    \\ \"{{term.color_6}}\",\n    \\ \"{{term.color_7}}\",\n    \\ \"{{term.color_8}}\",\n    \\ \"{{term.color_9}}\",\n    \\ \"{{term.color_10}}\",\n    \\ \"{{term.color_11}}\",\n    \\ \"{{term.color_12}}\",\n    \\ \"{{term.color_13}}\",\n    \\ \"{{term.color_14}}\",\n    \\ \"{{term.color_15}}\"\n  \\ ]\nendif\n\nif has('nvim')\n{{#each term}}\n  let g:terminal_{{@key}} = \"{{this}}\"\n{{/each}}\nendif\n{{~/if}}\n","lightline.hbs":"\"\"\n\" Lightline_theme: {{ info.name }}\n{{#if info.description}}\" Description: {{ info.description }}\n{{/if~}}\n{{#if info.url}}\" URL: {{ info.url }}\n{{/if~}}\n{{#if info.author}}\" Author: {{ info.author }}\n{{/if~}}\n{{#if info.license}}\" License: {{ info.license }}\n{{/if~}}\n\"\"\n\nlet s:p = {\"normal\": {}, \"inactive\": {}, \"insert\": {}, \"replace\": {}, \"visual\": {}, \"tabline\": {} }\n\nlet s:p.normal.left = [[[\"{{normal1.fg.hex}}\", {{normal1.fg.xterm}}], [\"{{normal1.bg.hex}}\", {{normal1.bg.xterm}}]], [[\"{{normal2.fg.hex}}\", {{normal2.fg.xterm}}], [\"{{normal2.bg.hex}}\", {{normal2.bg.xterm}}]]]\nlet s:p.normal.middle = [[[\"{{normal3.fg.hex}}\", {{normal3.fg.xterm}}], [\"{{normal3.bg.hex}}\", {{normal3.bg.xterm}}]]]\nlet s:p.normal.right = [[[\"{{normal4.fg.hex}}\", {{normal4.fg.xterm}}], [\"{{normal4.bg.hex}}\", {{normal4.bg.xterm}}]], [[\"{{normal5.fg.hex}}\", {{normal5.fg.xterm}}], [\"{{normal5.bg.hex}}\", {{normal5.bg.xterm}}]]]\nlet s:p.normal.error = [[[\"{{normalError.fg.hex}}\", {{normalError.fg.xterm}}], [\"{{normalError.bg.hex}}\", {{normalError.bg.xterm}}]]]\nlet s:p.normal.warning = [[[\"{{normalWarning.fg.hex}}\", {{normalWarning.fg.xterm}}], [\"{{normalWarning.bg.hex}}\", {{normalWarning.bg.xterm}}]]]\n\nlet s:p.inactive.left = [[[\"{{inactive1.fg.hex}}\", {{inactive1.fg.xterm}}], [\"{{inactive1.bg.hex}}\", {{inactive1.bg.xterm}}]], [[\"{{inactive2.fg.hex}}\", {{inactive2.fg.xterm}}], [\"{{inactive2.bg.hex}}\", {{inactive2.bg.xterm}}]]]\nlet s:p.inactive.middle = [[[\"{{inactive3.fg.hex}}\", {{inactive3.fg.xterm}}], [\"{{inactive3.bg.hex}}\", {{inactive3.bg.xterm}}]]]\nlet s:p.inactive.right = [[[\"{{inactive4.fg.hex}}\", {{inactive4.fg.xterm}}], [\"{{inactive4.bg.hex}}\", {{inactive4.bg.xterm}}]], [[\"{{inactive5.fg.hex}}\", {{inactive5.fg.xterm}}], [\"{{inactive5.bg.hex}}\", {{inactive5.bg.xterm}}]]]\n\nlet s:p.insert.left = [[[\"{{insert1.fg.hex}}\", {{insert1.fg.xterm}}], [\"{{insert1.bg.hex}}\", {{insert1.bg.xterm}}]], [[\"{{insert2.fg.hex}}\", {{insert2.fg.xterm}}], [\"{{insert2.bg.hex}}\", {{insert2.bg.xterm}}]]]\nlet s:p.insert.middle = [[[\"{{insert3.fg.hex}}\", {{insert3.fg.xterm}}], [\"{{insert3.bg.hex}}\", {{insert3.bg.xterm}}]]]\nlet s:p.insert.right = [[[\"{{insert4.fg.hex}}\", {{insert4.fg.xterm}}], [\"{{insert4.bg.hex}}\", {{insert4.bg.xterm}}]], [[\"{{insert5.fg.hex}}\", {{insert5.fg.xterm}}], [\"{{insert5.bg.hex}}\", {{insert5.bg.xterm}}]]]\n\nlet s:p.replace.left = [[[\"{{replace1.fg.hex}}\", {{replace1.fg.xterm}}], [\"{{replace1.bg.hex}}\", {{replace1.bg.xterm}}]], [[\"{{replace2.fg.hex}}\", {{replace2.fg.xterm}}], [\"{{replace2.bg.hex}}\", {{replace2.bg.xterm}}]]]\nlet s:p.replace.middle = [[[\"{{replace3.fg.hex}}\", {{replace3.fg.xterm}}], [\"{{replace3.bg.hex}}\", {{replace3.bg.xterm}}]]]\nlet s:p.replace.right = [[[\"{{replace4.fg.hex}}\", {{replace4.fg.xterm}}], [\"{{replace4.bg.hex}}\", {{replace4.bg.xterm}}]], [[\"{{replace5.fg.hex}}\", {{replace5.fg.xterm}}], [\"{{replace5.bg.hex}}\", {{replace5.bg.xterm}}]]]\n\nlet s:p.visual.left = [[[\"{{visual1.fg.hex}}\", {{visual1.fg.xterm}}], [\"{{visual1.bg.hex}}\", {{visual1.bg.xterm}}]], [[\"{{visual2.fg.hex}}\", {{visual2.fg.xterm}}], [\"{{visual2.bg.hex}}\", {{visual2.bg.xterm}}]]]\nlet s:p.visual.middle = [[[\"{{visual3.fg.hex}}\", {{visual3.fg.xterm}}], [\"{{visual3.bg.hex}}\", {{visual3.bg.xterm}}]]]\nlet s:p.visual.right = [[[\"{{visual4.fg.hex}}\", {{visual4.fg.xterm}}], [\"{{visual4.bg.hex}}\", {{visual4.bg.xterm}}]], [[\"{{visual5.fg.hex}}\", {{visual5.fg.xterm}}], [\"{{visual5.bg.hex}}\", {{visual5.bg.xterm}}]]]\n\nlet s:p.tabline.left = [[[\"{{tablineLeft.fg.hex}}\", {{tablineLeft.fg.xterm}}], [\"{{tablineLeft.bg.hex}}\", {{tablineLeft.bg.xterm}}]]]\nlet s:p.tabline.tabsel = [[[\"{{tablineSelected.fg.hex}}\", {{tablineSelected.fg.xterm}}], [\"{{tablineSelected.bg.hex}}\", {{tablineSelected.bg.xterm}}]]]\nlet s:p.tabline.middle = [[[\"{{tablineMiddle.fg.hex}}\", {{tablineMiddle.fg.xterm}}], [\"{{tablineMiddle.bg.hex}}\", {{tablineMiddle.bg.xterm}}]]]\nlet s:p.tabline.right = [[[\"{{tablineRight.fg.hex}}\", {{tablineRight.fg.xterm}}], [\"{{tablineRight.bg.hex}}\", {{tablineRight.bg.xterm}}]]]\n\nlet g:lightline#colorscheme#{{info.name}}#palette = lightline#colorscheme#flatten(s:p)\n"},"syntax":{"json.yml":"jsonPadding: '' # Operator\njsonString: '' # String\njsonTest: '' # Label\njsonEscape: '' # Special\njsonNumber: '' # Number\njsonBraces: '' # Delimiter\njsonNull: '' # Function\njsonBoolean: '' # Boolean\njsonKeyword: '' # Label\njsonNumError: '' # Error\njsonCommentError: '' # Error\njsonSemicolonError: '' # Error\njsonTrailingCommaError: '' # Error\njsonMissingCommaError: '' # Error\njsonStringSQError: '' # Error\njsonNoQuotesError: '' # Error\njsonTripleQuotesError: '' # Error\njsonQuote: '' # Quote\njsonNoise: '' # Noise\n","help.yml":"helpIgnore: '' # Ignore\nhelpHyperTextJump: '' # Identifier\nhelpBar: '' # Ignore\nhelpBacktick: '' # Ignore\nhelpStar: '' # Ignore\nhelpHyperTextEntry: '' # String\nhelpHeadline: '' # Statement\nhelpHeader: '' # PreProc\nhelpSectionDelim: '' # PreProc\nhelpVim: '' # Identifier\nhelpCommand: '' # Comment\nhelpExample: '' # Comment\nhelpOption: '' # Type\nhelpSpecial: '' # Special\nhelpNote: '' # Todo\nhelpComment: '' # Comment\nhelpConstant: '' # Constant\nhelpString: '' # String\nhelpCharacter: '' # Character\nhelpNumber: '' # Number\nhelpBoolean: '' # Boolean\nhelpFloat: '' # Float\nhelpIdentifier: '' # Identifier\nhelpFunction: '' # Function\nhelpStatement: '' # Statement\nhelpConditional: '' # Conditional\nhelpRepeat: '' # Repeat\nhelpLabel: '' # Label\nhelpOperator: '' # Operator\nhelpKeyword: '' # Keyword\nhelpException: '' # Exception\nhelpPreProc: '' # PreProc\nhelpInclude: '' # Include\nhelpDefine: '' # Define\nhelpMacro: '' # Macro\nhelpPreCondit: '' # PreCondit\nhelpType: '' # Type\nhelpStorageClass: '' # StorageClass\nhelpStructure: '' # Structure\nhelpTypedef: '' # Typedef\nhelpSpecialChar: '' # SpecialChar\nhelpTag: '' # Tag\nhelpDelimiter: '' # Delimiter\nhelpSpecialComment: '' # SpecialComment\nhelpDebug: '' # Debug\nhelpUnderlined: '' # Underlined\nhelpError: '' # Error\nhelpTodo: '' # Todo\nhelpURL: '' # String\n","base.yml":"# BASE UI\nColorColumn: ''\nConceal: ''\nCursor: ''\nCursorIM: ''\nCursorColumn: ''\nCursorLine: ''\nCursorLineNr: ''\nDirectory: ''\nDiffAdd: ''\nDiffChange: ''\nDiffDelete: ''\nDiffText: ''\nErrorMsg: ''\nVertSplit: ''\nFolded: ''\nFoldColumn: ''\nSignColumn: ''\nIncSearch: ''\nLineNr: ''\nMatchParen: ''\nModeMsg: ''\nMoreMsg: ''\nNonText: ''\nNormal: ''\nPMenu: ''\nPMenuSel: ''\nPmenuSbar: ''\nPmenuThumb: ''\nQuestion: ''\nSearch: ''\nSpecialKey: ''\nSpellBad: ''\nSpellLocal: ''\nSpellCap: ''\nSpellRare: ''\nStatusLine: ''\nStatusLineNC: ''\nTabLine: ''\nTabLineFill: ''\nTabLineSel: ''\nTitle: ''\nVisual: ''\nVisualNOS: ''\nWarningMsg: ''\nWildMenu: ''\n# BASE SYNTAX\nComment: ''\nConstant: ''\nString: '' # Constant\nCharacter: '' # Constant\nBoolean: '' # Constant\nNumber: '' # Constant\nFloat: '' # Constant\nIdentifier: ''\nFunction: '' # Identifier\nStatement: ''\nConditional: '' # Statement\nRepeat: '' # Statement\nLabel: '' # Statement\nOperator: '' # Statement\nKeyword: '' # Statement\nException: '' # Statement\nPreProc: ''\nInclude: '' # PreProc\nDefine: '' # PreProc\nMacro: '' # PreProc\nPreCondit: '' # PreProc\nType: ''\nStorageClass: '' # Type\nStructure: '' # Type\nTypedef: '' # Type\nSpecial: ''\nSpecialChar: '' # Special\nTag: '' # Special\nDelimiter: '' # Special\nSpecialComment: '' # Special\nDebug: '' # Special\nUnderlined: ''\nIgnore: ''\nError: ''\nTodo: ''\n","xml.yml":"xmlTodo: '' # Todo\nxmlTag: '' # Function\nxmlTagName: '' # Function\nxmlEndTag: '' # Identifier\nxmlNamespace: '' # Tag\nxmlEntity: '' # Statement\nxmlEntityPunct: '' # Type\nxmlAttribPunct: '' # Comment\nxmlAttrib: '' # Type\nxmlString: '' # String\nxmlComment: '' # Comment\nxmlCommentStart: '' # xmlComment\nxmlCommentPart: '' # Comment\nxmlCommentError: '' # Error\nxmlError: '' # Error\nxmlProcessingDelim: '' # Comment\nxmlProcessing: '' # Type\nxmlCdata: '' # String\nxmlCdataCdata: '' # Statement\nxmlCdataStart: '' # Type\nxmlCdataEnd: '' # Type\nxmlDocTypeDecl: '' # Function\nxmlDocTypeKeyword: '' # Statement\nxmlInlineDTD: '' # Function\n","css.yml":"cssComment: '' # Comment\ncssVendor: '' # Comment\ncssHacks: '' # Comment\ncssTagName: '' # Statement\ncssDeprecated: '' # Error\ncssSelectorOp: '' # Special\ncssSelectorOp2: '' # Special\ncssAttrComma: '' # Special\ncssAnimationProp: '' # cssProp\ncssBackgroundProp: '' # cssProp\ncssBorderProp: '' # cssProp\ncssBoxProp: '' # cssProp\ncssColorProp: '' # cssProp\ncssContentForPagedMediaProp: '' # cssProp\ncssDimensionProp: '' # cssProp\ncssFlexibleBoxProp: '' # cssProp\ncssFontProp: '' # cssProp\ncssGeneratedContentProp: '' # cssProp\ncssGridProp: '' # cssProp\ncssHyerlinkProp: '' # cssProp\ncssLineboxProp: '' # cssProp\ncssListProp: '' # cssProp\ncssMarqueeProp: '' # cssProp\ncssMultiColumnProp: '' # cssProp\ncssPagedMediaProp: '' # cssProp\ncssPositioningProp: '' # cssProp\ncssPrintProp: '' # cssProp\ncssRubyProp: '' # cssProp\ncssSpeechProp: '' # cssProp\ncssTableProp: '' # cssProp\ncssTextProp: '' # cssProp\ncssTransformProp: '' # cssProp\ncssTransitionProp: '' # cssProp\ncssUIProp: '' # cssProp\ncssIEUIProp: '' # cssProp\ncssAuralProp: '' # cssProp\ncssRenderProp: '' # cssProp\ncssMobileTextProp: '' # cssProp\ncssAnimationAttr: '' # cssAttr\ncssBackgroundAttr: '' # cssAttr\ncssBorderAttr: '' # cssAttr\ncssBoxAttr: '' # cssAttr\ncssContentForPagedMediaAttr: '' # cssAttr\ncssDimensionAttr: '' # cssAttr\ncssFlexibleBoxAttr: '' # cssAttr\ncssFontAttr: '' # cssAttr\ncssGeneratedContentAttr: '' # cssAttr\ncssGridAttr: '' # cssAttr\ncssHyerlinkAttr: '' # cssAttr\ncssLineboxAttr: '' # cssAttr\ncssListAttr: '' # cssAttr\ncssMarginAttr: '' # cssAttr\ncssMarqueeAttr: '' # cssAttr\ncssMultiColumnAttr: '' # cssAttr\ncssPaddingAttr: '' # cssAttr\ncssPagedMediaAttr: '' # cssAttr\ncssPositioningAttr: '' # cssAttr\ncssGradientAttr: '' # cssAttr\ncssPrintAttr: '' # cssAttr\ncssRubyAttr: '' # cssAttr\ncssSpeechAttr: '' # cssAttr\ncssTableAttr: '' # cssAttr\ncssTextAttr: '' # cssAttr\ncssTransformAttr: '' # cssAttr\ncssTransitionAttr: '' # cssAttr\ncssUIAttr: '' # cssAttr\ncssIEUIAttr: '' # cssAttr\ncssAuralAttr: '' # cssAttr\ncssRenderAttr: '' # cssAttr\ncssCommonAttr: '' # cssAttr\ncssPseudoClassId: '' # PreProc\ncssPseudoClassLang: '' # Constant\ncssValueLength: '' # Number\ncssValueInteger: '' # Number\ncssValueNumber: '' # Number\ncssValueAngle: '' # Number\ncssValueTime: '' # Number\ncssValueFrequency: '' # Number\ncssFunction: '' # Constant\ncssURL: '' # String\ncssFunctionName: '' # Function\ncssFunctionComma: '' # Function\ncssColor: '' # Constant\ncssIdentifier: '' # Function\ncssInclude: '' # Include\ncssIncludeKeyword: '' # atKeyword\ncssImportant: '' # Special\ncssBraces: '' # Function\ncssBraceError: '' # Error\ncssError: '' # Error\ncssUnicodeEscape: '' # Special\ncssStringQQ: '' # String\ncssStringQ: '' # String\ncssAttributeSelector: '' # String\ncssMedia: '' # atKeyword\ncssMediaType: '' # Special\ncssMediaComma: '' # Normal\ncssMediaKeyword: '' # Statement\ncssMediaProp: '' # cssProp\ncssMediaAttr: '' # cssAttr\ncssPage: '' # atKeyword\ncssPagePseudo: '' # PreProc\ncssPageMargin: '' # atKeyword\ncssPageProp: '' # cssProp\ncssKeyFrame: '' # atKeyword\ncssKeyFrameSelector: '' # Constant\ncssFontDescriptor: '' # Special\ncssFontDescriptorFunction: '' # Constant\ncssFontDescriptorProp: '' # cssProp\ncssFontDescriptorAttr: '' # cssAttr\ncssUnicodeRange: '' # Constant\ncssClassName: '' # Function\ncssClassNameDot: '' # Function\ncssProp: '' # StorageClass\ncssAttr: '' # Constant\ncssUnitDecorators: '' # Number\ncssNoise: '' # Noise\natKeyword: '' # PreProc\n","vim-stylus.yml":"stylusComment: '' # Comment\nstylusVariable: '' # Identifier\nstylusControl: '' # PreProc\nstylusFunction: '' # Function\nstylusInterpolation: '' # Delimiter\nstylusAmpersand: '' # Character\nstylusClass: '' # Type\nstylusClassChar: '' # Special\nstylusEscape: '' # Special\nstylusId: '' # Identifier\nstylusIdChar: '' # Special\n","vim-mustache-handlebars.yml":"mustacheVariable: '' # Number\nmustacheVariableUnescape: '' # Number\nmustachePartial: '' # Number\nmustacheSection: '' # Number\nmustacheMarkerSet: '' # Number\nmustacheComment: '' # Comment\nmustacheBlockComment: '' # Comment\nmustacheError: '' # Error\nmustacheInsideError: '' # Error\nmustacheHandlebars: '' # Special\nmustacheUnescape: '' # Identifier\nmustacheOperators: '' # Operator\nmustacheConditionals: '' # Conditional\nmustacheHelpers: '' # Repeat\nmustacheQString: '' # String\nmustacheDQString: '' # String\n","vim-signify.yml":"# mhinz/vim-signify\nSignifyLineAdd: ''\nSignifyLineDelete: ''\nSignifyLineDeleteFirstLine: ''\nSignifyLineChange: ''\nSignifyLineChangeDelete: ''\n\nSignifySignAdd: ''\nSignifySignDelete: ''\nSignifySignDeleteFirstLine: ''\nSignifySignChange: ''\nSignifySignChangeDelete: ''\n","diff.yml":"diffOldFile: '' # diffFile\ndiffNewFile: '' # diffFile\ndiffFile: '' # Type\ndiffOnly: '' # Constant\ndiffIdentical: '' # Constant\ndiffDiffer: '' # Constant\ndiffBDiffer: '' # Constant\ndiffIsA: '' # Constant\ndiffNoEOL: '' # Constant\ndiffCommon: '' # Constant\ndiffRemoved: '' # Special\ndiffChanged: '' # PreProc\ndiffAdded: '' # Identifier\ndiffLine: '' # Statement\ndiffSubname: '' # PreProc\ndiffComment: '' # Comment\n","vim-plug.yml":"plug1: '' # Title\nplug2: '' # Repeat\nplugH2: '' # Type\nplugX: '' # Exception\nplugBracket: '' # Structure\nplugNumber: '' # Number\nplugDash: '' # Special\nplugPlus: '' # Constant\nplugStar: '' # Boolean\nplugMessage: '' # Function\nplugName: '' # Label\nplugInstall: '' # Function\nplugUpdate: '' # Type\nplugError: '' # Error\nplugRelDate: '' # Comment\nplugEdge: '' # PreProc\nplugSha: '' # Identifier\nplugTag: '' # Constant\nplugNotLoaded: '' # Comment\n","pug.yml":"pugPlainChar: '' # Special\npugScriptConditional: '' # PreProc\npugScriptLoopKeywords: '' # PreProc\npugScriptStatement: '' # PreProc\npugHtmlArg: '' # htmlArg\npugAttributeString: '' # String\npugAttributesDelimiter: '' # Identifier\npugIdChar: '' # Special\npugClassChar: '' # Special\npugBlockExpansionChar: '' # Special\npugPipeChar: '' # Special\npugTagBlockChar: '' # Special\npugId: '' # Identifier\npugClass: '' # Type\npugInterpolationDelimiter: '' # Delimiter\npugInlineDelimiter: '' # Delimiter\npugFilter: '' # PreProc\npugDocType: '' # PreProc\npugComment: '' # Comment\npugCommentBlock: '' # Comment\npugHtmlConditionalComment: '' # pugComment\n","git.yml":"gitDateHeader: '' # gitIdentityHeader\ngitIdentityHeader: '' # gitIdentityKeyword\ngitIdentityKeyword: '' # Label\ngitNotesHeader: '' # gitKeyword\ngitReflogHeader: '' # gitKeyword\ngitKeyword: '' # Keyword\ngitIdentity: '' # String\ngitEmailDelimiter: '' # Delimiter\ngitEmail: '' # Special\ngitDate: '' # Number\ngitMode: '' # Number\ngitHashAbbrev: '' # gitHash\ngitHash: '' # Identifier\ngitReflogMiddle: '' # gitReference\ngitReference: '' # Function\ngitStage: '' # gitType\ngitType: '' # Type\ngitDiffAdded: '' # diffAdded\ngitDiffRemoved: '' # diffRemoved\n","elixir.yml":"# Elixir\nelixirComment: '' # Comment\nelixirUnusedVariable: '' # Comment\nelixirAtom: '' # Constant\nelixirBoolean: '' # Constant\nelixirPseudoVariable: '' # Constant\nelixirNumber: '' # Constant\nelixirString: '' # Constant\nelixirRegex: '' # Constant\nelixirDocString: '' # Constant\nelixirAtomInterpolated: '' # Constant\nelixirSigil: '' # Constant\nelixirRegexDelimiter: '' # Delimiter\nelixirStringDelimiter: '' # Delimiter\nelixirInterpolationDelimiter: '' # Delimiter\nelixirSigilDelimiter: '' # Delimiter\nelixirSpecial: '' # Delimiter\nelixirRegexEscape: '' # Delimiter\nelixirRegexEscapePunctuation: '' # Delimiter\nelixirRegexQuantifier: '' # Delimiter\nelixirRegexCharClass: '' # Delimiter\nelixirSelf: '' # Identifier\nelixirVariable: '' # Identifier\nelixirFunctionDeclaration: '' # Identifier\nelixirBlockDefinition: '' # Statement\nelixirKeyword: '' # Statement\nelixirOperator: '' # Statement\nelixirInclude: '' # Preproc\nelixirDefine: '' # Preproc\nelixirPrivateDefine: '' # Preproc\nelixirModuleDefine: '' # Preproc\nelixirProtocolDefine: '' # Preproc\nelixirImplDefine: '' # Preproc\nelixirRecordDefine: '' # Preproc\nelixirPrivateRecordDefine: '' # Preproc\nelixirMacroDefine: '' # Preproc\nelixirMacroDeclaration: '' # Preproc\nelixirPrivateMacroDefine: '' # Preproc\nelixirDelegateDefine: '' # Preproc\nelixirOverridableDefine: '' # Preproc\nelixirExceptionDefine: '' # Preproc\nelixirCallbackDefine: '' # Preproc\nelixirStructDefine: '' # Preproc\nelixirAlias: '' # Type\nelixirTodo: '' # Todo\nelixirArguments: ''\nelixirGuard: ''\nelixirId: ''\nelixirInterpolation: ''\nelixirDocStringStar: ''\nelixirBlock: ''\nelixirAnonymousFunction: ''\nelixirDelimEscape: ''\nelixirModuleDeclaration: ''\nelixirProtocolDeclaration: ''\nelixirImplDeclaration: ''\nelixirRecordDeclaration: ''\nelixirDelegateDeclaration: ''\nelixirOverridableDeclaratio: ''\nelixirExceptionDeclaration: ''\nelixirCallbackDeclaration: ''\nelixirStructDeclaration: ''\n","elm-vim.yml":"elmTopLevelDecl: '' # Function\nelmTupleFunction: '' # Normal\nelmTodo: '' # Todo\nelmComment: '' # Comment\nelmLineComment: '' # Comment\nelmString: '' # String\nelmTripleString: '' # String\nelmChar: '' # String\nelmStringEscape: '' # Special\nelmInt: '' # Number\nelmFloat: '' # Float\nelmDelimiter: '' # Comment\nelmTypedef: '' # Keyword\nelmImport: '' # Keyword\nelmConditional: '' # Keyword\nelmAlias: '' # Keyword\nelmOperator: '' # Operator\nelmType: '' # Type\nelmNumberType: '' # Type\nelmBraces: '' # Delimiter\n","markdown.yml":"markdownH1: '' # htmlH1\nmarkdownH2: '' # htmlH2\nmarkdownH3: '' # htmlH3\nmarkdownH4: '' # htmlH4\nmarkdownH5: '' # htmlH5\nmarkdownH6: '' # htmlH6\nmarkdownHeadingRule: '' # markdownRule\nmarkdownHeadingDelimiter: '' # Delimiter\nmarkdownOrderedListMarker: '' # markdownListMarker\nmarkdownListMarker: '' # htmlTagName\nmarkdownBlockquote: '' # Comment\nmarkdownRule: '' # PreProc\nmarkdownLinkText: '' # htmlLink\nmarkdownIdDeclaration: '' # Typedef\nmarkdownId: '' # Type\nmarkdownAutomaticLink: '' # markdownUrl\nmarkdownUrl: '' # Float\nmarkdownUrlTitle: '' # String\nmarkdownIdDelimiter: '' # markdownLinkDelimiter\nmarkdownUrlDelimiter: '' # htmlTag\nmarkdownUrlTitleDelimiter: '' # Delimiter\nmarkdownItalic: '' # htmlItalic\nmarkdownBold: '' # htmlBold\nmarkdownBoldItalic: '' # htmlBoldItalic\nmarkdownCodeDelimiter: '' # Delimiter\nmarkdownEscape: '' # Special\nmarkdownError: '' # Error\n","sh.yml":"shArithRegion: '' # shShellVariables\nshAtExpr: '' # shSetList\nshBeginHere: '' # shRedir\nshCaseBar: '' # shConditional\nshCaseCommandSub: '' # shCommandSub\nshCaseDoubleQuote: '' # shDoubleQuote\nshCaseIn: '' # shConditional\nshQuote: '' # shOperator\nshCaseSingleQuote: '' # shSingleQuote\nshCaseStart: '' # shConditional\nshCmdSubRegion: '' # shShellVariables\nshColon: '' # shComment\nshDerefOp: '' # shOperator\nshDerefPOL: '' # shDerefOp\nshDerefPPS: '' # shDerefOp\nshDeref: '' # shShellVariables\nshDerefDelim: '' # shOperator\nshDerefSimple: '' # shDeref\nshDerefSpecial: '' # shDeref\nshDerefString: '' # shDoubleQuote\nshDerefVar: '' # shDeref\nshDoubleQuote: '' # shString\nshEcho: '' # shString\nshEchoDelim: '' # shOperator\nshEchoQuote: '' # shString\nshForPP: '' # shLoop\nshEmbeddedEcho: '' # shString\nshEscape: '' # shCommandSub\nshExDoubleQuote: '' # shDoubleQuote\nshExSingleQuote: '' # shSingleQuote\nshFunction: '' # Function\nshHereDoc: '' # shString\nshHerePayload: '' # shHereDoc\nshLoop: '' # shStatement\nshMoreSpecial: '' # shSpecial\nshOption: '' # shCommandSub\nshPattern: '' # shString\nshParen: '' # shArithmetic\nshPosnParm: '' # shShellVariables\nshQuickComment: '' # shComment\nshRange: '' # shOperator\nshRedir: '' # shOperator\nshSetListDelim: '' # shOperator\nshSetOption: '' # shOption\nshSingleQuote: '' # shString\nshSource: '' # shOperator\nshStringSpecial: '' # shSpecial\nshSubShRegion: '' # shOperator\nshTestOpr: '' # shConditional\nshTestPattern: '' # shString\nshTestDoubleQuote: '' # shString\nshTestSingleQuote: '' # shString\nshVariable: '' # shSetList\nshWrapLineOperator: '' # shOperator\nbashAdminStatement: '' # shStatement if exists(\"b:is_bash\")\nbashSpecialVariables: '' # shShellVariables if exists(\"b:is_bash\")\nbashStatement: '' # shStatement if exists(\"b:is_bash\")\nshFunctionParen: '' # Delimiter if exists(\"b:is_bash\")\nshFunctionDelim: '' # Delimiter if exists(\"b:is_bash\")\nkshSpecialVariables: '' # shShellVariables if exists(\"b:is_kornshell\")\nkshStatement: '' # shStatement if exists(\"b:is_kornshell\")\nshCaseError: '' # Error if !exists(\"g:sh_no_error\")\nshCondError: '' # Error if !exists(\"g:sh_no_error\")\nshCurlyError: '' # Error if !exists(\"g:sh_no_error\")\nshDerefError: '' # Error if !exists(\"g:sh_no_error\")\nshDerefOpError: '' # Error if !exists(\"g:sh_no_error\")\nshDerefWordError: '' # Error if !exists(\"g:sh_no_error\")\nshDoError: '' # Error if !exists(\"g:sh_no_error\")\nshEsacError: '' # Error if !exists(\"g:sh_no_error\")\nshIfError: '' # Error if !exists(\"g:sh_no_error\")\nshInError: '' # Error if !exists(\"g:sh_no_error\")\nshParenError: '' # Error if !exists(\"g:sh_no_error\")\nshTestError: '' # Error if !exists(\"g:sh_no_error\")\nshDTestError: '' # Error if exists(\"b:is_kornshell\")\nshArithmetic: '' # Special\nshCharClass: '' # Identifier\nshSnglCase: '' # Statement\nshCommandSub: '' # Special\nshComment: '' # Comment\nshConditional: '' # Conditional\nshCtrlSeq: '' # Special\nshExprRegion: '' # Delimiter\nshFunctionKey: '' # Function\nshFunctionName: '' # Function\nshNumber: '' # Number\nshOperator: '' # Operator\nshRepeat: '' # Repeat\nshSet: '' # Statement\nshSetList: '' # Identifier\nshShellVariables: '' # PreProc\nshSpecial: '' # Special\nshStatement: '' # Statement\nshString: '' # String\nshTodo: '' # Todo\nshAlias: '' # Identifier\nshHereDoc01: '' # shRedir\nshHereDoc02: '' # shRedir\nshHereDoc03: '' # shRedir\nshHereDoc04: '' # shRedir\nshHereDoc05: '' # shRedir\nshHereDoc06: '' # shRedir\nshHereDoc07: '' # shRedir\nshHereDoc08: '' # shRedir\nshHereDoc09: '' # shRedir\nshHereDoc10: '' # shRedir\nshHereDoc11: '' # shRedir\nshHereDoc12: '' # shRedir\nshHereDoc13: '' # shRedir\nshHereDoc14: '' # shRedir\nshHereDoc15: '' # shRedir\nshHereDoc16: '' # shRedir\nshHereDoc17: '' # shRedir\nshHereDoc18: '' # shRedir\nshHereDoc19: '' # shRedir\nshHereDoc20: '' # shRedir\nshHereDoc21: '' # shRedir\nshHereDoc22: '' # shRedir\nshHereDoc23: '' # shRedir\nshHereDoc24: '' # shRedir\nshHereDoc25: '' # shRedir\nshHereDoc26: '' # shRedir\nshHereDoc27: '' # shRedir\nshHereDoc28: '' # shRedir\nshHereDoc29: '' # shRedir\nshHereDoc30: '' # shRedir\nshHereDoc31: '' # shRedir\nshHereDoc32: '' # shRedir\n","elm.vim.yml":"elmKeyword: '' # Keyword\nelmBuiltinOp: '' # Special\nelmType: '' # Type\nelmTodo: '' # Todo\nelmLineComment: '' # Comment\nelmComment: '' # Comment\nelmString: '' # String\nelmNumber: '' # Number\nspecialName: '' # Special\n","vim-gitgutter.yml":"# GitGutter airblade/vim-gitgutter\nGitGutterAdd: ''\nGitGutterChange: ''\nGitGutterDelete: ''\nGitGutterChangeDelete: ''\n","html.yml":"htmlTag: '' # Function\nhtmlEndTag: '' # Identifier\nhtmlArg: '' # Type\nhtmlTagName: '' # htmlStatement\nhtmlSpecialTagName: '' # Exception\nhtmlValue: '' # String\nhtmlH1: '' # Title\nhtmlH2: '' # htmlH1\nhtmlH3: '' # htmlH2\nhtmlH4: '' # htmlH3\nhtmlH5: '' # htmlH4\nhtmlH6: '' # htmlH5\nhtmlHead: '' # PreProc\nhtmlTitle: '' # Title\nhtmlBoldItalicUnderline: '' # htmlBoldUnderlineItalic\nhtmlUnderlineBold: '' # htmlBoldUnderline\nhtmlUnderlineItalicBold: '' # htmlBoldUnderlineItalic\nhtmlUnderlineBoldItalic: '' # htmlBoldUnderlineItalic\nhtmlItalicUnderline: '' # htmlUnderlineItalic\nhtmlItalicBold: '' # htmlBoldItalic\nhtmlItalicBoldUnderline: '' # htmlBoldUnderlineItalic\nhtmlItalicUnderlineBold: '' # htmlBoldUnderlineItalic\nhtmlLink: '' # Underlined\nhtmlLeadingSpace: '' # None\nhtmlPreStmt: '' # PreProc\nhtmlPreError: '' # Error\nhtmlPreProc: '' # PreProc\nhtmlPreAttr: '' # String\nhtmlPreProcAttrName: '' # PreProc\nhtmlPreProcAttrError: '' # Error\nhtmlSpecial: '' # Special\nhtmlSpecialChar: '' # Special\nhtmlString: '' # String\nhtmlStatement: '' # Statement\nhtmlComment: '' # Comment\nhtmlCommentPart: '' # Comment\nhtmlCommentError: '' # htmlError\nhtmlTagError: '' # htmlError\nhtmlEvent: '' # javaScript\nhtmlError: '' # Error\njavaScript: '' # Special\njavaScriptExpression: '' # javaScript\nhtmlCssStyleComment: '' # Comment\nhtmlCssDefinition: '' # Special\n","viminfo.yml":"viminfoComment: '' # Comment\nviminfoError: '' # Error\nviminfoStatement: '' # Statement\n","php.yml":"phpConstant: '' # Constant\nphpCoreConstant: '' # Constant\nphpComment: '' # Comment\nphpDocTags: '' # PreProc\nphpDocCustomTags: '' # Type\nphpException: '' # Exception\nphpBoolean: '' # Boolean\nphpStorageClass: '' # StorageClass\nphpSCKeyword: '' # StorageClass\nphpFCKeyword: '' # Define\nphpStructure: '' # Structure\nphpStringSingle: '' # String\nphpStringDouble: '' # String\nphpBacktick: '' # String\nphpNumber: '' # Number\nphpFloat: '' # Float\nphpMethods: '' # Function\nphpFunctions: '' # Function\nphpBaselib: '' # Function\nphpRepeat: '' # Repeat\nphpConditional: '' # Conditional\nphpLabel: '' # Label\nphpStatement: '' # Statement\nphpKeyword: '' # Statement\nphpType: '' # Type\nphpInclude: '' # Include\nphpDefine: '' # Define\nphpBackslashSequences: '' # SpecialChar\nphpBackslashDoubleQuote: '' # SpecialChar\nphpBackslashSingleQuote: '' # SpecialChar\nphpParent: '' # Delimiter\nphpBrackets: '' # Delimiter\nphpIdentifierConst: '' # Delimiter\nphpParentError: '' # Error\nphpOctalError: '' # Error\nphpInterpSimpleError: '' # Error\nphpInterpBogusDollarCurley: '' # Error\nphpInterpDollarCurly1: '' # Error\nphpInterpDollarCurly2: '' # Error\nphpInterpSimpleBracketsInner: '' # String\nphpInterpSimpleCurly: '' # Delimiter\nphpInterpVarname: '' # Identifier\nphpTodo: '' # Todo\nphpDocTodo: '' # Todo\nphpMemberSelector: '' # Structure\nphpIntVar: '' # Identifier\nphpEnvVar: '' # Identifier\nphpOperator: '' # Operator\nphpVarSelector: '' # Operator\nphpRelation: '' # Operator\nphpIdentifier: '' # Identifier\nphpIdentifierSimply: '' # Identifier\n","nerdtree.yml":"NERDTreePart: '' # Special\nNERDTreePartFile: '' # Type\nNERDTreeExecFile: '' # Title\nNERDTreeDirSlash: '' # Identifier\nNERDTreeBookmarksHeader: '' # statement\nNERDTreeBookmarksLeader: '' # ignore\nNERDTreeBookmarkName: '' # Identifier\nNERDTreeBookmark: '' # normal\nNERDTreeHelp: '' # String\nNERDTreeHelpKey: '' # Identifier\nNERDTreeHelpCommand: '' # Identifier\nNERDTreeHelpTitle: '' # Macro\nNERDTreeToggleOn: '' # Question\nNERDTreeToggleOff: '' # WarningMsg\nNERDTreeLinkTarget: '' # Type\nNERDTreeLinkFile: '' # Macro\nNERDTreeLinkDir: '' # Macro\nNERDTreeDir: '' # Directory\nNERDTreeUp: '' # Directory\nNERDTreeFile: '' # Normal\nNERDTreeCWD: '' # Statement\nNERDTreeOpenable: '' # Title\nNERDTreeClosable: '' # Title\nNERDTreeIgnore: '' # ignore\nNERDTreeRO: '' # WarningMsg\nNERDTreeFlags: '' # Number\n","fugitive.yml":"FugitiveblameBoundary: '' # Keyword\nFugitiveblameHash: '' # Identifier\nFugitiveblameUncommitted: '' # Ignore\nFugitiveblameTime: '' # PreProc\nFugitiveblameLineNumber: '' # Number\nFugitiveblameOriginalFile: '' # String\nFugitiveblameOriginalLineNumber: '' #\nFugitiveblameShort: '' # FugitiveblameDelimiter\nFugitiveblameDelimiter: '' # Delimiter\nFugitiveblameNotCommittedYet: '' # Comment\n","ruby.yml":"rubyClass: '' # rubyDefine\nrubyModule: '' # rubyDefine\nrubyMethodExceptional: '' # rubyDefine\nrubyDefine: '' # Define\nrubyFunction: '' # Function\nrubyConditional: '' # Conditional\nrubyConditionalModifier: '' # rubyConditional\nrubyExceptional: '' # rubyConditional\nrubyRepeat: '' # Repeat\nrubyRepeatModifier: '' # rubyRepeat\nrubyOptionalDo: '' # rubyRepeat\nrubyControl: '' # Statement\nrubyInclude: '' # Include\nrubyInteger: '' # Number\nrubyASCIICode: '' # Character\nrubyFloat: '' # Float\nrubyBoolean: '' # Boolean\nrubyException: '' # Exception\nrubyIdentifier: '' # Identifier\nrubyClassVariable: '' # rubyIdentifier\nrubyConstant: '' # Type\nrubyGlobalVariable: '' # rubyIdentifier\nrubyBlockParameter: '' # rubyIdentifier\nrubyInstanceVariable: '' # rubyIdentifier\nrubyPredefinedIdentifier: '' # rubyIdentifier\nrubyPredefinedConstant: '' # rubyPredefinedIdentifier\nrubyPredefinedVariable: '' # rubyPredefinedIdentifier\nrubySymbol: '' # Constant\nrubyKeyword: '' # Keyword\nrubyOperator: '' # Operator\nrubyBeginEnd: '' # Statement\nrubyAccess: '' # Statement\nrubyAttribute: '' # Statement\nrubyEval: '' # Statement\nrubyPseudoVariable: '' # Constant\nrubyComment: '' # Comment\nrubyData: '' # Comment\nrubyDataDirective: '' # Delimiter\nrubyDocumentation: '' # Comment\nrubyTodo: '' # Todo\nrubyQuoteEscape: '' # rubyStringEscape\nrubyStringEscape: '' # Special\nrubyInterpolationDelimiter: '' # Delimiter\nrubyNoInterpolation: '' # rubyString\nrubySharpBang: '' # PreProc\nrubyRegexpDelimiter: '' # rubyStringDelimiter\nrubySymbolDelimiter: '' # rubyStringDelimiter\nrubyStringDelimiter: '' # Delimiter\nrubyHeredoc: '' # rubyString\nrubyString: '' # String\nrubyRegexpEscape: '' # rubyRegexpSpecial\nrubyRegexpQuantifier: '' # rubyRegexpSpecial\nrubyRegexpAnchor: '' # rubyRegexpSpecial\nrubyRegexpDot: '' # rubyRegexpCharClass\nrubyRegexpCharClass: '' # rubyRegexpSpecial\nrubyRegexpSpecial: '' # Special\nrubyRegexpComment: '' # Comment\nrubyRegexp: '' # rubyString\nrubyInvalidVariable: '' # Error\nrubyError: '' # Error\nrubySpaceError: '' # rubyError\n","yajs.yml":"javascriptReserved: '' # Error\njavascriptReservedCase: '' # Error\njavascriptInvalidOp: '' # Error\njavascriptEndColons: '' # Statement\njavascriptOpSymbol: '' # Normal\njavascriptBraces: '' # Function\njavascriptBrackets: '' # Function\njavascriptParens: '' # Normal\njavascriptComment: '' # Comment\njavascriptLineComment: '' # Comment\njavascriptDocComment: '' # Comment\njavascriptCommentTodo: '' # Todo\njavascriptDocNotation: '' # SpecialComment\njavascriptDocTags: '' # SpecialComment\njavascriptDocNGParam: '' # javascriptDocParam\njavascriptDocParam: '' # Function\njavascriptDocNumParam: '' # Function\njavascriptDocEventRef: '' # Function\njavascriptDocNamedParamType: '' # Type\njavascriptDocParamName: '' # Type\njavascriptDocParamType: '' # Type\njavascriptString: '' # String\njavascriptTemplate: '' # String\njavascriptEventString: '' # String\njavascriptASCII: '' # Label\njavascriptTemplateSubstitution: '' # Label\njavascriptTemplateSB: '' # javascriptTemplateSubstitution\njavascriptRegexpString: '' # String\njavascriptGlobal: '' # Constant\njavascriptCharacter: '' # Character\njavascriptPrototype: '' # Type\njavascriptConditional: '' # Conditional\njavascriptConditionalElse: '' # Conditional\njavascriptSwitch: '' # Conditional\njavascriptCase: '' # Conditional\njavascriptDefault: '' # javascriptCase\njavascriptExportDefault: '' # javascriptCase\njavascriptBranch: '' # Conditional\njavascriptIdentifier: '' # Structure\njavascriptVariable: '' # Identifier\njavascriptRepeat: '' # Repeat\njavascriptForComprehension: '' # Repeat\njavascriptIfComprehension: '' # Repeat\njavascriptOfComprehension: '' # Repeat\njavascriptForOperator: '' # Repeat\njavascriptStatementKeyword: '' # Statement\njavascriptReturn: '' # Statement\njavascriptYield: '' # Statement\njavascriptYieldGen: '' # Statement\njavascriptMessage: '' # Keyword\njavascriptOperator: '' # Identifier\njavascriptTarget: '' # Identifier\njavascriptNull: '' # Boolean\njavascriptNumber: '' # Number\njavascriptBoolean: '' # Boolean\njavascriptObjectLabel: '' # javascriptLabel\njavascriptObjectLabelColon: '' # javascriptLabel\njavascriptLabel: '' # Label\njavascriptPropertyName: '' # Label\njavascriptImport: '' # Special\njavascriptExport: '' # Special\njavascriptTry: '' # Statement\njavascriptExceptions: '' # Statement\njavascriptMethodName: '' # Function\njavascriptMethodAccessor: '' # Operator\njavascriptObjectMethodName: '' # Function\njavascriptFuncKeyword: '' # Keyword\njavascriptAsyncFunc: '' # Keyword\njavascriptArrowFunc: '' # Type\njavascriptFuncName: '' # Function\njavascriptFuncArg: '' # Special\njavascriptArrowFuncArg: '' # javascriptFuncArg\njavascriptComma: '' # Normal\njavascriptClassKeyword: '' # Keyword\njavascriptClassExtends: '' # Keyword\njavascriptClassName: '' # Function\njavascriptClassSuperName: '' # Function\njavascriptClassStatic: '' # StorageClass\njavascriptClassSuper: '' # keyword\nshellbang: '' # Comment\n","less.yml":"lessEndOfLineComment: '' # lessComment\nlessCssComment: '' # lessComment\nlessComment: '' # Comment\nlessDefault: '' # cssImportant\nlessVariable: '' # Identifier\nlessFunction: '' # PreProc\nlessTodo: '' # Todo\nlessInclude: '' # Include\nlessIdChar: '' # Special\nlessClassChar: '' # Special\nlessAmpersand: '' # Character\nlessId: '' # Identifier\nlessClass: '' # Type\nlessCssAttribute: '' # PreProc\nlessClassCall: '' # Type\nlessClassIdCall: '' # Type\nlessTagName: '' # cssTagName\nlessDeprecated: '' # cssDeprecated\nlessMedia: '' # cssMedia\n","python.yml":"pythonStatement: '' # Statement\npythonConditional: '' # Conditional\npythonRepeat: '' # Repeat\npythonOperator: '' # Operator\npythonException: '' # Exception\npythonInclude: '' # Include\npythonDecorator: '' # Define\npythonFunction: '' # Function\npythonComment: '' # Comment\npythonTodo: '' # Todo\npythonString: '' # String\npythonRawString: '' # String\npythonQuotes: '' # String\npythonTripleQuotes: '' # pythonQuotes\npythonEscape: '' # Special\npythonNumber: '' # Number\npythonBuiltin: '' # Function\npythonExceptions: '' # Structure\npythonSpaceError: '' # Error\npythonDoctest: '' # Special\npythonDoctestValue: '' # Define\n","gitconfig.yml":"gitconfigComment: '' # Comment\ngitconfigSection: '' # Keyword\ngitconfigVariable: '' # Identifier\ngitconfigBoolean: '' # Boolean\ngitconfigNumber: '' # Number\ngitconfigString: '' # String\ngitconfigDelim: '' # Delimiter\ngitconfigEscape: '' # Delimiter\ngitconfigError: '' # Error\n","gitcommit.yml":"gitcommitSummary: '' # Keyword\ngitcommitComment: '' # Comment\ngitcommitUntracked: '' # gitcommitComment\ngitcommitDiscarded: '' # gitcommitComment\ngitcommitSelected: '' # gitcommitComment\ngitcommitUnmerged: '' # gitcommitComment\ngitcommitOnBranch: '' # Comment\ngitcommitBranch: '' # Special\ngitcommitNoBranch: '' # gitCommitBranch\ngitcommitDiscardedType: '' # gitcommitType\ngitcommitSelectedType: '' # gitcommitType\ngitcommitUnmergedType: '' # gitcommitType\ngitcommitType: '' # Type\ngitcommitNoChanges: '' # gitcommitHeader\ngitcommitHeader: '' # PreProc\ngitcommitUntrackedFile: '' # gitcommitFile\ngitcommitDiscardedFile: '' # gitcommitFile\ngitcommitSelectedFile: '' # gitcommitFile\ngitcommitUnmergedFile: '' # gitcommitFile\ngitcommitFile: '' # Constant\ngitcommitDiscardedArrow: '' # gitcommitArrow\ngitcommitSelectedArrow: '' # gitcommitArrow\ngitcommitUnmergedArrow: '' # gitcommitArrow\ngitcommitArrow: '' # gitcommitComment\ngitcommitOverflow: '' # none\ngitcommitBlank: '' # Error\n","vim-javascript-syntax.yml":"# jelera/vim-javascript-syntax\njavaScriptEndColons: '' # Operator\njavaScriptOpSymbols: '' # Operator\njavaScriptLogicSymbols: '' # Boolean\njavaScriptParens: '' # Operator\njavaScriptTemplateDelim: '' # Operator\njavaScriptDocComment: '' # Comment\njavaScriptDocTags: '' # Special\njavaScriptDocSeeTag: '' # Function\njavaScriptDocParam: '' # Function\njavaScriptString: '' # String\njavaScriptTemplateString: '' # String\njavaScriptFloat: '' # Number\njavaScriptPrototype: '' # Type\njavaScriptSpecial: '' # Special\njavaScriptSource: '' # Special\njavaScriptGlobalObjects: '' # Special\njavaScriptExceptions: '' # Special\njavaScriptParensErrA: '' # Error\njavaScriptParensErrB: '' # Error\njavaScriptParensErrC: '' # Error\njavaScriptDomErrNo: '' # Error\njavaScriptDomNodeConsts: '' # Constant\njavaScriptDomElemAttrs: '' # Label\njavaScriptDomElemFuncs: '' # Type\njavaScriptWebAPI: '' # Type\njavaScriptHtmlElemAttrs: '' # Label\njavaScriptHtmlElemFuncs: '' # Type\njavaScriptCssStyles: '' # Type\njavaScriptBrowserObjects: '' # Constant\njavaScriptDOMObjects: '' # Constant\njavaScriptDOMMethods: '' # Type\njavaScriptDOMProperties: '' # Label\njavaScriptAjaxObjects: '' # Constant\njavaScriptAjaxMethods: '' # Type\njavaScriptAjaxProperties: '' # Label\njavaScriptFuncKeyword: '' # Function\njavaScriptFuncDef: '' # PreProc\njavaScriptFuncExp: '' # Title\njavaScriptFuncArg: '' # Special\njavaScriptFuncComma: '' # Operator\njavaScriptFuncEq: '' # Operator\njavaScriptHtmlEvents: '' # Constant\njavaScriptHtmlElemProperties: '' # Label\njavaScriptEventListenerKeywords: '' # Type\njavaScriptPropietaryObjects: '' # Constant\n","gitrebase.yml":"gitrebaseCommit: '' # gitrebaseHash\ngitrebaseHash: '' # Identifier\ngitrebasePick: '' # Statement\ngitrebaseReword: '' # Number\ngitrebaseEdit: '' # PreProc\ngitrebaseSquash: '' # Type\ngitrebaseFixup: '' # Special\ngitrebaseExec: '' # Function\ngitrebaseSummary: '' # String\ngitrebaseComment: '' # Comment\ngitrebaseSquashError: '' # Error\n","javascript.yml":"javaScriptComment: '' # Comment\njavaScriptLineComment: '' # Comment\njavaScriptCommentTodo: '' # Todo\njavaScriptSpecial: '' # Special\njavaScriptStringS: '' # String\njavaScriptStringD: '' # String\njavaScriptCharacter: '' # Character\njavaScriptSpecialCharacter: '' # javaScriptSpecial\njavaScriptNumber: '' # javaScriptValue\njavaScriptConditional: '' # Conditional\njavaScriptRepeat: '' # Repeat\njavaScriptBranch: '' # Conditional\njavaScriptOperator: '' # Operator\njavaScriptType: '' # Type\njavaScriptStatement: '' # Statement\njavaScriptFunction: '' # Function\njavaScriptBraces: '' # Function\njavaScriptError: '' # Error\njavaScriptParensError: '' # Error\njavaScriptNull: '' # Keyword\njavaScriptBoolean: '' # Boolean\njavaScriptRegexpString: '' # String\njavaScriptIdentifier: '' # Identifier\njavaScriptLabel: '' # Label\njavaScriptException: '' # Exception\njavaScriptMessage: '' # Keyword\njavaScriptGlobal: '' # Keyword\njavaScriptMember: '' # Keyword\njavaScriptDeprecated: '' # Exception\njavaScriptReserved: '' # Keyword\njavaScriptDebug: '' # Debug\njavaScriptConstant: '' # Label\n","yaml.yml":"yamlTodo: '' # Todo\nyamlComment: '' # Comment\nyamlDocumentStart: '' # PreProc\nyamlDocumentEnd: '' # PreProc\nyamlDirectiveName: '' # Keyword\nyamlTAGDirective: '' # yamlDirectiveName\nyamlTagHandle: '' # String\nyamlTagPrefix: '' # String\nyamlYAMLDirective: '' # yamlDirectiveName\nyamlReservedDirective: '' # Error\nyamlYAMLVersion: '' # Number\nyamlString: '' # String\nyamlFlowString: '' # yamlString\nyamlFlowStringDelimiter: '' # yamlString\nyamlEscape: '' # SpecialChar\nyamlSingleEscape: '' # SpecialChar\nyamlBlockCollectionItemStart: '' # Label\nyamlBlockMappingKey: '' # Identifier\nyamlBlockMappingMerge: '' # Special\nyamlFlowMappingKey: '' # Identifier\nyamlFlowMappingMerge: '' # Special\nyamlMappingKeyStart: '' # Special\nyamlFlowIndicator: '' # Special\nyamlKeyValueDelimiter: '' # Special\nyamlConstant: '' # Constant\nyamlNull: '' # yamlConstant\nyamlBool: '' # yamlConstant\nyamlAnchor: '' # Type\nyamlAlias: '' # Type\nyamlNodeTag: '' # Type\nyamlInteger: '' # Number\nyamlFloat: '' # Float\nyamlTimestamp: '' # Number\n","go.yml":"goDirective: '' # Statement\ngoDeclaration: '' # Keyword\ngoDeclType: '' # Keyword\ngoStatement: '' # Statement\ngoConditional: '' # Conditional\ngoLabel: '' # Label\ngoRepeat: '' # Repeat\ngoType: '' # Type\ngoSignedInts: '' # Type\ngoUnsignedInts: '' # Type\ngoFloats: '' # Type\ngoComplexes: '' # Type\ngoBuiltins: '' # Keyword\ngoConstants: '' # Keyword\ngoComment: '' # Comment\ngoTodo: '' # Todo\ngoEscapeOctal: '' # goSpecialString\ngoEscapeC: '' # goSpecialString\ngoEscapeX: '' # goSpecialString\ngoEscapeU: '' # goSpecialString\ngoEscapeBigU: '' # goSpecialString\ngoSpecialString: '' # Special\ngoEscapeError: '' # Error\ngoString: '' # String\ngoRawString: '' # String\ngoCharacter: '' # Character\ngoDecimalInt: '' # Integer\ngoHexadecimalInt: '' # Integer\ngoOctalInt: '' # Integer\nInteger: '' # Number\ngoFloat: '' # Float\ngoImaginary: '' # Number\ngoExtraType: '' # Type\ngoSpaceError: '' # Error\n","unite.yml":"uniteError: '' # Error\nuniteMarkedLine: '' # Statement\nuniteCandidateSourceName: '' # Type\nuniteQuickMatchText: '' # Special\nuniteCandidateIcon: '' # Special\nuniteMarkedIcon: '' # Statement\nuniteCandidateInputKeyword: '' # Function\nuniteChooseAction: '' # NONE\nuniteChooseCandidate: '' # NONE\nuniteChooseKey: '' # SpecialKey\nuniteChooseMessage: '' # NONE\nuniteChoosePrompt: '' # uniteSourcePrompt\nuniteChooseSource: '' # uniteSourceNames\nuniteInputPrompt: '' # Normal\nuniteInputLine: '' # Identifier\nuniteInputCommand: '' # Statement\nuniteStatusNormal: '' # StatusLine\nuniteStatusHead: '' # Statement\nuniteStatusSourceNames: '' # PreProc\nuniteStatusSourceCandidates: '' # Constant\nuniteStatusMessage: '' # Comment\nuniteStatusLineNR: '' # LineNR\n"},"addons":{"terminal.yml":"color_foreground: ''\ncolor_background: ''\ncolor_0: ''\ncolor_1: ''\ncolor_2: ''\ncolor_3: ''\ncolor_4: ''\ncolor_5: ''\ncolor_6: ''\ncolor_7: ''\ncolor_8: ''\ncolor_9: ''\ncolor_10: ''\ncolor_11: ''\ncolor_12: ''\ncolor_13: ''\ncolor_14: ''\ncolor_15: ''\n","lightline.yml":"normal1: ''\nnormal2: ''\nnormal3: ''\nnormal4: ''\nnormal5: ''\nnormalError: ''\nnormalWarning: ''\ninactive1: ''\ninactive2: ''\ninactive3: ''\ninactive4: ''\ninactive5: ''\ninsert1: ''\ninsert2: ''\ninsert3: ''\ninsert4: ''\ninsert5: ''\nreplace1: ''\nreplace2: ''\nreplace3: ''\nreplace4: ''\nreplace5: ''\nvisual1: ''\nvisual2: ''\nvisual3: ''\nvisual4: ''\nvisual5: ''\ntablineLeft: ''\ntablineSelected: ''\ntablineMiddle: ''\ntablineRight: ''\n","airline.yml":"normal1: ''\nnormal2: ''\nnormal3: ''\ninactive1: ''\ninactive2: ''\ninactive3: ''\ninsert1: ''\ninsert2: ''\ninsert3: ''\nreplace1: ''\nreplace2: ''\nreplace3: ''\nvisual1: ''\nvisual2: ''\nvisual3: ''\nctrlp1: '' # optional\nctrlp2: '' # optional\nctrlp3: '' # optional\n"}})};
var exports = {
}, _dewExec = false;
function dew() {
    if (_dewExec) return exports;
    _dewExec = true;
    exports.__esModule = true;
    exports.extend = extend;
    exports.indexOf = indexOf;
    exports.escapeExpression = escapeExpression;
    exports.isEmpty = isEmpty;
    exports.createFrame = createFrame;
    exports.blockParams = blockParams;
    exports.appendContextPath = appendContextPath;
    var escape = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
    var badChars = /[&<>"'`=]/g, possible = /[&<>"'`=]/;
    function escapeChar(chr) {
        return escape[chr];
    }
    function extend(obj) {
        for(var i = 1; i < arguments.length; i++){
            for(var key in arguments[i]){
                if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
                    obj[key] = arguments[i][key];
                }
            }
        }
        return obj;
    }
    var toString = Object.prototype.toString;
    exports.toString = toString;
    var isFunction = function isFunction1(value) {
        return typeof value === 'function';
    };
    if (isFunction(/x/)) {
        exports.isFunction = isFunction = function(value) {
            return typeof value === 'function' && toString.call(value) === '[object Function]';
        };
    }
    exports.isFunction = isFunction;
    var isArray = Array.isArray || function(value) {
        return value && typeof value === 'object' ? toString.call(value) === '[object Array]' : false;
    };
    exports.isArray = isArray;
    function indexOf(array, value) {
        for(var i = 0, len = array.length; i < len; i++){
            if (array[i] === value) {
                return i;
            }
        }
        return -1;
    }
    function escapeExpression(string) {
        if (typeof string !== 'string') {
            if (string && string.toHTML) {
                return string.toHTML();
            } else if (string == null) {
                return '';
            } else if (!string) {
                return string + '';
            }
            string = '' + string;
        }
        if (!possible.test(string)) {
            return string;
        }
        return string.replace(badChars, escapeChar);
    }
    function isEmpty(value) {
        if (!value && value !== 0) {
            return true;
        } else if (isArray(value) && value.length === 0) {
            return true;
        } else {
            return false;
        }
    }
    function createFrame(object) {
        var frame = extend({
        }, object);
        frame._parent = object;
        return frame;
    }
    function blockParams(params, ids) {
        params.path = ids;
        return params;
    }
    function appendContextPath(contextPath, id) {
        return (contextPath ? contextPath + '.' : '') + id;
    }
    return exports;
}
var exports1 = {
}, _dewExec1 = false;
function dew1() {
    if (_dewExec1) return exports1;
    _dewExec1 = true;
    exports1.__esModule = true;
    var errorProps = [
        'description',
        'fileName',
        'lineNumber',
        'endLineNumber',
        'message',
        'name',
        'number',
        'stack'
    ];
    function Exception(message, node) {
        var loc = node && node.loc, line = undefined, endLineNumber = undefined, column = undefined, endColumn = undefined;
        if (loc) {
            line = loc.start.line;
            endLineNumber = loc.end.line;
            column = loc.start.column;
            endColumn = loc.end.column;
            message += ' - ' + line + ':' + column;
        }
        var tmp = Error.prototype.constructor.call(this, message);
        for(var idx = 0; idx < errorProps.length; idx++){
            this[errorProps[idx]] = tmp[errorProps[idx]];
        }
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, Exception);
        }
        try {
            if (loc) {
                this.lineNumber = line;
                this.endLineNumber = endLineNumber;
                if (Object.defineProperty) {
                    Object.defineProperty(this, 'column', {
                        value: column,
                        enumerable: true
                    });
                    Object.defineProperty(this, 'endColumn', {
                        value: endColumn,
                        enumerable: true
                    });
                } else {
                    this.column = column;
                    this.endColumn = endColumn;
                }
            }
        } catch (nop) {
        }
    }
    Exception.prototype = new Error();
    exports1['default'] = Exception;
    exports1 = exports1['default'];
    return exports1;
}
var exports2 = {
}, _dewExec2 = false;
function dew2() {
    if (_dewExec2) return exports2;
    _dewExec2 = true;
    exports2.__esModule = true;
    var _utils = dew();
    exports2['default'] = function(instance) {
        instance.registerHelper('blockHelperMissing', function(context, options) {
            var inverse = options.inverse, fn = options.fn;
            if (context === true) {
                return fn(this);
            } else if (context === false || context == null) {
                return inverse(this);
            } else if (_utils.isArray(context)) {
                if (context.length > 0) {
                    if (options.ids) {
                        options.ids = [
                            options.name
                        ];
                    }
                    return instance.helpers.each(context, options);
                } else {
                    return inverse(this);
                }
            } else {
                if (options.data && options.ids) {
                    var data = _utils.createFrame(options.data);
                    data.contextPath = _utils.appendContextPath(options.data.contextPath, options.name);
                    options = {
                        data: data
                    };
                }
                return fn(context, options);
            }
        });
    };
    exports2 = exports2['default'];
    return exports2;
}
var exports3 = {
}, _dewExec3 = false;
var _global = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : global;
function dew3() {
    if (_dewExec3) return exports3;
    _dewExec3 = true;
    exports3.__esModule = true;
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            'default': obj
        };
    }
    var _utils = dew();
    var _exception = dew1();
    var _exception2 = _interopRequireDefault(_exception);
    exports3['default'] = function(instance) {
        instance.registerHelper('each', function(context, options) {
            if (!options) {
                throw new _exception2['default']('Must pass iterator to #each');
            }
            var fn = options.fn, inverse = options.inverse, i = 0, ret = '', data = undefined, contextPath = undefined;
            if (options.data && options.ids) {
                contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
            }
            if (_utils.isFunction(context)) {
                context = context.call(this);
            }
            if (options.data) {
                data = _utils.createFrame(options.data);
            }
            function execIteration(field, index, last) {
                if (data) {
                    data.key = field;
                    data.index = index;
                    data.first = index === 0;
                    data.last = !!last;
                    if (contextPath) {
                        data.contextPath = contextPath + field;
                    }
                }
                ret = ret + fn(context[field], {
                    data: data,
                    blockParams: _utils.blockParams([
                        context[field],
                        field
                    ], [
                        contextPath + field,
                        null
                    ])
                });
            }
            if (context && typeof context === 'object') {
                if (_utils.isArray(context)) {
                    for(var j = context.length; i < j; i++){
                        if (i in context) {
                            execIteration(i, i, i === context.length - 1);
                        }
                    }
                } else if (_global.Symbol && context[_global.Symbol.iterator]) {
                    var newContext = [];
                    var iterator = context[_global.Symbol.iterator]();
                    for(var it = iterator.next(); !it.done; it = iterator.next()){
                        newContext.push(it.value);
                    }
                    context = newContext;
                    for(var j = context.length; i < j; i++){
                        execIteration(i, i, i === context.length - 1);
                    }
                } else {
                    (function() {
                        var priorKey = undefined;
                        Object.keys(context).forEach(function(key) {
                            if (priorKey !== undefined) {
                                execIteration(priorKey, i - 1);
                            }
                            priorKey = key;
                            i++;
                        });
                        if (priorKey !== undefined) {
                            execIteration(priorKey, i - 1, true);
                        }
                    })();
                }
            }
            if (i === 0) {
                ret = inverse(this);
            }
            return ret;
        });
    };
    exports3 = exports3['default'];
    return exports3;
}
var exports4 = {
}, _dewExec4 = false;
function dew4() {
    if (_dewExec4) return exports4;
    _dewExec4 = true;
    exports4.__esModule = true;
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            'default': obj
        };
    }
    var _exception = dew1();
    var _exception2 = _interopRequireDefault(_exception);
    exports4['default'] = function(instance) {
        instance.registerHelper('helperMissing', function() {
            if (arguments.length === 1) {
                return undefined;
            } else {
                throw new _exception2['default']('Missing helper: "' + arguments[arguments.length - 1].name + '"');
            }
        });
    };
    exports4 = exports4['default'];
    return exports4;
}
var exports5 = {
}, _dewExec5 = false;
function dew5() {
    if (_dewExec5) return exports5;
    _dewExec5 = true;
    exports5.__esModule = true;
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            'default': obj
        };
    }
    var _utils = dew();
    var _exception = dew1();
    var _exception2 = _interopRequireDefault(_exception);
    exports5['default'] = function(instance) {
        instance.registerHelper('if', function(conditional, options) {
            if (arguments.length != 2) {
                throw new _exception2['default']('#if requires exactly one argument');
            }
            if (_utils.isFunction(conditional)) {
                conditional = conditional.call(this);
            }
            if (!options.hash.includeZero && !conditional || _utils.isEmpty(conditional)) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        });
        instance.registerHelper('unless', function(conditional, options) {
            if (arguments.length != 2) {
                throw new _exception2['default']('#unless requires exactly one argument');
            }
            return instance.helpers['if'].call(this, conditional, {
                fn: options.inverse,
                inverse: options.fn,
                hash: options.hash
            });
        });
    };
    exports5 = exports5['default'];
    return exports5;
}
var exports6 = {
}, _dewExec6 = false;
function dew6() {
    if (_dewExec6) return exports6;
    _dewExec6 = true;
    exports6.__esModule = true;
    exports6['default'] = function(instance) {
        instance.registerHelper('log', function() {
            var args = [
                undefined
            ], options = arguments[arguments.length - 1];
            for(var i = 0; i < arguments.length - 1; i++){
                args.push(arguments[i]);
            }
            var level = 1;
            if (options.hash.level != null) {
                level = options.hash.level;
            } else if (options.data && options.data.level != null) {
                level = options.data.level;
            }
            args[0] = level;
            instance.log.apply(instance, args);
        });
    };
    exports6 = exports6['default'];
    return exports6;
}
var exports7 = {
}, _dewExec7 = false;
function dew7() {
    if (_dewExec7) return exports7;
    _dewExec7 = true;
    exports7.__esModule = true;
    exports7['default'] = function(instance) {
        instance.registerHelper('lookup', function(obj, field, options) {
            if (!obj) {
                return obj;
            }
            return options.lookupProperty(obj, field);
        });
    };
    exports7 = exports7['default'];
    return exports7;
}
var exports8 = {
}, _dewExec8 = false;
function dew8() {
    if (_dewExec8) return exports8;
    _dewExec8 = true;
    exports8.__esModule = true;
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            'default': obj
        };
    }
    var _utils = dew();
    var _exception = dew1();
    var _exception2 = _interopRequireDefault(_exception);
    exports8['default'] = function(instance) {
        instance.registerHelper('with', function(context, options) {
            if (arguments.length != 2) {
                throw new _exception2['default']('#with requires exactly one argument');
            }
            if (_utils.isFunction(context)) {
                context = context.call(this);
            }
            var fn = options.fn;
            if (!_utils.isEmpty(context)) {
                var data = options.data;
                if (options.data && options.ids) {
                    data = _utils.createFrame(options.data);
                    data.contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]);
                }
                return fn(context, {
                    data: data,
                    blockParams: _utils.blockParams([
                        context
                    ], [
                        data && data.contextPath
                    ])
                });
            } else {
                return options.inverse(this);
            }
        });
    };
    exports8 = exports8['default'];
    return exports8;
}
var exports9 = {
}, _dewExec9 = false;
function dew9() {
    if (_dewExec9) return exports9;
    _dewExec9 = true;
    exports9.__esModule = true;
    exports9.registerDefaultHelpers = registerDefaultHelpers;
    exports9.moveHelperToHooks = moveHelperToHooks;
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            'default': obj
        };
    }
    var _helpersBlockHelperMissing = dew2();
    var _helpersBlockHelperMissing2 = _interopRequireDefault(_helpersBlockHelperMissing);
    var _helpersEach = dew3();
    var _helpersEach2 = _interopRequireDefault(_helpersEach);
    var _helpersHelperMissing = dew4();
    var _helpersHelperMissing2 = _interopRequireDefault(_helpersHelperMissing);
    var _helpersIf = dew5();
    var _helpersIf2 = _interopRequireDefault(_helpersIf);
    var _helpersLog = dew6();
    var _helpersLog2 = _interopRequireDefault(_helpersLog);
    var _helpersLookup = dew7();
    var _helpersLookup2 = _interopRequireDefault(_helpersLookup);
    var _helpersWith = dew8();
    var _helpersWith2 = _interopRequireDefault(_helpersWith);
    function registerDefaultHelpers(instance) {
        _helpersBlockHelperMissing2['default'](instance);
        _helpersEach2['default'](instance);
        _helpersHelperMissing2['default'](instance);
        _helpersIf2['default'](instance);
        _helpersLog2['default'](instance);
        _helpersLookup2['default'](instance);
        _helpersWith2['default'](instance);
    }
    function moveHelperToHooks(instance, helperName, keepHelper) {
        if (instance.helpers[helperName]) {
            instance.hooks[helperName] = instance.helpers[helperName];
            if (!keepHelper) {
                delete instance.helpers[helperName];
            }
        }
    }
    return exports9;
}
var exports10 = {
}, _dewExec10 = false;
function dew10() {
    if (_dewExec10) return exports10;
    _dewExec10 = true;
    exports10.__esModule = true;
    var _utils = dew();
    exports10['default'] = function(instance) {
        instance.registerDecorator('inline', function(fn, props, container, options) {
            var ret = fn;
            if (!props.partials) {
                props.partials = {
                };
                ret = function(context, options1) {
                    var original = container.partials;
                    container.partials = _utils.extend({
                    }, original, props.partials);
                    var ret1 = fn(context, options1);
                    container.partials = original;
                    return ret1;
                };
            }
            props.partials[options.args[0]] = options.fn;
            return ret;
        });
    };
    exports10 = exports10['default'];
    return exports10;
}
var exports11 = {
}, _dewExec11 = false;
function dew11() {
    if (_dewExec11) return exports11;
    _dewExec11 = true;
    exports11.__esModule = true;
    exports11.registerDefaultDecorators = registerDefaultDecorators;
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            'default': obj
        };
    }
    var _decoratorsInline = dew10();
    var _decoratorsInline2 = _interopRequireDefault(_decoratorsInline);
    function registerDefaultDecorators(instance) {
        _decoratorsInline2['default'](instance);
    }
    return exports11;
}
var exports12 = {
}, _dewExec12 = false;
function dew12() {
    if (_dewExec12) return exports12;
    _dewExec12 = true;
    exports12.__esModule = true;
    var _utils = dew();
    var logger = {
        methodMap: [
            'debug',
            'info',
            'warn',
            'error'
        ],
        level: 'info',
        lookupLevel: function lookupLevel(level) {
            if (typeof level === 'string') {
                var levelMap = _utils.indexOf(logger.methodMap, level.toLowerCase());
                if (levelMap >= 0) {
                    level = levelMap;
                } else {
                    level = parseInt(level, 10);
                }
            }
            return level;
        },
        log: function log(level) {
            level = logger.lookupLevel(level);
            if (typeof console !== 'undefined' && logger.lookupLevel(logger.level) <= level) {
                var method = logger.methodMap[level];
                if (!console[method]) {
                    method = 'log';
                }
                for(var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
                    message[_key - 1] = arguments[_key];
                }
                console[method].apply(console, message);
            }
        }
    };
    exports12['default'] = logger;
    exports12 = exports12['default'];
    return exports12;
}
var exports13 = {
}, _dewExec13 = false;
function dew13() {
    if (_dewExec13) return exports13;
    _dewExec13 = true;
    exports13.__esModule = true;
    exports13.createNewLookupObject = createNewLookupObject;
    var _utils = dew();
    function createNewLookupObject() {
        for(var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++){
            sources[_key] = arguments[_key];
        }
        return _utils.extend.apply(undefined, [
            Object.create(null)
        ].concat(sources));
    }
    return exports13;
}
var exports14 = {
}, _dewExec14 = false;
function dew14() {
    if (_dewExec14) return exports14;
    _dewExec14 = true;
    exports14.__esModule = true;
    exports14.createProtoAccessControl = createProtoAccessControl;
    exports14.resultIsAllowed = resultIsAllowed;
    exports14.resetLoggedProperties = resetLoggedProperties;
    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {
            };
            if (obj != null) {
                for(var key in obj){
                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                }
            }
            newObj['default'] = obj;
            return newObj;
        }
    }
    var _createNewLookupObject = dew13();
    var _logger = dew12();
    var logger = _interopRequireWildcard(_logger);
    var loggedProperties = Object.create(null);
    function createProtoAccessControl(runtimeOptions) {
        var defaultMethodWhiteList = Object.create(null);
        defaultMethodWhiteList['constructor'] = false;
        defaultMethodWhiteList['__defineGetter__'] = false;
        defaultMethodWhiteList['__defineSetter__'] = false;
        defaultMethodWhiteList['__lookupGetter__'] = false;
        var defaultPropertyWhiteList = Object.create(null);
        defaultPropertyWhiteList['__proto__'] = false;
        return {
            properties: {
                whitelist: _createNewLookupObject.createNewLookupObject(defaultPropertyWhiteList, runtimeOptions.allowedProtoProperties),
                defaultValue: runtimeOptions.allowProtoPropertiesByDefault
            },
            methods: {
                whitelist: _createNewLookupObject.createNewLookupObject(defaultMethodWhiteList, runtimeOptions.allowedProtoMethods),
                defaultValue: runtimeOptions.allowProtoMethodsByDefault
            }
        };
    }
    function resultIsAllowed(result, protoAccessControl, propertyName) {
        if (typeof result === 'function') {
            return checkWhiteList(protoAccessControl.methods, propertyName);
        } else {
            return checkWhiteList(protoAccessControl.properties, propertyName);
        }
    }
    function checkWhiteList(protoAccessControlForType, propertyName) {
        if (protoAccessControlForType.whitelist[propertyName] !== undefined) {
            return protoAccessControlForType.whitelist[propertyName] === true;
        }
        if (protoAccessControlForType.defaultValue !== undefined) {
            return protoAccessControlForType.defaultValue;
        }
        logUnexpecedPropertyAccessOnce(propertyName);
        return false;
    }
    function logUnexpecedPropertyAccessOnce(propertyName) {
        if (loggedProperties[propertyName] !== true) {
            loggedProperties[propertyName] = true;
            logger.log('error', 'Handlebars: Access has been denied to resolve the property "' + propertyName + '" because it is not an "own property" of its parent.\n' + 'You can add a runtime option to disable the check or this warning:\n' + 'See https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details');
        }
    }
    function resetLoggedProperties() {
        Object.keys(loggedProperties).forEach(function(propertyName) {
            delete loggedProperties[propertyName];
        });
    }
    return exports14;
}
var exports15 = {
}, _dewExec15 = false;
function dew15() {
    if (_dewExec15) return exports15;
    _dewExec15 = true;
    exports15.__esModule = true;
    exports15.HandlebarsEnvironment = HandlebarsEnvironment;
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            'default': obj
        };
    }
    var _utils = dew();
    var _exception = dew1();
    var _exception2 = _interopRequireDefault(_exception);
    var _helpers = dew9();
    var _decorators = dew11();
    var _logger = dew12();
    var _logger2 = _interopRequireDefault(_logger);
    var _internalProtoAccess = dew14();
    var VERSION = '4.7.6';
    exports15.VERSION = VERSION;
    var COMPILER_REVISION = 8;
    exports15.COMPILER_REVISION = COMPILER_REVISION;
    var LAST_COMPATIBLE_COMPILER_REVISION = 7;
    exports15.LAST_COMPATIBLE_COMPILER_REVISION = LAST_COMPATIBLE_COMPILER_REVISION;
    var REVISION_CHANGES = {
        1: '<= 1.0.rc.2',
        2: '== 1.0.0-rc.3',
        3: '== 1.0.0-rc.4',
        4: '== 1.x.x',
        5: '== 2.0.0-alpha.x',
        6: '>= 2.0.0-beta.1',
        7: '>= 4.0.0 <4.3.0',
        8: '>= 4.3.0'
    };
    exports15.REVISION_CHANGES = REVISION_CHANGES;
    var objectType = '[object Object]';
    function HandlebarsEnvironment(helpers, partials, decorators) {
        this.helpers = helpers || {
        };
        this.partials = partials || {
        };
        this.decorators = decorators || {
        };
        _helpers.registerDefaultHelpers(this);
        _decorators.registerDefaultDecorators(this);
    }
    HandlebarsEnvironment.prototype = {
        constructor: HandlebarsEnvironment,
        logger: _logger2['default'],
        log: _logger2['default'].log,
        registerHelper: function registerHelper(name, fn) {
            if (_utils.toString.call(name) === objectType) {
                if (fn) {
                    throw new _exception2['default']('Arg not supported with multiple helpers');
                }
                _utils.extend(this.helpers, name);
            } else {
                this.helpers[name] = fn;
            }
        },
        unregisterHelper: function unregisterHelper(name) {
            delete this.helpers[name];
        },
        registerPartial: function registerPartial(name, partial) {
            if (_utils.toString.call(name) === objectType) {
                _utils.extend(this.partials, name);
            } else {
                if (typeof partial === 'undefined') {
                    throw new _exception2['default']('Attempting to register a partial called "' + name + '" as undefined');
                }
                this.partials[name] = partial;
            }
        },
        unregisterPartial: function unregisterPartial(name) {
            delete this.partials[name];
        },
        registerDecorator: function registerDecorator(name, fn) {
            if (_utils.toString.call(name) === objectType) {
                if (fn) {
                    throw new _exception2['default']('Arg not supported with multiple decorators');
                }
                _utils.extend(this.decorators, name);
            } else {
                this.decorators[name] = fn;
            }
        },
        unregisterDecorator: function unregisterDecorator(name) {
            delete this.decorators[name];
        },
        resetLoggedPropertyAccesses: function resetLoggedPropertyAccesses() {
            _internalProtoAccess.resetLoggedProperties();
        }
    };
    var log = _logger2['default'].log;
    exports15.log = log;
    exports15.createFrame = _utils.createFrame;
    exports15.logger = _logger2['default'];
    return exports15;
}
var exports16 = {
}, _dewExec16 = false;
function dew16() {
    if (_dewExec16) return exports16;
    _dewExec16 = true;
    exports16.__esModule = true;
    function SafeString(string) {
        this.string = string;
    }
    SafeString.prototype.toString = SafeString.prototype.toHTML = function() {
        return '' + this.string;
    };
    exports16['default'] = SafeString;
    exports16 = exports16['default'];
    return exports16;
}
var exports17 = {
}, _dewExec17 = false;
function dew17() {
    if (_dewExec17) return exports17;
    _dewExec17 = true;
    exports17.__esModule = true;
    exports17.wrapHelper = wrapHelper;
    function wrapHelper(helper, transformOptionsFn) {
        if (typeof helper !== 'function') {
            return helper;
        }
        var wrapper = function wrapper1() {
            var options = arguments[arguments.length - 1];
            arguments[arguments.length - 1] = transformOptionsFn(options);
            return helper.apply(this, arguments);
        };
        return wrapper;
    }
    return exports17;
}
var exports18 = {
}, _dewExec18 = false;
function dew18() {
    if (_dewExec18) return exports18;
    _dewExec18 = true;
    exports18.__esModule = true;
    exports18.checkRevision = checkRevision;
    exports18.template = template;
    exports18.wrapProgram = wrapProgram;
    exports18.resolvePartial = resolvePartial;
    exports18.invokePartial = invokePartial;
    exports18.noop = noop;
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            'default': obj
        };
    }
    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {
            };
            if (obj != null) {
                for(var key in obj){
                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                }
            }
            newObj['default'] = obj;
            return newObj;
        }
    }
    var _utils = dew();
    var Utils = _interopRequireWildcard(_utils);
    var _exception = dew1();
    var _exception2 = _interopRequireDefault(_exception);
    var _base = dew15();
    var _helpers = dew9();
    var _internalWrapHelper = dew17();
    var _internalProtoAccess = dew14();
    function checkRevision(compilerInfo) {
        var compilerRevision = compilerInfo && compilerInfo[0] || 1, currentRevision = _base.COMPILER_REVISION;
        if (compilerRevision >= _base.LAST_COMPATIBLE_COMPILER_REVISION && compilerRevision <= _base.COMPILER_REVISION) {
            return;
        }
        if (compilerRevision < _base.LAST_COMPATIBLE_COMPILER_REVISION) {
            var runtimeVersions = _base.REVISION_CHANGES[currentRevision], compilerVersions = _base.REVISION_CHANGES[compilerRevision];
            throw new _exception2['default']('Template was precompiled with an older version of Handlebars than the current runtime. ' + 'Please update your precompiler to a newer version (' + runtimeVersions + ') or downgrade your runtime to an older version (' + compilerVersions + ').');
        } else {
            throw new _exception2['default']('Template was precompiled with a newer version of Handlebars than the current runtime. ' + 'Please update your runtime to a newer version (' + compilerInfo[1] + ').');
        }
    }
    function template(templateSpec, env) {
        if (!env) {
            throw new _exception2['default']('No environment passed to template');
        }
        if (!templateSpec || !templateSpec.main) {
            throw new _exception2['default']('Unknown template object: ' + typeof templateSpec);
        }
        templateSpec.main.decorator = templateSpec.main_d;
        env.VM.checkRevision(templateSpec.compiler);
        var templateWasPrecompiledWithCompilerV7 = templateSpec.compiler && templateSpec.compiler[0] === 7;
        function invokePartialWrapper(partial, context, options) {
            if (options.hash) {
                context = Utils.extend({
                }, context, options.hash);
                if (options.ids) {
                    options.ids[0] = true;
                }
            }
            partial = env.VM.resolvePartial.call(this, partial, context, options);
            var extendedOptions = Utils.extend({
            }, options, {
                hooks: this.hooks,
                protoAccessControl: this.protoAccessControl
            });
            var result = env.VM.invokePartial.call(this, partial, context, extendedOptions);
            if (result == null && env.compile) {
                options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
                result = options.partials[options.name](context, extendedOptions);
            }
            if (result != null) {
                if (options.indent) {
                    var lines = result.split('\n');
                    for(var i = 0, l = lines.length; i < l; i++){
                        if (!lines[i] && i + 1 === l) {
                            break;
                        }
                        lines[i] = options.indent + lines[i];
                    }
                    result = lines.join('\n');
                }
                return result;
            } else {
                throw new _exception2['default']('The partial ' + options.name + ' could not be compiled when running in runtime-only mode');
            }
        }
        var container = {
            strict: function strict(obj, name, loc) {
                if (!obj || !(name in obj)) {
                    throw new _exception2['default']('"' + name + '" not defined in ' + obj, {
                        loc: loc
                    });
                }
                return obj[name];
            },
            lookupProperty: function lookupProperty(parent, propertyName) {
                var result = parent[propertyName];
                if (result == null) {
                    return result;
                }
                if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
                    return result;
                }
                if (_internalProtoAccess.resultIsAllowed(result, container.protoAccessControl, propertyName)) {
                    return result;
                }
                return undefined;
            },
            lookup: function lookup(depths, name) {
                var len = depths.length;
                for(var i = 0; i < len; i++){
                    var result = depths[i] && container.lookupProperty(depths[i], name);
                    if (result != null) {
                        return depths[i][name];
                    }
                }
            },
            lambda: function lambda(current, context) {
                return typeof current === 'function' ? current.call(context) : current;
            },
            escapeExpression: Utils.escapeExpression,
            invokePartial: invokePartialWrapper,
            fn: function fn(i) {
                var ret = templateSpec[i];
                ret.decorator = templateSpec[i + '_d'];
                return ret;
            },
            programs: [],
            program: function program(i, data, declaredBlockParams, blockParams, depths) {
                var programWrapper = this.programs[i], fn1 = this.fn(i);
                if (data || depths || blockParams || declaredBlockParams) {
                    programWrapper = wrapProgram(this, i, fn1, data, declaredBlockParams, blockParams, depths);
                } else if (!programWrapper) {
                    programWrapper = this.programs[i] = wrapProgram(this, i, fn1);
                }
                return programWrapper;
            },
            data: function data(value, depth) {
                while(value && depth--){
                    value = value._parent;
                }
                return value;
            },
            mergeIfNeeded: function mergeIfNeeded(param, common) {
                var obj = param || common;
                if (param && common && param !== common) {
                    obj = Utils.extend({
                    }, common, param);
                }
                return obj;
            },
            nullContext: Object.seal({
            }),
            noop: env.VM.noop,
            compilerInfo: templateSpec.compiler
        };
        function ret(context) {
            var options = arguments.length <= 1 || arguments[1] === undefined ? {
            } : arguments[1];
            var data = options.data;
            ret._setup(options);
            if (!options.partial && templateSpec.useData) {
                data = initData(context, data);
            }
            var depths = undefined, blockParams = templateSpec.useBlockParams ? [] : undefined;
            if (templateSpec.useDepths) {
                if (options.depths) {
                    depths = context != options.depths[0] ? [
                        context
                    ].concat(options.depths) : options.depths;
                } else {
                    depths = [
                        context
                    ];
                }
            }
            function main(context1) {
                return '' + templateSpec.main(container, context1, container.helpers, container.partials, data, blockParams, depths);
            }
            main = executeDecorators(templateSpec.main, main, container, options.depths || [], data, blockParams);
            return main(context, options);
        }
        ret.isTop = true;
        ret._setup = function(options) {
            if (!options.partial) {
                var mergedHelpers = Utils.extend({
                }, env.helpers, options.helpers);
                wrapHelpersToPassLookupProperty(mergedHelpers, container);
                container.helpers = mergedHelpers;
                if (templateSpec.usePartial) {
                    container.partials = container.mergeIfNeeded(options.partials, env.partials);
                }
                if (templateSpec.usePartial || templateSpec.useDecorators) {
                    container.decorators = Utils.extend({
                    }, env.decorators, options.decorators);
                }
                container.hooks = {
                };
                container.protoAccessControl = _internalProtoAccess.createProtoAccessControl(options);
                var keepHelperInHelpers = options.allowCallsToHelperMissing || templateWasPrecompiledWithCompilerV7;
                _helpers.moveHelperToHooks(container, 'helperMissing', keepHelperInHelpers);
                _helpers.moveHelperToHooks(container, 'blockHelperMissing', keepHelperInHelpers);
            } else {
                container.protoAccessControl = options.protoAccessControl;
                container.helpers = options.helpers;
                container.partials = options.partials;
                container.decorators = options.decorators;
                container.hooks = options.hooks;
            }
        };
        ret._child = function(i, data, blockParams, depths) {
            if (templateSpec.useBlockParams && !blockParams) {
                throw new _exception2['default']('must pass block params');
            }
            if (templateSpec.useDepths && !depths) {
                throw new _exception2['default']('must pass parent depths');
            }
            return wrapProgram(container, i, templateSpec[i], data, 0, blockParams, depths);
        };
        return ret;
    }
    function wrapProgram(container, i, fn, data, declaredBlockParams, blockParams, depths) {
        function prog(context) {
            var options = arguments.length <= 1 || arguments[1] === undefined ? {
            } : arguments[1];
            var currentDepths = depths;
            if (depths && context != depths[0] && !(context === container.nullContext && depths[0] === null)) {
                currentDepths = [
                    context
                ].concat(depths);
            }
            return fn(container, context, container.helpers, container.partials, options.data || data, blockParams && [
                options.blockParams
            ].concat(blockParams), currentDepths);
        }
        prog = executeDecorators(fn, prog, container, depths, data, blockParams);
        prog.program = i;
        prog.depth = depths ? depths.length : 0;
        prog.blockParams = declaredBlockParams || 0;
        return prog;
    }
    function resolvePartial(partial, context, options) {
        if (!partial) {
            if (options.name === '@partial-block') {
                partial = options.data['partial-block'];
            } else {
                partial = options.partials[options.name];
            }
        } else if (!partial.call && !options.name) {
            options.name = partial;
            partial = options.partials[partial];
        }
        return partial;
    }
    function invokePartial(partial, context, options) {
        var currentPartialBlock = options.data && options.data['partial-block'];
        options.partial = true;
        if (options.ids) {
            options.data.contextPath = options.ids[0] || options.data.contextPath;
        }
        var partialBlock = undefined;
        if (options.fn && options.fn !== noop) {
            (function() {
                options.data = _base.createFrame(options.data);
                var fn = options.fn;
                partialBlock = options.data['partial-block'] = function partialBlockWrapper(context1) {
                    var options1 = arguments.length <= 1 || arguments[1] === undefined ? {
                    } : arguments[1];
                    options1.data = _base.createFrame(options1.data);
                    options1.data['partial-block'] = currentPartialBlock;
                    return fn(context1, options1);
                };
                if (fn.partials) {
                    options.partials = Utils.extend({
                    }, options.partials, fn.partials);
                }
            })();
        }
        if (partial === undefined && partialBlock) {
            partial = partialBlock;
        }
        if (partial === undefined) {
            throw new _exception2['default']('The partial ' + options.name + ' could not be found');
        } else if (partial instanceof Function) {
            return partial(context, options);
        }
    }
    function noop() {
        return '';
    }
    function initData(context, data) {
        if (!data || !('root' in data)) {
            data = data ? _base.createFrame(data) : {
            };
            data.root = context;
        }
        return data;
    }
    function executeDecorators(fn, prog, container, depths, data, blockParams) {
        if (fn.decorator) {
            var props = {
            };
            prog = fn.decorator(prog, props, container, depths && depths[0], data, blockParams, depths);
            Utils.extend(prog, props);
        }
        return prog;
    }
    function wrapHelpersToPassLookupProperty(mergedHelpers, container) {
        Object.keys(mergedHelpers).forEach(function(helperName) {
            var helper = mergedHelpers[helperName];
            mergedHelpers[helperName] = passLookupPropertyOption(helper, container);
        });
    }
    function passLookupPropertyOption(helper, container) {
        var lookupProperty = container.lookupProperty;
        return _internalWrapHelper.wrapHelper(helper, function(options) {
            return Utils.extend({
                lookupProperty: lookupProperty
            }, options);
        });
    }
    return exports18;
}
var exports19 = {
}, _dewExec19 = false;
var _global1 = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : global;
function dew19() {
    if (_dewExec19) return exports19;
    _dewExec19 = true;
    exports19.__esModule = true;
    exports19['default'] = function(Handlebars) {
        var root = typeof _global1 !== 'undefined' ? _global1 : window, $Handlebars = root.Handlebars;
        Handlebars.noConflict = function() {
            if (root.Handlebars === Handlebars) {
                root.Handlebars = $Handlebars;
            }
            return Handlebars;
        };
    };
    exports19 = exports19['default'];
    return exports19;
}
var exports20 = {
}, _dewExec20 = false;
function dew20() {
    if (_dewExec20) return exports20;
    _dewExec20 = true;
    exports20.__esModule = true;
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            'default': obj
        };
    }
    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {
            };
            if (obj != null) {
                for(var key in obj){
                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                }
            }
            newObj['default'] = obj;
            return newObj;
        }
    }
    var _handlebarsBase = dew15();
    var base = _interopRequireWildcard(_handlebarsBase);
    var _handlebarsSafeString = dew16();
    var _handlebarsSafeString2 = _interopRequireDefault(_handlebarsSafeString);
    var _handlebarsException = dew1();
    var _handlebarsException2 = _interopRequireDefault(_handlebarsException);
    var _handlebarsUtils = dew();
    var Utils = _interopRequireWildcard(_handlebarsUtils);
    var _handlebarsRuntime = dew18();
    var runtime = _interopRequireWildcard(_handlebarsRuntime);
    var _handlebarsNoConflict = dew19();
    var _handlebarsNoConflict2 = _interopRequireDefault(_handlebarsNoConflict);
    function create() {
        var hb = new base.HandlebarsEnvironment();
        Utils.extend(hb, base);
        hb.SafeString = _handlebarsSafeString2['default'];
        hb.Exception = _handlebarsException2['default'];
        hb.Utils = Utils;
        hb.escapeExpression = Utils.escapeExpression;
        hb.VM = runtime;
        hb.template = function(spec) {
            return runtime.template(spec, hb);
        };
        return hb;
    }
    var inst = create();
    inst.create = create;
    _handlebarsNoConflict2['default'](inst);
    inst['default'] = inst;
    exports20['default'] = inst;
    exports20 = exports20['default'];
    return exports20;
}
var exports21 = {
}, _dewExec21 = false;
function dew21() {
    if (_dewExec21) return exports21;
    _dewExec21 = true;
    exports21.__esModule = true;
    var AST = {
        helpers: {
            helperExpression: function helperExpression(node) {
                return node.type === 'SubExpression' || (node.type === 'MustacheStatement' || node.type === 'BlockStatement') && !!(node.params && node.params.length || node.hash);
            },
            scopedId: function scopedId(path) {
                return /^\.|this\b/.test(path.original);
            },
            simpleId: function simpleId(path) {
                return path.parts.length === 1 && !AST.helpers.scopedId(path) && !path.depth;
            }
        }
    };
    exports21['default'] = AST;
    exports21 = exports21['default'];
    return exports21;
}
var exports22 = {
}, _dewExec22 = false;
function dew22() {
    if (_dewExec22) return exports22;
    _dewExec22 = true;
    exports22.__esModule = true;
    var handlebars = function() {
        var parser = {
            trace: function trace() {
            },
            yy: {
            },
            symbols_: {
                "error": 2,
                "root": 3,
                "program": 4,
                "EOF": 5,
                "program_repetition0": 6,
                "statement": 7,
                "mustache": 8,
                "block": 9,
                "rawBlock": 10,
                "partial": 11,
                "partialBlock": 12,
                "content": 13,
                "COMMENT": 14,
                "CONTENT": 15,
                "openRawBlock": 16,
                "rawBlock_repetition0": 17,
                "END_RAW_BLOCK": 18,
                "OPEN_RAW_BLOCK": 19,
                "helperName": 20,
                "openRawBlock_repetition0": 21,
                "openRawBlock_option0": 22,
                "CLOSE_RAW_BLOCK": 23,
                "openBlock": 24,
                "block_option0": 25,
                "closeBlock": 26,
                "openInverse": 27,
                "block_option1": 28,
                "OPEN_BLOCK": 29,
                "openBlock_repetition0": 30,
                "openBlock_option0": 31,
                "openBlock_option1": 32,
                "CLOSE": 33,
                "OPEN_INVERSE": 34,
                "openInverse_repetition0": 35,
                "openInverse_option0": 36,
                "openInverse_option1": 37,
                "openInverseChain": 38,
                "OPEN_INVERSE_CHAIN": 39,
                "openInverseChain_repetition0": 40,
                "openInverseChain_option0": 41,
                "openInverseChain_option1": 42,
                "inverseAndProgram": 43,
                "INVERSE": 44,
                "inverseChain": 45,
                "inverseChain_option0": 46,
                "OPEN_ENDBLOCK": 47,
                "OPEN": 48,
                "mustache_repetition0": 49,
                "mustache_option0": 50,
                "OPEN_UNESCAPED": 51,
                "mustache_repetition1": 52,
                "mustache_option1": 53,
                "CLOSE_UNESCAPED": 54,
                "OPEN_PARTIAL": 55,
                "partialName": 56,
                "partial_repetition0": 57,
                "partial_option0": 58,
                "openPartialBlock": 59,
                "OPEN_PARTIAL_BLOCK": 60,
                "openPartialBlock_repetition0": 61,
                "openPartialBlock_option0": 62,
                "param": 63,
                "sexpr": 64,
                "OPEN_SEXPR": 65,
                "sexpr_repetition0": 66,
                "sexpr_option0": 67,
                "CLOSE_SEXPR": 68,
                "hash": 69,
                "hash_repetition_plus0": 70,
                "hashSegment": 71,
                "ID": 72,
                "EQUALS": 73,
                "blockParams": 74,
                "OPEN_BLOCK_PARAMS": 75,
                "blockParams_repetition_plus0": 76,
                "CLOSE_BLOCK_PARAMS": 77,
                "path": 78,
                "dataName": 79,
                "STRING": 80,
                "NUMBER": 81,
                "BOOLEAN": 82,
                "UNDEFINED": 83,
                "NULL": 84,
                "DATA": 85,
                "pathSegments": 86,
                "SEP": 87,
                "$accept": 0,
                "$end": 1
            },
            terminals_: {
                2: "error",
                5: "EOF",
                14: "COMMENT",
                15: "CONTENT",
                18: "END_RAW_BLOCK",
                19: "OPEN_RAW_BLOCK",
                23: "CLOSE_RAW_BLOCK",
                29: "OPEN_BLOCK",
                33: "CLOSE",
                34: "OPEN_INVERSE",
                39: "OPEN_INVERSE_CHAIN",
                44: "INVERSE",
                47: "OPEN_ENDBLOCK",
                48: "OPEN",
                51: "OPEN_UNESCAPED",
                54: "CLOSE_UNESCAPED",
                55: "OPEN_PARTIAL",
                60: "OPEN_PARTIAL_BLOCK",
                65: "OPEN_SEXPR",
                68: "CLOSE_SEXPR",
                72: "ID",
                73: "EQUALS",
                75: "OPEN_BLOCK_PARAMS",
                77: "CLOSE_BLOCK_PARAMS",
                80: "STRING",
                81: "NUMBER",
                82: "BOOLEAN",
                83: "UNDEFINED",
                84: "NULL",
                85: "DATA",
                87: "SEP"
            },
            productions_: [
                0,
                [
                    3,
                    2
                ],
                [
                    4,
                    1
                ],
                [
                    7,
                    1
                ],
                [
                    7,
                    1
                ],
                [
                    7,
                    1
                ],
                [
                    7,
                    1
                ],
                [
                    7,
                    1
                ],
                [
                    7,
                    1
                ],
                [
                    7,
                    1
                ],
                [
                    13,
                    1
                ],
                [
                    10,
                    3
                ],
                [
                    16,
                    5
                ],
                [
                    9,
                    4
                ],
                [
                    9,
                    4
                ],
                [
                    24,
                    6
                ],
                [
                    27,
                    6
                ],
                [
                    38,
                    6
                ],
                [
                    43,
                    2
                ],
                [
                    45,
                    3
                ],
                [
                    45,
                    1
                ],
                [
                    26,
                    3
                ],
                [
                    8,
                    5
                ],
                [
                    8,
                    5
                ],
                [
                    11,
                    5
                ],
                [
                    12,
                    3
                ],
                [
                    59,
                    5
                ],
                [
                    63,
                    1
                ],
                [
                    63,
                    1
                ],
                [
                    64,
                    5
                ],
                [
                    69,
                    1
                ],
                [
                    71,
                    3
                ],
                [
                    74,
                    3
                ],
                [
                    20,
                    1
                ],
                [
                    20,
                    1
                ],
                [
                    20,
                    1
                ],
                [
                    20,
                    1
                ],
                [
                    20,
                    1
                ],
                [
                    20,
                    1
                ],
                [
                    20,
                    1
                ],
                [
                    56,
                    1
                ],
                [
                    56,
                    1
                ],
                [
                    79,
                    2
                ],
                [
                    78,
                    1
                ],
                [
                    86,
                    3
                ],
                [
                    86,
                    1
                ],
                [
                    6,
                    0
                ],
                [
                    6,
                    2
                ],
                [
                    17,
                    0
                ],
                [
                    17,
                    2
                ],
                [
                    21,
                    0
                ],
                [
                    21,
                    2
                ],
                [
                    22,
                    0
                ],
                [
                    22,
                    1
                ],
                [
                    25,
                    0
                ],
                [
                    25,
                    1
                ],
                [
                    28,
                    0
                ],
                [
                    28,
                    1
                ],
                [
                    30,
                    0
                ],
                [
                    30,
                    2
                ],
                [
                    31,
                    0
                ],
                [
                    31,
                    1
                ],
                [
                    32,
                    0
                ],
                [
                    32,
                    1
                ],
                [
                    35,
                    0
                ],
                [
                    35,
                    2
                ],
                [
                    36,
                    0
                ],
                [
                    36,
                    1
                ],
                [
                    37,
                    0
                ],
                [
                    37,
                    1
                ],
                [
                    40,
                    0
                ],
                [
                    40,
                    2
                ],
                [
                    41,
                    0
                ],
                [
                    41,
                    1
                ],
                [
                    42,
                    0
                ],
                [
                    42,
                    1
                ],
                [
                    46,
                    0
                ],
                [
                    46,
                    1
                ],
                [
                    49,
                    0
                ],
                [
                    49,
                    2
                ],
                [
                    50,
                    0
                ],
                [
                    50,
                    1
                ],
                [
                    52,
                    0
                ],
                [
                    52,
                    2
                ],
                [
                    53,
                    0
                ],
                [
                    53,
                    1
                ],
                [
                    57,
                    0
                ],
                [
                    57,
                    2
                ],
                [
                    58,
                    0
                ],
                [
                    58,
                    1
                ],
                [
                    61,
                    0
                ],
                [
                    61,
                    2
                ],
                [
                    62,
                    0
                ],
                [
                    62,
                    1
                ],
                [
                    66,
                    0
                ],
                [
                    66,
                    2
                ],
                [
                    67,
                    0
                ],
                [
                    67,
                    1
                ],
                [
                    70,
                    1
                ],
                [
                    70,
                    2
                ],
                [
                    76,
                    1
                ],
                [
                    76,
                    2
                ]
            ],
            performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
                var $0 = $$.length - 1;
                switch(yystate){
                    case 1:
                        return $$[$0 - 1];
                        break;
                    case 2:
                        this.$ = yy.prepareProgram($$[$0]);
                        break;
                    case 3:
                        this.$ = $$[$0];
                        break;
                    case 4:
                        this.$ = $$[$0];
                        break;
                    case 5:
                        this.$ = $$[$0];
                        break;
                    case 6:
                        this.$ = $$[$0];
                        break;
                    case 7:
                        this.$ = $$[$0];
                        break;
                    case 8:
                        this.$ = $$[$0];
                        break;
                    case 9:
                        this.$ = {
                            type: 'CommentStatement',
                            value: yy.stripComment($$[$0]),
                            strip: yy.stripFlags($$[$0], $$[$0]),
                            loc: yy.locInfo(this._$)
                        };
                        break;
                    case 10:
                        this.$ = {
                            type: 'ContentStatement',
                            original: $$[$0],
                            value: $$[$0],
                            loc: yy.locInfo(this._$)
                        };
                        break;
                    case 11:
                        this.$ = yy.prepareRawBlock($$[$0 - 2], $$[$0 - 1], $$[$0], this._$);
                        break;
                    case 12:
                        this.$ = {
                            path: $$[$0 - 3],
                            params: $$[$0 - 2],
                            hash: $$[$0 - 1]
                        };
                        break;
                    case 13:
                        this.$ = yy.prepareBlock($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0], false, this._$);
                        break;
                    case 14:
                        this.$ = yy.prepareBlock($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0], true, this._$);
                        break;
                    case 15:
                        this.$ = {
                            open: $$[$0 - 5],
                            path: $$[$0 - 4],
                            params: $$[$0 - 3],
                            hash: $$[$0 - 2],
                            blockParams: $$[$0 - 1],
                            strip: yy.stripFlags($$[$0 - 5], $$[$0])
                        };
                        break;
                    case 16:
                        this.$ = {
                            path: $$[$0 - 4],
                            params: $$[$0 - 3],
                            hash: $$[$0 - 2],
                            blockParams: $$[$0 - 1],
                            strip: yy.stripFlags($$[$0 - 5], $$[$0])
                        };
                        break;
                    case 17:
                        this.$ = {
                            path: $$[$0 - 4],
                            params: $$[$0 - 3],
                            hash: $$[$0 - 2],
                            blockParams: $$[$0 - 1],
                            strip: yy.stripFlags($$[$0 - 5], $$[$0])
                        };
                        break;
                    case 18:
                        this.$ = {
                            strip: yy.stripFlags($$[$0 - 1], $$[$0 - 1]),
                            program: $$[$0]
                        };
                        break;
                    case 19:
                        var inverse = yy.prepareBlock($$[$0 - 2], $$[$0 - 1], $$[$0], $$[$0], false, this._$), program = yy.prepareProgram([
                            inverse
                        ], $$[$0 - 1].loc);
                        program.chained = true;
                        this.$ = {
                            strip: $$[$0 - 2].strip,
                            program: program,
                            chain: true
                        };
                        break;
                    case 20:
                        this.$ = $$[$0];
                        break;
                    case 21:
                        this.$ = {
                            path: $$[$0 - 1],
                            strip: yy.stripFlags($$[$0 - 2], $$[$0])
                        };
                        break;
                    case 22:
                        this.$ = yy.prepareMustache($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0 - 4], yy.stripFlags($$[$0 - 4], $$[$0]), this._$);
                        break;
                    case 23:
                        this.$ = yy.prepareMustache($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0 - 4], yy.stripFlags($$[$0 - 4], $$[$0]), this._$);
                        break;
                    case 24:
                        this.$ = {
                            type: 'PartialStatement',
                            name: $$[$0 - 3],
                            params: $$[$0 - 2],
                            hash: $$[$0 - 1],
                            indent: '',
                            strip: yy.stripFlags($$[$0 - 4], $$[$0]),
                            loc: yy.locInfo(this._$)
                        };
                        break;
                    case 25:
                        this.$ = yy.preparePartialBlock($$[$0 - 2], $$[$0 - 1], $$[$0], this._$);
                        break;
                    case 26:
                        this.$ = {
                            path: $$[$0 - 3],
                            params: $$[$0 - 2],
                            hash: $$[$0 - 1],
                            strip: yy.stripFlags($$[$0 - 4], $$[$0])
                        };
                        break;
                    case 27:
                        this.$ = $$[$0];
                        break;
                    case 28:
                        this.$ = $$[$0];
                        break;
                    case 29:
                        this.$ = {
                            type: 'SubExpression',
                            path: $$[$0 - 3],
                            params: $$[$0 - 2],
                            hash: $$[$0 - 1],
                            loc: yy.locInfo(this._$)
                        };
                        break;
                    case 30:
                        this.$ = {
                            type: 'Hash',
                            pairs: $$[$0],
                            loc: yy.locInfo(this._$)
                        };
                        break;
                    case 31:
                        this.$ = {
                            type: 'HashPair',
                            key: yy.id($$[$0 - 2]),
                            value: $$[$0],
                            loc: yy.locInfo(this._$)
                        };
                        break;
                    case 32:
                        this.$ = yy.id($$[$0 - 1]);
                        break;
                    case 33:
                        this.$ = $$[$0];
                        break;
                    case 34:
                        this.$ = $$[$0];
                        break;
                    case 35:
                        this.$ = {
                            type: 'StringLiteral',
                            value: $$[$0],
                            original: $$[$0],
                            loc: yy.locInfo(this._$)
                        };
                        break;
                    case 36:
                        this.$ = {
                            type: 'NumberLiteral',
                            value: Number($$[$0]),
                            original: Number($$[$0]),
                            loc: yy.locInfo(this._$)
                        };
                        break;
                    case 37:
                        this.$ = {
                            type: 'BooleanLiteral',
                            value: $$[$0] === 'true',
                            original: $$[$0] === 'true',
                            loc: yy.locInfo(this._$)
                        };
                        break;
                    case 38:
                        this.$ = {
                            type: 'UndefinedLiteral',
                            original: undefined,
                            value: undefined,
                            loc: yy.locInfo(this._$)
                        };
                        break;
                    case 39:
                        this.$ = {
                            type: 'NullLiteral',
                            original: null,
                            value: null,
                            loc: yy.locInfo(this._$)
                        };
                        break;
                    case 40:
                        this.$ = $$[$0];
                        break;
                    case 41:
                        this.$ = $$[$0];
                        break;
                    case 42:
                        this.$ = yy.preparePath(true, $$[$0], this._$);
                        break;
                    case 43:
                        this.$ = yy.preparePath(false, $$[$0], this._$);
                        break;
                    case 44:
                        $$[$0 - 2].push({
                            part: yy.id($$[$0]),
                            original: $$[$0],
                            separator: $$[$0 - 1]
                        });
                        this.$ = $$[$0 - 2];
                        break;
                    case 45:
                        this.$ = [
                            {
                                part: yy.id($$[$0]),
                                original: $$[$0]
                            }
                        ];
                        break;
                    case 46:
                        this.$ = [];
                        break;
                    case 47:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 48:
                        this.$ = [];
                        break;
                    case 49:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 50:
                        this.$ = [];
                        break;
                    case 51:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 58:
                        this.$ = [];
                        break;
                    case 59:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 64:
                        this.$ = [];
                        break;
                    case 65:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 70:
                        this.$ = [];
                        break;
                    case 71:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 78:
                        this.$ = [];
                        break;
                    case 79:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 82:
                        this.$ = [];
                        break;
                    case 83:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 86:
                        this.$ = [];
                        break;
                    case 87:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 90:
                        this.$ = [];
                        break;
                    case 91:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 94:
                        this.$ = [];
                        break;
                    case 95:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 98:
                        this.$ = [
                            $$[$0]
                        ];
                        break;
                    case 99:
                        $$[$0 - 1].push($$[$0]);
                        break;
                    case 100:
                        this.$ = [
                            $$[$0]
                        ];
                        break;
                    case 101:
                        $$[$0 - 1].push($$[$0]);
                        break;
                }
            },
            table: [
                {
                    3: 1,
                    4: 2,
                    5: [
                        2,
                        46
                    ],
                    6: 3,
                    14: [
                        2,
                        46
                    ],
                    15: [
                        2,
                        46
                    ],
                    19: [
                        2,
                        46
                    ],
                    29: [
                        2,
                        46
                    ],
                    34: [
                        2,
                        46
                    ],
                    48: [
                        2,
                        46
                    ],
                    51: [
                        2,
                        46
                    ],
                    55: [
                        2,
                        46
                    ],
                    60: [
                        2,
                        46
                    ]
                },
                {
                    1: [
                        3
                    ]
                },
                {
                    5: [
                        1,
                        4
                    ]
                },
                {
                    5: [
                        2,
                        2
                    ],
                    7: 5,
                    8: 6,
                    9: 7,
                    10: 8,
                    11: 9,
                    12: 10,
                    13: 11,
                    14: [
                        1,
                        12
                    ],
                    15: [
                        1,
                        20
                    ],
                    16: 17,
                    19: [
                        1,
                        23
                    ],
                    24: 15,
                    27: 16,
                    29: [
                        1,
                        21
                    ],
                    34: [
                        1,
                        22
                    ],
                    39: [
                        2,
                        2
                    ],
                    44: [
                        2,
                        2
                    ],
                    47: [
                        2,
                        2
                    ],
                    48: [
                        1,
                        13
                    ],
                    51: [
                        1,
                        14
                    ],
                    55: [
                        1,
                        18
                    ],
                    59: 19,
                    60: [
                        1,
                        24
                    ]
                },
                {
                    1: [
                        2,
                        1
                    ]
                },
                {
                    5: [
                        2,
                        47
                    ],
                    14: [
                        2,
                        47
                    ],
                    15: [
                        2,
                        47
                    ],
                    19: [
                        2,
                        47
                    ],
                    29: [
                        2,
                        47
                    ],
                    34: [
                        2,
                        47
                    ],
                    39: [
                        2,
                        47
                    ],
                    44: [
                        2,
                        47
                    ],
                    47: [
                        2,
                        47
                    ],
                    48: [
                        2,
                        47
                    ],
                    51: [
                        2,
                        47
                    ],
                    55: [
                        2,
                        47
                    ],
                    60: [
                        2,
                        47
                    ]
                },
                {
                    5: [
                        2,
                        3
                    ],
                    14: [
                        2,
                        3
                    ],
                    15: [
                        2,
                        3
                    ],
                    19: [
                        2,
                        3
                    ],
                    29: [
                        2,
                        3
                    ],
                    34: [
                        2,
                        3
                    ],
                    39: [
                        2,
                        3
                    ],
                    44: [
                        2,
                        3
                    ],
                    47: [
                        2,
                        3
                    ],
                    48: [
                        2,
                        3
                    ],
                    51: [
                        2,
                        3
                    ],
                    55: [
                        2,
                        3
                    ],
                    60: [
                        2,
                        3
                    ]
                },
                {
                    5: [
                        2,
                        4
                    ],
                    14: [
                        2,
                        4
                    ],
                    15: [
                        2,
                        4
                    ],
                    19: [
                        2,
                        4
                    ],
                    29: [
                        2,
                        4
                    ],
                    34: [
                        2,
                        4
                    ],
                    39: [
                        2,
                        4
                    ],
                    44: [
                        2,
                        4
                    ],
                    47: [
                        2,
                        4
                    ],
                    48: [
                        2,
                        4
                    ],
                    51: [
                        2,
                        4
                    ],
                    55: [
                        2,
                        4
                    ],
                    60: [
                        2,
                        4
                    ]
                },
                {
                    5: [
                        2,
                        5
                    ],
                    14: [
                        2,
                        5
                    ],
                    15: [
                        2,
                        5
                    ],
                    19: [
                        2,
                        5
                    ],
                    29: [
                        2,
                        5
                    ],
                    34: [
                        2,
                        5
                    ],
                    39: [
                        2,
                        5
                    ],
                    44: [
                        2,
                        5
                    ],
                    47: [
                        2,
                        5
                    ],
                    48: [
                        2,
                        5
                    ],
                    51: [
                        2,
                        5
                    ],
                    55: [
                        2,
                        5
                    ],
                    60: [
                        2,
                        5
                    ]
                },
                {
                    5: [
                        2,
                        6
                    ],
                    14: [
                        2,
                        6
                    ],
                    15: [
                        2,
                        6
                    ],
                    19: [
                        2,
                        6
                    ],
                    29: [
                        2,
                        6
                    ],
                    34: [
                        2,
                        6
                    ],
                    39: [
                        2,
                        6
                    ],
                    44: [
                        2,
                        6
                    ],
                    47: [
                        2,
                        6
                    ],
                    48: [
                        2,
                        6
                    ],
                    51: [
                        2,
                        6
                    ],
                    55: [
                        2,
                        6
                    ],
                    60: [
                        2,
                        6
                    ]
                },
                {
                    5: [
                        2,
                        7
                    ],
                    14: [
                        2,
                        7
                    ],
                    15: [
                        2,
                        7
                    ],
                    19: [
                        2,
                        7
                    ],
                    29: [
                        2,
                        7
                    ],
                    34: [
                        2,
                        7
                    ],
                    39: [
                        2,
                        7
                    ],
                    44: [
                        2,
                        7
                    ],
                    47: [
                        2,
                        7
                    ],
                    48: [
                        2,
                        7
                    ],
                    51: [
                        2,
                        7
                    ],
                    55: [
                        2,
                        7
                    ],
                    60: [
                        2,
                        7
                    ]
                },
                {
                    5: [
                        2,
                        8
                    ],
                    14: [
                        2,
                        8
                    ],
                    15: [
                        2,
                        8
                    ],
                    19: [
                        2,
                        8
                    ],
                    29: [
                        2,
                        8
                    ],
                    34: [
                        2,
                        8
                    ],
                    39: [
                        2,
                        8
                    ],
                    44: [
                        2,
                        8
                    ],
                    47: [
                        2,
                        8
                    ],
                    48: [
                        2,
                        8
                    ],
                    51: [
                        2,
                        8
                    ],
                    55: [
                        2,
                        8
                    ],
                    60: [
                        2,
                        8
                    ]
                },
                {
                    5: [
                        2,
                        9
                    ],
                    14: [
                        2,
                        9
                    ],
                    15: [
                        2,
                        9
                    ],
                    19: [
                        2,
                        9
                    ],
                    29: [
                        2,
                        9
                    ],
                    34: [
                        2,
                        9
                    ],
                    39: [
                        2,
                        9
                    ],
                    44: [
                        2,
                        9
                    ],
                    47: [
                        2,
                        9
                    ],
                    48: [
                        2,
                        9
                    ],
                    51: [
                        2,
                        9
                    ],
                    55: [
                        2,
                        9
                    ],
                    60: [
                        2,
                        9
                    ]
                },
                {
                    20: 25,
                    72: [
                        1,
                        35
                    ],
                    78: 26,
                    79: 27,
                    80: [
                        1,
                        28
                    ],
                    81: [
                        1,
                        29
                    ],
                    82: [
                        1,
                        30
                    ],
                    83: [
                        1,
                        31
                    ],
                    84: [
                        1,
                        32
                    ],
                    85: [
                        1,
                        34
                    ],
                    86: 33
                },
                {
                    20: 36,
                    72: [
                        1,
                        35
                    ],
                    78: 26,
                    79: 27,
                    80: [
                        1,
                        28
                    ],
                    81: [
                        1,
                        29
                    ],
                    82: [
                        1,
                        30
                    ],
                    83: [
                        1,
                        31
                    ],
                    84: [
                        1,
                        32
                    ],
                    85: [
                        1,
                        34
                    ],
                    86: 33
                },
                {
                    4: 37,
                    6: 3,
                    14: [
                        2,
                        46
                    ],
                    15: [
                        2,
                        46
                    ],
                    19: [
                        2,
                        46
                    ],
                    29: [
                        2,
                        46
                    ],
                    34: [
                        2,
                        46
                    ],
                    39: [
                        2,
                        46
                    ],
                    44: [
                        2,
                        46
                    ],
                    47: [
                        2,
                        46
                    ],
                    48: [
                        2,
                        46
                    ],
                    51: [
                        2,
                        46
                    ],
                    55: [
                        2,
                        46
                    ],
                    60: [
                        2,
                        46
                    ]
                },
                {
                    4: 38,
                    6: 3,
                    14: [
                        2,
                        46
                    ],
                    15: [
                        2,
                        46
                    ],
                    19: [
                        2,
                        46
                    ],
                    29: [
                        2,
                        46
                    ],
                    34: [
                        2,
                        46
                    ],
                    44: [
                        2,
                        46
                    ],
                    47: [
                        2,
                        46
                    ],
                    48: [
                        2,
                        46
                    ],
                    51: [
                        2,
                        46
                    ],
                    55: [
                        2,
                        46
                    ],
                    60: [
                        2,
                        46
                    ]
                },
                {
                    15: [
                        2,
                        48
                    ],
                    17: 39,
                    18: [
                        2,
                        48
                    ]
                },
                {
                    20: 41,
                    56: 40,
                    64: 42,
                    65: [
                        1,
                        43
                    ],
                    72: [
                        1,
                        35
                    ],
                    78: 26,
                    79: 27,
                    80: [
                        1,
                        28
                    ],
                    81: [
                        1,
                        29
                    ],
                    82: [
                        1,
                        30
                    ],
                    83: [
                        1,
                        31
                    ],
                    84: [
                        1,
                        32
                    ],
                    85: [
                        1,
                        34
                    ],
                    86: 33
                },
                {
                    4: 44,
                    6: 3,
                    14: [
                        2,
                        46
                    ],
                    15: [
                        2,
                        46
                    ],
                    19: [
                        2,
                        46
                    ],
                    29: [
                        2,
                        46
                    ],
                    34: [
                        2,
                        46
                    ],
                    47: [
                        2,
                        46
                    ],
                    48: [
                        2,
                        46
                    ],
                    51: [
                        2,
                        46
                    ],
                    55: [
                        2,
                        46
                    ],
                    60: [
                        2,
                        46
                    ]
                },
                {
                    5: [
                        2,
                        10
                    ],
                    14: [
                        2,
                        10
                    ],
                    15: [
                        2,
                        10
                    ],
                    18: [
                        2,
                        10
                    ],
                    19: [
                        2,
                        10
                    ],
                    29: [
                        2,
                        10
                    ],
                    34: [
                        2,
                        10
                    ],
                    39: [
                        2,
                        10
                    ],
                    44: [
                        2,
                        10
                    ],
                    47: [
                        2,
                        10
                    ],
                    48: [
                        2,
                        10
                    ],
                    51: [
                        2,
                        10
                    ],
                    55: [
                        2,
                        10
                    ],
                    60: [
                        2,
                        10
                    ]
                },
                {
                    20: 45,
                    72: [
                        1,
                        35
                    ],
                    78: 26,
                    79: 27,
                    80: [
                        1,
                        28
                    ],
                    81: [
                        1,
                        29
                    ],
                    82: [
                        1,
                        30
                    ],
                    83: [
                        1,
                        31
                    ],
                    84: [
                        1,
                        32
                    ],
                    85: [
                        1,
                        34
                    ],
                    86: 33
                },
                {
                    20: 46,
                    72: [
                        1,
                        35
                    ],
                    78: 26,
                    79: 27,
                    80: [
                        1,
                        28
                    ],
                    81: [
                        1,
                        29
                    ],
                    82: [
                        1,
                        30
                    ],
                    83: [
                        1,
                        31
                    ],
                    84: [
                        1,
                        32
                    ],
                    85: [
                        1,
                        34
                    ],
                    86: 33
                },
                {
                    20: 47,
                    72: [
                        1,
                        35
                    ],
                    78: 26,
                    79: 27,
                    80: [
                        1,
                        28
                    ],
                    81: [
                        1,
                        29
                    ],
                    82: [
                        1,
                        30
                    ],
                    83: [
                        1,
                        31
                    ],
                    84: [
                        1,
                        32
                    ],
                    85: [
                        1,
                        34
                    ],
                    86: 33
                },
                {
                    20: 41,
                    56: 48,
                    64: 42,
                    65: [
                        1,
                        43
                    ],
                    72: [
                        1,
                        35
                    ],
                    78: 26,
                    79: 27,
                    80: [
                        1,
                        28
                    ],
                    81: [
                        1,
                        29
                    ],
                    82: [
                        1,
                        30
                    ],
                    83: [
                        1,
                        31
                    ],
                    84: [
                        1,
                        32
                    ],
                    85: [
                        1,
                        34
                    ],
                    86: 33
                },
                {
                    33: [
                        2,
                        78
                    ],
                    49: 49,
                    65: [
                        2,
                        78
                    ],
                    72: [
                        2,
                        78
                    ],
                    80: [
                        2,
                        78
                    ],
                    81: [
                        2,
                        78
                    ],
                    82: [
                        2,
                        78
                    ],
                    83: [
                        2,
                        78
                    ],
                    84: [
                        2,
                        78
                    ],
                    85: [
                        2,
                        78
                    ]
                },
                {
                    23: [
                        2,
                        33
                    ],
                    33: [
                        2,
                        33
                    ],
                    54: [
                        2,
                        33
                    ],
                    65: [
                        2,
                        33
                    ],
                    68: [
                        2,
                        33
                    ],
                    72: [
                        2,
                        33
                    ],
                    75: [
                        2,
                        33
                    ],
                    80: [
                        2,
                        33
                    ],
                    81: [
                        2,
                        33
                    ],
                    82: [
                        2,
                        33
                    ],
                    83: [
                        2,
                        33
                    ],
                    84: [
                        2,
                        33
                    ],
                    85: [
                        2,
                        33
                    ]
                },
                {
                    23: [
                        2,
                        34
                    ],
                    33: [
                        2,
                        34
                    ],
                    54: [
                        2,
                        34
                    ],
                    65: [
                        2,
                        34
                    ],
                    68: [
                        2,
                        34
                    ],
                    72: [
                        2,
                        34
                    ],
                    75: [
                        2,
                        34
                    ],
                    80: [
                        2,
                        34
                    ],
                    81: [
                        2,
                        34
                    ],
                    82: [
                        2,
                        34
                    ],
                    83: [
                        2,
                        34
                    ],
                    84: [
                        2,
                        34
                    ],
                    85: [
                        2,
                        34
                    ]
                },
                {
                    23: [
                        2,
                        35
                    ],
                    33: [
                        2,
                        35
                    ],
                    54: [
                        2,
                        35
                    ],
                    65: [
                        2,
                        35
                    ],
                    68: [
                        2,
                        35
                    ],
                    72: [
                        2,
                        35
                    ],
                    75: [
                        2,
                        35
                    ],
                    80: [
                        2,
                        35
                    ],
                    81: [
                        2,
                        35
                    ],
                    82: [
                        2,
                        35
                    ],
                    83: [
                        2,
                        35
                    ],
                    84: [
                        2,
                        35
                    ],
                    85: [
                        2,
                        35
                    ]
                },
                {
                    23: [
                        2,
                        36
                    ],
                    33: [
                        2,
                        36
                    ],
                    54: [
                        2,
                        36
                    ],
                    65: [
                        2,
                        36
                    ],
                    68: [
                        2,
                        36
                    ],
                    72: [
                        2,
                        36
                    ],
                    75: [
                        2,
                        36
                    ],
                    80: [
                        2,
                        36
                    ],
                    81: [
                        2,
                        36
                    ],
                    82: [
                        2,
                        36
                    ],
                    83: [
                        2,
                        36
                    ],
                    84: [
                        2,
                        36
                    ],
                    85: [
                        2,
                        36
                    ]
                },
                {
                    23: [
                        2,
                        37
                    ],
                    33: [
                        2,
                        37
                    ],
                    54: [
                        2,
                        37
                    ],
                    65: [
                        2,
                        37
                    ],
                    68: [
                        2,
                        37
                    ],
                    72: [
                        2,
                        37
                    ],
                    75: [
                        2,
                        37
                    ],
                    80: [
                        2,
                        37
                    ],
                    81: [
                        2,
                        37
                    ],
                    82: [
                        2,
                        37
                    ],
                    83: [
                        2,
                        37
                    ],
                    84: [
                        2,
                        37
                    ],
                    85: [
                        2,
                        37
                    ]
                },
                {
                    23: [
                        2,
                        38
                    ],
                    33: [
                        2,
                        38
                    ],
                    54: [
                        2,
                        38
                    ],
                    65: [
                        2,
                        38
                    ],
                    68: [
                        2,
                        38
                    ],
                    72: [
                        2,
                        38
                    ],
                    75: [
                        2,
                        38
                    ],
                    80: [
                        2,
                        38
                    ],
                    81: [
                        2,
                        38
                    ],
                    82: [
                        2,
                        38
                    ],
                    83: [
                        2,
                        38
                    ],
                    84: [
                        2,
                        38
                    ],
                    85: [
                        2,
                        38
                    ]
                },
                {
                    23: [
                        2,
                        39
                    ],
                    33: [
                        2,
                        39
                    ],
                    54: [
                        2,
                        39
                    ],
                    65: [
                        2,
                        39
                    ],
                    68: [
                        2,
                        39
                    ],
                    72: [
                        2,
                        39
                    ],
                    75: [
                        2,
                        39
                    ],
                    80: [
                        2,
                        39
                    ],
                    81: [
                        2,
                        39
                    ],
                    82: [
                        2,
                        39
                    ],
                    83: [
                        2,
                        39
                    ],
                    84: [
                        2,
                        39
                    ],
                    85: [
                        2,
                        39
                    ]
                },
                {
                    23: [
                        2,
                        43
                    ],
                    33: [
                        2,
                        43
                    ],
                    54: [
                        2,
                        43
                    ],
                    65: [
                        2,
                        43
                    ],
                    68: [
                        2,
                        43
                    ],
                    72: [
                        2,
                        43
                    ],
                    75: [
                        2,
                        43
                    ],
                    80: [
                        2,
                        43
                    ],
                    81: [
                        2,
                        43
                    ],
                    82: [
                        2,
                        43
                    ],
                    83: [
                        2,
                        43
                    ],
                    84: [
                        2,
                        43
                    ],
                    85: [
                        2,
                        43
                    ],
                    87: [
                        1,
                        50
                    ]
                },
                {
                    72: [
                        1,
                        35
                    ],
                    86: 51
                },
                {
                    23: [
                        2,
                        45
                    ],
                    33: [
                        2,
                        45
                    ],
                    54: [
                        2,
                        45
                    ],
                    65: [
                        2,
                        45
                    ],
                    68: [
                        2,
                        45
                    ],
                    72: [
                        2,
                        45
                    ],
                    75: [
                        2,
                        45
                    ],
                    80: [
                        2,
                        45
                    ],
                    81: [
                        2,
                        45
                    ],
                    82: [
                        2,
                        45
                    ],
                    83: [
                        2,
                        45
                    ],
                    84: [
                        2,
                        45
                    ],
                    85: [
                        2,
                        45
                    ],
                    87: [
                        2,
                        45
                    ]
                },
                {
                    52: 52,
                    54: [
                        2,
                        82
                    ],
                    65: [
                        2,
                        82
                    ],
                    72: [
                        2,
                        82
                    ],
                    80: [
                        2,
                        82
                    ],
                    81: [
                        2,
                        82
                    ],
                    82: [
                        2,
                        82
                    ],
                    83: [
                        2,
                        82
                    ],
                    84: [
                        2,
                        82
                    ],
                    85: [
                        2,
                        82
                    ]
                },
                {
                    25: 53,
                    38: 55,
                    39: [
                        1,
                        57
                    ],
                    43: 56,
                    44: [
                        1,
                        58
                    ],
                    45: 54,
                    47: [
                        2,
                        54
                    ]
                },
                {
                    28: 59,
                    43: 60,
                    44: [
                        1,
                        58
                    ],
                    47: [
                        2,
                        56
                    ]
                },
                {
                    13: 62,
                    15: [
                        1,
                        20
                    ],
                    18: [
                        1,
                        61
                    ]
                },
                {
                    33: [
                        2,
                        86
                    ],
                    57: 63,
                    65: [
                        2,
                        86
                    ],
                    72: [
                        2,
                        86
                    ],
                    80: [
                        2,
                        86
                    ],
                    81: [
                        2,
                        86
                    ],
                    82: [
                        2,
                        86
                    ],
                    83: [
                        2,
                        86
                    ],
                    84: [
                        2,
                        86
                    ],
                    85: [
                        2,
                        86
                    ]
                },
                {
                    33: [
                        2,
                        40
                    ],
                    65: [
                        2,
                        40
                    ],
                    72: [
                        2,
                        40
                    ],
                    80: [
                        2,
                        40
                    ],
                    81: [
                        2,
                        40
                    ],
                    82: [
                        2,
                        40
                    ],
                    83: [
                        2,
                        40
                    ],
                    84: [
                        2,
                        40
                    ],
                    85: [
                        2,
                        40
                    ]
                },
                {
                    33: [
                        2,
                        41
                    ],
                    65: [
                        2,
                        41
                    ],
                    72: [
                        2,
                        41
                    ],
                    80: [
                        2,
                        41
                    ],
                    81: [
                        2,
                        41
                    ],
                    82: [
                        2,
                        41
                    ],
                    83: [
                        2,
                        41
                    ],
                    84: [
                        2,
                        41
                    ],
                    85: [
                        2,
                        41
                    ]
                },
                {
                    20: 64,
                    72: [
                        1,
                        35
                    ],
                    78: 26,
                    79: 27,
                    80: [
                        1,
                        28
                    ],
                    81: [
                        1,
                        29
                    ],
                    82: [
                        1,
                        30
                    ],
                    83: [
                        1,
                        31
                    ],
                    84: [
                        1,
                        32
                    ],
                    85: [
                        1,
                        34
                    ],
                    86: 33
                },
                {
                    26: 65,
                    47: [
                        1,
                        66
                    ]
                },
                {
                    30: 67,
                    33: [
                        2,
                        58
                    ],
                    65: [
                        2,
                        58
                    ],
                    72: [
                        2,
                        58
                    ],
                    75: [
                        2,
                        58
                    ],
                    80: [
                        2,
                        58
                    ],
                    81: [
                        2,
                        58
                    ],
                    82: [
                        2,
                        58
                    ],
                    83: [
                        2,
                        58
                    ],
                    84: [
                        2,
                        58
                    ],
                    85: [
                        2,
                        58
                    ]
                },
                {
                    33: [
                        2,
                        64
                    ],
                    35: 68,
                    65: [
                        2,
                        64
                    ],
                    72: [
                        2,
                        64
                    ],
                    75: [
                        2,
                        64
                    ],
                    80: [
                        2,
                        64
                    ],
                    81: [
                        2,
                        64
                    ],
                    82: [
                        2,
                        64
                    ],
                    83: [
                        2,
                        64
                    ],
                    84: [
                        2,
                        64
                    ],
                    85: [
                        2,
                        64
                    ]
                },
                {
                    21: 69,
                    23: [
                        2,
                        50
                    ],
                    65: [
                        2,
                        50
                    ],
                    72: [
                        2,
                        50
                    ],
                    80: [
                        2,
                        50
                    ],
                    81: [
                        2,
                        50
                    ],
                    82: [
                        2,
                        50
                    ],
                    83: [
                        2,
                        50
                    ],
                    84: [
                        2,
                        50
                    ],
                    85: [
                        2,
                        50
                    ]
                },
                {
                    33: [
                        2,
                        90
                    ],
                    61: 70,
                    65: [
                        2,
                        90
                    ],
                    72: [
                        2,
                        90
                    ],
                    80: [
                        2,
                        90
                    ],
                    81: [
                        2,
                        90
                    ],
                    82: [
                        2,
                        90
                    ],
                    83: [
                        2,
                        90
                    ],
                    84: [
                        2,
                        90
                    ],
                    85: [
                        2,
                        90
                    ]
                },
                {
                    20: 74,
                    33: [
                        2,
                        80
                    ],
                    50: 71,
                    63: 72,
                    64: 75,
                    65: [
                        1,
                        43
                    ],
                    69: 73,
                    70: 76,
                    71: 77,
                    72: [
                        1,
                        78
                    ],
                    78: 26,
                    79: 27,
                    80: [
                        1,
                        28
                    ],
                    81: [
                        1,
                        29
                    ],
                    82: [
                        1,
                        30
                    ],
                    83: [
                        1,
                        31
                    ],
                    84: [
                        1,
                        32
                    ],
                    85: [
                        1,
                        34
                    ],
                    86: 33
                },
                {
                    72: [
                        1,
                        79
                    ]
                },
                {
                    23: [
                        2,
                        42
                    ],
                    33: [
                        2,
                        42
                    ],
                    54: [
                        2,
                        42
                    ],
                    65: [
                        2,
                        42
                    ],
                    68: [
                        2,
                        42
                    ],
                    72: [
                        2,
                        42
                    ],
                    75: [
                        2,
                        42
                    ],
                    80: [
                        2,
                        42
                    ],
                    81: [
                        2,
                        42
                    ],
                    82: [
                        2,
                        42
                    ],
                    83: [
                        2,
                        42
                    ],
                    84: [
                        2,
                        42
                    ],
                    85: [
                        2,
                        42
                    ],
                    87: [
                        1,
                        50
                    ]
                },
                {
                    20: 74,
                    53: 80,
                    54: [
                        2,
                        84
                    ],
                    63: 81,
                    64: 75,
                    65: [
                        1,
                        43
                    ],
                    69: 82,
                    70: 76,
                    71: 77,
                    72: [
                        1,
                        78
                    ],
                    78: 26,
                    79: 27,
                    80: [
                        1,
                        28
                    ],
                    81: [
                        1,
                        29
                    ],
                    82: [
                        1,
                        30
                    ],
                    83: [
                        1,
                        31
                    ],
                    84: [
                        1,
                        32
                    ],
                    85: [
                        1,
                        34
                    ],
                    86: 33
                },
                {
                    26: 83,
                    47: [
                        1,
                        66
                    ]
                },
                {
                    47: [
                        2,
                        55
                    ]
                },
                {
                    4: 84,
                    6: 3,
                    14: [
                        2,
                        46
                    ],
                    15: [
                        2,
                        46
                    ],
                    19: [
                        2,
                        46
                    ],
                    29: [
                        2,
                        46
                    ],
                    34: [
                        2,
                        46
                    ],
                    39: [
                        2,
                        46
                    ],
                    44: [
                        2,
                        46
                    ],
                    47: [
                        2,
                        46
                    ],
                    48: [
                        2,
                        46
                    ],
                    51: [
                        2,
                        46
                    ],
                    55: [
                        2,
                        46
                    ],
                    60: [
                        2,
                        46
                    ]
                },
                {
                    47: [
                        2,
                        20
                    ]
                },
                {
                    20: 85,
                    72: [
                        1,
                        35
                    ],
                    78: 26,
                    79: 27,
                    80: [
                        1,
                        28
                    ],
                    81: [
                        1,
                        29
                    ],
                    82: [
                        1,
                        30
                    ],
                    83: [
                        1,
                        31
                    ],
                    84: [
                        1,
                        32
                    ],
                    85: [
                        1,
                        34
                    ],
                    86: 33
                },
                {
                    4: 86,
                    6: 3,
                    14: [
                        2,
                        46
                    ],
                    15: [
                        2,
                        46
                    ],
                    19: [
                        2,
                        46
                    ],
                    29: [
                        2,
                        46
                    ],
                    34: [
                        2,
                        46
                    ],
                    47: [
                        2,
                        46
                    ],
                    48: [
                        2,
                        46
                    ],
                    51: [
                        2,
                        46
                    ],
                    55: [
                        2,
                        46
                    ],
                    60: [
                        2,
                        46
                    ]
                },
                {
                    26: 87,
                    47: [
                        1,
                        66
                    ]
                },
                {
                    47: [
                        2,
                        57
                    ]
                },
                {
                    5: [
                        2,
                        11
                    ],
                    14: [
                        2,
                        11
                    ],
                    15: [
                        2,
                        11
                    ],
                    19: [
                        2,
                        11
                    ],
                    29: [
                        2,
                        11
                    ],
                    34: [
                        2,
                        11
                    ],
                    39: [
                        2,
                        11
                    ],
                    44: [
                        2,
                        11
                    ],
                    47: [
                        2,
                        11
                    ],
                    48: [
                        2,
                        11
                    ],
                    51: [
                        2,
                        11
                    ],
                    55: [
                        2,
                        11
                    ],
                    60: [
                        2,
                        11
                    ]
                },
                {
                    15: [
                        2,
                        49
                    ],
                    18: [
                        2,
                        49
                    ]
                },
                {
                    20: 74,
                    33: [
                        2,
                        88
                    ],
                    58: 88,
                    63: 89,
                    64: 75,
                    65: [
                        1,
                        43
                    ],
                    69: 90,
                    70: 76,
                    71: 77,
                    72: [
                        1,
                        78
                    ],
                    78: 26,
                    79: 27,
                    80: [
                        1,
                        28
                    ],
                    81: [
                        1,
                        29
                    ],
                    82: [
                        1,
                        30
                    ],
                    83: [
                        1,
                        31
                    ],
                    84: [
                        1,
                        32
                    ],
                    85: [
                        1,
                        34
                    ],
                    86: 33
                },
                {
                    65: [
                        2,
                        94
                    ],
                    66: 91,
                    68: [
                        2,
                        94
                    ],
                    72: [
                        2,
                        94
                    ],
                    80: [
                        2,
                        94
                    ],
                    81: [
                        2,
                        94
                    ],
                    82: [
                        2,
                        94
                    ],
                    83: [
                        2,
                        94
                    ],
                    84: [
                        2,
                        94
                    ],
                    85: [
                        2,
                        94
                    ]
                },
                {
                    5: [
                        2,
                        25
                    ],
                    14: [
                        2,
                        25
                    ],
                    15: [
                        2,
                        25
                    ],
                    19: [
                        2,
                        25
                    ],
                    29: [
                        2,
                        25
                    ],
                    34: [
                        2,
                        25
                    ],
                    39: [
                        2,
                        25
                    ],
                    44: [
                        2,
                        25
                    ],
                    47: [
                        2,
                        25
                    ],
                    48: [
                        2,
                        25
                    ],
                    51: [
                        2,
                        25
                    ],
                    55: [
                        2,
                        25
                    ],
                    60: [
                        2,
                        25
                    ]
                },
                {
                    20: 92,
                    72: [
                        1,
                        35
                    ],
                    78: 26,
                    79: 27,
                    80: [
                        1,
                        28
                    ],
                    81: [
                        1,
                        29
                    ],
                    82: [
                        1,
                        30
                    ],
                    83: [
                        1,
                        31
                    ],
                    84: [
                        1,
                        32
                    ],
                    85: [
                        1,
                        34
                    ],
                    86: 33
                },
                {
                    20: 74,
                    31: 93,
                    33: [
                        2,
                        60
                    ],
                    63: 94,
                    64: 75,
                    65: [
                        1,
                        43
                    ],
                    69: 95,
                    70: 76,
                    71: 77,
                    72: [
                        1,
                        78
                    ],
                    75: [
                        2,
                        60
                    ],
                    78: 26,
                    79: 27,
                    80: [
                        1,
                        28
                    ],
                    81: [
                        1,
                        29
                    ],
                    82: [
                        1,
                        30
                    ],
                    83: [
                        1,
                        31
                    ],
                    84: [
                        1,
                        32
                    ],
                    85: [
                        1,
                        34
                    ],
                    86: 33
                },
                {
                    20: 74,
                    33: [
                        2,
                        66
                    ],
                    36: 96,
                    63: 97,
                    64: 75,
                    65: [
                        1,
                        43
                    ],
                    69: 98,
                    70: 76,
                    71: 77,
                    72: [
                        1,
                        78
                    ],
                    75: [
                        2,
                        66
                    ],
                    78: 26,
                    79: 27,
                    80: [
                        1,
                        28
                    ],
                    81: [
                        1,
                        29
                    ],
                    82: [
                        1,
                        30
                    ],
                    83: [
                        1,
                        31
                    ],
                    84: [
                        1,
                        32
                    ],
                    85: [
                        1,
                        34
                    ],
                    86: 33
                },
                {
                    20: 74,
                    22: 99,
                    23: [
                        2,
                        52
                    ],
                    63: 100,
                    64: 75,
                    65: [
                        1,
                        43
                    ],
                    69: 101,
                    70: 76,
                    71: 77,
                    72: [
                        1,
                        78
                    ],
                    78: 26,
                    79: 27,
                    80: [
                        1,
                        28
                    ],
                    81: [
                        1,
                        29
                    ],
                    82: [
                        1,
                        30
                    ],
                    83: [
                        1,
                        31
                    ],
                    84: [
                        1,
                        32
                    ],
                    85: [
                        1,
                        34
                    ],
                    86: 33
                },
                {
                    20: 74,
                    33: [
                        2,
                        92
                    ],
                    62: 102,
                    63: 103,
                    64: 75,
                    65: [
                        1,
                        43
                    ],
                    69: 104,
                    70: 76,
                    71: 77,
                    72: [
                        1,
                        78
                    ],
                    78: 26,
                    79: 27,
                    80: [
                        1,
                        28
                    ],
                    81: [
                        1,
                        29
                    ],
                    82: [
                        1,
                        30
                    ],
                    83: [
                        1,
                        31
                    ],
                    84: [
                        1,
                        32
                    ],
                    85: [
                        1,
                        34
                    ],
                    86: 33
                },
                {
                    33: [
                        1,
                        105
                    ]
                },
                {
                    33: [
                        2,
                        79
                    ],
                    65: [
                        2,
                        79
                    ],
                    72: [
                        2,
                        79
                    ],
                    80: [
                        2,
                        79
                    ],
                    81: [
                        2,
                        79
                    ],
                    82: [
                        2,
                        79
                    ],
                    83: [
                        2,
                        79
                    ],
                    84: [
                        2,
                        79
                    ],
                    85: [
                        2,
                        79
                    ]
                },
                {
                    33: [
                        2,
                        81
                    ]
                },
                {
                    23: [
                        2,
                        27
                    ],
                    33: [
                        2,
                        27
                    ],
                    54: [
                        2,
                        27
                    ],
                    65: [
                        2,
                        27
                    ],
                    68: [
                        2,
                        27
                    ],
                    72: [
                        2,
                        27
                    ],
                    75: [
                        2,
                        27
                    ],
                    80: [
                        2,
                        27
                    ],
                    81: [
                        2,
                        27
                    ],
                    82: [
                        2,
                        27
                    ],
                    83: [
                        2,
                        27
                    ],
                    84: [
                        2,
                        27
                    ],
                    85: [
                        2,
                        27
                    ]
                },
                {
                    23: [
                        2,
                        28
                    ],
                    33: [
                        2,
                        28
                    ],
                    54: [
                        2,
                        28
                    ],
                    65: [
                        2,
                        28
                    ],
                    68: [
                        2,
                        28
                    ],
                    72: [
                        2,
                        28
                    ],
                    75: [
                        2,
                        28
                    ],
                    80: [
                        2,
                        28
                    ],
                    81: [
                        2,
                        28
                    ],
                    82: [
                        2,
                        28
                    ],
                    83: [
                        2,
                        28
                    ],
                    84: [
                        2,
                        28
                    ],
                    85: [
                        2,
                        28
                    ]
                },
                {
                    23: [
                        2,
                        30
                    ],
                    33: [
                        2,
                        30
                    ],
                    54: [
                        2,
                        30
                    ],
                    68: [
                        2,
                        30
                    ],
                    71: 106,
                    72: [
                        1,
                        107
                    ],
                    75: [
                        2,
                        30
                    ]
                },
                {
                    23: [
                        2,
                        98
                    ],
                    33: [
                        2,
                        98
                    ],
                    54: [
                        2,
                        98
                    ],
                    68: [
                        2,
                        98
                    ],
                    72: [
                        2,
                        98
                    ],
                    75: [
                        2,
                        98
                    ]
                },
                {
                    23: [
                        2,
                        45
                    ],
                    33: [
                        2,
                        45
                    ],
                    54: [
                        2,
                        45
                    ],
                    65: [
                        2,
                        45
                    ],
                    68: [
                        2,
                        45
                    ],
                    72: [
                        2,
                        45
                    ],
                    73: [
                        1,
                        108
                    ],
                    75: [
                        2,
                        45
                    ],
                    80: [
                        2,
                        45
                    ],
                    81: [
                        2,
                        45
                    ],
                    82: [
                        2,
                        45
                    ],
                    83: [
                        2,
                        45
                    ],
                    84: [
                        2,
                        45
                    ],
                    85: [
                        2,
                        45
                    ],
                    87: [
                        2,
                        45
                    ]
                },
                {
                    23: [
                        2,
                        44
                    ],
                    33: [
                        2,
                        44
                    ],
                    54: [
                        2,
                        44
                    ],
                    65: [
                        2,
                        44
                    ],
                    68: [
                        2,
                        44
                    ],
                    72: [
                        2,
                        44
                    ],
                    75: [
                        2,
                        44
                    ],
                    80: [
                        2,
                        44
                    ],
                    81: [
                        2,
                        44
                    ],
                    82: [
                        2,
                        44
                    ],
                    83: [
                        2,
                        44
                    ],
                    84: [
                        2,
                        44
                    ],
                    85: [
                        2,
                        44
                    ],
                    87: [
                        2,
                        44
                    ]
                },
                {
                    54: [
                        1,
                        109
                    ]
                },
                {
                    54: [
                        2,
                        83
                    ],
                    65: [
                        2,
                        83
                    ],
                    72: [
                        2,
                        83
                    ],
                    80: [
                        2,
                        83
                    ],
                    81: [
                        2,
                        83
                    ],
                    82: [
                        2,
                        83
                    ],
                    83: [
                        2,
                        83
                    ],
                    84: [
                        2,
                        83
                    ],
                    85: [
                        2,
                        83
                    ]
                },
                {
                    54: [
                        2,
                        85
                    ]
                },
                {
                    5: [
                        2,
                        13
                    ],
                    14: [
                        2,
                        13
                    ],
                    15: [
                        2,
                        13
                    ],
                    19: [
                        2,
                        13
                    ],
                    29: [
                        2,
                        13
                    ],
                    34: [
                        2,
                        13
                    ],
                    39: [
                        2,
                        13
                    ],
                    44: [
                        2,
                        13
                    ],
                    47: [
                        2,
                        13
                    ],
                    48: [
                        2,
                        13
                    ],
                    51: [
                        2,
                        13
                    ],
                    55: [
                        2,
                        13
                    ],
                    60: [
                        2,
                        13
                    ]
                },
                {
                    38: 55,
                    39: [
                        1,
                        57
                    ],
                    43: 56,
                    44: [
                        1,
                        58
                    ],
                    45: 111,
                    46: 110,
                    47: [
                        2,
                        76
                    ]
                },
                {
                    33: [
                        2,
                        70
                    ],
                    40: 112,
                    65: [
                        2,
                        70
                    ],
                    72: [
                        2,
                        70
                    ],
                    75: [
                        2,
                        70
                    ],
                    80: [
                        2,
                        70
                    ],
                    81: [
                        2,
                        70
                    ],
                    82: [
                        2,
                        70
                    ],
                    83: [
                        2,
                        70
                    ],
                    84: [
                        2,
                        70
                    ],
                    85: [
                        2,
                        70
                    ]
                },
                {
                    47: [
                        2,
                        18
                    ]
                },
                {
                    5: [
                        2,
                        14
                    ],
                    14: [
                        2,
                        14
                    ],
                    15: [
                        2,
                        14
                    ],
                    19: [
                        2,
                        14
                    ],
                    29: [
                        2,
                        14
                    ],
                    34: [
                        2,
                        14
                    ],
                    39: [
                        2,
                        14
                    ],
                    44: [
                        2,
                        14
                    ],
                    47: [
                        2,
                        14
                    ],
                    48: [
                        2,
                        14
                    ],
                    51: [
                        2,
                        14
                    ],
                    55: [
                        2,
                        14
                    ],
                    60: [
                        2,
                        14
                    ]
                },
                {
                    33: [
                        1,
                        113
                    ]
                },
                {
                    33: [
                        2,
                        87
                    ],
                    65: [
                        2,
                        87
                    ],
                    72: [
                        2,
                        87
                    ],
                    80: [
                        2,
                        87
                    ],
                    81: [
                        2,
                        87
                    ],
                    82: [
                        2,
                        87
                    ],
                    83: [
                        2,
                        87
                    ],
                    84: [
                        2,
                        87
                    ],
                    85: [
                        2,
                        87
                    ]
                },
                {
                    33: [
                        2,
                        89
                    ]
                },
                {
                    20: 74,
                    63: 115,
                    64: 75,
                    65: [
                        1,
                        43
                    ],
                    67: 114,
                    68: [
                        2,
                        96
                    ],
                    69: 116,
                    70: 76,
                    71: 77,
                    72: [
                        1,
                        78
                    ],
                    78: 26,
                    79: 27,
                    80: [
                        1,
                        28
                    ],
                    81: [
                        1,
                        29
                    ],
                    82: [
                        1,
                        30
                    ],
                    83: [
                        1,
                        31
                    ],
                    84: [
                        1,
                        32
                    ],
                    85: [
                        1,
                        34
                    ],
                    86: 33
                },
                {
                    33: [
                        1,
                        117
                    ]
                },
                {
                    32: 118,
                    33: [
                        2,
                        62
                    ],
                    74: 119,
                    75: [
                        1,
                        120
                    ]
                },
                {
                    33: [
                        2,
                        59
                    ],
                    65: [
                        2,
                        59
                    ],
                    72: [
                        2,
                        59
                    ],
                    75: [
                        2,
                        59
                    ],
                    80: [
                        2,
                        59
                    ],
                    81: [
                        2,
                        59
                    ],
                    82: [
                        2,
                        59
                    ],
                    83: [
                        2,
                        59
                    ],
                    84: [
                        2,
                        59
                    ],
                    85: [
                        2,
                        59
                    ]
                },
                {
                    33: [
                        2,
                        61
                    ],
                    75: [
                        2,
                        61
                    ]
                },
                {
                    33: [
                        2,
                        68
                    ],
                    37: 121,
                    74: 122,
                    75: [
                        1,
                        120
                    ]
                },
                {
                    33: [
                        2,
                        65
                    ],
                    65: [
                        2,
                        65
                    ],
                    72: [
                        2,
                        65
                    ],
                    75: [
                        2,
                        65
                    ],
                    80: [
                        2,
                        65
                    ],
                    81: [
                        2,
                        65
                    ],
                    82: [
                        2,
                        65
                    ],
                    83: [
                        2,
                        65
                    ],
                    84: [
                        2,
                        65
                    ],
                    85: [
                        2,
                        65
                    ]
                },
                {
                    33: [
                        2,
                        67
                    ],
                    75: [
                        2,
                        67
                    ]
                },
                {
                    23: [
                        1,
                        123
                    ]
                },
                {
                    23: [
                        2,
                        51
                    ],
                    65: [
                        2,
                        51
                    ],
                    72: [
                        2,
                        51
                    ],
                    80: [
                        2,
                        51
                    ],
                    81: [
                        2,
                        51
                    ],
                    82: [
                        2,
                        51
                    ],
                    83: [
                        2,
                        51
                    ],
                    84: [
                        2,
                        51
                    ],
                    85: [
                        2,
                        51
                    ]
                },
                {
                    23: [
                        2,
                        53
                    ]
                },
                {
                    33: [
                        1,
                        124
                    ]
                },
                {
                    33: [
                        2,
                        91
                    ],
                    65: [
                        2,
                        91
                    ],
                    72: [
                        2,
                        91
                    ],
                    80: [
                        2,
                        91
                    ],
                    81: [
                        2,
                        91
                    ],
                    82: [
                        2,
                        91
                    ],
                    83: [
                        2,
                        91
                    ],
                    84: [
                        2,
                        91
                    ],
                    85: [
                        2,
                        91
                    ]
                },
                {
                    33: [
                        2,
                        93
                    ]
                },
                {
                    5: [
                        2,
                        22
                    ],
                    14: [
                        2,
                        22
                    ],
                    15: [
                        2,
                        22
                    ],
                    19: [
                        2,
                        22
                    ],
                    29: [
                        2,
                        22
                    ],
                    34: [
                        2,
                        22
                    ],
                    39: [
                        2,
                        22
                    ],
                    44: [
                        2,
                        22
                    ],
                    47: [
                        2,
                        22
                    ],
                    48: [
                        2,
                        22
                    ],
                    51: [
                        2,
                        22
                    ],
                    55: [
                        2,
                        22
                    ],
                    60: [
                        2,
                        22
                    ]
                },
                {
                    23: [
                        2,
                        99
                    ],
                    33: [
                        2,
                        99
                    ],
                    54: [
                        2,
                        99
                    ],
                    68: [
                        2,
                        99
                    ],
                    72: [
                        2,
                        99
                    ],
                    75: [
                        2,
                        99
                    ]
                },
                {
                    73: [
                        1,
                        108
                    ]
                },
                {
                    20: 74,
                    63: 125,
                    64: 75,
                    65: [
                        1,
                        43
                    ],
                    72: [
                        1,
                        35
                    ],
                    78: 26,
                    79: 27,
                    80: [
                        1,
                        28
                    ],
                    81: [
                        1,
                        29
                    ],
                    82: [
                        1,
                        30
                    ],
                    83: [
                        1,
                        31
                    ],
                    84: [
                        1,
                        32
                    ],
                    85: [
                        1,
                        34
                    ],
                    86: 33
                },
                {
                    5: [
                        2,
                        23
                    ],
                    14: [
                        2,
                        23
                    ],
                    15: [
                        2,
                        23
                    ],
                    19: [
                        2,
                        23
                    ],
                    29: [
                        2,
                        23
                    ],
                    34: [
                        2,
                        23
                    ],
                    39: [
                        2,
                        23
                    ],
                    44: [
                        2,
                        23
                    ],
                    47: [
                        2,
                        23
                    ],
                    48: [
                        2,
                        23
                    ],
                    51: [
                        2,
                        23
                    ],
                    55: [
                        2,
                        23
                    ],
                    60: [
                        2,
                        23
                    ]
                },
                {
                    47: [
                        2,
                        19
                    ]
                },
                {
                    47: [
                        2,
                        77
                    ]
                },
                {
                    20: 74,
                    33: [
                        2,
                        72
                    ],
                    41: 126,
                    63: 127,
                    64: 75,
                    65: [
                        1,
                        43
                    ],
                    69: 128,
                    70: 76,
                    71: 77,
                    72: [
                        1,
                        78
                    ],
                    75: [
                        2,
                        72
                    ],
                    78: 26,
                    79: 27,
                    80: [
                        1,
                        28
                    ],
                    81: [
                        1,
                        29
                    ],
                    82: [
                        1,
                        30
                    ],
                    83: [
                        1,
                        31
                    ],
                    84: [
                        1,
                        32
                    ],
                    85: [
                        1,
                        34
                    ],
                    86: 33
                },
                {
                    5: [
                        2,
                        24
                    ],
                    14: [
                        2,
                        24
                    ],
                    15: [
                        2,
                        24
                    ],
                    19: [
                        2,
                        24
                    ],
                    29: [
                        2,
                        24
                    ],
                    34: [
                        2,
                        24
                    ],
                    39: [
                        2,
                        24
                    ],
                    44: [
                        2,
                        24
                    ],
                    47: [
                        2,
                        24
                    ],
                    48: [
                        2,
                        24
                    ],
                    51: [
                        2,
                        24
                    ],
                    55: [
                        2,
                        24
                    ],
                    60: [
                        2,
                        24
                    ]
                },
                {
                    68: [
                        1,
                        129
                    ]
                },
                {
                    65: [
                        2,
                        95
                    ],
                    68: [
                        2,
                        95
                    ],
                    72: [
                        2,
                        95
                    ],
                    80: [
                        2,
                        95
                    ],
                    81: [
                        2,
                        95
                    ],
                    82: [
                        2,
                        95
                    ],
                    83: [
                        2,
                        95
                    ],
                    84: [
                        2,
                        95
                    ],
                    85: [
                        2,
                        95
                    ]
                },
                {
                    68: [
                        2,
                        97
                    ]
                },
                {
                    5: [
                        2,
                        21
                    ],
                    14: [
                        2,
                        21
                    ],
                    15: [
                        2,
                        21
                    ],
                    19: [
                        2,
                        21
                    ],
                    29: [
                        2,
                        21
                    ],
                    34: [
                        2,
                        21
                    ],
                    39: [
                        2,
                        21
                    ],
                    44: [
                        2,
                        21
                    ],
                    47: [
                        2,
                        21
                    ],
                    48: [
                        2,
                        21
                    ],
                    51: [
                        2,
                        21
                    ],
                    55: [
                        2,
                        21
                    ],
                    60: [
                        2,
                        21
                    ]
                },
                {
                    33: [
                        1,
                        130
                    ]
                },
                {
                    33: [
                        2,
                        63
                    ]
                },
                {
                    72: [
                        1,
                        132
                    ],
                    76: 131
                },
                {
                    33: [
                        1,
                        133
                    ]
                },
                {
                    33: [
                        2,
                        69
                    ]
                },
                {
                    15: [
                        2,
                        12
                    ],
                    18: [
                        2,
                        12
                    ]
                },
                {
                    14: [
                        2,
                        26
                    ],
                    15: [
                        2,
                        26
                    ],
                    19: [
                        2,
                        26
                    ],
                    29: [
                        2,
                        26
                    ],
                    34: [
                        2,
                        26
                    ],
                    47: [
                        2,
                        26
                    ],
                    48: [
                        2,
                        26
                    ],
                    51: [
                        2,
                        26
                    ],
                    55: [
                        2,
                        26
                    ],
                    60: [
                        2,
                        26
                    ]
                },
                {
                    23: [
                        2,
                        31
                    ],
                    33: [
                        2,
                        31
                    ],
                    54: [
                        2,
                        31
                    ],
                    68: [
                        2,
                        31
                    ],
                    72: [
                        2,
                        31
                    ],
                    75: [
                        2,
                        31
                    ]
                },
                {
                    33: [
                        2,
                        74
                    ],
                    42: 134,
                    74: 135,
                    75: [
                        1,
                        120
                    ]
                },
                {
                    33: [
                        2,
                        71
                    ],
                    65: [
                        2,
                        71
                    ],
                    72: [
                        2,
                        71
                    ],
                    75: [
                        2,
                        71
                    ],
                    80: [
                        2,
                        71
                    ],
                    81: [
                        2,
                        71
                    ],
                    82: [
                        2,
                        71
                    ],
                    83: [
                        2,
                        71
                    ],
                    84: [
                        2,
                        71
                    ],
                    85: [
                        2,
                        71
                    ]
                },
                {
                    33: [
                        2,
                        73
                    ],
                    75: [
                        2,
                        73
                    ]
                },
                {
                    23: [
                        2,
                        29
                    ],
                    33: [
                        2,
                        29
                    ],
                    54: [
                        2,
                        29
                    ],
                    65: [
                        2,
                        29
                    ],
                    68: [
                        2,
                        29
                    ],
                    72: [
                        2,
                        29
                    ],
                    75: [
                        2,
                        29
                    ],
                    80: [
                        2,
                        29
                    ],
                    81: [
                        2,
                        29
                    ],
                    82: [
                        2,
                        29
                    ],
                    83: [
                        2,
                        29
                    ],
                    84: [
                        2,
                        29
                    ],
                    85: [
                        2,
                        29
                    ]
                },
                {
                    14: [
                        2,
                        15
                    ],
                    15: [
                        2,
                        15
                    ],
                    19: [
                        2,
                        15
                    ],
                    29: [
                        2,
                        15
                    ],
                    34: [
                        2,
                        15
                    ],
                    39: [
                        2,
                        15
                    ],
                    44: [
                        2,
                        15
                    ],
                    47: [
                        2,
                        15
                    ],
                    48: [
                        2,
                        15
                    ],
                    51: [
                        2,
                        15
                    ],
                    55: [
                        2,
                        15
                    ],
                    60: [
                        2,
                        15
                    ]
                },
                {
                    72: [
                        1,
                        137
                    ],
                    77: [
                        1,
                        136
                    ]
                },
                {
                    72: [
                        2,
                        100
                    ],
                    77: [
                        2,
                        100
                    ]
                },
                {
                    14: [
                        2,
                        16
                    ],
                    15: [
                        2,
                        16
                    ],
                    19: [
                        2,
                        16
                    ],
                    29: [
                        2,
                        16
                    ],
                    34: [
                        2,
                        16
                    ],
                    44: [
                        2,
                        16
                    ],
                    47: [
                        2,
                        16
                    ],
                    48: [
                        2,
                        16
                    ],
                    51: [
                        2,
                        16
                    ],
                    55: [
                        2,
                        16
                    ],
                    60: [
                        2,
                        16
                    ]
                },
                {
                    33: [
                        1,
                        138
                    ]
                },
                {
                    33: [
                        2,
                        75
                    ]
                },
                {
                    33: [
                        2,
                        32
                    ]
                },
                {
                    72: [
                        2,
                        101
                    ],
                    77: [
                        2,
                        101
                    ]
                },
                {
                    14: [
                        2,
                        17
                    ],
                    15: [
                        2,
                        17
                    ],
                    19: [
                        2,
                        17
                    ],
                    29: [
                        2,
                        17
                    ],
                    34: [
                        2,
                        17
                    ],
                    39: [
                        2,
                        17
                    ],
                    44: [
                        2,
                        17
                    ],
                    47: [
                        2,
                        17
                    ],
                    48: [
                        2,
                        17
                    ],
                    51: [
                        2,
                        17
                    ],
                    55: [
                        2,
                        17
                    ],
                    60: [
                        2,
                        17
                    ]
                }
            ],
            defaultActions: {
                4: [
                    2,
                    1
                ],
                54: [
                    2,
                    55
                ],
                56: [
                    2,
                    20
                ],
                60: [
                    2,
                    57
                ],
                73: [
                    2,
                    81
                ],
                82: [
                    2,
                    85
                ],
                86: [
                    2,
                    18
                ],
                90: [
                    2,
                    89
                ],
                101: [
                    2,
                    53
                ],
                104: [
                    2,
                    93
                ],
                110: [
                    2,
                    19
                ],
                111: [
                    2,
                    77
                ],
                116: [
                    2,
                    97
                ],
                119: [
                    2,
                    63
                ],
                122: [
                    2,
                    69
                ],
                135: [
                    2,
                    75
                ],
                136: [
                    2,
                    32
                ]
            },
            parseError: function parseError(str, hash) {
                throw new Error(str);
            },
            parse: function parse(input) {
                var self = this, stack = [
                    0
                ], vstack = [
                    null
                ], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
                this.lexer.setInput(input);
                this.lexer.yy = this.yy;
                this.yy.lexer = this.lexer;
                this.yy.parser = this;
                if (typeof this.lexer.yylloc == "undefined") this.lexer.yylloc = {
                };
                var yyloc = this.lexer.yylloc;
                lstack.push(yyloc);
                var ranges = this.lexer.options && this.lexer.options.ranges;
                if (typeof this.yy.parseError === "function") this.parseError = this.yy.parseError;
                function popStack(n) {
                    stack.length = stack.length - 2 * n;
                    vstack.length = vstack.length - n;
                    lstack.length = lstack.length - n;
                }
                function lex() {
                    var token;
                    token = self.lexer.lex() || 1;
                    if (typeof token !== "number") {
                        token = self.symbols_[token] || token;
                    }
                    return token;
                }
                var symbol, preErrorSymbol, state, action, a, r, yyval = {
                }, p, len, newState, expected;
                while(true){
                    state = stack[stack.length - 1];
                    if (this.defaultActions[state]) {
                        action = this.defaultActions[state];
                    } else {
                        if (symbol === null || typeof symbol == "undefined") {
                            symbol = lex();
                        }
                        action = table[state] && table[state][symbol];
                    }
                    if (typeof action === "undefined" || !action.length || !action[0]) {
                        var errStr = "";
                        if (!recovering) {
                            expected = [];
                            for(p in table[state])if (this.terminals_[p] && p > 2) {
                                expected.push("'" + this.terminals_[p] + "'");
                            }
                            if (this.lexer.showPosition) {
                                errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                            } else {
                                errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1 ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
                            }
                            this.parseError(errStr, {
                                text: this.lexer.match,
                                token: this.terminals_[symbol] || symbol,
                                line: this.lexer.yylineno,
                                loc: yyloc,
                                expected: expected
                            });
                        }
                    }
                    if (action[0] instanceof Array && action.length > 1) {
                        throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
                    }
                    switch(action[0]){
                        case 1:
                            stack.push(symbol);
                            vstack.push(this.lexer.yytext);
                            lstack.push(this.lexer.yylloc);
                            stack.push(action[1]);
                            symbol = null;
                            if (!preErrorSymbol) {
                                yyleng = this.lexer.yyleng;
                                yytext = this.lexer.yytext;
                                yylineno = this.lexer.yylineno;
                                yyloc = this.lexer.yylloc;
                                if (recovering > 0) recovering--;
                            } else {
                                symbol = preErrorSymbol;
                                preErrorSymbol = null;
                            }
                            break;
                        case 2:
                            len = this.productions_[action[1]][1];
                            yyval.$ = vstack[vstack.length - len];
                            yyval._$ = {
                                first_line: lstack[lstack.length - (len || 1)].first_line,
                                last_line: lstack[lstack.length - 1].last_line,
                                first_column: lstack[lstack.length - (len || 1)].first_column,
                                last_column: lstack[lstack.length - 1].last_column
                            };
                            if (ranges) {
                                yyval._$.range = [
                                    lstack[lstack.length - (len || 1)].range[0],
                                    lstack[lstack.length - 1].range[1]
                                ];
                            }
                            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
                            if (typeof r !== "undefined") {
                                return r;
                            }
                            if (len) {
                                stack = stack.slice(0, -1 * len * 2);
                                vstack = vstack.slice(0, -1 * len);
                                lstack = lstack.slice(0, -1 * len);
                            }
                            stack.push(this.productions_[action[1]][0]);
                            vstack.push(yyval.$);
                            lstack.push(yyval._$);
                            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
                            stack.push(newState);
                            break;
                        case 3:
                            return true;
                    }
                }
                return true;
            }
        };
        var lexer = function() {
            var lexer1 = {
                EOF: 1,
                parseError: function parseError(str, hash) {
                    if (this.yy.parser) {
                        this.yy.parser.parseError(str, hash);
                    } else {
                        throw new Error(str);
                    }
                },
                setInput: function setInput(input) {
                    this._input = input;
                    this._more = this._less = this.done = false;
                    this.yylineno = this.yyleng = 0;
                    this.yytext = this.matched = this.match = '';
                    this.conditionStack = [
                        'INITIAL'
                    ];
                    this.yylloc = {
                        first_line: 1,
                        first_column: 0,
                        last_line: 1,
                        last_column: 0
                    };
                    if (this.options.ranges) this.yylloc.range = [
                        0,
                        0
                    ];
                    this.offset = 0;
                    return this;
                },
                input: function input() {
                    var ch = this._input[0];
                    this.yytext += ch;
                    this.yyleng++;
                    this.offset++;
                    this.match += ch;
                    this.matched += ch;
                    var lines = ch.match(/(?:\r\n?|\n).*/g);
                    if (lines) {
                        this.yylineno++;
                        this.yylloc.last_line++;
                    } else {
                        this.yylloc.last_column++;
                    }
                    if (this.options.ranges) this.yylloc.range[1]++;
                    this._input = this._input.slice(1);
                    return ch;
                },
                unput: function unput(ch) {
                    var len = ch.length;
                    var lines = ch.split(/(?:\r\n?|\n)/g);
                    this._input = ch + this._input;
                    this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
                    this.offset -= len;
                    var oldLines = this.match.split(/(?:\r\n?|\n)/g);
                    this.match = this.match.substr(0, this.match.length - 1);
                    this.matched = this.matched.substr(0, this.matched.length - 1);
                    if (lines.length - 1) this.yylineno -= lines.length - 1;
                    var r = this.yylloc.range;
                    this.yylloc = {
                        first_line: this.yylloc.first_line,
                        last_line: this.yylineno + 1,
                        first_column: this.yylloc.first_column,
                        last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
                    };
                    if (this.options.ranges) {
                        this.yylloc.range = [
                            r[0],
                            r[0] + this.yyleng - len
                        ];
                    }
                    return this;
                },
                more: function more() {
                    this._more = true;
                    return this;
                },
                less: function less(n) {
                    this.unput(this.match.slice(n));
                },
                pastInput: function pastInput() {
                    var past = this.matched.substr(0, this.matched.length - this.match.length);
                    return (past.length > 20 ? '...' : '') + past.substr(-20).replace(/\n/g, "");
                },
                upcomingInput: function upcomingInput() {
                    var next = this.match;
                    if (next.length < 20) {
                        next += this._input.substr(0, 20 - next.length);
                    }
                    return (next.substr(0, 20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
                },
                showPosition: function showPosition() {
                    var pre = this.pastInput();
                    var c = new Array(pre.length + 1).join("-");
                    return pre + this.upcomingInput() + "\n" + c + "^";
                },
                next: function next() {
                    if (this.done) {
                        return this.EOF;
                    }
                    if (!this._input) this.done = true;
                    var token, match, tempMatch, index, col, lines;
                    if (!this._more) {
                        this.yytext = '';
                        this.match = '';
                    }
                    var rules = this._currentRules();
                    for(var i = 0; i < rules.length; i++){
                        tempMatch = this._input.match(this.rules[rules[i]]);
                        if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                            match = tempMatch;
                            index = i;
                            if (!this.options.flex) break;
                        }
                    }
                    if (match) {
                        lines = match[0].match(/(?:\r\n?|\n).*/g);
                        if (lines) this.yylineno += lines.length;
                        this.yylloc = {
                            first_line: this.yylloc.last_line,
                            last_line: this.yylineno + 1,
                            first_column: this.yylloc.last_column,
                            last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
                        };
                        this.yytext += match[0];
                        this.match += match[0];
                        this.matches = match;
                        this.yyleng = this.yytext.length;
                        if (this.options.ranges) {
                            this.yylloc.range = [
                                this.offset,
                                this.offset += this.yyleng
                            ];
                        }
                        this._more = false;
                        this._input = this._input.slice(match[0].length);
                        this.matched += match[0];
                        token = this.performAction.call(this, this.yy, this, rules[index], this.conditionStack[this.conditionStack.length - 1]);
                        if (this.done && this._input) this.done = false;
                        if (token) return token;
                        else return;
                    }
                    if (this._input === "") {
                        return this.EOF;
                    } else {
                        return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                            text: "",
                            token: null,
                            line: this.yylineno
                        });
                    }
                },
                lex: function lex() {
                    var r = this.next();
                    if (typeof r !== 'undefined') {
                        return r;
                    } else {
                        return this.lex();
                    }
                },
                begin: function begin(condition) {
                    this.conditionStack.push(condition);
                },
                popState: function popState() {
                    return this.conditionStack.pop();
                },
                _currentRules: function _currentRules() {
                    return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
                },
                topState: function topState() {
                    return this.conditionStack[this.conditionStack.length - 2];
                },
                pushState: function begin1(condition) {
                    this.begin(condition);
                }
            };
            lexer1.options = {
            };
            lexer1.performAction = function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
                function strip(start, end) {
                    return yy_.yytext = yy_.yytext.substring(start, yy_.yyleng - end + start);
                }
                var YYSTATE = YY_START;
                switch($avoiding_name_collisions){
                    case 0:
                        if (yy_.yytext.slice(-2) === "\\\\") {
                            strip(0, 1);
                            this.begin("mu");
                        } else if (yy_.yytext.slice(-1) === "\\") {
                            strip(0, 1);
                            this.begin("emu");
                        } else {
                            this.begin("mu");
                        }
                        if (yy_.yytext) return 15;
                        break;
                    case 1:
                        return 15;
                        break;
                    case 2:
                        this.popState();
                        return 15;
                        break;
                    case 3:
                        this.begin('raw');
                        return 15;
                        break;
                    case 4:
                        this.popState();
                        if (this.conditionStack[this.conditionStack.length - 1] === 'raw') {
                            return 15;
                        } else {
                            strip(5, 9);
                            return 'END_RAW_BLOCK';
                        }
                        break;
                    case 5:
                        return 15;
                        break;
                    case 6:
                        this.popState();
                        return 14;
                        break;
                    case 7:
                        return 65;
                        break;
                    case 8:
                        return 68;
                        break;
                    case 9:
                        return 19;
                        break;
                    case 10:
                        this.popState();
                        this.begin('raw');
                        return 23;
                        break;
                    case 11:
                        return 55;
                        break;
                    case 12:
                        return 60;
                        break;
                    case 13:
                        return 29;
                        break;
                    case 14:
                        return 47;
                        break;
                    case 15:
                        this.popState();
                        return 44;
                        break;
                    case 16:
                        this.popState();
                        return 44;
                        break;
                    case 17:
                        return 34;
                        break;
                    case 18:
                        return 39;
                        break;
                    case 19:
                        return 51;
                        break;
                    case 20:
                        return 48;
                        break;
                    case 21:
                        this.unput(yy_.yytext);
                        this.popState();
                        this.begin('com');
                        break;
                    case 22:
                        this.popState();
                        return 14;
                        break;
                    case 23:
                        return 48;
                        break;
                    case 24:
                        return 73;
                        break;
                    case 25:
                        return 72;
                        break;
                    case 26:
                        return 72;
                        break;
                    case 27:
                        return 87;
                        break;
                    case 28: break;
                    case 29:
                        this.popState();
                        return 54;
                        break;
                    case 30:
                        this.popState();
                        return 33;
                        break;
                    case 31:
                        yy_.yytext = strip(1, 2).replace(/\\"/g, '"');
                        return 80;
                        break;
                    case 32:
                        yy_.yytext = strip(1, 2).replace(/\\'/g, "'");
                        return 80;
                        break;
                    case 33:
                        return 85;
                        break;
                    case 34:
                        return 82;
                        break;
                    case 35:
                        return 82;
                        break;
                    case 36:
                        return 83;
                        break;
                    case 37:
                        return 84;
                        break;
                    case 38:
                        return 81;
                        break;
                    case 39:
                        return 75;
                        break;
                    case 40:
                        return 77;
                        break;
                    case 41:
                        return 72;
                        break;
                    case 42:
                        yy_.yytext = yy_.yytext.replace(/\\([\\\]])/g, '$1');
                        return 72;
                        break;
                    case 43:
                        return 'INVALID';
                        break;
                    case 44:
                        return 5;
                        break;
                }
            };
            lexer1.rules = [
                /^(?:[^\x00]*?(?=(\{\{)))/,
                /^(?:[^\x00]+)/,
                /^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/,
                /^(?:\{\{\{\{(?=[^\/]))/,
                /^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/,
                /^(?:[^\x00]+?(?=(\{\{\{\{)))/,
                /^(?:[\s\S]*?--(~)?\}\})/,
                /^(?:\()/,
                /^(?:\))/,
                /^(?:\{\{\{\{)/,
                /^(?:\}\}\}\})/,
                /^(?:\{\{(~)?>)/,
                /^(?:\{\{(~)?#>)/,
                /^(?:\{\{(~)?#\*?)/,
                /^(?:\{\{(~)?\/)/,
                /^(?:\{\{(~)?\^\s*(~)?\}\})/,
                /^(?:\{\{(~)?\s*else\s*(~)?\}\})/,
                /^(?:\{\{(~)?\^)/,
                /^(?:\{\{(~)?\s*else\b)/,
                /^(?:\{\{(~)?\{)/,
                /^(?:\{\{(~)?&)/,
                /^(?:\{\{(~)?!--)/,
                /^(?:\{\{(~)?![\s\S]*?\}\})/,
                /^(?:\{\{(~)?\*?)/,
                /^(?:=)/,
                /^(?:\.\.)/,
                /^(?:\.(?=([=~}\s\/.)|])))/,
                /^(?:[\/.])/,
                /^(?:\s+)/,
                /^(?:\}(~)?\}\})/,
                /^(?:(~)?\}\})/,
                /^(?:"(\\["]|[^"])*")/,
                /^(?:'(\\[']|[^'])*')/,
                /^(?:@)/,
                /^(?:true(?=([~}\s)])))/,
                /^(?:false(?=([~}\s)])))/,
                /^(?:undefined(?=([~}\s)])))/,
                /^(?:null(?=([~}\s)])))/,
                /^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/,
                /^(?:as\s+\|)/,
                /^(?:\|)/,
                /^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)|]))))/,
                /^(?:\[(\\\]|[^\]])*\])/,
                /^(?:.)/,
                /^(?:$)/
            ];
            lexer1.conditions = {
                "mu": {
                    "rules": [
                        7,
                        8,
                        9,
                        10,
                        11,
                        12,
                        13,
                        14,
                        15,
                        16,
                        17,
                        18,
                        19,
                        20,
                        21,
                        22,
                        23,
                        24,
                        25,
                        26,
                        27,
                        28,
                        29,
                        30,
                        31,
                        32,
                        33,
                        34,
                        35,
                        36,
                        37,
                        38,
                        39,
                        40,
                        41,
                        42,
                        43,
                        44
                    ],
                    "inclusive": false
                },
                "emu": {
                    "rules": [
                        2
                    ],
                    "inclusive": false
                },
                "com": {
                    "rules": [
                        6
                    ],
                    "inclusive": false
                },
                "raw": {
                    "rules": [
                        3,
                        4,
                        5
                    ],
                    "inclusive": false
                },
                "INITIAL": {
                    "rules": [
                        0,
                        1,
                        44
                    ],
                    "inclusive": true
                }
            };
            return lexer1;
        }();
        parser.lexer = lexer;
        function Parser() {
            this.yy = {
            };
        }
        Parser.prototype = parser;
        parser.Parser = Parser;
        return new Parser();
    }();
    exports22["default"] = handlebars;
    exports22 = exports22["default"];
    return exports22;
}
var exports23 = {
}, _dewExec23 = false;
function dew23() {
    if (_dewExec23) return exports23;
    _dewExec23 = true;
    exports23.__esModule = true;
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            'default': obj
        };
    }
    var _exception = dew1();
    var _exception2 = _interopRequireDefault(_exception);
    function Visitor() {
        this.parents = [];
    }
    Visitor.prototype = {
        constructor: Visitor,
        mutating: false,
        acceptKey: function acceptKey(node, name) {
            var value = this.accept(node[name]);
            if (this.mutating) {
                if (value && !Visitor.prototype[value.type]) {
                    throw new _exception2['default']('Unexpected node type "' + value.type + '" found when accepting ' + name + ' on ' + node.type);
                }
                node[name] = value;
            }
        },
        acceptRequired: function acceptRequired(node, name) {
            this.acceptKey(node, name);
            if (!node[name]) {
                throw new _exception2['default'](node.type + ' requires ' + name);
            }
        },
        acceptArray: function acceptArray(array) {
            for(var i = 0, l = array.length; i < l; i++){
                this.acceptKey(array, i);
                if (!array[i]) {
                    array.splice(i, 1);
                    i--;
                    l--;
                }
            }
        },
        accept: function accept(object) {
            if (!object) {
                return;
            }
            if (!this[object.type]) {
                throw new _exception2['default']('Unknown type: ' + object.type, object);
            }
            if (this.current) {
                this.parents.unshift(this.current);
            }
            this.current = object;
            var ret = this[object.type](object);
            this.current = this.parents.shift();
            if (!this.mutating || ret) {
                return ret;
            } else if (ret !== false) {
                return object;
            }
        },
        Program: function Program(program) {
            this.acceptArray(program.body);
        },
        MustacheStatement: visitSubExpression,
        Decorator: visitSubExpression,
        BlockStatement: visitBlock,
        DecoratorBlock: visitBlock,
        PartialStatement: visitPartial,
        PartialBlockStatement: function PartialBlockStatement(partial) {
            visitPartial.call(this, partial);
            this.acceptKey(partial, 'program');
        },
        ContentStatement: function ContentStatement() {
        },
        CommentStatement: function CommentStatement() {
        },
        SubExpression: visitSubExpression,
        PathExpression: function PathExpression() {
        },
        StringLiteral: function StringLiteral() {
        },
        NumberLiteral: function NumberLiteral() {
        },
        BooleanLiteral: function BooleanLiteral() {
        },
        UndefinedLiteral: function UndefinedLiteral() {
        },
        NullLiteral: function NullLiteral() {
        },
        Hash: function Hash(hash) {
            this.acceptArray(hash.pairs);
        },
        HashPair: function HashPair(pair) {
            this.acceptRequired(pair, 'value');
        }
    };
    function visitSubExpression(mustache) {
        this.acceptRequired(mustache, 'path');
        this.acceptArray(mustache.params);
        this.acceptKey(mustache, 'hash');
    }
    function visitBlock(block) {
        visitSubExpression.call(this, block);
        this.acceptKey(block, 'program');
        this.acceptKey(block, 'inverse');
    }
    function visitPartial(partial) {
        this.acceptRequired(partial, 'name');
        this.acceptArray(partial.params);
        this.acceptKey(partial, 'hash');
    }
    exports23['default'] = Visitor;
    exports23 = exports23['default'];
    return exports23;
}
var exports24 = {
}, _dewExec24 = false;
function dew24() {
    if (_dewExec24) return exports24;
    _dewExec24 = true;
    exports24.__esModule = true;
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            'default': obj
        };
    }
    var _visitor = dew23();
    var _visitor2 = _interopRequireDefault(_visitor);
    function WhitespaceControl() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {
        } : arguments[0];
        this.options = options;
    }
    WhitespaceControl.prototype = new _visitor2['default']();
    WhitespaceControl.prototype.Program = function(program) {
        var doStandalone = !this.options.ignoreStandalone;
        var isRoot = !this.isRootSeen;
        this.isRootSeen = true;
        var body = program.body;
        for(var i = 0, l = body.length; i < l; i++){
            var current = body[i], strip = this.accept(current);
            if (!strip) {
                continue;
            }
            var _isPrevWhitespace = isPrevWhitespace(body, i, isRoot), _isNextWhitespace = isNextWhitespace(body, i, isRoot), openStandalone = strip.openStandalone && _isPrevWhitespace, closeStandalone = strip.closeStandalone && _isNextWhitespace, inlineStandalone = strip.inlineStandalone && _isPrevWhitespace && _isNextWhitespace;
            if (strip.close) {
                omitRight(body, i, true);
            }
            if (strip.open) {
                omitLeft(body, i, true);
            }
            if (doStandalone && inlineStandalone) {
                omitRight(body, i);
                if (omitLeft(body, i)) {
                    if (current.type === 'PartialStatement') {
                        current.indent = /([ \t]+$)/.exec(body[i - 1].original)[1];
                    }
                }
            }
            if (doStandalone && openStandalone) {
                omitRight((current.program || current.inverse).body);
                omitLeft(body, i);
            }
            if (doStandalone && closeStandalone) {
                omitRight(body, i);
                omitLeft((current.inverse || current.program).body);
            }
        }
        return program;
    };
    WhitespaceControl.prototype.BlockStatement = WhitespaceControl.prototype.DecoratorBlock = WhitespaceControl.prototype.PartialBlockStatement = function(block) {
        this.accept(block.program);
        this.accept(block.inverse);
        var program = block.program || block.inverse, inverse = block.program && block.inverse, firstInverse = inverse, lastInverse = inverse;
        if (inverse && inverse.chained) {
            firstInverse = inverse.body[0].program;
            while(lastInverse.chained){
                lastInverse = lastInverse.body[lastInverse.body.length - 1].program;
            }
        }
        var strip = {
            open: block.openStrip.open,
            close: block.closeStrip.close,
            openStandalone: isNextWhitespace(program.body),
            closeStandalone: isPrevWhitespace((firstInverse || program).body)
        };
        if (block.openStrip.close) {
            omitRight(program.body, null, true);
        }
        if (inverse) {
            var inverseStrip = block.inverseStrip;
            if (inverseStrip.open) {
                omitLeft(program.body, null, true);
            }
            if (inverseStrip.close) {
                omitRight(firstInverse.body, null, true);
            }
            if (block.closeStrip.open) {
                omitLeft(lastInverse.body, null, true);
            }
            if (!this.options.ignoreStandalone && isPrevWhitespace(program.body) && isNextWhitespace(firstInverse.body)) {
                omitLeft(program.body);
                omitRight(firstInverse.body);
            }
        } else if (block.closeStrip.open) {
            omitLeft(program.body, null, true);
        }
        return strip;
    };
    WhitespaceControl.prototype.Decorator = WhitespaceControl.prototype.MustacheStatement = function(mustache) {
        return mustache.strip;
    };
    WhitespaceControl.prototype.PartialStatement = WhitespaceControl.prototype.CommentStatement = function(node) {
        var strip = node.strip || {
        };
        return {
            inlineStandalone: true,
            open: strip.open,
            close: strip.close
        };
    };
    function isPrevWhitespace(body, i, isRoot) {
        if (i === undefined) {
            i = body.length;
        }
        var prev = body[i - 1], sibling = body[i - 2];
        if (!prev) {
            return isRoot;
        }
        if (prev.type === 'ContentStatement') {
            return (sibling || !isRoot ? /\r?\n\s*?$/ : /(^|\r?\n)\s*?$/).test(prev.original);
        }
    }
    function isNextWhitespace(body, i, isRoot) {
        if (i === undefined) {
            i = -1;
        }
        var next = body[i + 1], sibling = body[i + 2];
        if (!next) {
            return isRoot;
        }
        if (next.type === 'ContentStatement') {
            return (sibling || !isRoot ? /^\s*?\r?\n/ : /^\s*?(\r?\n|$)/).test(next.original);
        }
    }
    function omitRight(body, i, multiple) {
        var current = body[i == null ? 0 : i + 1];
        if (!current || current.type !== 'ContentStatement' || !multiple && current.rightStripped) {
            return;
        }
        var original = current.value;
        current.value = current.value.replace(multiple ? /^\s+/ : /^[ \t]*\r?\n?/, '');
        current.rightStripped = current.value !== original;
    }
    function omitLeft(body, i, multiple) {
        var current = body[i == null ? body.length - 1 : i - 1];
        if (!current || current.type !== 'ContentStatement' || !multiple && current.leftStripped) {
            return;
        }
        var original = current.value;
        current.value = current.value.replace(multiple ? /\s+$/ : /[ \t]+$/, '');
        current.leftStripped = current.value !== original;
        return current.leftStripped;
    }
    exports24['default'] = WhitespaceControl;
    exports24 = exports24['default'];
    return exports24;
}
var exports25 = {
}, _dewExec25 = false;
function dew25() {
    if (_dewExec25) return exports25;
    _dewExec25 = true;
    exports25.__esModule = true;
    exports25.SourceLocation = SourceLocation;
    exports25.id = id;
    exports25.stripFlags = stripFlags;
    exports25.stripComment = stripComment;
    exports25.preparePath = preparePath;
    exports25.prepareMustache = prepareMustache;
    exports25.prepareRawBlock = prepareRawBlock;
    exports25.prepareBlock = prepareBlock;
    exports25.prepareProgram = prepareProgram;
    exports25.preparePartialBlock = preparePartialBlock;
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            'default': obj
        };
    }
    var _exception = dew1();
    var _exception2 = _interopRequireDefault(_exception);
    function validateClose(open, close) {
        close = close.path ? close.path.original : close;
        if (open.path.original !== close) {
            var errorNode = {
                loc: open.path.loc
            };
            throw new _exception2['default'](open.path.original + " doesn't match " + close, errorNode);
        }
    }
    function SourceLocation(source, locInfo) {
        this.source = source;
        this.start = {
            line: locInfo.first_line,
            column: locInfo.first_column
        };
        this.end = {
            line: locInfo.last_line,
            column: locInfo.last_column
        };
    }
    function id(token) {
        if (/^\[.*\]$/.test(token)) {
            return token.substring(1, token.length - 1);
        } else {
            return token;
        }
    }
    function stripFlags(open, close) {
        return {
            open: open.charAt(2) === '~',
            close: close.charAt(close.length - 3) === '~'
        };
    }
    function stripComment(comment) {
        return comment.replace(/^\{\{~?!-?-?/, '').replace(/-?-?~?\}\}$/, '');
    }
    function preparePath(data, parts, loc) {
        loc = this.locInfo(loc);
        var original = data ? '@' : '', dig = [], depth = 0;
        for(var i = 0, l = parts.length; i < l; i++){
            var part = parts[i].part, isLiteral = parts[i].original !== part;
            original += (parts[i].separator || '') + part;
            if (!isLiteral && (part === '..' || part === '.' || part === 'this')) {
                if (dig.length > 0) {
                    throw new _exception2['default']('Invalid path: ' + original, {
                        loc: loc
                    });
                } else if (part === '..') {
                    depth++;
                }
            } else {
                dig.push(part);
            }
        }
        return {
            type: 'PathExpression',
            data: data,
            depth: depth,
            parts: dig,
            original: original,
            loc: loc
        };
    }
    function prepareMustache(path, params, hash, open, strip, locInfo) {
        var escapeFlag = open.charAt(3) || open.charAt(2), escaped = escapeFlag !== '{' && escapeFlag !== '&';
        var decorator = /\*/.test(open);
        return {
            type: decorator ? 'Decorator' : 'MustacheStatement',
            path: path,
            params: params,
            hash: hash,
            escaped: escaped,
            strip: strip,
            loc: this.locInfo(locInfo)
        };
    }
    function prepareRawBlock(openRawBlock, contents, close, locInfo) {
        validateClose(openRawBlock, close);
        locInfo = this.locInfo(locInfo);
        var program = {
            type: 'Program',
            body: contents,
            strip: {
            },
            loc: locInfo
        };
        return {
            type: 'BlockStatement',
            path: openRawBlock.path,
            params: openRawBlock.params,
            hash: openRawBlock.hash,
            program: program,
            openStrip: {
            },
            inverseStrip: {
            },
            closeStrip: {
            },
            loc: locInfo
        };
    }
    function prepareBlock(openBlock, program, inverseAndProgram, close, inverted, locInfo) {
        if (close && close.path) {
            validateClose(openBlock, close);
        }
        var decorator = /\*/.test(openBlock.open);
        program.blockParams = openBlock.blockParams;
        var inverse = undefined, inverseStrip = undefined;
        if (inverseAndProgram) {
            if (decorator) {
                throw new _exception2['default']('Unexpected inverse block on decorator', inverseAndProgram);
            }
            if (inverseAndProgram.chain) {
                inverseAndProgram.program.body[0].closeStrip = close.strip;
            }
            inverseStrip = inverseAndProgram.strip;
            inverse = inverseAndProgram.program;
        }
        if (inverted) {
            inverted = inverse;
            inverse = program;
            program = inverted;
        }
        return {
            type: decorator ? 'DecoratorBlock' : 'BlockStatement',
            path: openBlock.path,
            params: openBlock.params,
            hash: openBlock.hash,
            program: program,
            inverse: inverse,
            openStrip: openBlock.strip,
            inverseStrip: inverseStrip,
            closeStrip: close && close.strip,
            loc: this.locInfo(locInfo)
        };
    }
    function prepareProgram(statements, loc) {
        if (!loc && statements.length) {
            var firstLoc = statements[0].loc, lastLoc = statements[statements.length - 1].loc;
            if (firstLoc && lastLoc) {
                loc = {
                    source: firstLoc.source,
                    start: {
                        line: firstLoc.start.line,
                        column: firstLoc.start.column
                    },
                    end: {
                        line: lastLoc.end.line,
                        column: lastLoc.end.column
                    }
                };
            }
        }
        return {
            type: 'Program',
            body: statements,
            strip: {
            },
            loc: loc
        };
    }
    function preparePartialBlock(open, program, close, locInfo) {
        validateClose(open, close);
        return {
            type: 'PartialBlockStatement',
            name: open.path,
            params: open.params,
            hash: open.hash,
            program: program,
            openStrip: open.strip,
            closeStrip: close && close.strip,
            loc: this.locInfo(locInfo)
        };
    }
    return exports25;
}
var exports26 = {
}, _dewExec26 = false;
function dew26() {
    if (_dewExec26) return exports26;
    _dewExec26 = true;
    exports26.__esModule = true;
    exports26.parseWithoutProcessing = parseWithoutProcessing;
    exports26.parse = parse;
    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {
            };
            if (obj != null) {
                for(var key in obj){
                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                }
            }
            newObj['default'] = obj;
            return newObj;
        }
    }
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            'default': obj
        };
    }
    var _parser = dew22();
    var _parser2 = _interopRequireDefault(_parser);
    var _whitespaceControl = dew24();
    var _whitespaceControl2 = _interopRequireDefault(_whitespaceControl);
    var _helpers = dew25();
    var Helpers = _interopRequireWildcard(_helpers);
    var _utils = dew();
    exports26.parser = _parser2['default'];
    var yy = {
    };
    _utils.extend(yy, Helpers);
    function parseWithoutProcessing(input, options) {
        if (input.type === 'Program') {
            return input;
        }
        _parser2['default'].yy = yy;
        yy.locInfo = function(locInfo) {
            return new yy.SourceLocation(options && options.srcName, locInfo);
        };
        var ast = _parser2['default'].parse(input);
        return ast;
    }
    function parse(input, options) {
        var ast = parseWithoutProcessing(input, options);
        var strip = new _whitespaceControl2['default'](options);
        return strip.accept(ast);
    }
    return exports26;
}
var exports27 = {
}, _dewExec27 = false;
function dew27() {
    if (_dewExec27) return exports27;
    _dewExec27 = true;
    exports27.__esModule = true;
    exports27.Compiler = Compiler;
    exports27.precompile = precompile;
    exports27.compile = compile;
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            'default': obj
        };
    }
    var _exception = dew1();
    var _exception2 = _interopRequireDefault(_exception);
    var _utils = dew();
    var _ast = dew21();
    var _ast2 = _interopRequireDefault(_ast);
    var slice = [].slice;
    function Compiler() {
    }
    Compiler.prototype = {
        compiler: Compiler,
        equals: function equals(other) {
            var len = this.opcodes.length;
            if (other.opcodes.length !== len) {
                return false;
            }
            for(var i = 0; i < len; i++){
                var opcode = this.opcodes[i], otherOpcode = other.opcodes[i];
                if (opcode.opcode !== otherOpcode.opcode || !argEquals(opcode.args, otherOpcode.args)) {
                    return false;
                }
            }
            len = this.children.length;
            for(var i = 0; i < len; i++){
                if (!this.children[i].equals(other.children[i])) {
                    return false;
                }
            }
            return true;
        },
        guid: 0,
        compile: function compile(program, options) {
            this.sourceNode = [];
            this.opcodes = [];
            this.children = [];
            this.options = options;
            this.stringParams = options.stringParams;
            this.trackIds = options.trackIds;
            options.blockParams = options.blockParams || [];
            options.knownHelpers = _utils.extend(Object.create(null), {
                helperMissing: true,
                blockHelperMissing: true,
                each: true,
                'if': true,
                unless: true,
                'with': true,
                log: true,
                lookup: true
            }, options.knownHelpers);
            return this.accept(program);
        },
        compileProgram: function compileProgram(program) {
            var childCompiler = new this.compiler(), result = childCompiler.compile(program, this.options), guid = this.guid++;
            this.usePartial = this.usePartial || result.usePartial;
            this.children[guid] = result;
            this.useDepths = this.useDepths || result.useDepths;
            return guid;
        },
        accept: function accept(node) {
            if (!this[node.type]) {
                throw new _exception2['default']('Unknown type: ' + node.type, node);
            }
            this.sourceNode.unshift(node);
            var ret = this[node.type](node);
            this.sourceNode.shift();
            return ret;
        },
        Program: function Program(program) {
            this.options.blockParams.unshift(program.blockParams);
            var body = program.body, bodyLength = body.length;
            for(var i = 0; i < bodyLength; i++){
                this.accept(body[i]);
            }
            this.options.blockParams.shift();
            this.isSimple = bodyLength === 1;
            this.blockParams = program.blockParams ? program.blockParams.length : 0;
            return this;
        },
        BlockStatement: function BlockStatement(block) {
            transformLiteralToPath(block);
            var program = block.program, inverse = block.inverse;
            program = program && this.compileProgram(program);
            inverse = inverse && this.compileProgram(inverse);
            var type = this.classifySexpr(block);
            if (type === 'helper') {
                this.helperSexpr(block, program, inverse);
            } else if (type === 'simple') {
                this.simpleSexpr(block);
                this.opcode('pushProgram', program);
                this.opcode('pushProgram', inverse);
                this.opcode('emptyHash');
                this.opcode('blockValue', block.path.original);
            } else {
                this.ambiguousSexpr(block, program, inverse);
                this.opcode('pushProgram', program);
                this.opcode('pushProgram', inverse);
                this.opcode('emptyHash');
                this.opcode('ambiguousBlockValue');
            }
            this.opcode('append');
        },
        DecoratorBlock: function DecoratorBlock(decorator) {
            var program = decorator.program && this.compileProgram(decorator.program);
            var params = this.setupFullMustacheParams(decorator, program, undefined), path = decorator.path;
            this.useDecorators = true;
            this.opcode('registerDecorator', params.length, path.original);
        },
        PartialStatement: function PartialStatement(partial) {
            this.usePartial = true;
            var program = partial.program;
            if (program) {
                program = this.compileProgram(partial.program);
            }
            var params = partial.params;
            if (params.length > 1) {
                throw new _exception2['default']('Unsupported number of partial arguments: ' + params.length, partial);
            } else if (!params.length) {
                if (this.options.explicitPartialContext) {
                    this.opcode('pushLiteral', 'undefined');
                } else {
                    params.push({
                        type: 'PathExpression',
                        parts: [],
                        depth: 0
                    });
                }
            }
            var partialName = partial.name.original, isDynamic = partial.name.type === 'SubExpression';
            if (isDynamic) {
                this.accept(partial.name);
            }
            this.setupFullMustacheParams(partial, program, undefined, true);
            var indent = partial.indent || '';
            if (this.options.preventIndent && indent) {
                this.opcode('appendContent', indent);
                indent = '';
            }
            this.opcode('invokePartial', isDynamic, partialName, indent);
            this.opcode('append');
        },
        PartialBlockStatement: function PartialBlockStatement(partialBlock) {
            this.PartialStatement(partialBlock);
        },
        MustacheStatement: function MustacheStatement(mustache) {
            this.SubExpression(mustache);
            if (mustache.escaped && !this.options.noEscape) {
                this.opcode('appendEscaped');
            } else {
                this.opcode('append');
            }
        },
        Decorator: function Decorator(decorator) {
            this.DecoratorBlock(decorator);
        },
        ContentStatement: function ContentStatement(content) {
            if (content.value) {
                this.opcode('appendContent', content.value);
            }
        },
        CommentStatement: function CommentStatement() {
        },
        SubExpression: function SubExpression(sexpr) {
            transformLiteralToPath(sexpr);
            var type = this.classifySexpr(sexpr);
            if (type === 'simple') {
                this.simpleSexpr(sexpr);
            } else if (type === 'helper') {
                this.helperSexpr(sexpr);
            } else {
                this.ambiguousSexpr(sexpr);
            }
        },
        ambiguousSexpr: function ambiguousSexpr(sexpr, program, inverse) {
            var path = sexpr.path, name = path.parts[0], isBlock = program != null || inverse != null;
            this.opcode('getContext', path.depth);
            this.opcode('pushProgram', program);
            this.opcode('pushProgram', inverse);
            path.strict = true;
            this.accept(path);
            this.opcode('invokeAmbiguous', name, isBlock);
        },
        simpleSexpr: function simpleSexpr(sexpr) {
            var path = sexpr.path;
            path.strict = true;
            this.accept(path);
            this.opcode('resolvePossibleLambda');
        },
        helperSexpr: function helperSexpr(sexpr, program, inverse) {
            var params = this.setupFullMustacheParams(sexpr, program, inverse), path = sexpr.path, name = path.parts[0];
            if (this.options.knownHelpers[name]) {
                this.opcode('invokeKnownHelper', params.length, name);
            } else if (this.options.knownHelpersOnly) {
                throw new _exception2['default']('You specified knownHelpersOnly, but used the unknown helper ' + name, sexpr);
            } else {
                path.strict = true;
                path.falsy = true;
                this.accept(path);
                this.opcode('invokeHelper', params.length, path.original, _ast2['default'].helpers.simpleId(path));
            }
        },
        PathExpression: function PathExpression(path) {
            this.addDepth(path.depth);
            this.opcode('getContext', path.depth);
            var name = path.parts[0], scoped = _ast2['default'].helpers.scopedId(path), blockParamId = !path.depth && !scoped && this.blockParamIndex(name);
            if (blockParamId) {
                this.opcode('lookupBlockParam', blockParamId, path.parts);
            } else if (!name) {
                this.opcode('pushContext');
            } else if (path.data) {
                this.options.data = true;
                this.opcode('lookupData', path.depth, path.parts, path.strict);
            } else {
                this.opcode('lookupOnContext', path.parts, path.falsy, path.strict, scoped);
            }
        },
        StringLiteral: function StringLiteral(string) {
            this.opcode('pushString', string.value);
        },
        NumberLiteral: function NumberLiteral(number) {
            this.opcode('pushLiteral', number.value);
        },
        BooleanLiteral: function BooleanLiteral(bool) {
            this.opcode('pushLiteral', bool.value);
        },
        UndefinedLiteral: function UndefinedLiteral() {
            this.opcode('pushLiteral', 'undefined');
        },
        NullLiteral: function NullLiteral() {
            this.opcode('pushLiteral', 'null');
        },
        Hash: function Hash(hash) {
            var pairs = hash.pairs, i = 0, l = pairs.length;
            this.opcode('pushHash');
            for(; i < l; i++){
                this.pushParam(pairs[i].value);
            }
            while(i--){
                this.opcode('assignToHash', pairs[i].key);
            }
            this.opcode('popHash');
        },
        opcode: function opcode(name) {
            this.opcodes.push({
                opcode: name,
                args: slice.call(arguments, 1),
                loc: this.sourceNode[0].loc
            });
        },
        addDepth: function addDepth(depth) {
            if (!depth) {
                return;
            }
            this.useDepths = true;
        },
        classifySexpr: function classifySexpr(sexpr) {
            var isSimple = _ast2['default'].helpers.simpleId(sexpr.path);
            var isBlockParam = isSimple && !!this.blockParamIndex(sexpr.path.parts[0]);
            var isHelper = !isBlockParam && _ast2['default'].helpers.helperExpression(sexpr);
            var isEligible = !isBlockParam && (isHelper || isSimple);
            if (isEligible && !isHelper) {
                var _name = sexpr.path.parts[0], options = this.options;
                if (options.knownHelpers[_name]) {
                    isHelper = true;
                } else if (options.knownHelpersOnly) {
                    isEligible = false;
                }
            }
            if (isHelper) {
                return 'helper';
            } else if (isEligible) {
                return 'ambiguous';
            } else {
                return 'simple';
            }
        },
        pushParams: function pushParams(params) {
            for(var i = 0, l = params.length; i < l; i++){
                this.pushParam(params[i]);
            }
        },
        pushParam: function pushParam(val) {
            var value = val.value != null ? val.value : val.original || '';
            if (this.stringParams) {
                if (value.replace) {
                    value = value.replace(/^(\.?\.\/)*/g, '').replace(/\//g, '.');
                }
                if (val.depth) {
                    this.addDepth(val.depth);
                }
                this.opcode('getContext', val.depth || 0);
                this.opcode('pushStringParam', value, val.type);
                if (val.type === 'SubExpression') {
                    this.accept(val);
                }
            } else {
                if (this.trackIds) {
                    var blockParamIndex = undefined;
                    if (val.parts && !_ast2['default'].helpers.scopedId(val) && !val.depth) {
                        blockParamIndex = this.blockParamIndex(val.parts[0]);
                    }
                    if (blockParamIndex) {
                        var blockParamChild = val.parts.slice(1).join('.');
                        this.opcode('pushId', 'BlockParam', blockParamIndex, blockParamChild);
                    } else {
                        value = val.original || value;
                        if (value.replace) {
                            value = value.replace(/^this(?:\.|$)/, '').replace(/^\.\//, '').replace(/^\.$/, '');
                        }
                        this.opcode('pushId', val.type, value);
                    }
                }
                this.accept(val);
            }
        },
        setupFullMustacheParams: function setupFullMustacheParams(sexpr, program, inverse, omitEmpty) {
            var params = sexpr.params;
            this.pushParams(params);
            this.opcode('pushProgram', program);
            this.opcode('pushProgram', inverse);
            if (sexpr.hash) {
                this.accept(sexpr.hash);
            } else {
                this.opcode('emptyHash', omitEmpty);
            }
            return params;
        },
        blockParamIndex: function blockParamIndex(name) {
            for(var depth = 0, len = this.options.blockParams.length; depth < len; depth++){
                var blockParams = this.options.blockParams[depth], param = blockParams && _utils.indexOf(blockParams, name);
                if (blockParams && param >= 0) {
                    return [
                        depth,
                        param
                    ];
                }
            }
        }
    };
    function precompile(input, options, env) {
        if (input == null || typeof input !== 'string' && input.type !== 'Program') {
            throw new _exception2['default']('You must pass a string or Handlebars AST to Handlebars.precompile. You passed ' + input);
        }
        options = options || {
        };
        if (!('data' in options)) {
            options.data = true;
        }
        if (options.compat) {
            options.useDepths = true;
        }
        var ast = env.parse(input, options), environment = new env.Compiler().compile(ast, options);
        return new env.JavaScriptCompiler().compile(environment, options);
    }
    function compile(input, options, env) {
        if (options === undefined) options = {
        };
        if (input == null || typeof input !== 'string' && input.type !== 'Program') {
            throw new _exception2['default']('You must pass a string or Handlebars AST to Handlebars.compile. You passed ' + input);
        }
        options = _utils.extend({
        }, options);
        if (!('data' in options)) {
            options.data = true;
        }
        if (options.compat) {
            options.useDepths = true;
        }
        var compiled = undefined;
        function compileInput() {
            var ast = env.parse(input, options), environment = new env.Compiler().compile(ast, options), templateSpec = new env.JavaScriptCompiler().compile(environment, options, undefined, true);
            return env.template(templateSpec);
        }
        function ret(context, execOptions) {
            if (!compiled) {
                compiled = compileInput();
            }
            return compiled.call(this, context, execOptions);
        }
        ret._setup = function(setupOptions) {
            if (!compiled) {
                compiled = compileInput();
            }
            return compiled._setup(setupOptions);
        };
        ret._child = function(i, data, blockParams, depths) {
            if (!compiled) {
                compiled = compileInput();
            }
            return compiled._child(i, data, blockParams, depths);
        };
        return ret;
    }
    function argEquals(a, b) {
        if (a === b) {
            return true;
        }
        if (_utils.isArray(a) && _utils.isArray(b) && a.length === b.length) {
            for(var i = 0; i < a.length; i++){
                if (!argEquals(a[i], b[i])) {
                    return false;
                }
            }
            return true;
        }
    }
    function transformLiteralToPath(sexpr) {
        if (!sexpr.path.parts) {
            var literal = sexpr.path;
            sexpr.path = {
                type: 'PathExpression',
                data: false,
                depth: 0,
                parts: [
                    literal.original + ''
                ],
                original: literal.original + '',
                loc: literal.loc
            };
        }
    }
    return exports27;
}
var exports28 = {
}, _dewExec28 = false;
function dew28() {
    if (_dewExec28) return exports28;
    _dewExec28 = true;
    var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');
    exports28.encode = function(number) {
        if (0 <= number && number < intToCharMap.length) {
            return intToCharMap[number];
        }
        throw new TypeError("Must be between 0 and 63: " + number);
    };
    exports28.decode = function(charCode) {
        var bigA = 65;
        var bigZ = 90;
        var littleA = 97;
        var littleZ = 122;
        var zero = 48;
        var nine = 57;
        var plus = 43;
        var slash = 47;
        var littleOffset = 26;
        var numberOffset = 52;
        if (bigA <= charCode && charCode <= bigZ) {
            return charCode - bigA;
        }
        if (littleA <= charCode && charCode <= littleZ) {
            return charCode - littleA + littleOffset;
        }
        if (zero <= charCode && charCode <= nine) {
            return charCode - zero + numberOffset;
        }
        if (charCode == plus) {
            return 62;
        }
        if (charCode == slash) {
            return 63;
        }
        return -1;
    };
    return exports28;
}
var exports29 = {
}, _dewExec29 = false;
function dew29() {
    if (_dewExec29) return exports29;
    _dewExec29 = true;
    var base64 = dew28();
    var VLQ_BASE_SHIFT = 5;
    var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
    var VLQ_BASE_MASK = VLQ_BASE - 1;
    var VLQ_CONTINUATION_BIT = VLQ_BASE;
    function toVLQSigned(aValue) {
        return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
    }
    function fromVLQSigned(aValue) {
        var isNegative = (aValue & 1) === 1;
        var shifted = aValue >> 1;
        return isNegative ? -shifted : shifted;
    }
    exports29.encode = function base64VLQ_encode(aValue) {
        var encoded = "";
        var digit;
        var vlq = toVLQSigned(aValue);
        do {
            digit = vlq & VLQ_BASE_MASK;
            vlq >>>= VLQ_BASE_SHIFT;
            if (vlq > 0) {
                digit |= VLQ_CONTINUATION_BIT;
            }
            encoded += base64.encode(digit);
        }while (vlq > 0)
        return encoded;
    };
    exports29.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
        var strLen = aStr.length;
        var result = 0;
        var shift = 0;
        var continuation, digit;
        do {
            if (aIndex >= strLen) {
                throw new Error("Expected more digits in base 64 VLQ value.");
            }
            digit = base64.decode(aStr.charCodeAt(aIndex++));
            if (digit === -1) {
                throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
            }
            continuation = !!(digit & VLQ_CONTINUATION_BIT);
            digit &= VLQ_BASE_MASK;
            result = result + (digit << shift);
            shift += VLQ_BASE_SHIFT;
        }while (continuation)
        aOutParam.value = fromVLQSigned(result);
        aOutParam.rest = aIndex;
    };
    return exports29;
}
var exports30 = {
}, _dewExec30 = false;
function dew30() {
    if (_dewExec30) return exports30;
    _dewExec30 = true;
    function getArg(aArgs, aName, aDefaultValue) {
        if (aName in aArgs) {
            return aArgs[aName];
        } else if (arguments.length === 3) {
            return aDefaultValue;
        } else {
            throw new Error('"' + aName + '" is a required argument.');
        }
    }
    exports30.getArg = getArg;
    var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
    var dataUrlRegexp = /^data:.+\,.+$/;
    function urlParse(aUrl) {
        var match = aUrl.match(urlRegexp);
        if (!match) {
            return null;
        }
        return {
            scheme: match[1],
            auth: match[2],
            host: match[3],
            port: match[4],
            path: match[5]
        };
    }
    exports30.urlParse = urlParse;
    function urlGenerate(aParsedUrl) {
        var url = '';
        if (aParsedUrl.scheme) {
            url += aParsedUrl.scheme + ':';
        }
        url += '//';
        if (aParsedUrl.auth) {
            url += aParsedUrl.auth + '@';
        }
        if (aParsedUrl.host) {
            url += aParsedUrl.host;
        }
        if (aParsedUrl.port) {
            url += ":" + aParsedUrl.port;
        }
        if (aParsedUrl.path) {
            url += aParsedUrl.path;
        }
        return url;
    }
    exports30.urlGenerate = urlGenerate;
    function normalize(aPath) {
        var path = aPath;
        var url = urlParse(aPath);
        if (url) {
            if (!url.path) {
                return aPath;
            }
            path = url.path;
        }
        var isAbsolute = exports30.isAbsolute(path);
        var parts = path.split(/\/+/);
        for(var part, up = 0, i = parts.length - 1; i >= 0; i--){
            part = parts[i];
            if (part === '.') {
                parts.splice(i, 1);
            } else if (part === '..') {
                up++;
            } else if (up > 0) {
                if (part === '') {
                    parts.splice(i + 1, up);
                    up = 0;
                } else {
                    parts.splice(i, 2);
                    up--;
                }
            }
        }
        path = parts.join('/');
        if (path === '') {
            path = isAbsolute ? '/' : '.';
        }
        if (url) {
            url.path = path;
            return urlGenerate(url);
        }
        return path;
    }
    exports30.normalize = normalize;
    function join(aRoot, aPath) {
        if (aRoot === "") {
            aRoot = ".";
        }
        if (aPath === "") {
            aPath = ".";
        }
        var aPathUrl = urlParse(aPath);
        var aRootUrl = urlParse(aRoot);
        if (aRootUrl) {
            aRoot = aRootUrl.path || '/';
        }
        if (aPathUrl && !aPathUrl.scheme) {
            if (aRootUrl) {
                aPathUrl.scheme = aRootUrl.scheme;
            }
            return urlGenerate(aPathUrl);
        }
        if (aPathUrl || aPath.match(dataUrlRegexp)) {
            return aPath;
        }
        if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
            aRootUrl.host = aPath;
            return urlGenerate(aRootUrl);
        }
        var joined = aPath.charAt(0) === '/' ? aPath : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);
        if (aRootUrl) {
            aRootUrl.path = joined;
            return urlGenerate(aRootUrl);
        }
        return joined;
    }
    exports30.join = join;
    exports30.isAbsolute = function(aPath) {
        return aPath.charAt(0) === '/' || urlRegexp.test(aPath);
    };
    function relative(aRoot, aPath) {
        if (aRoot === "") {
            aRoot = ".";
        }
        aRoot = aRoot.replace(/\/$/, '');
        var level = 0;
        while(aPath.indexOf(aRoot + '/') !== 0){
            var index = aRoot.lastIndexOf("/");
            if (index < 0) {
                return aPath;
            }
            aRoot = aRoot.slice(0, index);
            if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
                return aPath;
            }
            ++level;
        }
        return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
    }
    exports30.relative = relative;
    var supportsNullProto = function() {
        var obj = Object.create(null);
        return !('__proto__' in obj);
    }();
    function identity(s) {
        return s;
    }
    function toSetString(aStr) {
        if (isProtoString(aStr)) {
            return '$' + aStr;
        }
        return aStr;
    }
    exports30.toSetString = supportsNullProto ? identity : toSetString;
    function fromSetString(aStr) {
        if (isProtoString(aStr)) {
            return aStr.slice(1);
        }
        return aStr;
    }
    exports30.fromSetString = supportsNullProto ? identity : fromSetString;
    function isProtoString(s) {
        if (!s) {
            return false;
        }
        var length = s.length;
        if (length < 9) {
            return false;
        }
        if (s.charCodeAt(length - 1) !== 95 || s.charCodeAt(length - 2) !== 95 || s.charCodeAt(length - 3) !== 111 || s.charCodeAt(length - 4) !== 116 || s.charCodeAt(length - 5) !== 111 || s.charCodeAt(length - 6) !== 114 || s.charCodeAt(length - 7) !== 112 || s.charCodeAt(length - 8) !== 95 || s.charCodeAt(length - 9) !== 95) {
            return false;
        }
        for(var i = length - 10; i >= 0; i--){
            if (s.charCodeAt(i) !== 36) {
                return false;
            }
        }
        return true;
    }
    function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
        var cmp = strcmp(mappingA.source, mappingB.source);
        if (cmp !== 0) {
            return cmp;
        }
        cmp = mappingA.originalLine - mappingB.originalLine;
        if (cmp !== 0) {
            return cmp;
        }
        cmp = mappingA.originalColumn - mappingB.originalColumn;
        if (cmp !== 0 || onlyCompareOriginal) {
            return cmp;
        }
        cmp = mappingA.generatedColumn - mappingB.generatedColumn;
        if (cmp !== 0) {
            return cmp;
        }
        cmp = mappingA.generatedLine - mappingB.generatedLine;
        if (cmp !== 0) {
            return cmp;
        }
        return strcmp(mappingA.name, mappingB.name);
    }
    exports30.compareByOriginalPositions = compareByOriginalPositions;
    function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
        var cmp = mappingA.generatedLine - mappingB.generatedLine;
        if (cmp !== 0) {
            return cmp;
        }
        cmp = mappingA.generatedColumn - mappingB.generatedColumn;
        if (cmp !== 0 || onlyCompareGenerated) {
            return cmp;
        }
        cmp = strcmp(mappingA.source, mappingB.source);
        if (cmp !== 0) {
            return cmp;
        }
        cmp = mappingA.originalLine - mappingB.originalLine;
        if (cmp !== 0) {
            return cmp;
        }
        cmp = mappingA.originalColumn - mappingB.originalColumn;
        if (cmp !== 0) {
            return cmp;
        }
        return strcmp(mappingA.name, mappingB.name);
    }
    exports30.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
    function strcmp(aStr1, aStr2) {
        if (aStr1 === aStr2) {
            return 0;
        }
        if (aStr1 === null) {
            return 1;
        }
        if (aStr2 === null) {
            return -1;
        }
        if (aStr1 > aStr2) {
            return 1;
        }
        return -1;
    }
    function compareByGeneratedPositionsInflated(mappingA, mappingB) {
        var cmp = mappingA.generatedLine - mappingB.generatedLine;
        if (cmp !== 0) {
            return cmp;
        }
        cmp = mappingA.generatedColumn - mappingB.generatedColumn;
        if (cmp !== 0) {
            return cmp;
        }
        cmp = strcmp(mappingA.source, mappingB.source);
        if (cmp !== 0) {
            return cmp;
        }
        cmp = mappingA.originalLine - mappingB.originalLine;
        if (cmp !== 0) {
            return cmp;
        }
        cmp = mappingA.originalColumn - mappingB.originalColumn;
        if (cmp !== 0) {
            return cmp;
        }
        return strcmp(mappingA.name, mappingB.name);
    }
    exports30.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
    function parseSourceMapInput(str) {
        return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
    }
    exports30.parseSourceMapInput = parseSourceMapInput;
    function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
        sourceURL = sourceURL || '';
        if (sourceRoot) {
            if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
                sourceRoot += '/';
            }
            sourceURL = sourceRoot + sourceURL;
        }
        if (sourceMapURL) {
            var parsed = urlParse(sourceMapURL);
            if (!parsed) {
                throw new Error("sourceMapURL could not be parsed");
            }
            if (parsed.path) {
                var index = parsed.path.lastIndexOf('/');
                if (index >= 0) {
                    parsed.path = parsed.path.substring(0, index + 1);
                }
            }
            sourceURL = join(urlGenerate(parsed), sourceURL);
        }
        return normalize(sourceURL);
    }
    exports30.computeSourceURL = computeSourceURL;
    return exports30;
}
var exports31 = {
}, _dewExec31 = false;
var _global2 = typeof self !== "undefined" ? self : global;
function dew31() {
    if (_dewExec31) return exports31;
    _dewExec31 = true;
    var util = dew30();
    var has = Object.prototype.hasOwnProperty;
    var hasNativeMap = typeof Map !== "undefined";
    function ArraySet() {
        (this || _global2)._array = [];
        (this || _global2)._set = hasNativeMap ? new Map() : Object.create(null);
    }
    ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
        var set = new ArraySet();
        for(var i = 0, len = aArray.length; i < len; i++){
            set.add(aArray[i], aAllowDuplicates);
        }
        return set;
    };
    ArraySet.prototype.size = function ArraySet_size() {
        return hasNativeMap ? (this || _global2)._set.size : Object.getOwnPropertyNames((this || _global2)._set).length;
    };
    ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
        var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
        var isDuplicate = hasNativeMap ? this.has(aStr) : has.call((this || _global2)._set, sStr);
        var idx = (this || _global2)._array.length;
        if (!isDuplicate || aAllowDuplicates) {
            (this || _global2)._array.push(aStr);
        }
        if (!isDuplicate) {
            if (hasNativeMap) {
                (this || _global2)._set.set(aStr, idx);
            } else {
                (this || _global2)._set[sStr] = idx;
            }
        }
    };
    ArraySet.prototype.has = function ArraySet_has(aStr) {
        if (hasNativeMap) {
            return (this || _global2)._set.has(aStr);
        } else {
            var sStr = util.toSetString(aStr);
            return has.call((this || _global2)._set, sStr);
        }
    };
    ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
        if (hasNativeMap) {
            var idx = (this || _global2)._set.get(aStr);
            if (idx >= 0) {
                return idx;
            }
        } else {
            var sStr = util.toSetString(aStr);
            if (has.call((this || _global2)._set, sStr)) {
                return (this || _global2)._set[sStr];
            }
        }
        throw new Error('"' + aStr + '" is not in the set.');
    };
    ArraySet.prototype.at = function ArraySet_at(aIdx) {
        if (aIdx >= 0 && aIdx < (this || _global2)._array.length) {
            return (this || _global2)._array[aIdx];
        }
        throw new Error('No element indexed by ' + aIdx);
    };
    ArraySet.prototype.toArray = function ArraySet_toArray() {
        return (this || _global2)._array.slice();
    };
    exports31.ArraySet = ArraySet;
    return exports31;
}
var exports32 = {
}, _dewExec32 = false;
var _global3 = typeof self !== "undefined" ? self : global;
function dew32() {
    if (_dewExec32) return exports32;
    _dewExec32 = true;
    var util = dew30();
    function generatedPositionAfter(mappingA, mappingB) {
        var lineA = mappingA.generatedLine;
        var lineB = mappingB.generatedLine;
        var columnA = mappingA.generatedColumn;
        var columnB = mappingB.generatedColumn;
        return lineB > lineA || lineB == lineA && columnB >= columnA || util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
    }
    function MappingList() {
        (this || _global3)._array = [];
        (this || _global3)._sorted = true;
        (this || _global3)._last = {
            generatedLine: -1,
            generatedColumn: 0
        };
    }
    MappingList.prototype.unsortedForEach = function MappingList_forEach(aCallback, aThisArg) {
        (this || _global3)._array.forEach(aCallback, aThisArg);
    };
    MappingList.prototype.add = function MappingList_add(aMapping) {
        if (generatedPositionAfter((this || _global3)._last, aMapping)) {
            (this || _global3)._last = aMapping;
            (this || _global3)._array.push(aMapping);
        } else {
            (this || _global3)._sorted = false;
            (this || _global3)._array.push(aMapping);
        }
    };
    MappingList.prototype.toArray = function MappingList_toArray() {
        if (!(this || _global3)._sorted) {
            (this || _global3)._array.sort(util.compareByGeneratedPositionsInflated);
            (this || _global3)._sorted = true;
        }
        return (this || _global3)._array;
    };
    exports32.MappingList = MappingList;
    return exports32;
}
var exports33 = {
}, _dewExec33 = false;
var _global4 = typeof self !== "undefined" ? self : global;
function dew33() {
    if (_dewExec33) return exports33;
    _dewExec33 = true;
    var base64VLQ = dew29();
    var util = dew30();
    var ArraySet = dew31().ArraySet;
    var MappingList = dew32().MappingList;
    function SourceMapGenerator(aArgs) {
        if (!aArgs) {
            aArgs = {
            };
        }
        (this || _global4)._file = util.getArg(aArgs, 'file', null);
        (this || _global4)._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
        (this || _global4)._skipValidation = util.getArg(aArgs, 'skipValidation', false);
        (this || _global4)._sources = new ArraySet();
        (this || _global4)._names = new ArraySet();
        (this || _global4)._mappings = new MappingList();
        (this || _global4)._sourcesContents = null;
    }
    SourceMapGenerator.prototype._version = 3;
    SourceMapGenerator.fromSourceMap = function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
        var sourceRoot = aSourceMapConsumer.sourceRoot;
        var generator = new SourceMapGenerator({
            file: aSourceMapConsumer.file,
            sourceRoot: sourceRoot
        });
        aSourceMapConsumer.eachMapping(function(mapping) {
            var newMapping = {
                generated: {
                    line: mapping.generatedLine,
                    column: mapping.generatedColumn
                }
            };
            if (mapping.source != null) {
                newMapping.source = mapping.source;
                if (sourceRoot != null) {
                    newMapping.source = util.relative(sourceRoot, newMapping.source);
                }
                newMapping.original = {
                    line: mapping.originalLine,
                    column: mapping.originalColumn
                };
                if (mapping.name != null) {
                    newMapping.name = mapping.name;
                }
            }
            generator.addMapping(newMapping);
        });
        aSourceMapConsumer.sources.forEach(function(sourceFile) {
            var sourceRelative = sourceFile;
            if (sourceRoot !== null) {
                sourceRelative = util.relative(sourceRoot, sourceFile);
            }
            if (!generator._sources.has(sourceRelative)) {
                generator._sources.add(sourceRelative);
            }
            var content = aSourceMapConsumer.sourceContentFor(sourceFile);
            if (content != null) {
                generator.setSourceContent(sourceFile, content);
            }
        });
        return generator;
    };
    SourceMapGenerator.prototype.addMapping = function SourceMapGenerator_addMapping(aArgs) {
        var generated = util.getArg(aArgs, 'generated');
        var original = util.getArg(aArgs, 'original', null);
        var source = util.getArg(aArgs, 'source', null);
        var name = util.getArg(aArgs, 'name', null);
        if (!(this || _global4)._skipValidation) {
            this._validateMapping(generated, original, source, name);
        }
        if (source != null) {
            source = String(source);
            if (!(this || _global4)._sources.has(source)) {
                (this || _global4)._sources.add(source);
            }
        }
        if (name != null) {
            name = String(name);
            if (!(this || _global4)._names.has(name)) {
                (this || _global4)._names.add(name);
            }
        }
        (this || _global4)._mappings.add({
            generatedLine: generated.line,
            generatedColumn: generated.column,
            originalLine: original != null && original.line,
            originalColumn: original != null && original.column,
            source: source,
            name: name
        });
    };
    SourceMapGenerator.prototype.setSourceContent = function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
        var source = aSourceFile;
        if ((this || _global4)._sourceRoot != null) {
            source = util.relative((this || _global4)._sourceRoot, source);
        }
        if (aSourceContent != null) {
            if (!(this || _global4)._sourcesContents) {
                (this || _global4)._sourcesContents = Object.create(null);
            }
            (this || _global4)._sourcesContents[util.toSetString(source)] = aSourceContent;
        } else if ((this || _global4)._sourcesContents) {
            delete (this || _global4)._sourcesContents[util.toSetString(source)];
            if (Object.keys((this || _global4)._sourcesContents).length === 0) {
                (this || _global4)._sourcesContents = null;
            }
        }
    };
    SourceMapGenerator.prototype.applySourceMap = function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
        var sourceFile = aSourceFile;
        if (aSourceFile == null) {
            if (aSourceMapConsumer.file == null) {
                throw new Error('SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' + 'or the source map\'s "file" property. Both were omitted.');
            }
            sourceFile = aSourceMapConsumer.file;
        }
        var sourceRoot = (this || _global4)._sourceRoot;
        if (sourceRoot != null) {
            sourceFile = util.relative(sourceRoot, sourceFile);
        }
        var newSources = new ArraySet();
        var newNames = new ArraySet();
        (this || _global4)._mappings.unsortedForEach(function(mapping) {
            if (mapping.source === sourceFile && mapping.originalLine != null) {
                var original = aSourceMapConsumer.originalPositionFor({
                    line: mapping.originalLine,
                    column: mapping.originalColumn
                });
                if (original.source != null) {
                    mapping.source = original.source;
                    if (aSourceMapPath != null) {
                        mapping.source = util.join(aSourceMapPath, mapping.source);
                    }
                    if (sourceRoot != null) {
                        mapping.source = util.relative(sourceRoot, mapping.source);
                    }
                    mapping.originalLine = original.line;
                    mapping.originalColumn = original.column;
                    if (original.name != null) {
                        mapping.name = original.name;
                    }
                }
            }
            var source = mapping.source;
            if (source != null && !newSources.has(source)) {
                newSources.add(source);
            }
            var name = mapping.name;
            if (name != null && !newNames.has(name)) {
                newNames.add(name);
            }
        }, this || _global4);
        (this || _global4)._sources = newSources;
        (this || _global4)._names = newNames;
        aSourceMapConsumer.sources.forEach(function(sourceFile1) {
            var content = aSourceMapConsumer.sourceContentFor(sourceFile1);
            if (content != null) {
                if (aSourceMapPath != null) {
                    sourceFile1 = util.join(aSourceMapPath, sourceFile1);
                }
                if (sourceRoot != null) {
                    sourceFile1 = util.relative(sourceRoot, sourceFile1);
                }
                this.setSourceContent(sourceFile1, content);
            }
        }, this || _global4);
    };
    SourceMapGenerator.prototype._validateMapping = function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource, aName) {
        if (aOriginal && typeof aOriginal.line !== 'number' && typeof aOriginal.column !== 'number') {
            throw new Error('original.line and original.column are not numbers -- you probably meant to omit ' + 'the original mapping entirely and only map the generated position. If so, pass ' + 'null for the original mapping instead of an object with empty or null values.');
        }
        if (aGenerated && 'line' in aGenerated && 'column' in aGenerated && aGenerated.line > 0 && aGenerated.column >= 0 && !aOriginal && !aSource && !aName) {
            return;
        } else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated && aOriginal && 'line' in aOriginal && 'column' in aOriginal && aGenerated.line > 0 && aGenerated.column >= 0 && aOriginal.line > 0 && aOriginal.column >= 0 && aSource) {
            return;
        } else {
            throw new Error('Invalid mapping: ' + JSON.stringify({
                generated: aGenerated,
                source: aSource,
                original: aOriginal,
                name: aName
            }));
        }
    };
    SourceMapGenerator.prototype._serializeMappings = function SourceMapGenerator_serializeMappings() {
        var previousGeneratedColumn = 0;
        var previousGeneratedLine = 1;
        var previousOriginalColumn = 0;
        var previousOriginalLine = 0;
        var previousName = 0;
        var previousSource = 0;
        var result = '';
        var next;
        var mapping;
        var nameIdx;
        var sourceIdx;
        var mappings = (this || _global4)._mappings.toArray();
        for(var i = 0, len = mappings.length; i < len; i++){
            mapping = mappings[i];
            next = '';
            if (mapping.generatedLine !== previousGeneratedLine) {
                previousGeneratedColumn = 0;
                while(mapping.generatedLine !== previousGeneratedLine){
                    next += ';';
                    previousGeneratedLine++;
                }
            } else {
                if (i > 0) {
                    if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
                        continue;
                    }
                    next += ',';
                }
            }
            next += base64VLQ.encode(mapping.generatedColumn - previousGeneratedColumn);
            previousGeneratedColumn = mapping.generatedColumn;
            if (mapping.source != null) {
                sourceIdx = (this || _global4)._sources.indexOf(mapping.source);
                next += base64VLQ.encode(sourceIdx - previousSource);
                previousSource = sourceIdx;
                next += base64VLQ.encode(mapping.originalLine - 1 - previousOriginalLine);
                previousOriginalLine = mapping.originalLine - 1;
                next += base64VLQ.encode(mapping.originalColumn - previousOriginalColumn);
                previousOriginalColumn = mapping.originalColumn;
                if (mapping.name != null) {
                    nameIdx = (this || _global4)._names.indexOf(mapping.name);
                    next += base64VLQ.encode(nameIdx - previousName);
                    previousName = nameIdx;
                }
            }
            result += next;
        }
        return result;
    };
    SourceMapGenerator.prototype._generateSourcesContent = function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
        return aSources.map(function(source) {
            if (!(this || _global4)._sourcesContents) {
                return null;
            }
            if (aSourceRoot != null) {
                source = util.relative(aSourceRoot, source);
            }
            var key = util.toSetString(source);
            return Object.prototype.hasOwnProperty.call((this || _global4)._sourcesContents, key) ? (this || _global4)._sourcesContents[key] : null;
        }, this || _global4);
    };
    SourceMapGenerator.prototype.toJSON = function SourceMapGenerator_toJSON() {
        var map = {
            version: (this || _global4)._version,
            sources: (this || _global4)._sources.toArray(),
            names: (this || _global4)._names.toArray(),
            mappings: this._serializeMappings()
        };
        if ((this || _global4)._file != null) {
            map.file = (this || _global4)._file;
        }
        if ((this || _global4)._sourceRoot != null) {
            map.sourceRoot = (this || _global4)._sourceRoot;
        }
        if ((this || _global4)._sourcesContents) {
            map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
        }
        return map;
    };
    SourceMapGenerator.prototype.toString = function SourceMapGenerator_toString() {
        return JSON.stringify(this.toJSON());
    };
    exports33.SourceMapGenerator = SourceMapGenerator;
    return exports33;
}
var exports34 = {
}, _dewExec34 = false;
function dew34() {
    if (_dewExec34) return exports34;
    _dewExec34 = true;
    exports34.GREATEST_LOWER_BOUND = 1;
    exports34.LEAST_UPPER_BOUND = 2;
    function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
        var mid = Math.floor((aHigh - aLow) / 2) + aLow;
        var cmp = aCompare(aNeedle, aHaystack[mid], true);
        if (cmp === 0) {
            return mid;
        } else if (cmp > 0) {
            if (aHigh - mid > 1) {
                return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
            }
            if (aBias == exports34.LEAST_UPPER_BOUND) {
                return aHigh < aHaystack.length ? aHigh : -1;
            } else {
                return mid;
            }
        } else {
            if (mid - aLow > 1) {
                return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
            }
            if (aBias == exports34.LEAST_UPPER_BOUND) {
                return mid;
            } else {
                return aLow < 0 ? -1 : aLow;
            }
        }
    }
    exports34.search = function search(aNeedle, aHaystack, aCompare, aBias) {
        if (aHaystack.length === 0) {
            return -1;
        }
        var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare, aBias || exports34.GREATEST_LOWER_BOUND);
        if (index < 0) {
            return -1;
        }
        while(index - 1 >= 0){
            if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
                break;
            }
            --index;
        }
        return index;
    };
    return exports34;
}
var exports35 = {
}, _dewExec35 = false;
function dew35() {
    if (_dewExec35) return exports35;
    _dewExec35 = true;
    function swap(ary, x, y) {
        var temp = ary[x];
        ary[x] = ary[y];
        ary[y] = temp;
    }
    function randomIntInRange(low, high) {
        return Math.round(low + Math.random() * (high - low));
    }
    function doQuickSort(ary, comparator, p, r) {
        if (p < r) {
            var pivotIndex = randomIntInRange(p, r);
            var i = p - 1;
            swap(ary, pivotIndex, r);
            var pivot = ary[r];
            for(var j = p; j < r; j++){
                if (comparator(ary[j], pivot) <= 0) {
                    i += 1;
                    swap(ary, i, j);
                }
            }
            swap(ary, i + 1, j);
            var q = i + 1;
            doQuickSort(ary, comparator, p, q - 1);
            doQuickSort(ary, comparator, q + 1, r);
        }
    }
    exports35.quickSort = function(ary, comparator) {
        doQuickSort(ary, comparator, 0, ary.length - 1);
    };
    return exports35;
}
var exports36 = {
}, _dewExec36 = false;
var _global5 = typeof self !== "undefined" ? self : global;
function dew36() {
    if (_dewExec36) return exports36;
    _dewExec36 = true;
    var util = dew30();
    var binarySearch = dew34();
    var ArraySet = dew31().ArraySet;
    var base64VLQ = dew29();
    var quickSort = dew35().quickSort;
    function SourceMapConsumer(aSourceMap, aSourceMapURL) {
        var sourceMap = aSourceMap;
        if (typeof aSourceMap === 'string') {
            sourceMap = util.parseSourceMapInput(aSourceMap);
        }
        return sourceMap.sections != null ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL) : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
    }
    SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
        return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
    };
    SourceMapConsumer.prototype._version = 3;
    SourceMapConsumer.prototype.__generatedMappings = null;
    Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
        configurable: true,
        enumerable: true,
        get: function() {
            if (!(this || _global5).__generatedMappings) {
                this._parseMappings((this || _global5)._mappings, (this || _global5).sourceRoot);
            }
            return (this || _global5).__generatedMappings;
        }
    });
    SourceMapConsumer.prototype.__originalMappings = null;
    Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
        configurable: true,
        enumerable: true,
        get: function() {
            if (!(this || _global5).__originalMappings) {
                this._parseMappings((this || _global5)._mappings, (this || _global5).sourceRoot);
            }
            return (this || _global5).__originalMappings;
        }
    });
    SourceMapConsumer.prototype._charIsMappingSeparator = function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
        var c = aStr.charAt(index);
        return c === ";" || c === ",";
    };
    SourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
        throw new Error("Subclasses must implement _parseMappings");
    };
    SourceMapConsumer.GENERATED_ORDER = 1;
    SourceMapConsumer.ORIGINAL_ORDER = 2;
    SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
    SourceMapConsumer.LEAST_UPPER_BOUND = 2;
    SourceMapConsumer.prototype.eachMapping = function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
        var context = aContext || null;
        var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
        var mappings;
        switch(order){
            case SourceMapConsumer.GENERATED_ORDER:
                mappings = (this || _global5)._generatedMappings;
                break;
            case SourceMapConsumer.ORIGINAL_ORDER:
                mappings = (this || _global5)._originalMappings;
                break;
            default:
                throw new Error("Unknown order of iteration.");
        }
        var sourceRoot = (this || _global5).sourceRoot;
        mappings.map(function(mapping) {
            var source = mapping.source === null ? null : (this || _global5)._sources.at(mapping.source);
            source = util.computeSourceURL(sourceRoot, source, (this || _global5)._sourceMapURL);
            return {
                source: source,
                generatedLine: mapping.generatedLine,
                generatedColumn: mapping.generatedColumn,
                originalLine: mapping.originalLine,
                originalColumn: mapping.originalColumn,
                name: mapping.name === null ? null : (this || _global5)._names.at(mapping.name)
            };
        }, this || _global5).forEach(aCallback, context);
    };
    SourceMapConsumer.prototype.allGeneratedPositionsFor = function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
        var line = util.getArg(aArgs, 'line');
        var needle = {
            source: util.getArg(aArgs, 'source'),
            originalLine: line,
            originalColumn: util.getArg(aArgs, 'column', 0)
        };
        needle.source = this._findSourceIndex(needle.source);
        if (needle.source < 0) {
            return [];
        }
        var mappings = [];
        var index = this._findMapping(needle, (this || _global5)._originalMappings, "originalLine", "originalColumn", util.compareByOriginalPositions, binarySearch.LEAST_UPPER_BOUND);
        if (index >= 0) {
            var mapping = (this || _global5)._originalMappings[index];
            if (aArgs.column === undefined) {
                var originalLine = mapping.originalLine;
                while(mapping && mapping.originalLine === originalLine){
                    mappings.push({
                        line: util.getArg(mapping, 'generatedLine', null),
                        column: util.getArg(mapping, 'generatedColumn', null),
                        lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
                    });
                    mapping = (this || _global5)._originalMappings[++index];
                }
            } else {
                var originalColumn = mapping.originalColumn;
                while(mapping && mapping.originalLine === line && mapping.originalColumn == originalColumn){
                    mappings.push({
                        line: util.getArg(mapping, 'generatedLine', null),
                        column: util.getArg(mapping, 'generatedColumn', null),
                        lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
                    });
                    mapping = (this || _global5)._originalMappings[++index];
                }
            }
        }
        return mappings;
    };
    exports36.SourceMapConsumer = SourceMapConsumer;
    function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
        var sourceMap = aSourceMap;
        if (typeof aSourceMap === 'string') {
            sourceMap = util.parseSourceMapInput(aSourceMap);
        }
        var version = util.getArg(sourceMap, 'version');
        var sources = util.getArg(sourceMap, 'sources');
        var names = util.getArg(sourceMap, 'names', []);
        var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
        var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
        var mappings = util.getArg(sourceMap, 'mappings');
        var file = util.getArg(sourceMap, 'file', null);
        if (version != (this || _global5)._version) {
            throw new Error('Unsupported version: ' + version);
        }
        if (sourceRoot) {
            sourceRoot = util.normalize(sourceRoot);
        }
        sources = sources.map(String).map(util.normalize).map(function(source) {
            return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source) ? util.relative(sourceRoot, source) : source;
        });
        (this || _global5)._names = ArraySet.fromArray(names.map(String), true);
        (this || _global5)._sources = ArraySet.fromArray(sources, true);
        (this || _global5)._absoluteSources = (this || _global5)._sources.toArray().map(function(s) {
            return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
        });
        (this || _global5).sourceRoot = sourceRoot;
        (this || _global5).sourcesContent = sourcesContent;
        (this || _global5)._mappings = mappings;
        (this || _global5)._sourceMapURL = aSourceMapURL;
        (this || _global5).file = file;
    }
    BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
    BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
    BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
        var relativeSource = aSource;
        if ((this || _global5).sourceRoot != null) {
            relativeSource = util.relative((this || _global5).sourceRoot, relativeSource);
        }
        if ((this || _global5)._sources.has(relativeSource)) {
            return (this || _global5)._sources.indexOf(relativeSource);
        }
        var i;
        for(i = 0; i < (this || _global5)._absoluteSources.length; ++i){
            if ((this || _global5)._absoluteSources[i] == aSource) {
                return i;
            }
        }
        return -1;
    };
    BasicSourceMapConsumer.fromSourceMap = function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
        var smc = Object.create(BasicSourceMapConsumer.prototype);
        var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
        var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
        smc.sourceRoot = aSourceMap._sourceRoot;
        smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(), smc.sourceRoot);
        smc.file = aSourceMap._file;
        smc._sourceMapURL = aSourceMapURL;
        smc._absoluteSources = smc._sources.toArray().map(function(s) {
            return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
        });
        var generatedMappings = aSourceMap._mappings.toArray().slice();
        var destGeneratedMappings = smc.__generatedMappings = [];
        var destOriginalMappings = smc.__originalMappings = [];
        for(var i = 0, length = generatedMappings.length; i < length; i++){
            var srcMapping = generatedMappings[i];
            var destMapping = new Mapping();
            destMapping.generatedLine = srcMapping.generatedLine;
            destMapping.generatedColumn = srcMapping.generatedColumn;
            if (srcMapping.source) {
                destMapping.source = sources.indexOf(srcMapping.source);
                destMapping.originalLine = srcMapping.originalLine;
                destMapping.originalColumn = srcMapping.originalColumn;
                if (srcMapping.name) {
                    destMapping.name = names.indexOf(srcMapping.name);
                }
                destOriginalMappings.push(destMapping);
            }
            destGeneratedMappings.push(destMapping);
        }
        quickSort(smc.__originalMappings, util.compareByOriginalPositions);
        return smc;
    };
    BasicSourceMapConsumer.prototype._version = 3;
    Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
        get: function() {
            return (this || _global5)._absoluteSources.slice();
        }
    });
    function Mapping() {
        (this || _global5).generatedLine = 0;
        (this || _global5).generatedColumn = 0;
        (this || _global5).source = null;
        (this || _global5).originalLine = null;
        (this || _global5).originalColumn = null;
        (this || _global5).name = null;
    }
    BasicSourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings1(aStr, aSourceRoot) {
        var generatedLine = 1;
        var previousGeneratedColumn = 0;
        var previousOriginalLine = 0;
        var previousOriginalColumn = 0;
        var previousSource = 0;
        var previousName = 0;
        var length = aStr.length;
        var index = 0;
        var cachedSegments = {
        };
        var temp = {
        };
        var originalMappings = [];
        var generatedMappings = [];
        var mapping, str, segment, end, value;
        while(index < length){
            if (aStr.charAt(index) === ';') {
                generatedLine++;
                index++;
                previousGeneratedColumn = 0;
            } else if (aStr.charAt(index) === ',') {
                index++;
            } else {
                mapping = new Mapping();
                mapping.generatedLine = generatedLine;
                for(end = index; end < length; end++){
                    if (this._charIsMappingSeparator(aStr, end)) {
                        break;
                    }
                }
                str = aStr.slice(index, end);
                segment = cachedSegments[str];
                if (segment) {
                    index += str.length;
                } else {
                    segment = [];
                    while(index < end){
                        base64VLQ.decode(aStr, index, temp);
                        value = temp.value;
                        index = temp.rest;
                        segment.push(value);
                    }
                    if (segment.length === 2) {
                        throw new Error('Found a source, but no line and column');
                    }
                    if (segment.length === 3) {
                        throw new Error('Found a source and line, but no column');
                    }
                    cachedSegments[str] = segment;
                }
                mapping.generatedColumn = previousGeneratedColumn + segment[0];
                previousGeneratedColumn = mapping.generatedColumn;
                if (segment.length > 1) {
                    mapping.source = previousSource + segment[1];
                    previousSource += segment[1];
                    mapping.originalLine = previousOriginalLine + segment[2];
                    previousOriginalLine = mapping.originalLine;
                    mapping.originalLine += 1;
                    mapping.originalColumn = previousOriginalColumn + segment[3];
                    previousOriginalColumn = mapping.originalColumn;
                    if (segment.length > 4) {
                        mapping.name = previousName + segment[4];
                        previousName += segment[4];
                    }
                }
                generatedMappings.push(mapping);
                if (typeof mapping.originalLine === 'number') {
                    originalMappings.push(mapping);
                }
            }
        }
        quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
        (this || _global5).__generatedMappings = generatedMappings;
        quickSort(originalMappings, util.compareByOriginalPositions);
        (this || _global5).__originalMappings = originalMappings;
    };
    BasicSourceMapConsumer.prototype._findMapping = function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName, aColumnName, aComparator, aBias) {
        if (aNeedle[aLineName] <= 0) {
            throw new TypeError('Line must be greater than or equal to 1, got ' + aNeedle[aLineName]);
        }
        if (aNeedle[aColumnName] < 0) {
            throw new TypeError('Column must be greater than or equal to 0, got ' + aNeedle[aColumnName]);
        }
        return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
    };
    BasicSourceMapConsumer.prototype.computeColumnSpans = function SourceMapConsumer_computeColumnSpans() {
        for(var index = 0; index < (this || _global5)._generatedMappings.length; ++index){
            var mapping = (this || _global5)._generatedMappings[index];
            if (index + 1 < (this || _global5)._generatedMappings.length) {
                var nextMapping = (this || _global5)._generatedMappings[index + 1];
                if (mapping.generatedLine === nextMapping.generatedLine) {
                    mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
                    continue;
                }
            }
            mapping.lastGeneratedColumn = Infinity;
        }
    };
    BasicSourceMapConsumer.prototype.originalPositionFor = function SourceMapConsumer_originalPositionFor(aArgs) {
        var needle = {
            generatedLine: util.getArg(aArgs, 'line'),
            generatedColumn: util.getArg(aArgs, 'column')
        };
        var index = this._findMapping(needle, (this || _global5)._generatedMappings, "generatedLine", "generatedColumn", util.compareByGeneratedPositionsDeflated, util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND));
        if (index >= 0) {
            var mapping = (this || _global5)._generatedMappings[index];
            if (mapping.generatedLine === needle.generatedLine) {
                var source = util.getArg(mapping, 'source', null);
                if (source !== null) {
                    source = (this || _global5)._sources.at(source);
                    source = util.computeSourceURL((this || _global5).sourceRoot, source, (this || _global5)._sourceMapURL);
                }
                var name = util.getArg(mapping, 'name', null);
                if (name !== null) {
                    name = (this || _global5)._names.at(name);
                }
                return {
                    source: source,
                    line: util.getArg(mapping, 'originalLine', null),
                    column: util.getArg(mapping, 'originalColumn', null),
                    name: name
                };
            }
        }
        return {
            source: null,
            line: null,
            column: null,
            name: null
        };
    };
    BasicSourceMapConsumer.prototype.hasContentsOfAllSources = function BasicSourceMapConsumer_hasContentsOfAllSources() {
        if (!(this || _global5).sourcesContent) {
            return false;
        }
        return (this || _global5).sourcesContent.length >= (this || _global5)._sources.size() && !(this || _global5).sourcesContent.some(function(sc) {
            return sc == null;
        });
    };
    BasicSourceMapConsumer.prototype.sourceContentFor = function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
        if (!(this || _global5).sourcesContent) {
            return null;
        }
        var index = this._findSourceIndex(aSource);
        if (index >= 0) {
            return (this || _global5).sourcesContent[index];
        }
        var relativeSource = aSource;
        if ((this || _global5).sourceRoot != null) {
            relativeSource = util.relative((this || _global5).sourceRoot, relativeSource);
        }
        var url;
        if ((this || _global5).sourceRoot != null && (url = util.urlParse((this || _global5).sourceRoot))) {
            var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
            if (url.scheme == "file" && (this || _global5)._sources.has(fileUriAbsPath)) {
                return (this || _global5).sourcesContent[(this || _global5)._sources.indexOf(fileUriAbsPath)];
            }
            if ((!url.path || url.path == "/") && (this || _global5)._sources.has("/" + relativeSource)) {
                return (this || _global5).sourcesContent[(this || _global5)._sources.indexOf("/" + relativeSource)];
            }
        }
        if (nullOnMissing) {
            return null;
        } else {
            throw new Error('"' + relativeSource + '" is not in the SourceMap.');
        }
    };
    BasicSourceMapConsumer.prototype.generatedPositionFor = function SourceMapConsumer_generatedPositionFor(aArgs) {
        var source = util.getArg(aArgs, 'source');
        source = this._findSourceIndex(source);
        if (source < 0) {
            return {
                line: null,
                column: null,
                lastColumn: null
            };
        }
        var needle = {
            source: source,
            originalLine: util.getArg(aArgs, 'line'),
            originalColumn: util.getArg(aArgs, 'column')
        };
        var index = this._findMapping(needle, (this || _global5)._originalMappings, "originalLine", "originalColumn", util.compareByOriginalPositions, util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND));
        if (index >= 0) {
            var mapping = (this || _global5)._originalMappings[index];
            if (mapping.source === needle.source) {
                return {
                    line: util.getArg(mapping, 'generatedLine', null),
                    column: util.getArg(mapping, 'generatedColumn', null),
                    lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
                };
            }
        }
        return {
            line: null,
            column: null,
            lastColumn: null
        };
    };
    exports36.BasicSourceMapConsumer = BasicSourceMapConsumer;
    function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
        var sourceMap = aSourceMap;
        if (typeof aSourceMap === 'string') {
            sourceMap = util.parseSourceMapInput(aSourceMap);
        }
        var version = util.getArg(sourceMap, 'version');
        var sections = util.getArg(sourceMap, 'sections');
        if (version != (this || _global5)._version) {
            throw new Error('Unsupported version: ' + version);
        }
        (this || _global5)._sources = new ArraySet();
        (this || _global5)._names = new ArraySet();
        var lastOffset = {
            line: -1,
            column: 0
        };
        (this || _global5)._sections = sections.map(function(s) {
            if (s.url) {
                throw new Error('Support for url field in sections not implemented.');
            }
            var offset = util.getArg(s, 'offset');
            var offsetLine = util.getArg(offset, 'line');
            var offsetColumn = util.getArg(offset, 'column');
            if (offsetLine < lastOffset.line || offsetLine === lastOffset.line && offsetColumn < lastOffset.column) {
                throw new Error('Section offsets must be ordered and non-overlapping.');
            }
            lastOffset = offset;
            return {
                generatedOffset: {
                    generatedLine: offsetLine + 1,
                    generatedColumn: offsetColumn + 1
                },
                consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)
            };
        });
    }
    IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
    IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
    IndexedSourceMapConsumer.prototype._version = 3;
    Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
        get: function() {
            var sources = [];
            for(var i = 0; i < (this || _global5)._sections.length; i++){
                for(var j = 0; j < (this || _global5)._sections[i].consumer.sources.length; j++){
                    sources.push((this || _global5)._sections[i].consumer.sources[j]);
                }
            }
            return sources;
        }
    });
    IndexedSourceMapConsumer.prototype.originalPositionFor = function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
        var needle = {
            generatedLine: util.getArg(aArgs, 'line'),
            generatedColumn: util.getArg(aArgs, 'column')
        };
        var sectionIndex = binarySearch.search(needle, (this || _global5)._sections, function(needle1, section) {
            var cmp = needle1.generatedLine - section.generatedOffset.generatedLine;
            if (cmp) {
                return cmp;
            }
            return needle1.generatedColumn - section.generatedOffset.generatedColumn;
        });
        var section = (this || _global5)._sections[sectionIndex];
        if (!section) {
            return {
                source: null,
                line: null,
                column: null,
                name: null
            };
        }
        return section.consumer.originalPositionFor({
            line: needle.generatedLine - (section.generatedOffset.generatedLine - 1),
            column: needle.generatedColumn - (section.generatedOffset.generatedLine === needle.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
            bias: aArgs.bias
        });
    };
    IndexedSourceMapConsumer.prototype.hasContentsOfAllSources = function IndexedSourceMapConsumer_hasContentsOfAllSources() {
        return (this || _global5)._sections.every(function(s) {
            return s.consumer.hasContentsOfAllSources();
        });
    };
    IndexedSourceMapConsumer.prototype.sourceContentFor = function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
        for(var i = 0; i < (this || _global5)._sections.length; i++){
            var section = (this || _global5)._sections[i];
            var content = section.consumer.sourceContentFor(aSource, true);
            if (content) {
                return content;
            }
        }
        if (nullOnMissing) {
            return null;
        } else {
            throw new Error('"' + aSource + '" is not in the SourceMap.');
        }
    };
    IndexedSourceMapConsumer.prototype.generatedPositionFor = function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
        for(var i = 0; i < (this || _global5)._sections.length; i++){
            var section = (this || _global5)._sections[i];
            if (section.consumer._findSourceIndex(util.getArg(aArgs, 'source')) === -1) {
                continue;
            }
            var generatedPosition = section.consumer.generatedPositionFor(aArgs);
            if (generatedPosition) {
                var ret = {
                    line: generatedPosition.line + (section.generatedOffset.generatedLine - 1),
                    column: generatedPosition.column + (section.generatedOffset.generatedLine === generatedPosition.line ? section.generatedOffset.generatedColumn - 1 : 0)
                };
                return ret;
            }
        }
        return {
            line: null,
            column: null
        };
    };
    IndexedSourceMapConsumer.prototype._parseMappings = function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
        (this || _global5).__generatedMappings = [];
        (this || _global5).__originalMappings = [];
        for(var i = 0; i < (this || _global5)._sections.length; i++){
            var section = (this || _global5)._sections[i];
            var sectionMappings = section.consumer._generatedMappings;
            for(var j = 0; j < sectionMappings.length; j++){
                var mapping = sectionMappings[j];
                var source = section.consumer._sources.at(mapping.source);
                source = util.computeSourceURL(section.consumer.sourceRoot, source, (this || _global5)._sourceMapURL);
                (this || _global5)._sources.add(source);
                source = (this || _global5)._sources.indexOf(source);
                var name = null;
                if (mapping.name) {
                    name = section.consumer._names.at(mapping.name);
                    (this || _global5)._names.add(name);
                    name = (this || _global5)._names.indexOf(name);
                }
                var adjustedMapping = {
                    source: source,
                    generatedLine: mapping.generatedLine + (section.generatedOffset.generatedLine - 1),
                    generatedColumn: mapping.generatedColumn + (section.generatedOffset.generatedLine === mapping.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
                    originalLine: mapping.originalLine,
                    originalColumn: mapping.originalColumn,
                    name: name
                };
                (this || _global5).__generatedMappings.push(adjustedMapping);
                if (typeof adjustedMapping.originalLine === 'number') {
                    (this || _global5).__originalMappings.push(adjustedMapping);
                }
            }
        }
        quickSort((this || _global5).__generatedMappings, util.compareByGeneratedPositionsDeflated);
        quickSort((this || _global5).__originalMappings, util.compareByOriginalPositions);
    };
    exports36.IndexedSourceMapConsumer = IndexedSourceMapConsumer;
    return exports36;
}
var exports37 = {
}, _dewExec37 = false;
var _global6 = typeof self !== "undefined" ? self : global;
function dew37() {
    if (_dewExec37) return exports37;
    _dewExec37 = true;
    var SourceMapGenerator = dew33().SourceMapGenerator;
    var util = dew30();
    var REGEX_NEWLINE = /(\r?\n)/;
    var NEWLINE_CODE = 10;
    var isSourceNode = "$$$isSourceNode$$$";
    function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
        (this || _global6).children = [];
        (this || _global6).sourceContents = {
        };
        (this || _global6).line = aLine == null ? null : aLine;
        (this || _global6).column = aColumn == null ? null : aColumn;
        (this || _global6).source = aSource == null ? null : aSource;
        (this || _global6).name = aName == null ? null : aName;
        (this || _global6)[isSourceNode] = true;
        if (aChunks != null) this.add(aChunks);
    }
    SourceNode.fromStringWithSourceMap = function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
        var node = new SourceNode();
        var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
        var remainingLinesIndex = 0;
        var shiftNextLine = function() {
            var lineContents = getNextLine();
            var newLine = getNextLine() || "";
            return lineContents + newLine;
            function getNextLine() {
                return remainingLinesIndex < remainingLines.length ? remainingLines[remainingLinesIndex++] : undefined;
            }
        };
        var lastGeneratedLine = 1, lastGeneratedColumn = 0;
        var lastMapping = null;
        aSourceMapConsumer.eachMapping(function(mapping) {
            if (lastMapping !== null) {
                if (lastGeneratedLine < mapping.generatedLine) {
                    addMappingWithCode(lastMapping, shiftNextLine());
                    lastGeneratedLine++;
                    lastGeneratedColumn = 0;
                } else {
                    var nextLine = remainingLines[remainingLinesIndex] || '';
                    var code = nextLine.substr(0, mapping.generatedColumn - lastGeneratedColumn);
                    remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn - lastGeneratedColumn);
                    lastGeneratedColumn = mapping.generatedColumn;
                    addMappingWithCode(lastMapping, code);
                    lastMapping = mapping;
                    return;
                }
            }
            while(lastGeneratedLine < mapping.generatedLine){
                node.add(shiftNextLine());
                lastGeneratedLine++;
            }
            if (lastGeneratedColumn < mapping.generatedColumn) {
                var nextLine = remainingLines[remainingLinesIndex] || '';
                node.add(nextLine.substr(0, mapping.generatedColumn));
                remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
                lastGeneratedColumn = mapping.generatedColumn;
            }
            lastMapping = mapping;
        }, this || _global6);
        if (remainingLinesIndex < remainingLines.length) {
            if (lastMapping) {
                addMappingWithCode(lastMapping, shiftNextLine());
            }
            node.add(remainingLines.splice(remainingLinesIndex).join(""));
        }
        aSourceMapConsumer.sources.forEach(function(sourceFile) {
            var content = aSourceMapConsumer.sourceContentFor(sourceFile);
            if (content != null) {
                if (aRelativePath != null) {
                    sourceFile = util.join(aRelativePath, sourceFile);
                }
                node.setSourceContent(sourceFile, content);
            }
        });
        return node;
        function addMappingWithCode(mapping, code) {
            if (mapping === null || mapping.source === undefined) {
                node.add(code);
            } else {
                var source = aRelativePath ? util.join(aRelativePath, mapping.source) : mapping.source;
                node.add(new SourceNode(mapping.originalLine, mapping.originalColumn, source, code, mapping.name));
            }
        }
    };
    SourceNode.prototype.add = function SourceNode_add(aChunk) {
        if (Array.isArray(aChunk)) {
            aChunk.forEach(function(chunk) {
                this.add(chunk);
            }, this || _global6);
        } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
            if (aChunk) {
                (this || _global6).children.push(aChunk);
            }
        } else {
            throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk);
        }
        return this || _global6;
    };
    SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
        if (Array.isArray(aChunk)) {
            for(var i = aChunk.length - 1; i >= 0; i--){
                this.prepend(aChunk[i]);
            }
        } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
            (this || _global6).children.unshift(aChunk);
        } else {
            throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk);
        }
        return this || _global6;
    };
    SourceNode.prototype.walk = function SourceNode_walk(aFn) {
        var chunk;
        for(var i = 0, len = (this || _global6).children.length; i < len; i++){
            chunk = (this || _global6).children[i];
            if (chunk[isSourceNode]) {
                chunk.walk(aFn);
            } else {
                if (chunk !== '') {
                    aFn(chunk, {
                        source: (this || _global6).source,
                        line: (this || _global6).line,
                        column: (this || _global6).column,
                        name: (this || _global6).name
                    });
                }
            }
        }
    };
    SourceNode.prototype.join = function SourceNode_join(aSep) {
        var newChildren;
        var i;
        var len = (this || _global6).children.length;
        if (len > 0) {
            newChildren = [];
            for(i = 0; i < len - 1; i++){
                newChildren.push((this || _global6).children[i]);
                newChildren.push(aSep);
            }
            newChildren.push((this || _global6).children[i]);
            (this || _global6).children = newChildren;
        }
        return this || _global6;
    };
    SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
        var lastChild = (this || _global6).children[(this || _global6).children.length - 1];
        if (lastChild[isSourceNode]) {
            lastChild.replaceRight(aPattern, aReplacement);
        } else if (typeof lastChild === 'string') {
            (this || _global6).children[(this || _global6).children.length - 1] = lastChild.replace(aPattern, aReplacement);
        } else {
            (this || _global6).children.push(''.replace(aPattern, aReplacement));
        }
        return this || _global6;
    };
    SourceNode.prototype.setSourceContent = function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
        (this || _global6).sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
    };
    SourceNode.prototype.walkSourceContents = function SourceNode_walkSourceContents(aFn) {
        for(var i = 0, len = (this || _global6).children.length; i < len; i++){
            if ((this || _global6).children[i][isSourceNode]) {
                (this || _global6).children[i].walkSourceContents(aFn);
            }
        }
        var sources = Object.keys((this || _global6).sourceContents);
        for(var i = 0, len = sources.length; i < len; i++){
            aFn(util.fromSetString(sources[i]), (this || _global6).sourceContents[sources[i]]);
        }
    };
    SourceNode.prototype.toString = function SourceNode_toString() {
        var str = "";
        this.walk(function(chunk) {
            str += chunk;
        });
        return str;
    };
    SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
        var generated = {
            code: "",
            line: 1,
            column: 0
        };
        var map = new SourceMapGenerator(aArgs);
        var sourceMappingActive = false;
        var lastOriginalSource = null;
        var lastOriginalLine = null;
        var lastOriginalColumn = null;
        var lastOriginalName = null;
        this.walk(function(chunk, original) {
            generated.code += chunk;
            if (original.source !== null && original.line !== null && original.column !== null) {
                if (lastOriginalSource !== original.source || lastOriginalLine !== original.line || lastOriginalColumn !== original.column || lastOriginalName !== original.name) {
                    map.addMapping({
                        source: original.source,
                        original: {
                            line: original.line,
                            column: original.column
                        },
                        generated: {
                            line: generated.line,
                            column: generated.column
                        },
                        name: original.name
                    });
                }
                lastOriginalSource = original.source;
                lastOriginalLine = original.line;
                lastOriginalColumn = original.column;
                lastOriginalName = original.name;
                sourceMappingActive = true;
            } else if (sourceMappingActive) {
                map.addMapping({
                    generated: {
                        line: generated.line,
                        column: generated.column
                    }
                });
                lastOriginalSource = null;
                sourceMappingActive = false;
            }
            for(var idx = 0, length = chunk.length; idx < length; idx++){
                if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
                    generated.line++;
                    generated.column = 0;
                    if (idx + 1 === length) {
                        lastOriginalSource = null;
                        sourceMappingActive = false;
                    } else if (sourceMappingActive) {
                        map.addMapping({
                            source: original.source,
                            original: {
                                line: original.line,
                                column: original.column
                            },
                            generated: {
                                line: generated.line,
                                column: generated.column
                            },
                            name: original.name
                        });
                    }
                } else {
                    generated.column++;
                }
            }
        });
        this.walkSourceContents(function(sourceFile, sourceContent) {
            map.setSourceContent(sourceFile, sourceContent);
        });
        return {
            code: generated.code,
            map: map
        };
    };
    exports37.SourceNode = SourceNode;
    return exports37;
}
var exports38 = {
}, _dewExec38 = false;
function dew38() {
    if (_dewExec38) return exports38;
    _dewExec38 = true;
    exports38.SourceMapGenerator = dew33().SourceMapGenerator;
    exports38.SourceMapConsumer = dew36().SourceMapConsumer;
    exports38.SourceNode = dew37().SourceNode;
    return exports38;
}
var exports39 = {
}, _dewExec39 = false;
function dew39() {
    if (_dewExec39) return exports39;
    _dewExec39 = true;
    exports39.__esModule = true;
    var _utils = dew();
    var SourceNode = undefined;
    try {
        if (typeof define !== 'function' || !define.amd) {
            var SourceMap = dew38();
            SourceNode = SourceMap.SourceNode;
        }
    } catch (err) {
    }
    if (!SourceNode) {
        SourceNode = function(line, column, srcFile, chunks) {
            this.src = '';
            if (chunks) {
                this.add(chunks);
            }
        };
        SourceNode.prototype = {
            add: function add(chunks) {
                if (_utils.isArray(chunks)) {
                    chunks = chunks.join('');
                }
                this.src += chunks;
            },
            prepend: function prepend(chunks) {
                if (_utils.isArray(chunks)) {
                    chunks = chunks.join('');
                }
                this.src = chunks + this.src;
            },
            toStringWithSourceMap: function toStringWithSourceMap() {
                return {
                    code: this.toString()
                };
            },
            toString: function toString() {
                return this.src;
            }
        };
    }
    function castChunk(chunk, codeGen, loc) {
        if (_utils.isArray(chunk)) {
            var ret = [];
            for(var i = 0, len = chunk.length; i < len; i++){
                ret.push(codeGen.wrap(chunk[i], loc));
            }
            return ret;
        } else if (typeof chunk === 'boolean' || typeof chunk === 'number') {
            return chunk + '';
        }
        return chunk;
    }
    function CodeGen(srcFile) {
        this.srcFile = srcFile;
        this.source = [];
    }
    CodeGen.prototype = {
        isEmpty: function isEmpty() {
            return !this.source.length;
        },
        prepend: function prepend(source, loc) {
            this.source.unshift(this.wrap(source, loc));
        },
        push: function push(source, loc) {
            this.source.push(this.wrap(source, loc));
        },
        merge: function merge() {
            var source = this.empty();
            this.each(function(line) {
                source.add([
                    '  ',
                    line,
                    '\n'
                ]);
            });
            return source;
        },
        each: function each(iter) {
            for(var i = 0, len = this.source.length; i < len; i++){
                iter(this.source[i]);
            }
        },
        empty: function empty() {
            var loc = this.currentLocation || {
                start: {
                }
            };
            return new SourceNode(loc.start.line, loc.start.column, this.srcFile);
        },
        wrap: function wrap(chunk) {
            var loc = arguments.length <= 1 || arguments[1] === undefined ? this.currentLocation || {
                start: {
                }
            } : arguments[1];
            if (chunk instanceof SourceNode) {
                return chunk;
            }
            chunk = castChunk(chunk, this, loc);
            return new SourceNode(loc.start.line, loc.start.column, this.srcFile, chunk);
        },
        functionCall: function functionCall(fn, type, params) {
            params = this.generateList(params);
            return this.wrap([
                fn,
                type ? '.' + type + '(' : '(',
                params,
                ')'
            ]);
        },
        quotedString: function quotedString(str) {
            return '"' + (str + '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029') + '"';
        },
        objectLiteral: function objectLiteral(obj) {
            var _this = this;
            var pairs = [];
            Object.keys(obj).forEach(function(key) {
                var value = castChunk(obj[key], _this);
                if (value !== 'undefined') {
                    pairs.push([
                        _this.quotedString(key),
                        ':',
                        value
                    ]);
                }
            });
            var ret = this.generateList(pairs);
            ret.prepend('{');
            ret.add('}');
            return ret;
        },
        generateList: function generateList(entries) {
            var ret = this.empty();
            for(var i = 0, len = entries.length; i < len; i++){
                if (i) {
                    ret.add(',');
                }
                ret.add(castChunk(entries[i], this));
            }
            return ret;
        },
        generateArray: function generateArray(entries) {
            var ret = this.generateList(entries);
            ret.prepend('[');
            ret.add(']');
            return ret;
        }
    };
    exports39['default'] = CodeGen;
    exports39 = exports39['default'];
    return exports39;
}
var exports40 = {
}, _dewExec40 = false;
function dew40() {
    if (_dewExec40) return exports40;
    _dewExec40 = true;
    exports40.__esModule = true;
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            'default': obj
        };
    }
    var _base = dew15();
    var _exception = dew1();
    var _exception2 = _interopRequireDefault(_exception);
    var _utils = dew();
    var _codeGen = dew39();
    var _codeGen2 = _interopRequireDefault(_codeGen);
    function Literal(value) {
        this.value = value;
    }
    function JavaScriptCompiler() {
    }
    JavaScriptCompiler.prototype = {
        nameLookup: function nameLookup(parent, name) {
            return this.internalNameLookup(parent, name);
        },
        depthedLookup: function depthedLookup(name) {
            return [
                this.aliasable('container.lookup'),
                '(depths, "',
                name,
                '")'
            ];
        },
        compilerInfo: function compilerInfo() {
            var revision = _base.COMPILER_REVISION, versions = _base.REVISION_CHANGES[revision];
            return [
                revision,
                versions
            ];
        },
        appendToBuffer: function appendToBuffer(source, location, explicit) {
            if (!_utils.isArray(source)) {
                source = [
                    source
                ];
            }
            source = this.source.wrap(source, location);
            if (this.environment.isSimple) {
                return [
                    'return ',
                    source,
                    ';'
                ];
            } else if (explicit) {
                return [
                    'buffer += ',
                    source,
                    ';'
                ];
            } else {
                source.appendToBuffer = true;
                return source;
            }
        },
        initializeBuffer: function initializeBuffer() {
            return this.quotedString('');
        },
        internalNameLookup: function internalNameLookup(parent, name) {
            this.lookupPropertyFunctionIsUsed = true;
            return [
                'lookupProperty(',
                parent,
                ',',
                JSON.stringify(name),
                ')'
            ];
        },
        lookupPropertyFunctionIsUsed: false,
        compile: function compile(environment, options, context, asObject) {
            this.environment = environment;
            this.options = options;
            this.stringParams = this.options.stringParams;
            this.trackIds = this.options.trackIds;
            this.precompile = !asObject;
            this.name = this.environment.name;
            this.isChild = !!context;
            this.context = context || {
                decorators: [],
                programs: [],
                environments: []
            };
            this.preamble();
            this.stackSlot = 0;
            this.stackVars = [];
            this.aliases = {
            };
            this.registers = {
                list: []
            };
            this.hashes = [];
            this.compileStack = [];
            this.inlineStack = [];
            this.blockParams = [];
            this.compileChildren(environment, options);
            this.useDepths = this.useDepths || environment.useDepths || environment.useDecorators || this.options.compat;
            this.useBlockParams = this.useBlockParams || environment.useBlockParams;
            var opcodes = environment.opcodes, opcode = undefined, firstLoc = undefined, i = undefined, l = undefined;
            for(i = 0, l = opcodes.length; i < l; i++){
                opcode = opcodes[i];
                this.source.currentLocation = opcode.loc;
                firstLoc = firstLoc || opcode.loc;
                this[opcode.opcode].apply(this, opcode.args);
            }
            this.source.currentLocation = firstLoc;
            this.pushSource('');
            if (this.stackSlot || this.inlineStack.length || this.compileStack.length) {
                throw new _exception2['default']('Compile completed with content left on stack');
            }
            if (!this.decorators.isEmpty()) {
                this.useDecorators = true;
                this.decorators.prepend([
                    'var decorators = container.decorators, ',
                    this.lookupPropertyFunctionVarDeclaration(),
                    ';\n'
                ]);
                this.decorators.push('return fn;');
                if (asObject) {
                    this.decorators = Function.apply(this, [
                        'fn',
                        'props',
                        'container',
                        'depth0',
                        'data',
                        'blockParams',
                        'depths',
                        this.decorators.merge()
                    ]);
                } else {
                    this.decorators.prepend('function(fn, props, container, depth0, data, blockParams, depths) {\n');
                    this.decorators.push('}\n');
                    this.decorators = this.decorators.merge();
                }
            } else {
                this.decorators = undefined;
            }
            var fn = this.createFunctionContext(asObject);
            if (!this.isChild) {
                var ret = {
                    compiler: this.compilerInfo(),
                    main: fn
                };
                if (this.decorators) {
                    ret.main_d = this.decorators;
                    ret.useDecorators = true;
                }
                var _context = this.context;
                var programs = _context.programs;
                var decorators = _context.decorators;
                for(i = 0, l = programs.length; i < l; i++){
                    if (programs[i]) {
                        ret[i] = programs[i];
                        if (decorators[i]) {
                            ret[i + '_d'] = decorators[i];
                            ret.useDecorators = true;
                        }
                    }
                }
                if (this.environment.usePartial) {
                    ret.usePartial = true;
                }
                if (this.options.data) {
                    ret.useData = true;
                }
                if (this.useDepths) {
                    ret.useDepths = true;
                }
                if (this.useBlockParams) {
                    ret.useBlockParams = true;
                }
                if (this.options.compat) {
                    ret.compat = true;
                }
                if (!asObject) {
                    ret.compiler = JSON.stringify(ret.compiler);
                    this.source.currentLocation = {
                        start: {
                            line: 1,
                            column: 0
                        }
                    };
                    ret = this.objectLiteral(ret);
                    if (options.srcName) {
                        ret = ret.toStringWithSourceMap({
                            file: options.destName
                        });
                        ret.map = ret.map && ret.map.toString();
                    } else {
                        ret = ret.toString();
                    }
                } else {
                    ret.compilerOptions = this.options;
                }
                return ret;
            } else {
                return fn;
            }
        },
        preamble: function preamble() {
            this.lastContext = 0;
            this.source = new _codeGen2['default'](this.options.srcName);
            this.decorators = new _codeGen2['default'](this.options.srcName);
        },
        createFunctionContext: function createFunctionContext(asObject) {
            var _this = this;
            var varDeclarations = '';
            var locals = this.stackVars.concat(this.registers.list);
            if (locals.length > 0) {
                varDeclarations += ', ' + locals.join(', ');
            }
            var aliasCount = 0;
            Object.keys(this.aliases).forEach(function(alias) {
                var node = _this.aliases[alias];
                if (node.children && node.referenceCount > 1) {
                    varDeclarations += ', alias' + ++aliasCount + '=' + alias;
                    node.children[0] = 'alias' + aliasCount;
                }
            });
            if (this.lookupPropertyFunctionIsUsed) {
                varDeclarations += ', ' + this.lookupPropertyFunctionVarDeclaration();
            }
            var params = [
                'container',
                'depth0',
                'helpers',
                'partials',
                'data'
            ];
            if (this.useBlockParams || this.useDepths) {
                params.push('blockParams');
            }
            if (this.useDepths) {
                params.push('depths');
            }
            var source = this.mergeSource(varDeclarations);
            if (asObject) {
                params.push(source);
                return Function.apply(this, params);
            } else {
                return this.source.wrap([
                    'function(',
                    params.join(','),
                    ') {\n  ',
                    source,
                    '}'
                ]);
            }
        },
        mergeSource: function mergeSource(varDeclarations) {
            var isSimple = this.environment.isSimple, appendOnly = !this.forceBuffer, appendFirst = undefined, sourceSeen = undefined, bufferStart = undefined, bufferEnd = undefined;
            this.source.each(function(line) {
                if (line.appendToBuffer) {
                    if (bufferStart) {
                        line.prepend('  + ');
                    } else {
                        bufferStart = line;
                    }
                    bufferEnd = line;
                } else {
                    if (bufferStart) {
                        if (!sourceSeen) {
                            appendFirst = true;
                        } else {
                            bufferStart.prepend('buffer += ');
                        }
                        bufferEnd.add(';');
                        bufferStart = bufferEnd = undefined;
                    }
                    sourceSeen = true;
                    if (!isSimple) {
                        appendOnly = false;
                    }
                }
            });
            if (appendOnly) {
                if (bufferStart) {
                    bufferStart.prepend('return ');
                    bufferEnd.add(';');
                } else if (!sourceSeen) {
                    this.source.push('return "";');
                }
            } else {
                varDeclarations += ', buffer = ' + (appendFirst ? '' : this.initializeBuffer());
                if (bufferStart) {
                    bufferStart.prepend('return buffer + ');
                    bufferEnd.add(';');
                } else {
                    this.source.push('return buffer;');
                }
            }
            if (varDeclarations) {
                this.source.prepend('var ' + varDeclarations.substring(2) + (appendFirst ? '' : ';\n'));
            }
            return this.source.merge();
        },
        lookupPropertyFunctionVarDeclaration: function lookupPropertyFunctionVarDeclaration() {
            return '\n      lookupProperty = container.lookupProperty || function(parent, propertyName) {\n        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {\n          return parent[propertyName];\n        }\n        return undefined\n    }\n    '.trim();
        },
        blockValue: function blockValue(name) {
            var blockHelperMissing = this.aliasable('container.hooks.blockHelperMissing'), params = [
                this.contextName(0)
            ];
            this.setupHelperArgs(name, 0, params);
            var blockName = this.popStack();
            params.splice(1, 0, blockName);
            this.push(this.source.functionCall(blockHelperMissing, 'call', params));
        },
        ambiguousBlockValue: function ambiguousBlockValue() {
            var blockHelperMissing = this.aliasable('container.hooks.blockHelperMissing'), params = [
                this.contextName(0)
            ];
            this.setupHelperArgs('', 0, params, true);
            this.flushInline();
            var current = this.topStack();
            params.splice(1, 0, current);
            this.pushSource([
                'if (!',
                this.lastHelper,
                ') { ',
                current,
                ' = ',
                this.source.functionCall(blockHelperMissing, 'call', params),
                '}'
            ]);
        },
        appendContent: function appendContent(content) {
            if (this.pendingContent) {
                content = this.pendingContent + content;
            } else {
                this.pendingLocation = this.source.currentLocation;
            }
            this.pendingContent = content;
        },
        append: function append() {
            if (this.isInline()) {
                this.replaceStack(function(current) {
                    return [
                        ' != null ? ',
                        current,
                        ' : ""'
                    ];
                });
                this.pushSource(this.appendToBuffer(this.popStack()));
            } else {
                var local = this.popStack();
                this.pushSource([
                    'if (',
                    local,
                    ' != null) { ',
                    this.appendToBuffer(local, undefined, true),
                    ' }'
                ]);
                if (this.environment.isSimple) {
                    this.pushSource([
                        'else { ',
                        this.appendToBuffer("''", undefined, true),
                        ' }'
                    ]);
                }
            }
        },
        appendEscaped: function appendEscaped() {
            this.pushSource(this.appendToBuffer([
                this.aliasable('container.escapeExpression'),
                '(',
                this.popStack(),
                ')'
            ]));
        },
        getContext: function getContext(depth) {
            this.lastContext = depth;
        },
        pushContext: function pushContext() {
            this.pushStackLiteral(this.contextName(this.lastContext));
        },
        lookupOnContext: function lookupOnContext(parts, falsy, strict, scoped) {
            var i = 0;
            if (!scoped && this.options.compat && !this.lastContext) {
                this.push(this.depthedLookup(parts[i++]));
            } else {
                this.pushContext();
            }
            this.resolvePath('context', parts, i, falsy, strict);
        },
        lookupBlockParam: function lookupBlockParam(blockParamId, parts) {
            this.useBlockParams = true;
            this.push([
                'blockParams[',
                blockParamId[0],
                '][',
                blockParamId[1],
                ']'
            ]);
            this.resolvePath('context', parts, 1);
        },
        lookupData: function lookupData(depth, parts, strict) {
            if (!depth) {
                this.pushStackLiteral('data');
            } else {
                this.pushStackLiteral('container.data(data, ' + depth + ')');
            }
            this.resolvePath('data', parts, 0, true, strict);
        },
        resolvePath: function resolvePath(type, parts, i, falsy, strict) {
            var _this2 = this;
            if (this.options.strict || this.options.assumeObjects) {
                this.push(strictLookup(this.options.strict && strict, this, parts, type));
                return;
            }
            var len = parts.length;
            for(; i < len; i++){
                this.replaceStack(function(current) {
                    var lookup = _this2.nameLookup(current, parts[i], type);
                    if (!falsy) {
                        return [
                            ' != null ? ',
                            lookup,
                            ' : ',
                            current
                        ];
                    } else {
                        return [
                            ' && ',
                            lookup
                        ];
                    }
                });
            }
        },
        resolvePossibleLambda: function resolvePossibleLambda() {
            this.push([
                this.aliasable('container.lambda'),
                '(',
                this.popStack(),
                ', ',
                this.contextName(0),
                ')'
            ]);
        },
        pushStringParam: function pushStringParam(string, type) {
            this.pushContext();
            this.pushString(type);
            if (type !== 'SubExpression') {
                if (typeof string === 'string') {
                    this.pushString(string);
                } else {
                    this.pushStackLiteral(string);
                }
            }
        },
        emptyHash: function emptyHash(omitEmpty) {
            if (this.trackIds) {
                this.push('{}');
            }
            if (this.stringParams) {
                this.push('{}');
                this.push('{}');
            }
            this.pushStackLiteral(omitEmpty ? 'undefined' : '{}');
        },
        pushHash: function pushHash() {
            if (this.hash) {
                this.hashes.push(this.hash);
            }
            this.hash = {
                values: {
                },
                types: [],
                contexts: [],
                ids: []
            };
        },
        popHash: function popHash() {
            var hash = this.hash;
            this.hash = this.hashes.pop();
            if (this.trackIds) {
                this.push(this.objectLiteral(hash.ids));
            }
            if (this.stringParams) {
                this.push(this.objectLiteral(hash.contexts));
                this.push(this.objectLiteral(hash.types));
            }
            this.push(this.objectLiteral(hash.values));
        },
        pushString: function pushString(string) {
            this.pushStackLiteral(this.quotedString(string));
        },
        pushLiteral: function pushLiteral(value) {
            this.pushStackLiteral(value);
        },
        pushProgram: function pushProgram(guid) {
            if (guid != null) {
                this.pushStackLiteral(this.programExpression(guid));
            } else {
                this.pushStackLiteral(null);
            }
        },
        registerDecorator: function registerDecorator(paramSize, name) {
            var foundDecorator = this.nameLookup('decorators', name, 'decorator'), options = this.setupHelperArgs(name, paramSize);
            this.decorators.push([
                'fn = ',
                this.decorators.functionCall(foundDecorator, '', [
                    'fn',
                    'props',
                    'container',
                    options
                ]),
                ' || fn;'
            ]);
        },
        invokeHelper: function invokeHelper(paramSize, name, isSimple) {
            var nonHelper = this.popStack(), helper = this.setupHelper(paramSize, name);
            var possibleFunctionCalls = [];
            if (isSimple) {
                possibleFunctionCalls.push(helper.name);
            }
            possibleFunctionCalls.push(nonHelper);
            if (!this.options.strict) {
                possibleFunctionCalls.push(this.aliasable('container.hooks.helperMissing'));
            }
            var functionLookupCode = [
                '(',
                this.itemsSeparatedBy(possibleFunctionCalls, '||'),
                ')'
            ];
            var functionCall = this.source.functionCall(functionLookupCode, 'call', helper.callParams);
            this.push(functionCall);
        },
        itemsSeparatedBy: function itemsSeparatedBy(items, separator) {
            var result = [];
            result.push(items[0]);
            for(var i = 1; i < items.length; i++){
                result.push(separator, items[i]);
            }
            return result;
        },
        invokeKnownHelper: function invokeKnownHelper(paramSize, name) {
            var helper = this.setupHelper(paramSize, name);
            this.push(this.source.functionCall(helper.name, 'call', helper.callParams));
        },
        invokeAmbiguous: function invokeAmbiguous(name, helperCall) {
            this.useRegister('helper');
            var nonHelper = this.popStack();
            this.emptyHash();
            var helper = this.setupHelper(0, name, helperCall);
            var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');
            var lookup = [
                '(',
                '(helper = ',
                helperName,
                ' || ',
                nonHelper,
                ')'
            ];
            if (!this.options.strict) {
                lookup[0] = '(helper = ';
                lookup.push(' != null ? helper : ', this.aliasable('container.hooks.helperMissing'));
            }
            this.push([
                '(',
                lookup,
                helper.paramsInit ? [
                    '),(',
                    helper.paramsInit
                ] : [],
                '),',
                '(typeof helper === ',
                this.aliasable('"function"'),
                ' ? ',
                this.source.functionCall('helper', 'call', helper.callParams),
                ' : helper))'
            ]);
        },
        invokePartial: function invokePartial(isDynamic, name, indent) {
            var params = [], options = this.setupParams(name, 1, params);
            if (isDynamic) {
                name = this.popStack();
                delete options.name;
            }
            if (indent) {
                options.indent = JSON.stringify(indent);
            }
            options.helpers = 'helpers';
            options.partials = 'partials';
            options.decorators = 'container.decorators';
            if (!isDynamic) {
                params.unshift(this.nameLookup('partials', name, 'partial'));
            } else {
                params.unshift(name);
            }
            if (this.options.compat) {
                options.depths = 'depths';
            }
            options = this.objectLiteral(options);
            params.push(options);
            this.push(this.source.functionCall('container.invokePartial', '', params));
        },
        assignToHash: function assignToHash(key) {
            var value = this.popStack(), context = undefined, type = undefined, id = undefined;
            if (this.trackIds) {
                id = this.popStack();
            }
            if (this.stringParams) {
                type = this.popStack();
                context = this.popStack();
            }
            var hash = this.hash;
            if (context) {
                hash.contexts[key] = context;
            }
            if (type) {
                hash.types[key] = type;
            }
            if (id) {
                hash.ids[key] = id;
            }
            hash.values[key] = value;
        },
        pushId: function pushId(type, name, child) {
            if (type === 'BlockParam') {
                this.pushStackLiteral('blockParams[' + name[0] + '].path[' + name[1] + ']' + (child ? ' + ' + JSON.stringify('.' + child) : ''));
            } else if (type === 'PathExpression') {
                this.pushString(name);
            } else if (type === 'SubExpression') {
                this.pushStackLiteral('true');
            } else {
                this.pushStackLiteral('null');
            }
        },
        compiler: JavaScriptCompiler,
        compileChildren: function compileChildren(environment, options) {
            var children = environment.children, child = undefined, compiler = undefined;
            for(var i = 0, l = children.length; i < l; i++){
                child = children[i];
                compiler = new this.compiler();
                var existing = this.matchExistingProgram(child);
                if (existing == null) {
                    this.context.programs.push('');
                    var index = this.context.programs.length;
                    child.index = index;
                    child.name = 'program' + index;
                    this.context.programs[index] = compiler.compile(child, options, this.context, !this.precompile);
                    this.context.decorators[index] = compiler.decorators;
                    this.context.environments[index] = child;
                    this.useDepths = this.useDepths || compiler.useDepths;
                    this.useBlockParams = this.useBlockParams || compiler.useBlockParams;
                    child.useDepths = this.useDepths;
                    child.useBlockParams = this.useBlockParams;
                } else {
                    child.index = existing.index;
                    child.name = 'program' + existing.index;
                    this.useDepths = this.useDepths || existing.useDepths;
                    this.useBlockParams = this.useBlockParams || existing.useBlockParams;
                }
            }
        },
        matchExistingProgram: function matchExistingProgram(child) {
            for(var i = 0, len = this.context.environments.length; i < len; i++){
                var environment = this.context.environments[i];
                if (environment && environment.equals(child)) {
                    return environment;
                }
            }
        },
        programExpression: function programExpression(guid) {
            var child = this.environment.children[guid], programParams = [
                child.index,
                'data',
                child.blockParams
            ];
            if (this.useBlockParams || this.useDepths) {
                programParams.push('blockParams');
            }
            if (this.useDepths) {
                programParams.push('depths');
            }
            return 'container.program(' + programParams.join(', ') + ')';
        },
        useRegister: function useRegister(name) {
            if (!this.registers[name]) {
                this.registers[name] = true;
                this.registers.list.push(name);
            }
        },
        push: function push(expr) {
            if (!(expr instanceof Literal)) {
                expr = this.source.wrap(expr);
            }
            this.inlineStack.push(expr);
            return expr;
        },
        pushStackLiteral: function pushStackLiteral(item) {
            this.push(new Literal(item));
        },
        pushSource: function pushSource(source) {
            if (this.pendingContent) {
                this.source.push(this.appendToBuffer(this.source.quotedString(this.pendingContent), this.pendingLocation));
                this.pendingContent = undefined;
            }
            if (source) {
                this.source.push(source);
            }
        },
        replaceStack: function replaceStack(callback) {
            var prefix = [
                '('
            ], stack = undefined, createdStack = undefined, usedLiteral = undefined;
            if (!this.isInline()) {
                throw new _exception2['default']('replaceStack on non-inline');
            }
            var top = this.popStack(true);
            if (top instanceof Literal) {
                stack = [
                    top.value
                ];
                prefix = [
                    '(',
                    stack
                ];
                usedLiteral = true;
            } else {
                createdStack = true;
                var _name = this.incrStack();
                prefix = [
                    '((',
                    this.push(_name),
                    ' = ',
                    top,
                    ')'
                ];
                stack = this.topStack();
            }
            var item = callback.call(this, stack);
            if (!usedLiteral) {
                this.popStack();
            }
            if (createdStack) {
                this.stackSlot--;
            }
            this.push(prefix.concat(item, ')'));
        },
        incrStack: function incrStack() {
            this.stackSlot++;
            if (this.stackSlot > this.stackVars.length) {
                this.stackVars.push('stack' + this.stackSlot);
            }
            return this.topStackName();
        },
        topStackName: function topStackName() {
            return 'stack' + this.stackSlot;
        },
        flushInline: function flushInline() {
            var inlineStack = this.inlineStack;
            this.inlineStack = [];
            for(var i = 0, len = inlineStack.length; i < len; i++){
                var entry = inlineStack[i];
                if (entry instanceof Literal) {
                    this.compileStack.push(entry);
                } else {
                    var stack = this.incrStack();
                    this.pushSource([
                        stack,
                        ' = ',
                        entry,
                        ';'
                    ]);
                    this.compileStack.push(stack);
                }
            }
        },
        isInline: function isInline() {
            return this.inlineStack.length;
        },
        popStack: function popStack(wrapped) {
            var inline = this.isInline(), item = (inline ? this.inlineStack : this.compileStack).pop();
            if (!wrapped && item instanceof Literal) {
                return item.value;
            } else {
                if (!inline) {
                    if (!this.stackSlot) {
                        throw new _exception2['default']('Invalid stack pop');
                    }
                    this.stackSlot--;
                }
                return item;
            }
        },
        topStack: function topStack() {
            var stack = this.isInline() ? this.inlineStack : this.compileStack, item = stack[stack.length - 1];
            if (item instanceof Literal) {
                return item.value;
            } else {
                return item;
            }
        },
        contextName: function contextName(context) {
            if (this.useDepths && context) {
                return 'depths[' + context + ']';
            } else {
                return 'depth' + context;
            }
        },
        quotedString: function quotedString(str) {
            return this.source.quotedString(str);
        },
        objectLiteral: function objectLiteral(obj) {
            return this.source.objectLiteral(obj);
        },
        aliasable: function aliasable(name) {
            var ret = this.aliases[name];
            if (ret) {
                ret.referenceCount++;
                return ret;
            }
            ret = this.aliases[name] = this.source.wrap(name);
            ret.aliasable = true;
            ret.referenceCount = 1;
            return ret;
        },
        setupHelper: function setupHelper(paramSize, name, blockHelper) {
            var params = [], paramsInit = this.setupHelperArgs(name, paramSize, params, blockHelper);
            var foundHelper = this.nameLookup('helpers', name, 'helper'), callContext = this.aliasable(this.contextName(0) + ' != null ? ' + this.contextName(0) + ' : (container.nullContext || {})');
            return {
                params: params,
                paramsInit: paramsInit,
                name: foundHelper,
                callParams: [
                    callContext
                ].concat(params)
            };
        },
        setupParams: function setupParams(helper, paramSize, params) {
            var options = {
            }, contexts = [], types = [], ids = [], objectArgs = !params, param = undefined;
            if (objectArgs) {
                params = [];
            }
            options.name = this.quotedString(helper);
            options.hash = this.popStack();
            if (this.trackIds) {
                options.hashIds = this.popStack();
            }
            if (this.stringParams) {
                options.hashTypes = this.popStack();
                options.hashContexts = this.popStack();
            }
            var inverse = this.popStack(), program = this.popStack();
            if (program || inverse) {
                options.fn = program || 'container.noop';
                options.inverse = inverse || 'container.noop';
            }
            var i = paramSize;
            while(i--){
                param = this.popStack();
                params[i] = param;
                if (this.trackIds) {
                    ids[i] = this.popStack();
                }
                if (this.stringParams) {
                    types[i] = this.popStack();
                    contexts[i] = this.popStack();
                }
            }
            if (objectArgs) {
                options.args = this.source.generateArray(params);
            }
            if (this.trackIds) {
                options.ids = this.source.generateArray(ids);
            }
            if (this.stringParams) {
                options.types = this.source.generateArray(types);
                options.contexts = this.source.generateArray(contexts);
            }
            if (this.options.data) {
                options.data = 'data';
            }
            if (this.useBlockParams) {
                options.blockParams = 'blockParams';
            }
            return options;
        },
        setupHelperArgs: function setupHelperArgs(helper, paramSize, params, useRegister1) {
            var options = this.setupParams(helper, paramSize, params);
            options.loc = JSON.stringify(this.source.currentLocation);
            options = this.objectLiteral(options);
            if (useRegister1) {
                this.useRegister('options');
                params.push('options');
                return [
                    'options=',
                    options
                ];
            } else if (params) {
                params.push(options);
                return '';
            } else {
                return options;
            }
        }
    };
    (function() {
        var reservedWords = ('break else new var' + ' case finally return void' + ' catch for switch while' + ' continue function this with' + ' default if throw' + ' delete in try' + ' do instanceof typeof' + ' abstract enum int short' + ' boolean export interface static' + ' byte extends long super' + ' char final native synchronized' + ' class float package throws' + ' const goto private transient' + ' debugger implements protected volatile' + ' double import public let yield await' + ' null true false').split(' ');
        var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {
        };
        for(var i = 0, l = reservedWords.length; i < l; i++){
            compilerWords[reservedWords[i]] = true;
        }
    })();
    JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
        return !JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name);
    };
    function strictLookup(requireTerminal, compiler, parts, type) {
        var stack = compiler.popStack(), i = 0, len = parts.length;
        if (requireTerminal) {
            len--;
        }
        for(; i < len; i++){
            stack = compiler.nameLookup(stack, parts[i], type);
        }
        if (requireTerminal) {
            return [
                compiler.aliasable('container.strict'),
                '(',
                stack,
                ', ',
                compiler.quotedString(parts[i]),
                ', ',
                JSON.stringify(compiler.source.currentLocation),
                ' )'
            ];
        } else {
            return stack;
        }
    }
    exports40['default'] = JavaScriptCompiler;
    exports40 = exports40['default'];
    return exports40;
}
var exports41 = {
}, _dewExec41 = false;
function dew41() {
    if (_dewExec41) return exports41;
    _dewExec41 = true;
    exports41.__esModule = true;
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            'default': obj
        };
    }
    var _handlebarsRuntime = dew20();
    var _handlebarsRuntime2 = _interopRequireDefault(_handlebarsRuntime);
    var _handlebarsCompilerAst = dew21();
    var _handlebarsCompilerAst2 = _interopRequireDefault(_handlebarsCompilerAst);
    var _handlebarsCompilerBase = dew26();
    var _handlebarsCompilerCompiler = dew27();
    var _handlebarsCompilerJavascriptCompiler = dew40();
    var _handlebarsCompilerJavascriptCompiler2 = _interopRequireDefault(_handlebarsCompilerJavascriptCompiler);
    var _handlebarsCompilerVisitor = dew23();
    var _handlebarsCompilerVisitor2 = _interopRequireDefault(_handlebarsCompilerVisitor);
    var _handlebarsNoConflict = dew19();
    var _handlebarsNoConflict2 = _interopRequireDefault(_handlebarsNoConflict);
    var _create = _handlebarsRuntime2['default'].create;
    function create() {
        var hb = _create();
        hb.compile = function(input, options) {
            return _handlebarsCompilerCompiler.compile(input, options, hb);
        };
        hb.precompile = function(input, options) {
            return _handlebarsCompilerCompiler.precompile(input, options, hb);
        };
        hb.AST = _handlebarsCompilerAst2['default'];
        hb.Compiler = _handlebarsCompilerCompiler.Compiler;
        hb.JavaScriptCompiler = _handlebarsCompilerJavascriptCompiler2['default'];
        hb.Parser = _handlebarsCompilerBase.parser;
        hb.parse = _handlebarsCompilerBase.parse;
        hb.parseWithoutProcessing = _handlebarsCompilerBase.parseWithoutProcessing;
        return hb;
    }
    var inst = create();
    inst.create = create;
    _handlebarsNoConflict2['default'](inst);
    inst.Visitor = _handlebarsCompilerVisitor2['default'];
    inst['default'] = inst;
    exports41['default'] = inst;
    exports41 = exports41['default'];
    return exports41;
}
var exports42 = {
}, _dewExec42 = false;
function dew42() {
    if (_dewExec42) return exports42;
    _dewExec42 = true;
    exports42.__esModule = true;
    exports42.print = print;
    exports42.PrintVisitor = PrintVisitor;
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            'default': obj
        };
    }
    var _visitor = dew23();
    var _visitor2 = _interopRequireDefault(_visitor);
    function print(ast) {
        return new PrintVisitor().accept(ast);
    }
    function PrintVisitor() {
        this.padding = 0;
    }
    PrintVisitor.prototype = new _visitor2['default']();
    PrintVisitor.prototype.pad = function(string) {
        var out = '';
        for(var i = 0, l = this.padding; i < l; i++){
            out += '  ';
        }
        out += string + '\n';
        return out;
    };
    PrintVisitor.prototype.Program = function(program) {
        var out = '', body = program.body, i = undefined, l = undefined;
        if (program.blockParams) {
            var blockParams = 'BLOCK PARAMS: [';
            for(i = 0, l = program.blockParams.length; i < l; i++){
                blockParams += ' ' + program.blockParams[i];
            }
            blockParams += ' ]';
            out += this.pad(blockParams);
        }
        for(i = 0, l = body.length; i < l; i++){
            out += this.accept(body[i]);
        }
        this.padding--;
        return out;
    };
    PrintVisitor.prototype.MustacheStatement = function(mustache) {
        return this.pad('{{ ' + this.SubExpression(mustache) + ' }}');
    };
    PrintVisitor.prototype.Decorator = function(mustache) {
        return this.pad('{{ DIRECTIVE ' + this.SubExpression(mustache) + ' }}');
    };
    PrintVisitor.prototype.BlockStatement = PrintVisitor.prototype.DecoratorBlock = function(block) {
        var out = '';
        out += this.pad((block.type === 'DecoratorBlock' ? 'DIRECTIVE ' : '') + 'BLOCK:');
        this.padding++;
        out += this.pad(this.SubExpression(block));
        if (block.program) {
            out += this.pad('PROGRAM:');
            this.padding++;
            out += this.accept(block.program);
            this.padding--;
        }
        if (block.inverse) {
            if (block.program) {
                this.padding++;
            }
            out += this.pad('{{^}}');
            this.padding++;
            out += this.accept(block.inverse);
            this.padding--;
            if (block.program) {
                this.padding--;
            }
        }
        this.padding--;
        return out;
    };
    PrintVisitor.prototype.PartialStatement = function(partial) {
        var content = 'PARTIAL:' + partial.name.original;
        if (partial.params[0]) {
            content += ' ' + this.accept(partial.params[0]);
        }
        if (partial.hash) {
            content += ' ' + this.accept(partial.hash);
        }
        return this.pad('{{> ' + content + ' }}');
    };
    PrintVisitor.prototype.PartialBlockStatement = function(partial) {
        var content = 'PARTIAL BLOCK:' + partial.name.original;
        if (partial.params[0]) {
            content += ' ' + this.accept(partial.params[0]);
        }
        if (partial.hash) {
            content += ' ' + this.accept(partial.hash);
        }
        content += ' ' + this.pad('PROGRAM:');
        this.padding++;
        content += this.accept(partial.program);
        this.padding--;
        return this.pad('{{> ' + content + ' }}');
    };
    PrintVisitor.prototype.ContentStatement = function(content) {
        return this.pad("CONTENT[ '" + content.value + "' ]");
    };
    PrintVisitor.prototype.CommentStatement = function(comment) {
        return this.pad("{{! '" + comment.value + "' }}");
    };
    PrintVisitor.prototype.SubExpression = function(sexpr) {
        var params = sexpr.params, paramStrings = [], hash = undefined;
        for(var i = 0, l = params.length; i < l; i++){
            paramStrings.push(this.accept(params[i]));
        }
        params = '[' + paramStrings.join(', ') + ']';
        hash = sexpr.hash ? ' ' + this.accept(sexpr.hash) : '';
        return this.accept(sexpr.path) + ' ' + params + hash;
    };
    PrintVisitor.prototype.PathExpression = function(id) {
        var path = id.parts.join('/');
        return (id.data ? '@' : '') + 'PATH:' + path;
    };
    PrintVisitor.prototype.StringLiteral = function(string) {
        return '"' + string.value + '"';
    };
    PrintVisitor.prototype.NumberLiteral = function(number) {
        return 'NUMBER{' + number.value + '}';
    };
    PrintVisitor.prototype.BooleanLiteral = function(bool) {
        return 'BOOLEAN{' + bool.value + '}';
    };
    PrintVisitor.prototype.UndefinedLiteral = function() {
        return 'UNDEFINED';
    };
    PrintVisitor.prototype.NullLiteral = function() {
        return 'NULL';
    };
    PrintVisitor.prototype.Hash = function(hash) {
        var pairs = hash.pairs, joinedPairs = [];
        for(var i = 0, l = pairs.length; i < l; i++){
            joinedPairs.push(this.accept(pairs[i]));
        }
        return 'HASH{' + joinedPairs.join(', ') + '}';
    };
    PrintVisitor.prototype.HashPair = function(pair) {
        return pair.key + '=' + this.accept(pair.value);
    };
    return exports42;
}
function unimplemented() {
    throw new Error("Node.js fs module is not supported by jspm core" + ("undefined" != typeof Deno ? ". Deno support here is tracking in https://github.com/jspm/jspm-core/issues/4, +1's are appreciated!" : " in the browser"));
}
var promises = {
    access: unimplemented,
    copyFile: unimplemented,
    open: unimplemented,
    opendir: unimplemented,
    rename: unimplemented,
    truncate: unimplemented,
    rmdir: unimplemented,
    mkdir: unimplemented,
    readdir: unimplemented,
    readlink: unimplemented,
    symlink: unimplemented,
    lstat: unimplemented,
    stat: unimplemented,
    link: unimplemented,
    unlink: unimplemented,
    chmod: unimplemented,
    lchmod: unimplemented,
    lchown: unimplemented,
    chown: unimplemented,
    utimes: unimplemented,
    realpath: unimplemented,
    mkdtemp: unimplemented,
    writeFile: unimplemented,
    appendFile: unimplemented,
    readFile: unimplemented
};
var fs = {
    appendFile: unimplemented,
    appendFileSync: unimplemented,
    access: unimplemented,
    accessSync: unimplemented,
    chown: unimplemented,
    chownSync: unimplemented,
    chmod: unimplemented,
    chmodSync: unimplemented,
    close: unimplemented,
    closeSync: unimplemented,
    copyFile: unimplemented,
    copyFileSync: unimplemented,
    createReadStream: unimplemented,
    createWriteStream: unimplemented,
    exists: unimplemented,
    existsSync: unimplemented,
    fchown: unimplemented,
    fchownSync: unimplemented,
    fchmod: unimplemented,
    fchmodSync: unimplemented,
    fdatasync: unimplemented,
    fdatasyncSync: unimplemented,
    fstat: unimplemented,
    fstatSync: unimplemented,
    fsync: unimplemented,
    fsyncSync: unimplemented,
    ftruncate: unimplemented,
    ftruncateSync: unimplemented,
    futimes: unimplemented,
    futimesSync: unimplemented,
    lchown: unimplemented,
    lchownSync: unimplemented,
    lchmod: unimplemented,
    lchmodSync: unimplemented,
    link: unimplemented,
    linkSync: unimplemented,
    lstat: unimplemented,
    lstatSync: unimplemented,
    mkdir: unimplemented,
    mkdirSync: unimplemented,
    mkdtemp: unimplemented,
    mkdtempSync: unimplemented,
    open: unimplemented,
    openSync: unimplemented,
    opendir: unimplemented,
    opendirSync: unimplemented,
    readdir: unimplemented,
    readdirSync: unimplemented,
    read: unimplemented,
    readSync: unimplemented,
    readFile: unimplemented,
    readFileSync: unimplemented,
    readlink: unimplemented,
    readlinkSync: unimplemented,
    realpath: unimplemented,
    realpathSync: unimplemented,
    rename: unimplemented,
    renameSync: unimplemented,
    rmdir: unimplemented,
    rmdirSync: unimplemented,
    stat: unimplemented,
    statSync: unimplemented,
    symlink: unimplemented,
    symlinkSync: unimplemented,
    truncate: unimplemented,
    truncateSync: unimplemented,
    unwatchFile: unimplemented,
    unlink: unimplemented,
    unlinkSync: unimplemented,
    utimes: unimplemented,
    utimesSync: unimplemented,
    watch: unimplemented,
    watchFile: unimplemented,
    writeFile: unimplemented,
    writeFileSync: unimplemented,
    write: unimplemented,
    writeSync: unimplemented,
    writev: unimplemented,
    writevSync: unimplemented,
    Dir: unimplemented,
    Dirent: unimplemented,
    Stats: unimplemented,
    ReadStream: unimplemented,
    WriteStream: unimplemented,
    FileReadStream: unimplemented,
    FileWriteStream: unimplemented,
    _toUnixTimestamp: unimplemented,
    F_OK: null,
    R_OK: null,
    W_OK: null,
    X_OK: null,
    constants: null,
    promises: promises
};
var exports43 = {
}, _dewExec43 = false;
function dew43() {
    if (_dewExec43) return exports43;
    _dewExec43 = true;
    var handlebars = dew41()['default'];
    var printer = dew42();
    handlebars.PrintVisitor = printer.PrintVisitor;
    handlebars.print = printer.print;
    exports43 = handlebars;
    function extension(module, filename) {
        var fs1 = fs;
        var templateString = fs1.readFileSync(filename, 'utf8');
        module.exports = handlebars.compile(templateString);
    }
    if ({
    }) {
        ({
        })['.handlebars'] = extension;
        ({
        })['.hbs'] = extension;
    }
    return exports43;
}
const __default = dew43();
const __default1 = "2.0.0-beta.1";
const osType = (()=>{
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
function normalizeString(path, allowAboveRoot, separator, isPathSeparator1) {
    let res = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let code;
    for(let i = 0, len = path.length; i <= len; ++i){
        if (i < len) code = path.charCodeAt(i);
        else if (isPathSeparator1(code)) break;
        else code = CHAR_FORWARD_SLASH;
        if (isPathSeparator1(code)) {
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
                        if ((--extIdx) === -1) {
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
function parse(path) {
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
const mod = function() {
    return {
        sep: sep,
        delimiter: delimiter,
        resolve: resolve3,
        normalize: normalize,
        isAbsolute: isAbsolute,
        join: join,
        relative: relative,
        toNamespacedPath: toNamespacedPath,
        dirname: dirname,
        basename: basename,
        extname: extname,
        format: format,
        parse: parse,
        fromFileUrl: fromFileUrl,
        toFileUrl: toFileUrl
    };
}();
const sep1 = "/";
const delimiter1 = ":";
function resolve1(...pathSegments) {
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
    const isAbsolute1 = path.charCodeAt(0) === 47;
    const trailingSeparator = path.charCodeAt(path.length - 1) === 47;
    path = normalizeString(path, !isAbsolute1, "/", isPosixPathSeparator);
    if (path.length === 0 && !isAbsolute1) path = ".";
    if (path.length > 0 && trailingSeparator) path += "/";
    if (isAbsolute1) return `/${path}`;
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
                        if ((--extIdx) === -1) {
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
function parse1(path) {
    assertPath(path);
    const ret = {
        root: "",
        dir: "",
        base: "",
        ext: "",
        name: ""
    };
    if (path.length === 0) return ret;
    const isAbsolute2 = path.charCodeAt(0) === 47;
    let start;
    if (isAbsolute2) {
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
            if (startPart === 0 && isAbsolute2) {
                ret.base = ret.name = path.slice(1, end);
            } else {
                ret.base = ret.name = path.slice(startPart, end);
            }
        }
    } else {
        if (startPart === 0 && isAbsolute2) {
            ret.name = path.slice(1, startDot);
            ret.base = path.slice(1, end);
        } else {
            ret.name = path.slice(startPart, startDot);
            ret.base = path.slice(startPart, end);
        }
        ret.ext = path.slice(startDot, end);
    }
    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);
    else if (isAbsolute2) ret.dir = "/";
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
const mod1 = function() {
    return {
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
        parse: parse1,
        fromFileUrl: fromFileUrl1,
        toFileUrl: toFileUrl1
    };
}();
const path1 = isWindows ? mod : mod1;
const { basename: basename2 , delimiter: delimiter2 , dirname: dirname2 , extname: extname2 , format: format2 , fromFileUrl: fromFileUrl2 , isAbsolute: isAbsolute2 , join: join2 , normalize: normalize2 , parse: parse2 , relative: relative2 , resolve: resolve2 , sep: sep2 , toFileUrl: toFileUrl2 , toNamespacedPath: toNamespacedPath2 ,  } = path1;
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
var EOL;
(function(EOL1) {
    EOL1["LF"] = "\n";
    EOL1["CRLF"] = "\r\n";
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
const mod2 = function() {
    return {
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
}();
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
    const tty1 = function(...args) {
        if (this) {
            update(args);
            stdout.writeSync(new TextEncoder().encode(result));
            return this;
        }
        return factory(args[0] ?? options);
    };
    tty1.text = function(text) {
        stack.push([
            text,
            []
        ]);
        update();
        stdout.writeSync(new TextEncoder().encode(result));
        return this;
    };
    tty1.getCursorPosition = ()=>getCursorPosition({
            stdout,
            stdin
        })
    ;
    const methodList = Object.entries(mod2);
    for (const [name, method] of methodList){
        if (name === "cursorPosition") {
            continue;
        }
        Object.defineProperty(tty1, name, {
            get () {
                stack.push([
                    method,
                    []
                ]);
                return this;
            }
        });
    }
    return tty1;
    function update(args) {
        if (!stack.length) {
            return;
        }
        if (args) {
            stack[stack.length - 1][1] = args;
        }
        result = stack.reduce((prev, [cur, args1])=>prev + (typeof cur === "string" ? cur : cur.call(tty1, ...args1))
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
function parse3(data) {
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
const noColor = globalThis.Deno?.noColor ?? true;
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
function run1(str, code1) {
    return enabled ? `${code1.open}${str.replace(code1.regexp, code1.open)}${code1.close}` : str;
}
function bold(str) {
    return run1(str, code([
        1
    ], 22));
}
function dim(str) {
    return run1(str, code([
        2
    ], 22));
}
function italic(str) {
    return run1(str, code([
        3
    ], 23));
}
function underline(str) {
    return run1(str, code([
        4
    ], 24));
}
function red(str) {
    return run1(str, code([
        31
    ], 39));
}
function green(str) {
    return run1(str, code([
        32
    ], 39));
}
function yellow(str) {
    return run1(str, code([
        33
    ], 39));
}
function blue(str) {
    return run1(str, code([
        34
    ], 39));
}
function magenta(str) {
    return run1(str, code([
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
        return `${this.settings.indent}${yellow("?")} ` + bold(this.settings.message) + this.defaults();
    }
    defaults() {
        let defaultMessage = "";
        if (typeof this.settings.default !== "undefined") {
            defaultMessage += dim(` (${this.format(this.settings.default)})`);
        }
        return defaultMessage;
    }
    success(value) {
        return `${this.settings.indent}${yellow("?")} ` + bold(this.settings.message) + this.defaults() + " " + this.settings.pointer + " " + green(this.format(value));
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
                Deno.exit(0);
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
    constructor(settings1){
        super({
            ...settings1,
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
                ...settings1.keys ?? {
                }
            }
        });
    }
    getCurrentInputValue() {
        return this.inputValue;
    }
    message() {
        const message1 = super.message() + " " + this.settings.pointer + " ";
        this.cursor.x = stripColor(message1).length + this.inputIndex + 1;
        return message1 + this.input();
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
                Deno.exit(0);
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
        for(let j1 = 1; j1 <= a.length; j1++){
            if (b.charAt(i1 - 1) == a.charAt(j1 - 1)) {
                matrix[i1][j1] = matrix[i1 - 1][j1 - 1];
            } else {
                matrix[i1][j1] = Math.min(matrix[i1 - 1][j1 - 1] + 1, Math.min(matrix[i1][j1 - 1] + 1, matrix[i1 - 1][j1] + 1));
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
    constructor(settings2){
        super({
            ...settings2,
            keys: {
                previous: settings2.search ? [
                    "up"
                ] : [
                    "up",
                    "u",
                    "8"
                ],
                next: settings2.search ? [
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
                ...settings2.keys ?? {
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
        let message1 = `${this.settings.indent}${yellow("?")} ` + bold(this.settings.message) + this.defaults();
        if (this.settings.search) {
            message1 += " " + this.settings.searchLabel + " ";
        }
        this.cursor.x = stripColor(message1).length + this.inputIndex + 1;
        return message1 + this.input();
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
    constructor(settings3){
        super({
            ...settings3,
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
                ...settings3.keys ?? {
                }
            }
        });
        const suggestions1 = this.loadSuggestions();
        if (suggestions1.length || this.settings.suggestions) {
            this.settings.suggestions = [
                ...suggestions1,
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
            const suggestions1 = json ? JSON.parse(json) : [];
            if (!Array.isArray(suggestions1)) {
                return [];
            }
            return suggestions1;
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
    constructor(prompts, options4){
        this.prompts = prompts;
        this.options = options4;
        this.names = this.prompts.map((prompt1)=>prompt1.name
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
        const prompt1 = this.prompt.type;
        if (typeof injected[this.prompt.name] !== "undefined") {
            if (prompt1.inject) {
                prompt1.inject(injected[this.prompt.name]);
            } else {
                GenericPrompt.inject(injected[this.prompt.name]);
            }
        }
        try {
            this.result[this.prompt.name] = await prompt1.prompt({
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
                    await this.prompt.after(this.result, (name1)=>this.next(name1)
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
function didYouMeanOption(option, options1) {
    const optionNames = options1.map((option1)=>[
            option1.name,
            ...option1.aliases ?? []
        ]
    ).flat().map((option1)=>getFlag(option1)
    );
    return didYouMean(" Did you mean option", getFlag(option), optionNames);
}
function didYouMeanType(type, types) {
    return didYouMean(" Did you mean type", type, types);
}
function didYouMean(message1, type, types) {
    const match = closest(type, types);
    return match ? `${message1} "${match}"?` : "";
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
    constructor(message1){
        super(message1);
        Object.setPrototypeOf(this, FlagsError.prototype);
    }
}
class UnknownRequiredOption extends FlagsError {
    constructor(option9, options1){
        super(`Unknown required option "${getFlag(option9)}".${didYouMeanOption(option9, options1)}`);
        Object.setPrototypeOf(this, UnknownRequiredOption.prototype);
    }
}
class UnknownConflictingOption extends FlagsError {
    constructor(option1, options2){
        super(`Unknown conflicting option "${getFlag(option1)}".${didYouMeanOption(option1, options2)}`);
        Object.setPrototypeOf(this, UnknownConflictingOption.prototype);
    }
}
class UnknownType extends FlagsError {
    constructor(type2, types1){
        super(`Unknown type "${type2}".${didYouMeanType(type2, types1)}`);
        Object.setPrototypeOf(this, UnknownType.prototype);
    }
}
class ValidationError extends FlagsError {
    constructor(message2){
        super(message2);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
class DuplicateOption extends ValidationError {
    constructor(name17){
        super(`Option "${getFlag(name17).replace(/^--no-/, "--")}" can only occur once, but was found several times.`);
        Object.setPrototypeOf(this, DuplicateOption.prototype);
    }
}
class UnknownOption extends ValidationError {
    constructor(option2, options3){
        super(`Unknown option "${getFlag(option2)}".${didYouMeanOption(option2, options3)}`);
        Object.setPrototypeOf(this, UnknownOption.prototype);
    }
}
class MissingOptionValue extends ValidationError {
    constructor(option3){
        super(`Missing value for option "${getFlag(option3)}".`);
        Object.setPrototypeOf(this, MissingOptionValue.prototype);
    }
}
class InvalidOptionValue extends ValidationError {
    constructor(option4, expected, value2){
        super(`Option "${getFlag(option4)}" must be of type "${expected}", but got "${value2}".`);
        Object.setPrototypeOf(this, InvalidOptionValue.prototype);
    }
}
class OptionNotCombinable extends ValidationError {
    constructor(option5){
        super(`Option "${getFlag(option5)}" cannot be combined with other options.`);
        Object.setPrototypeOf(this, OptionNotCombinable.prototype);
    }
}
class ConflictingOption extends ValidationError {
    constructor(option6, conflictingOption){
        super(`Option "${getFlag(option6)}" conflicts with option "${getFlag(conflictingOption)}".`);
        Object.setPrototypeOf(this, ConflictingOption.prototype);
    }
}
class DependingOption extends ValidationError {
    constructor(option7, dependingOption){
        super(`Option "${getFlag(option7)}" depends on option "${getFlag(dependingOption)}".`);
        Object.setPrototypeOf(this, DependingOption.prototype);
    }
}
class MissingRequiredOption extends ValidationError {
    constructor(option8){
        super(`Missing required option "${getFlag(option8)}".`);
        Object.setPrototypeOf(this, MissingRequiredOption.prototype);
    }
}
class RequiredArgumentFollowsOptionalArgument extends ValidationError {
    constructor(arg3){
        super(`An required argument cannot follow an optional argument, but "${arg3}"  is defined as required.`);
        Object.setPrototypeOf(this, RequiredArgumentFollowsOptionalArgument.prototype);
    }
}
class ArgumentFollowsVariadicArgument extends ValidationError {
    constructor(arg1){
        super(`An argument cannot follow an variadic argument, but got "${arg1}".`);
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
    constructor({ label: label1 , name: name1 , value: value1 , type: type1  }, expected1){
        super(`${label1} "${name1}" must be of type "${type1}", but got "${value1}".` + (expected1 ? ` Expected values: ${expected1.map((value2)=>`"${value2}"`
        ).join(", ")}` : ""));
        Object.setPrototypeOf(this, MissingOptionValue.prototype);
    }
}
function normalize3(args) {
    const normalized = [];
    let inLiteral = false;
    for (const arg2 of args){
        if (inLiteral) {
            normalized.push(arg2);
        } else if (arg2 === "--") {
            inLiteral = true;
            normalized.push(arg2);
        } else if (arg2.length > 1 && arg2[0] === "-") {
            const isLong = arg2[1] === "-";
            const isDotted = !isLong && arg2[2] === ".";
            if (arg2.includes("=")) {
                const parts = arg2.split("=");
                const flag = parts.shift();
                if (isLong) {
                    normalized.push(flag);
                } else {
                    normalizeShortFlags(flag);
                }
                normalized.push(parts.join("="));
            } else if (isLong || isDotted) {
                normalized.push(arg2);
            } else {
                normalizeShortFlags(arg2);
            }
        } else {
            normalized.push(arg2);
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
(function(OptionType1) {
    OptionType1["STRING"] = "string";
    OptionType1["NUMBER"] = "number";
    OptionType1["INTEGER"] = "integer";
    OptionType1["BOOLEAN"] = "boolean";
})(OptionType || (OptionType = {
}));
const __boolean = (type2)=>{
    if (~[
        "1",
        "true"
    ].indexOf(type2.value)) {
        return true;
    }
    if (~[
        "0",
        "false"
    ].indexOf(type2.value)) {
        return false;
    }
    throw new InvalidTypeError(type2);
};
const number = (type2)=>{
    const value2 = Number(type2.value);
    if (Number.isFinite(value2)) {
        return value2;
    }
    throw new InvalidTypeError(type2);
};
const string = ({ value: value2  })=>{
    return value2;
};
function validateFlags(flags, values, _knownFlaks, allowEmpty, optionNames = {
}) {
    const defaultValues = {
    };
    for (const option9 of flags){
        let name2;
        let defaultValue = undefined;
        if (option9.name.startsWith("no-")) {
            const propName = option9.name.replace(/^no-/, "");
            if (propName in values) {
                continue;
            }
            const positiveOption = getOption(flags, propName);
            if (positiveOption) {
                continue;
            }
            name2 = paramCaseToCamelCase(propName);
            defaultValue = true;
        }
        if (!name2) {
            name2 = paramCaseToCamelCase(option9.name);
        }
        if (!(name2 in optionNames)) {
            optionNames[name2] = option9.name;
        }
        const hasDefaultValue = typeof values[name2] === "undefined" && (typeof option9.default !== "undefined" || typeof defaultValue !== "undefined");
        if (hasDefaultValue) {
            values[name2] = getDefaultValue(option9) ?? defaultValue;
            defaultValues[option9.name] = true;
            if (typeof option9.value === "function") {
                values[name2] = option9.value(values[name2]);
            }
        }
    }
    const keys = Object.keys(values);
    if (keys.length === 0 && allowEmpty) {
        return;
    }
    const options4 = keys.map((name2)=>({
            name: name2,
            option: getOption(flags, optionNames[name2])
        })
    );
    for (const { name: name2 , option: option10  } of options4){
        if (!option10) {
            throw new UnknownOption(name2, flags);
        }
        if (option10.standalone) {
            if (keys.length > 1) {
                if (options4.every(({ option: opt  })=>opt && (option10 === opt || defaultValues[opt.name])
                )) {
                    return;
                }
                throw new OptionNotCombinable(option10.name);
            }
            return;
        }
        option10.conflicts?.forEach((flag)=>{
            if (isset(flag, values)) {
                throw new ConflictingOption(option10.name, flag);
            }
        });
        option10.depends?.forEach((flag)=>{
            if (!isset(flag, values) && !defaultValues[option10.name]) {
                throw new DependingOption(option10.name, flag);
            }
        });
        const isArray = (option10.args?.length || 0) > 1;
        option10.args?.forEach((arg2, i)=>{
            if (arg2.requiredValue && (typeof values[name2] === "undefined" || isArray && typeof values[name2][i] === "undefined")) {
                throw new MissingOptionValue(option10.name);
            }
        });
    }
    for (const option11 of flags){
        if (option11.required && !(paramCaseToCamelCase(option11.name) in values)) {
            if ((!option11.conflicts || !option11.conflicts.find((flag)=>!!values[flag]
            )) && !options4.find((opt)=>opt.option?.conflicts?.find((flag)=>flag === option11.name
                )
            )) {
                throw new MissingRequiredOption(option11.name);
            }
        }
    }
    if (keys.length === 0 && !allowEmpty) {
        throw new NoArguments();
    }
}
function isset(flag, values) {
    const name2 = paramCaseToCamelCase(flag);
    return typeof values[name2] !== "undefined";
}
const integer = (type2)=>{
    const value2 = Number(type2.value);
    if (Number.isInteger(value2)) {
        return value2;
    }
    throw new InvalidTypeError(type2);
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
    const normalized = normalize3(args);
    let inLiteral = false;
    let negate = false;
    const flags = {
    };
    const optionNames = {
    };
    const literal = [];
    const unknown = [];
    let stopEarly = false;
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
        let option9;
        let args1;
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
        if (isFlag && !stopEarly) {
            if (current[2] === "-" || current[1] === "-" && current.length === 3) {
                throw new UnknownOption(current, opts.flags);
            }
            negate = current.startsWith("--no-");
            option9 = getOption(opts.flags, current);
            if (!option9) {
                if (opts.flags.length) {
                    throw new UnknownOption(current, opts.flags);
                }
                option9 = {
                    name: current.replace(/^-+/, ""),
                    optionalValue: true,
                    type: OptionType.STRING
                };
            }
            const positiveName = option9.name.replace(/^no-?/, "");
            const propName = paramCaseToCamelCase(positiveName);
            if (typeof flags[propName] !== "undefined" && !option9.collect) {
                throw new DuplicateOption(current);
            }
            args1 = option9.args?.length ? option9.args : [
                {
                    type: option9.type,
                    requiredValue: option9.requiredValue,
                    optionalValue: option9.optionalValue,
                    variadic: option9.variadic,
                    list: option9.list,
                    separator: option9.separator
                }
            ];
            let argIndex = 0;
            let inOptionalArg = false;
            const previous = flags[propName];
            parseNext(option9, args1);
            if (typeof flags[propName] === "undefined") {
                if (typeof option9.default !== "undefined") {
                    flags[propName] = getDefaultValue(option9);
                } else if (args1[argIndex].requiredValue) {
                    throw new MissingOptionValue(option9.name);
                } else {
                    flags[propName] = true;
                }
            }
            if (option9.value) {
                flags[propName] = option9.value(flags[propName], previous);
            } else if (option9.collect) {
                const value2 = Array.isArray(previous) ? previous : [];
                value2.push(flags[propName]);
                flags[propName] = value2;
            }
            optionNames[propName] = option9.name;
            opts.option?.(option9, flags[propName]);
            function parseNext(option10, args2) {
                const arg2 = args2[argIndex];
                if (!arg2) {
                    const flag = next();
                    throw new UnknownOption(flag, opts.flags ?? []);
                }
                if (!arg2.type) {
                    arg2.type = OptionType.BOOLEAN;
                }
                if (option10.args?.length) {
                    if ((typeof arg2.optionalValue === "undefined" || arg2.optionalValue === false) && typeof arg2.requiredValue === "undefined") {
                        arg2.requiredValue = true;
                    }
                } else {
                    if (arg2.type !== OptionType.BOOLEAN && (typeof arg2.optionalValue === "undefined" || arg2.optionalValue === false) && typeof arg2.requiredValue === "undefined") {
                        arg2.requiredValue = true;
                    }
                }
                if (arg2.requiredValue) {
                    if (inOptionalArg) {
                        throw new RequiredArgumentFollowsOptionalArgument(option10.name);
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
                if (arg2.list && hasNext(arg2)) {
                    const parsed = next().split(arg2.separator || ",").map((nextValue)=>{
                        const value2 = parseValue(option10, arg2, nextValue);
                        if (typeof value2 === "undefined") {
                            throw new InvalidOptionValue(option10.name, arg2.type ?? "?", nextValue);
                        }
                        return value2;
                    });
                    if (parsed?.length) {
                        result = parsed;
                    }
                } else {
                    if (hasNext(arg2)) {
                        result = parseValue(option10, arg2, next());
                    } else if (arg2.optionalValue && arg2.type === OptionType.BOOLEAN) {
                        result = true;
                    }
                }
                if (increase) {
                    i++;
                    if (!arg2.variadic) {
                        argIndex++;
                    } else if (args2[argIndex + 1]) {
                        throw new ArgumentFollowsVariadicArgument(next());
                    }
                }
                if (typeof result !== "undefined" && (args2.length > 1 || arg2.variadic)) {
                    if (!flags[propName]) {
                        flags[propName] = [];
                    }
                    flags[propName].push(result);
                    if (hasNext(arg2)) {
                        parseNext(option10, args2);
                    }
                } else {
                    flags[propName] = result;
                }
                function hasNext(arg3) {
                    return !!(normalized[i + 1] && (arg3.optionalValue || arg3.requiredValue || arg3.variadic) && (normalized[i + 1][0] !== "-" || arg3.type === OptionType.NUMBER && !isNaN(Number(normalized[i + 1]))) && arg3);
                }
                function parseValue(option11, arg3, value2) {
                    const type2 = arg3.type || OptionType.STRING;
                    const result1 = opts.parse ? opts.parse({
                        label: "Option",
                        type: type2,
                        name: `--${option11.name}`,
                        value: value2
                    }) : parseFlagValue(option11, arg3, value2);
                    if (typeof result1 !== "undefined") {
                        increase = true;
                    }
                    return result1;
                }
            }
        } else {
            if (opts.stopEarly) {
                stopEarly = true;
            }
            unknown.push(current);
        }
    }
    if (opts.flags && opts.flags.length) {
        validateFlags(opts.flags, flags, opts.knownFlaks, opts.allowEmpty, optionNames);
    }
    const result = Object.keys(flags).reduce((result1, key)=>{
        if (~key.indexOf(".")) {
            key.split(".").reduce((result2, subKey, index, parts)=>{
                if (index === parts.length - 1) {
                    result2[subKey] = flags[key];
                } else {
                    result2[subKey] = result2[subKey] ?? {
                    };
                }
                return result2[subKey];
            }, result1);
        } else {
            result1[key] = flags[key];
        }
        return result1;
    }, {
    });
    return {
        flags: result,
        unknown,
        literal
    };
}
function parseFlagValue(option9, arg2, value2) {
    const type2 = arg2.type || OptionType.STRING;
    const parseType = Types[type2];
    if (!parseType) {
        throw new UnknownType(type2, Object.keys(Types));
    }
    return parseType({
        label: "Option",
        type: type2,
        name: `--${option9.name}`,
        value: value2
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
    const commandNames = commands.map((command1)=>command1.getName()
    ).filter((command1)=>!excludes.includes(command1)
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
    await Promise.all(names.map((name2)=>hasPermission(name2).then((hasPermission1)=>permissions[name2] = hasPermission1
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
    for (const arg2 of parts){
        if (hasVariadic) {
            throw new ArgumentFollowsVariadicArgument(arg2);
        }
        const parts1 = arg2.split(ARGUMENT_DETAILS_REGEX);
        const type2 = parts1[2] || OptionType.STRING;
        const details = {
            optionalValue: arg2[0] !== "<",
            name: parts1[1],
            action: parts1[3] || type2,
            variadic: false,
            list: type2 ? arg2.indexOf(type2 + "[]") !== -1 : false,
            type: type2
        };
        if (!details.optionalValue && hasOptional) {
            throw new RequiredArgumentFollowsOptionalArgument(details.name);
        }
        if (arg2[0] === "[") {
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
    constructor(message3){
        super(message3);
        Object.setPrototypeOf(this, CommandError.prototype);
    }
}
class ValidationError1 extends CommandError {
    exitCode;
    constructor(message4, { exitCode  } = {
    }){
        super(message4);
        Object.setPrototypeOf(this, ValidationError1.prototype);
        this.exitCode = exitCode ?? 1;
    }
}
class DuplicateOptionName extends CommandError {
    constructor(name2){
        super(`Option with name "${getFlag(name2)}" already exists.`);
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
    constructor(name3){
        super(`Duplicate command name "${name3}".`);
        Object.setPrototypeOf(this, DuplicateCommandName.prototype);
    }
}
class DuplicateCommandAlias extends CommandError {
    constructor(alias1){
        super(`Duplicate command alias "${alias1}".`);
        Object.setPrototypeOf(this, DuplicateCommandAlias.prototype);
    }
}
class CommandNotFound extends CommandError {
    constructor(name4, commands4, excluded){
        super(`Unknown command "${name4}".${didYouMeanCommand(name4, commands4, excluded)}`);
        Object.setPrototypeOf(this, UnknownCommand.prototype);
    }
}
class DuplicateType extends CommandError {
    constructor(name5){
        super(`Type with name "${name5}" already exists.`);
        Object.setPrototypeOf(this, DuplicateType.prototype);
    }
}
class DuplicateCompletion extends CommandError {
    constructor(name6){
        super(`Completion with name "${name6}" already exists.`);
        Object.setPrototypeOf(this, DuplicateCompletion.prototype);
    }
}
class DuplicateExample extends CommandError {
    constructor(name7){
        super(`Example with name "${name7}" already exists.`);
        Object.setPrototypeOf(this, DuplicateExample.prototype);
    }
}
class DuplicateEnvironmentVariable extends CommandError {
    constructor(name8){
        super(`Environment variable with name "${name8}" already exists.`);
        Object.setPrototypeOf(this, DuplicateEnvironmentVariable.prototype);
    }
}
class EnvironmentVariableSingleValue extends CommandError {
    constructor(name9){
        super(`An environment variable can only have one value, but "${name9}" has more than one.`);
        Object.setPrototypeOf(this, EnvironmentVariableSingleValue.prototype);
    }
}
class EnvironmentVariableOptionalValue extends CommandError {
    constructor(name10){
        super(`An environment variable cannot have an optional value, but "${name10}" is defined as optional.`);
        Object.setPrototypeOf(this, EnvironmentVariableOptionalValue.prototype);
    }
}
class EnvironmentVariableVariadicValue extends CommandError {
    constructor(name11){
        super(`An environment variable cannot have an variadic value, but "${name11}" is defined as variadic.`);
        Object.setPrototypeOf(this, EnvironmentVariableVariadicValue.prototype);
    }
}
class DefaultCommandNotFound extends CommandError {
    constructor(name12, commands1){
        super(`Default command "${name12}" not found.${didYouMeanCommand(name12, commands1)}`);
        Object.setPrototypeOf(this, DefaultCommandNotFound.prototype);
    }
}
class CommandExecutableNotFound extends CommandError {
    constructor(name13, files){
        super(`Command executable not found: ${name13}:\n    - ${files.join("\\n    - ")}`);
        Object.setPrototypeOf(this, CommandExecutableNotFound.prototype);
    }
}
class UnknownCompletionCommand extends CommandError {
    constructor(name14, commands2){
        super(`Auto-completion failed. Unknown command "${name14}".${didYouMeanCommand(name14, commands2)}`);
        Object.setPrototypeOf(this, UnknownCompletionCommand.prototype);
    }
}
class UnknownCommand extends ValidationError1 {
    constructor(name15, commands3, excluded1){
        super(`Unknown command "${name15}".${didYouMeanCommand(name15, commands3, excluded1)}`);
        Object.setPrototypeOf(this, UnknownCommand.prototype);
    }
}
class NoArgumentsAllowed extends ValidationError1 {
    constructor(name16){
        super(`No arguments allowed for command "${name16}".`);
        Object.setPrototypeOf(this, NoArgumentsAllowed.prototype);
    }
}
class MissingArguments extends ValidationError1 {
    constructor(args2){
        super("Missing argument(s): " + args2.join(", "));
        Object.setPrototypeOf(this, MissingArguments.prototype);
    }
}
class MissingArgument extends ValidationError1 {
    constructor(arg2){
        super(`Missing argument "${arg2}".`);
        Object.setPrototypeOf(this, MissingArgument.prototype);
    }
}
class TooManyArguments extends ValidationError1 {
    constructor(args1){
        super(`Too many arguments: ${args1.join(" ")}`);
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
    constructor(value3){
        this.value = value3;
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
    constructor(table, options5){
        this.table = table;
        this.options = options5;
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
        const table1 = new this(...rows);
        if (rows instanceof Table) {
            table1.options = {
                ...rows.options
            };
            table1.headerRow = rows.headerRow ? Row.from(rows.headerRow) : undefined;
        }
        return table1;
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
        const table1 = new Table(...this.map((row)=>row instanceof Row ? row.clone() : Row.from(row).clone()
        ));
        table1.options = {
            ...this.options
        };
        table1.headerRow = this.headerRow?.clone();
        return table1;
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
    constructor(cmd1, options6 = {
    }){
        this.cmd = cmd1;
        this.options = {
            types: false,
            hints: true,
            colors: true,
            ...options6
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
                yellow(`v${this.cmd.getVersion()}`)
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
        const options7 = this.cmd.getOptions(false);
        if (!options7.length) {
            return "";
        }
        const hasTypeDefinitions = !!options7.find((option9)=>!!option9.typeDefinition
        );
        if (hasTypeDefinitions) {
            return this.label("Options") + Table.from([
                ...options7.map((option9)=>[
                        option9.flags.map((flag)=>blue(flag)
                        ).join(", "),
                        highlightArguments(option9.typeDefinition || "", this.options.types),
                        red(bold("-")) + " " + option9.description.split("\n").shift(),
                        this.generateHints(option9), 
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
            ...options7.map((option9)=>[
                    option9.flags.map((flag)=>blue(flag)
                    ).join(", "),
                    red(bold("-")) + " " + option9.description.split("\n").shift(),
                    this.generateHints(option9), 
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
        const commands4 = this.cmd.getCommands(false);
        if (!commands4.length) {
            return "";
        }
        const hasTypeDefinitions = !!commands4.find((command)=>!!command.getArgsDefinition()
        );
        if (hasTypeDefinitions) {
            return this.label("Commands") + Table.from([
                ...commands4.map((command)=>[
                        [
                            command.getName(),
                            ...command.getAliases()
                        ].map((name17)=>blue(name17)
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
            ...commands4.map((command)=>[
                    [
                        command.getName(),
                        ...command.getAliases()
                    ].map((name17)=>blue(name17)
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
                    envVar.names.map((name17)=>blue(name17)
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
        const type3 = this.cmd.getType(option.args[0]?.type)?.handler;
        if (type3 instanceof Type) {
            const possibleValues = type3.values?.(this.cmd, this.cmd.getParent());
            if (possibleValues?.length) {
                hints.push(bold(`Values: `) + possibleValues.map((value4)=>inspect(value4, this.options.colors)
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
function capitalize(string1) {
    return (string1?.charAt(0).toUpperCase() + string1.slice(1)) ?? "";
}
function inspect(value4, colors) {
    return Deno.inspect(value4, {
        depth: 1,
        colors,
        trailingComma: false
    });
}
function highlightArguments(argsDefinition, types1 = true) {
    if (!argsDefinition) {
        return "";
    }
    return parseArgumentsDefinition(argsDefinition).map((arg3)=>highlightArgumentDetails(arg3, types1)
    ).join(" ");
}
function highlightArgumentDetails(arg3, types1 = true) {
    let str = "";
    str += yellow(arg3.optionalValue ? "[" : "<");
    let name17 = "";
    name17 += arg3.name;
    if (arg3.variadic) {
        name17 += "...";
    }
    name17 = magenta(name17);
    str += name17;
    if (types1) {
        str += yellow(":");
        str += red(arg3.type);
    }
    if (arg3.list) {
        str += green("[]");
    }
    str += yellow(arg3.optionalValue ? "]" : ">");
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
        const name17 = result.flags.shift();
        const aliases = result.flags;
        if (!name17) {
            throw new MissingCommandName();
        }
        if (this.getBaseCommand(name17, true)) {
            if (!override) {
                throw new DuplicateCommandName(name17);
            }
            this.removeCommand(name17);
        }
        let description;
        let cmd2;
        if (typeof cmdOrDescription === "string") {
            description = cmdOrDescription;
        }
        if (cmdOrDescription instanceof Command) {
            cmd2 = cmdOrDescription.reset();
        } else {
            cmd2 = new Command();
        }
        cmd2._name = name17;
        cmd2._parent = this;
        if (description) {
            cmd2.description(description);
        }
        if (result.typeDefinition) {
            cmd2.arguments(result.typeDefinition);
        }
        aliases.forEach((alias1)=>cmd2.alias(alias1)
        );
        this.commands.set(name17, cmd2);
        this.select(name17);
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
        const cmd2 = this.getBaseCommand(name, true);
        if (!cmd2) {
            throw new CommandNotFound(name, this.getBaseCommands(true));
        }
        this.cmd = cmd2;
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
            this.cmd._help = (cmd2)=>HelpGenerator.generate(cmd2, help)
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
            const completeHandler = (cmd2, parent)=>handler.complete?.(cmd2, parent) || []
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
        const args3 = result.typeDefinition ? parseArgumentsDefinition(result.typeDefinition) : [];
        const option10 = {
            ...opts,
            name: "",
            description: desc,
            args: args3,
            flags: result.flags,
            typeDefinition: result.typeDefinition
        };
        if (option10.separator) {
            for (const arg3 of args3){
                if (arg3.list) {
                    arg3.separator = option10.separator;
                }
            }
        }
        for (const part of option10.flags){
            const arg3 = part.trim();
            const isLong = /^--/.test(arg3);
            const name18 = isLong ? arg3.slice(2) : arg3.slice(1);
            if (this.cmd.getBaseOption(name18, true)) {
                if (opts?.override) {
                    this.removeOption(name18);
                } else {
                    throw new DuplicateOptionName(name18);
                }
            }
            if (!option10.name && isLong) {
                option10.name = name18;
            } else if (!option10.aliases) {
                option10.aliases = [
                    name18
                ];
            } else {
                option10.aliases.push(name18);
            }
        }
        if (option10.prepend) {
            this.cmd.options.unshift(option10);
        } else {
            this.cmd.options.push(option10);
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
            const cmd2 = this.getCommand(this.defaultCommand, true);
            if (!cmd2) {
                throw new DefaultCommandNotFound(this.defaultCommand, this.getCommands());
            }
            cmd2._globalParent = this;
            await cmd2.execute(options, ...args);
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
        const [main1, ...names] = this.getPath().split(" ");
        names.unshift(main1.replace(/\.ts$/, ""));
        const executableName = names.join("-");
        const files1 = [];
        const parts = Deno.mainModule.replace(/^file:\/\//g, "").split("/");
        parts.pop();
        const path1 = parts.join("/");
        files1.push(path1 + "/" + executableName, path1 + "/" + executableName + ".ts");
        files1.push(executableName, executableName + ".ts");
        const denoOpts = [];
        if (isUnstable()) {
            denoOpts.push("--unstable");
        }
        denoOpts.push("--allow-read", "--allow-run");
        Object.keys(permissions).forEach((name18)=>{
            if (name18 === "read" || name18 === "run") {
                return;
            }
            if (permissions[name18]) {
                denoOpts.push(`--allow-${name18}`);
            }
        });
        for (const file of files1){
            try {
                Deno.lstatSync(file);
            } catch (error) {
                if (error instanceof Deno.errors.NotFound) {
                    return false;
                }
                throw error;
            }
            const cmd2 = [
                "deno",
                "run",
                ...denoOpts,
                file,
                ...args
            ];
            const process = Deno.run({
                cmd: cmd2
            });
            const status = await process.status();
            if (!status.success) {
                Deno.exit(status.code);
            }
            return;
        }
        throw new CommandExecutableNotFound(executableName, files1);
    }
    parseFlags(args) {
        try {
            let action;
            const result = parseFlags(args, {
                stopEarly: this._stopEarly,
                allowEmpty: this._allowEmpty,
                flags: this.getOptions(true),
                parse: (type3)=>this.parseType(type3)
                ,
                option: (option10)=>{
                    if (!action && option10.action) {
                        action = option10.action;
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
            throw new UnknownType(type.type, this.getTypes().map((type3)=>type3.name
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
            const name18 = env.names.find((name19)=>!!Deno.env.get(name19)
            );
            if (name18) {
                this.parseType({
                    label: "Environment variable",
                    type: env.type,
                    name: name18,
                    value: Deno.env.get(name18) ?? ""
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
                    const hasStandaloneOption = !!flagNames.find((name18)=>this.getOption(name18, true)?.standalone
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
                    let arg3;
                    if (expectedArg.variadic) {
                        arg3 = args.splice(0, args.length).map((value4)=>this.parseType({
                                label: "Argument",
                                type: expectedArg.type,
                                name: expectedArg.name,
                                value: value4
                            })
                        );
                    } else {
                        arg3 = this.parseType({
                            label: "Argument",
                            type: expectedArg.type,
                            name: expectedArg.name,
                            value: args.shift()
                        });
                    }
                    if (arg3) {
                        params.push(arg3);
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
        return this.getArguments().find((arg3)=>arg3.name === name
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
        const getOptions = (cmd2, options7 = [], names = [])=>{
            if (cmd2) {
                if (cmd2.options.length) {
                    cmd2.options.forEach((option10)=>{
                        if (option10.global && !this.options.find((opt)=>opt.name === option10.name
                        ) && names.indexOf(option10.name) === -1 && (hidden || !option10.hidden)) {
                            names.push(option10.name);
                            options7.push(option10);
                        }
                    });
                }
                return getOptions(cmd2._parent, options7, names);
            }
            return options7;
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
        const option10 = this.options.find((option11)=>option11.name === name
        );
        return option10 && (hidden || !option10.hidden) ? option10 : undefined;
    }
    getGlobalOption(name, hidden) {
        if (!this._parent) {
            return;
        }
        const option10 = this._parent.getBaseOption(name, hidden);
        if (!option10 || !option10.global) {
            return this._parent.getGlobalOption(name, hidden);
        }
        return option10;
    }
    removeOption(name) {
        const index = this.options.findIndex((option10)=>option10.name === name
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
        const commands5 = Array.from(this.commands.values());
        return hidden ? commands5 : commands5.filter((cmd2)=>!cmd2.isHidden
        );
    }
    getGlobalCommands(hidden) {
        const getCommands = (cmd2, commands5 = [], names = [])=>{
            if (cmd2) {
                if (cmd2.commands.size) {
                    cmd2.commands.forEach((cmd3)=>{
                        if (cmd3.isGlobal && this !== cmd3 && !this.commands.has(cmd3._name) && names.indexOf(cmd3._name) === -1 && (hidden || !cmd3.isHidden)) {
                            names.push(cmd3._name);
                            commands5.push(cmd3);
                        }
                    });
                }
                return getCommands(cmd2._parent, commands5, names);
            }
            return commands5;
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
        for (const cmd2 of this.commands.values()){
            if (cmd2._name === name || cmd2.aliases.includes(name)) {
                return cmd2 && (hidden || !cmd2.isHidden) ? cmd2 : undefined;
            }
        }
    }
    getGlobalCommand(name, hidden) {
        if (!this._parent) {
            return;
        }
        const cmd2 = this._parent.getBaseCommand(name, hidden);
        if (!cmd2?.isGlobal) {
            return this._parent.getGlobalCommand(name, hidden);
        }
        return cmd2;
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
        const getTypes = (cmd2, types2 = [], names = [])=>{
            if (cmd2) {
                if (cmd2.types.size) {
                    cmd2.types.forEach((type3)=>{
                        if (type3.global && !this.types.has(type3.name) && names.indexOf(type3.name) === -1) {
                            names.push(type3.name);
                            types2.push(type3);
                        }
                    });
                }
                return getTypes(cmd2._parent, types2, names);
            }
            return types2;
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
        const cmd2 = this._parent.getBaseType(name);
        if (!cmd2?.global) {
            return this._parent.getGlobalType(name);
        }
        return cmd2;
    }
    getCompletions() {
        return this.getGlobalCompletions().concat(this.getBaseCompletions());
    }
    getBaseCompletions() {
        return Array.from(this.completions.values());
    }
    getGlobalCompletions() {
        const getCompletions = (cmd2, completions = [], names = [])=>{
            if (cmd2) {
                if (cmd2.completions.size) {
                    cmd2.completions.forEach((completion)=>{
                        if (completion.global && !this.completions.has(completion.name) && names.indexOf(completion.name) === -1) {
                            names.push(completion.name);
                            completions.push(completion);
                        }
                    });
                }
                return getCompletions(cmd2._parent, completions, names);
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
        const getEnvVars = (cmd2, envVars = [], names = [])=>{
            if (cmd2) {
                if (cmd2.envVars.length) {
                    cmd2.envVars.forEach((envVar)=>{
                        if (envVar.global && !this.envVars.find((env)=>env.names[0] === envVar.names[0]
                        ) && names.indexOf(envVar.names[0]) === -1 && (hidden || !envVar.hidden)) {
                            names.push(envVar.names[0]);
                            envVars.push(envVar);
                        }
                    });
                }
                return getEnvVars(cmd2._parent, envVars, names);
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
    constructor(cmd2){
        this.cmd = cmd2;
    }
    generate() {
        const path1 = this.cmd.getPath();
        const version = this.cmd.getVersion() ? ` v${this.cmd.getVersion()}` : "";
        return `#!/usr/bin/env bash\n# bash completion support for ${path1}${version}\n\n_${replaceSpecialChars1(path1)}() {\n  local word cur prev\n  local -a opts\n  COMPREPLY=()\n  cur="\${COMP_WORDS[COMP_CWORD]}"\n  prev="\${COMP_WORDS[COMP_CWORD-1]}"\n  cmd="_"\n  opts=()\n\n  _${replaceSpecialChars1(this.cmd.getName())}_complete() {\n    local action="$1"; shift\n    mapfile -t values < <( ${this.cmd.getName()} completions complete "\${action}" "\${@}" )\n    for i in "\${values[@]}"; do\n      opts+=("$i")\n    done\n  }\n\n  ${this.generateCompletions(this.cmd).trim()}\n\n  for word in "\${COMP_WORDS[@]}"; do\n    case "\${word}" in\n      -*) ;;\n      *)\n        cmd_tmp="\${cmd}_\${word//[^[:alnum:]]/_}"\n        if type "\${cmd_tmp}" &>/dev/null; then\n          cmd="\${cmd_tmp}"\n        fi\n    esac\n  done\n\n  \${cmd}\n\n  if [[ \${#opts[@]} -eq 0 ]]; then\n    # shellcheck disable=SC2207\n    COMPREPLY=($(compgen -f "\${cur}"))\n    return 0\n  fi\n\n  local values\n  values="$( printf "\\n%s" "\${opts[@]}" )"\n  local IFS=$'\\n'\n  # shellcheck disable=SC2207\n  local result=($(compgen -W "\${values[@]}" -- "\${cur}"))\n  if [[ \${#result[@]} -eq 0 ]]; then\n    # shellcheck disable=SC2207\n    COMPREPLY=($(compgen -f "\${cur}"))\n  else\n    # shellcheck disable=SC2207\n    COMPREPLY=($(printf '%q\\n' "\${result[@]}"))\n  fi\n\n  return 0\n}\n\ncomplete -F _${replaceSpecialChars1(path1)} -o bashdefault -o default ${path1}\n`;
    }
    generateCompletions(command, path = "", index = 1) {
        path = (path ? path + " " : "") + command.getName();
        const commandCompletions = this.generateCommandCompletions(command, path, index);
        const childCommandCompletions = command.getCommands(false).filter((subCommand)=>subCommand !== command
        ).map((subCommand)=>this.generateCompletions(subCommand, path, index + 1)
        ).join("");
        return `${commandCompletions}\n\n${childCommandCompletions}`;
    }
    generateCommandCompletions(command, path, index) {
        const flags = this.getFlags(command);
        const childCommandNames = command.getCommands(false).map((childCommand)=>childCommand.getName()
        );
        const completionsPath = ~path.indexOf(" ") ? " " + path.split(" ").slice(1).join(" ") : "";
        const optionArguments = this.generateOptionArguments(command, completionsPath);
        const completionsCmd = this.generateCommandCompletionsCommand(command.getArguments(), completionsPath);
        return `  __${replaceSpecialChars1(path)}() {\n    opts=(${[
            ...flags,
            ...childCommandNames
        ].join(" ")})\n    ${completionsCmd}\n    if [[ \${cur} == -* || \${COMP_CWORD} -eq ${index} ]] ; then\n      return 0\n    fi\n    ${optionArguments}\n  }`;
    }
    getFlags(command) {
        return command.getOptions(false).map((option10)=>option10.flags
        ).flat();
    }
    generateOptionArguments(command, completionsPath) {
        let opts = "";
        const options7 = command.getOptions(false);
        if (options7.length) {
            opts += 'case "${prev}" in';
            for (const option10 of options7){
                const flags = option10.flags.map((flag)=>flag.trim()
                ).join("|");
                const completionsCmd = this.generateOptionCompletionsCommand(option10.args, completionsPath, {
                    standalone: option10.standalone
                });
                opts += `\n      ${flags}) ${completionsCmd} ;;`;
            }
            opts += "\n    esac";
        }
        return opts;
    }
    generateCommandCompletionsCommand(args, path) {
        if (args.length) {
            return `_${replaceSpecialChars1(this.cmd.getName())}_complete ${args[0].action}${path}`;
        }
        return "";
    }
    generateOptionCompletionsCommand(args, path, opts) {
        if (args.length) {
            return `opts=(); _${replaceSpecialChars1(this.cmd.getName())}_complete ${args[0].action}${path}`;
        }
        if (opts?.standalone) {
            return "opts=()";
        }
        return "";
    }
}
function replaceSpecialChars1(str) {
    return str.replace(/[^a-zA-Z0-9]/g, "_");
}
class BashCompletionsCommand extends Command {
    #cmd;
    constructor(cmd3){
        super();
        this.#cmd = cmd3;
        this.description(()=>{
            const baseCmd = this.#cmd || this.getMainCommand();
            return `Generate shell completions for bash.\n\nTo enable bash completions for this program add following line to your ${dim(italic("~/.bashrc"))}:\n\n    ${dim(italic(`source <(${baseCmd.getPath()} completions bash)`))}`;
        }).action(()=>{
            const baseCmd = this.#cmd || this.getMainCommand();
            Deno.stdout.writeSync(new TextEncoder().encode(BashCompletionsGenerator.generate(baseCmd)));
        });
    }
}
class CompleteCommand extends Command {
    constructor(cmd4){
        super();
        this.description("Get completions for given action from given command.").arguments("<action:string> [command...:string]").action(async (_, action, commandNames)=>{
            let parent;
            const completeCommand = commandNames?.reduce((cmd5, name18)=>{
                parent = cmd5;
                const childCmd = cmd5.getCommand(name18, false);
                if (!childCmd) {
                    throw new UnknownCompletionCommand(name18, cmd5.getCommands());
                }
                return childCmd;
            }, cmd4 || this.getMainCommand()) ?? (cmd4 || this.getMainCommand());
            const completion = completeCommand.getCompletion(action);
            const result = await completion?.complete(completeCommand, parent) ?? [];
            if (result?.length) {
                Deno.stdout.writeSync(new TextEncoder().encode(result.join("\n")));
            }
        }).reset();
    }
}
class FishCompletionsGenerator {
    cmd;
    static generate(cmd) {
        return new FishCompletionsGenerator(cmd).generate();
    }
    constructor(cmd5){
        this.cmd = cmd5;
    }
    generate() {
        const path2 = this.cmd.getPath();
        const version = this.cmd.getVersion() ? ` v${this.cmd.getVersion()}` : "";
        return `#!/usr/bin/env fish\n# fish completion support for ${path2}${version}\n\nfunction __fish_${replaceSpecialChars2(this.cmd.getName())}_using_command\n  set cmds ${getCommandFnNames(this.cmd).join(" ")}\n  set words (commandline -opc)\n  set cmd "_"\n  for word in $words\n    switch $word\n      case '-*'\n        continue\n      case '*'\n        set word (string replace -r -a '\\W' '_' $word)\n        set cmd_tmp $cmd"_$word"\n        if contains $cmd_tmp $cmds\n          set cmd $cmd_tmp\n        end\n    end\n  end\n  if [ "$cmd" = "$argv[1]" ]\n    return 0\n  end\n  return 1\nend\n\n${this.generateCompletions(this.cmd).trim()}\n`;
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
        for (const option10 of command.getOptions(false)){
            result += "\n" + this.completeOption(command, option10);
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
        const cmd6 = [
            "complete"
        ];
        cmd6.push("-c", this.cmd.getName());
        cmd6.push("-n", `'__fish_${replaceSpecialChars2(this.cmd.getName())}_using_command __${replaceSpecialChars2(command.getPath())}'`);
        options.shortOption && cmd6.push("-s", options.shortOption);
        options.longOption && cmd6.push("-l", options.longOption);
        options.standalone && cmd6.push("-x");
        cmd6.push("-k");
        cmd6.push("-f");
        if (options.arguments) {
            options.required && cmd6.push("-r");
            cmd6.push("-a", options.arguments);
        }
        options.description && cmd6.push("-d", `'${options.description}'`);
        return cmd6.join(" ");
    }
    getCompletionCommand(cmd) {
        return `'(${this.cmd.getName()} completions complete ${cmd.trim()})'`;
    }
}
function getCommandFnNames(cmd6, cmds = []) {
    cmds.push(`__${replaceSpecialChars2(cmd6.getPath())}`);
    cmd6.getCommands(false).forEach((command)=>{
        getCommandFnNames(command, cmds);
    });
    return cmds;
}
function getCompletionsPath(command) {
    return command.getPath().split(" ").slice(1).join(" ");
}
function replaceSpecialChars2(str) {
    return str.replace(/[^a-zA-Z0-9]/g, "_");
}
class FishCompletionsCommand extends Command {
    #cmd;
    constructor(cmd6){
        super();
        this.#cmd = cmd6;
        this.description(()=>{
            const baseCmd = this.#cmd || this.getMainCommand();
            return `Generate shell completions for fish.\n\nTo enable fish completions for this program add following line to your ${dim(italic("~/.config/fish/config.fish"))}:\n\n    ${dim(italic(`source (${baseCmd.getPath()} completions fish | psub)`))}`;
        }).action(()=>{
            const baseCmd = this.#cmd || this.getMainCommand();
            Deno.stdout.writeSync(new TextEncoder().encode(FishCompletionsGenerator.generate(baseCmd)));
        });
    }
}
class ZshCompletionsGenerator {
    cmd;
    actions = new Map();
    static generate(cmd) {
        return new ZshCompletionsGenerator(cmd).generate();
    }
    constructor(cmd7){
        this.cmd = cmd7;
    }
    generate() {
        const path2 = this.cmd.getPath();
        const name18 = this.cmd.getName();
        const version = this.cmd.getVersion() ? ` v${this.cmd.getVersion()}` : "";
        return `#!/usr/bin/env zsh\n# zsh completion support for ${path2}${version}\n\nautoload -U is-at-least\n\n# shellcheck disable=SC2154\n(( $+functions[__${replaceSpecialChars3(name18)}_complete] )) ||\nfunction __${replaceSpecialChars3(name18)}_complete {\n  local name="$1"; shift\n  local action="$1"; shift\n  integer ret=1\n  local -a values\n  local expl lines\n  _tags "$name"\n  while _tags; do\n    if _requested "$name"; then\n      # shellcheck disable=SC2034\n      lines="$(${name18} completions complete "\${action}" "\${@}")"\n      values=("\${(ps:\\n:)lines}")\n      if (( \${#values[@]} )); then\n        while _next_label "$name" expl "$action"; do\n          compadd -S '' "\${expl[@]}" "\${values[@]}"\n        done\n      fi\n    fi\n  done\n}\n\n${this.generateCompletions(this.cmd).trim()}\n\n# _${replaceSpecialChars3(path2)} "\${@}"\n\ncompdef _${replaceSpecialChars3(path2)} ${path2}\n\n`;
    }
    generateCompletions(command, path = "") {
        if (!command.hasCommands(false) && !command.hasOptions(false) && !command.hasArguments()) {
            return "";
        }
        path = (path ? path + " " : "") + command.getName();
        return `# shellcheck disable=SC2154\n(( $+functions[_${replaceSpecialChars3(path)}] )) ||\nfunction _${replaceSpecialChars3(path)}() {` + (!command.getParent() ? `\n  local state` : "") + this.generateCommandCompletions(command, path) + this.generateSubCommandCompletions(command, path) + this.generateArgumentCompletions(command, path) + this.generateActions(command) + `\n}\n\n` + command.getCommands(false).filter((subCommand)=>subCommand !== command
        ).map((subCommand)=>this.generateCompletions(subCommand, path)
        ).join("");
    }
    generateCommandCompletions(command, path) {
        const commands5 = command.getCommands(false);
        let completions = commands5.map((subCommand)=>`'${subCommand.getName()}:${subCommand.getShortDescription()}'`
        ).join("\n      ");
        if (completions) {
            completions = `\n    local -a commands\n    # shellcheck disable=SC2034\n    commands=(\n      ${completions}\n    )\n    _describe 'command' commands`;
        }
        if (command.hasArguments()) {
            const completionsPath = path.split(" ").slice(1).join(" ");
            const arg3 = command.getArguments()[0];
            const action = this.addAction(arg3, completionsPath);
            if (action && command.getCompletion(arg3.action)) {
                completions += `\n    __${replaceSpecialChars3(this.cmd.getName())}_complete ${action.arg.name} ${action.arg.action} ${action.cmd}`;
            }
        }
        if (completions) {
            completions = `\n\n  function _commands() {${completions}\n  }`;
        }
        return completions;
    }
    generateSubCommandCompletions(command, path) {
        if (command.hasCommands(false)) {
            const actions = command.getCommands(false).map((command)=>`${command.getName()}) _${replaceSpecialChars3(path + " " + command.getName())} ;;`
            ).join("\n      ");
            return `\n\n  function _command_args() {\n    case "\${words[1]}" in\n      ${actions}\n    esac\n  }`;
        }
        return "";
    }
    generateArgumentCompletions(command, path) {
        this.actions.clear();
        const options7 = this.generateOptions(command, path);
        let argIndex = 0;
        let argsCommand = "\n\n  _arguments -w -s -S -C";
        if (command.hasOptions()) {
            argsCommand += ` \\\n    ${options7.join(" \\\n    ")}`;
        }
        if (command.hasCommands(false) || command.getArguments().filter((arg3)=>command.getCompletion(arg3.action)
        ).length) {
            argsCommand += ` \\\n    '${++argIndex}: :_commands'`;
        }
        if (command.hasArguments() || command.hasCommands(false)) {
            const args3 = [];
            for (const arg3 of command.getArguments().slice(1)){
                const completionsPath = path.split(" ").slice(1).join(" ");
                const action = this.addAction(arg3, completionsPath);
                args3.push(`${++argIndex}${arg3.optionalValue ? "::" : ":"}${action.name}`);
            }
            argsCommand += args3.map((arg4)=>`\\\n    '${arg4}'`
            ).join("");
            if (command.hasCommands(false)) {
                argsCommand += ` \\\n    '*:: :->command_args'`;
            }
        }
        return argsCommand;
    }
    generateOptions(command, path) {
        const options7 = [];
        const cmdArgs = path.split(" ");
        const _baseName = cmdArgs.shift();
        const completionsPath = cmdArgs.join(" ");
        const excludedFlags = command.getOptions(false).map((option10)=>option10.standalone ? option10.flags : false
        ).flat().filter((flag)=>typeof flag === "string"
        );
        for (const option10 of command.getOptions(false)){
            options7.push(this.generateOption(option10, completionsPath, excludedFlags));
        }
        return options7;
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
        let args3 = "";
        for (const arg3 of option.args){
            const action = this.addAction(arg3, completionsPath);
            if (arg3.variadic) {
                args3 += `${arg3.optionalValue ? "::" : ":"}${arg3.name}:->${action.name}`;
            } else {
                args3 += `${arg3.optionalValue ? "::" : ":"}${arg3.name}:->${action.name}`;
            }
        }
        let description = option.description.trim().split("\n").shift();
        description = description.replace(/\[/g, "\\[").replace(/]/g, "\\]").replace(/"/g, '\\"').replace(/'/g, "'\"'\"'");
        const collect = option.collect ? "*" : "";
        if (option.standalone) {
            return `'(- *)'{${collect}${flags}}'[${description}]${args3}'`;
        } else {
            const excluded2 = excludedFlags.length ? `'(${excludedFlags.join(" ")})'` : "";
            if (collect || flags.length > 1) {
                return `${excluded2}{${collect}${flags}}'[${description}]${args3}'`;
            } else {
                return `${excluded2}${flags}'[${description}]${args3}'`;
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
            actions = Array.from(this.actions).map(([name18, action])=>`${name18}) __${replaceSpecialChars3(this.cmd.getName())}_complete ${action.arg.name} ${action.arg.action} ${action.cmd} ;;`
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
function replaceSpecialChars3(str) {
    return str.replace(/[^a-zA-Z0-9]/g, "_");
}
class ZshCompletionsCommand extends Command {
    #cmd;
    constructor(cmd8){
        super();
        this.#cmd = cmd8;
        this.description(()=>{
            const baseCmd = this.#cmd || this.getMainCommand();
            return `Generate shell completions for zsh.\n\nTo enable zsh completions for this program add following line to your ${dim(italic("~/.zshrc"))}:\n\n    ${dim(italic(`source <(${baseCmd.getPath()} completions zsh)`))}`;
        }).action(()=>{
            const baseCmd = this.#cmd || this.getMainCommand();
            Deno.stdout.writeSync(new TextEncoder().encode(ZshCompletionsGenerator.generate(baseCmd)));
        });
    }
}
class CompletionsCommand extends Command {
    #cmd;
    constructor(cmd9){
        super();
        this.#cmd = cmd9;
        this.description(()=>{
            const baseCmd = this.#cmd || this.getMainCommand();
            return `Generate shell completions.\n\nTo enable shell completions for this program add the following line to your ${dim(italic("~/.bashrc"))} or similar:\n\n    ${dim(italic(`source <(${baseCmd.getPath()} completions [shell])`))}\n\n    For more information run ${dim(italic(`${baseCmd.getPath()} completions [shell] --help`))}\n`;
        }).action(()=>this.showHelp()
        ).command("bash", new BashCompletionsCommand(this.#cmd)).command("fish", new FishCompletionsCommand(this.#cmd)).command("zsh", new ZshCompletionsCommand(this.#cmd)).command("complete", new CompleteCommand(this.#cmd).hidden()).reset();
    }
}
class CommandType extends StringType {
    complete(_cmd, parent) {
        return parent?.getCommands(false).map((cmd10)=>cmd10.getName()
        ) || [];
    }
}
class HelpCommand extends Command {
    constructor(cmd10){
        super();
        this.type("command", new CommandType()).arguments("[command:command]").description("Show this help or the help of a sub-command.").action((_, name18)=>{
            if (!cmd10) {
                cmd10 = name18 ? this.getGlobalParent()?.getBaseCommand(name18) : this.getGlobalParent();
            }
            if (!cmd10) {
                const cmds = this.getGlobalParent()?.getCommands();
                throw new UnknownCommand(name18 ?? "", cmds ?? [], [
                    this.getName(),
                    ...this.getAliases(), 
                ]);
            }
            cmd10.showHelp();
            Deno.exit(0);
        });
    }
}
class ActionListType extends StringType {
    cmd;
    constructor(cmd11){
        super();
        this.cmd = cmd11;
    }
    complete() {
        return this.cmd.getCompletions().map((type3)=>type3.name
        ).filter((value4, index, self)=>self.indexOf(value4) === index
        );
    }
}
class ChildCommandType extends StringType {
    #cmd;
    constructor(cmd12){
        super();
        this.#cmd = cmd12;
    }
    complete(cmd) {
        return (this.#cmd ?? cmd)?.getCommands(false).map((cmd13)=>cmd13.getName()
        ) || [];
    }
}
class EnumType extends Type {
    allowedValues;
    constructor(values){
        super();
        this.allowedValues = values;
    }
    parse(type) {
        for (const value4 of this.allowedValues){
            if (value4.toString() === type.value) {
                return value4;
            }
        }
        throw new InvalidTypeError(type, this.allowedValues.slice());
    }
    values() {
        return this.allowedValues.slice();
    }
    complete() {
        return this.values();
    }
}
class YAMLError extends Error {
    mark;
    constructor(message5 = "(unknown reason)", mark = ""){
        super(`${message5} ${mark}`);
        this.mark = mark;
        this.name = this.constructor.name;
    }
    toString(_compact) {
        return `${this.name}: ${this.message} ${this.mark}`;
    }
}
function isBoolean(value4) {
    return typeof value4 === "boolean" || value4 instanceof Boolean;
}
function isObject(value4) {
    return value4 !== null && typeof value4 === "object";
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
    constructor(name18, buffer, position1, line1, column){
        this.name = name18;
        this.buffer = buffer;
        this.position = position1;
        this.line = line1;
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
function compileList(schema, name19, result) {
    const exclude = [];
    for (const includedSchema of schema.include){
        result = compileList(includedSchema, name19, result);
    }
    for (const currentType of schema[name19]){
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
    for (const types2 of typesList){
        for (const type3 of types2){
            if (type3.kind !== null) {
                result[type3.kind][type3.tag] = result["fallback"][type3.tag] = type3;
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
    constructor(definition1){
        this.explicit = definition1.explicit || [];
        this.implicit = definition1.implicit || [];
        this.include = definition1.include || [];
        for (const type3 of this.implicit){
            if (type3.loadKind && type3.loadKind !== "scalar") {
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
    constructor(tag1, options7){
        this.tag = checkTagFormat(tag1);
        if (options7) {
            this.kind = options7.kind;
            this.resolve = options7.resolve || DEFAULT_RESOLVE;
            this.construct = options7.construct || DEFAULT_CONSTRUCT;
            this.instanceOf = options7.instanceOf;
            this.predicate = options7.predicate;
            this.represent = options7.represent;
            this.defaultStyle = options7.defaultStyle;
            this.styleAliases = options7.styleAliases;
        }
    }
    resolve = ()=>true
    ;
    construct = (data)=>data
    ;
}
class DenoStdInternalError1 extends Error {
    constructor(message6){
        super(message6);
        this.name = "DenoStdInternalError";
    }
}
function assert1(expr, msg = "") {
    if (!expr) {
        throw new DenoStdInternalError1(msg);
    }
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
        assert1(len <= this.#buf.buffer.byteLength);
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
    let code1;
    let bitlen = 0;
    const max = data.length;
    const map = BASE64_MAP;
    for(let idx = 0; idx < max; idx++){
        code1 = map.indexOf(data.charAt(idx));
        if (code1 > 64) continue;
        if (code1 < 0) return false;
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
    let value4 = data.replace(/_/g, "").toLowerCase();
    const sign = value4[0] === "-" ? -1 : 1;
    const digits = [];
    if ("+-".indexOf(value4[0]) >= 0) {
        value4 = value4.slice(1);
    }
    if (value4 === ".inf") {
        return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    }
    if (value4 === ".nan") {
        return NaN;
    }
    if (value4.indexOf(":") >= 0) {
        value4.split(":").forEach((v)=>{
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
    return sign * parseFloat(value4);
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
function reconstructFunction(code1) {
    const func = new Function(`return ${code1}`)();
    if (!(func instanceof Function)) {
        throw new TypeError(`Expected function but got ${typeof func}: ${code1}`);
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
    let value4 = data;
    const digits = [];
    if (value4.indexOf("_") !== -1) {
        value4 = value4.replace(/_/g, "");
    }
    let sign = 1;
    let ch = value4[0];
    if (ch === "-" || ch === "+") {
        if (ch === "-") sign = -1;
        value4 = value4.slice(1);
        ch = value4[0];
    }
    if (value4 === "0") return 0;
    if (ch === "0") {
        if (value4[1] === "b") return sign * parseInt(value4.slice(2), 2);
        if (value4[1] === "x") return sign * parseInt(value4, 16);
        return sign * parseInt(value4, 8);
    }
    if (value4.indexOf(":") !== -1) {
        value4.split(":").forEach((v)=>{
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
    return sign * parseInt(value4, 10);
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
        const regexp1 = `${data}`;
        if (regexp1.charAt(0) === "/") {
            if (!REGEXP.test(data)) {
                return false;
            }
            const modifiers = [
                ...regexp1.match(REGEXP)?.groups?.modifiers ?? ""
            ];
            if (new Set(modifiers).size < modifiers.length) {
                return false;
            }
        }
        return true;
    },
    construct (data) {
        const { regexp: regexp1 = `${data}` , modifiers =""  } = `${data}`.match(REGEXP)?.groups ?? {
        };
        return new RegExp(regexp1, modifiers);
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
const extended = new Schema({
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
    constructor(input, { filename , schema: schema1 , onWarning , legacy =false , json: json2 = false , listener =null  }){
        super(schema1);
        this.input = input;
        this.filename = filename;
        this.onWarning = onWarning;
        this.legacy = legacy;
        this.json = json2;
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
function generateError(state, message7) {
    return new YAMLError(message7, new Mark(state.filename, state.input, state.position, state.line, state.position - state.lineStart));
}
function throwError(state, message7) {
    throw generateError(state, message7);
}
function throwWarning(state, message7) {
    if (state.onWarning) {
        state.onWarning.call(null, generateError(state, message7));
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
            for(let position2 = 0, length = result.length; position2 < length; position2++){
                const character = result.charCodeAt(position2);
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
    for(let i1 = 0, len = keys.length; i1 < len; i1++){
        const key = keys[i1];
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
    let line2 = 0;
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
            line2 = state.line;
            const lineStart = state.lineStart;
            const lineIndent = state.lineIndent;
            skipSeparationSpace(state, false, -1);
            if (state.lineIndent >= nodeIndent) {
                hasPendingContent = true;
                ch = state.input.charCodeAt(state.position);
                continue;
            } else {
                state.position = captureEnd;
                state.line = line2;
                state.lineStart = lineStart;
                state.lineIndent = lineIndent;
                break;
            }
        }
        if (hasPendingContent) {
            captureSegment(state, captureStart, captureEnd, false);
            writeFoldedLines(state, state.line - line2);
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
    const tag2 = state.tag, anchor = state.anchor;
    let readNext = true;
    let valueNode, keyNode, keyTag = keyNode = valueNode = null, isExplicitPair, isPair = isExplicitPair = false;
    let following = 0, line2 = 0;
    const overridableKeys = {
    };
    while(ch !== 0){
        skipSeparationSpace(state, true, nodeIndent);
        ch = state.input.charCodeAt(state.position);
        if (ch === terminator) {
            state.position++;
            state.tag = tag2;
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
        line2 = state.line;
        composeNode(state, nodeIndent, 1, false, true);
        keyTag = state.tag || null;
        keyNode = state.result;
        skipSeparationSpace(state, true, nodeIndent);
        ch = state.input.charCodeAt(state.position);
        if ((isExplicitPair || state.line === line2) && ch === 58) {
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
    let line2, following, detected = false, ch;
    const tag2 = state.tag, anchor = state.anchor, result = [];
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
        line2 = state.line;
        composeNode(state, nodeIndent, 3, false, true);
        result.push(state.result);
        skipSeparationSpace(state, true, -1);
        ch = state.input.charCodeAt(state.position);
        if ((state.line === line2 || state.lineIndent > nodeIndent) && ch !== 0) {
            return throwError(state, "bad indentation of a sequence entry");
        } else if (state.lineIndent < nodeIndent) {
            break;
        }
    }
    if (detected) {
        state.tag = tag2;
        state.anchor = anchor;
        state.kind = "sequence";
        state.result = result;
        return true;
    }
    return false;
}
function readBlockMapping(state, nodeIndent, flowIndent) {
    const tag2 = state.tag, anchor = state.anchor, result = {
    }, overridableKeys = {
    };
    let following, allowCompact = false, line2, pos, keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
    if (state.anchor !== null && typeof state.anchor !== "undefined" && typeof state.anchorMap !== "undefined") {
        state.anchorMap[state.anchor] = result;
    }
    ch = state.input.charCodeAt(state.position);
    while(ch !== 0){
        following = state.input.charCodeAt(state.position + 1);
        line2 = state.line;
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
            if (state.line === line2) {
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
                    state.tag = tag2;
                    state.anchor = anchor;
                    return true;
                }
            } else if (detected) {
                return throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
            } else {
                state.tag = tag2;
                state.anchor = anchor;
                return true;
            }
        } else {
            break;
        }
        if (state.line === line2 || state.lineIndent > nodeIndent) {
            if (composeNode(state, nodeIndent, 4, true, allowCompact)) {
                if (atExplicitKey) {
                    keyNode = state.result;
                } else {
                    valueNode = state.result;
                }
            }
            if (!atExplicitKey) {
                storeMappingPair(state, result, overridableKeys, keyTag, keyNode, valueNode, line2, pos);
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
        state.tag = tag2;
        state.anchor = anchor;
        state.kind = "mapping";
        state.result = result;
    }
    return detected;
}
function readTagProperty(state) {
    let position2, isVerbatim = false, isNamed = false, tagHandle = "", tagName, ch;
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
    position2 = state.position;
    if (isVerbatim) {
        do {
            ch = state.input.charCodeAt(++state.position);
        }while (ch !== 0 && ch !== 62)
        if (state.position < state.length) {
            tagName = state.input.slice(position2, state.position);
            ch = state.input.charCodeAt(++state.position);
        } else {
            return throwError(state, "unexpected end of the stream within a verbatim tag");
        }
    } else {
        while(ch !== 0 && !isWsOrEol(ch)){
            if (ch === 33) {
                if (!isNamed) {
                    tagHandle = state.input.slice(position2 - 1, state.position + 1);
                    if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
                        return throwError(state, "named tag handle cannot contain such characters");
                    }
                    isNamed = true;
                    position2 = state.position + 1;
                } else {
                    return throwError(state, "tag suffix cannot contain exclamation marks");
                }
            }
            ch = state.input.charCodeAt(++state.position);
        }
        tagName = state.input.slice(position2, state.position);
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
    const position2 = state.position;
    while(ch !== 0 && !isWsOrEol(ch) && !isFlowIndicator(ch)){
        ch = state.input.charCodeAt(++state.position);
    }
    if (state.position === position2) {
        return throwError(state, "name of an anchor node must contain at least one character");
    }
    state.anchor = state.input.slice(position2, state.position);
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
    const alias2 = state.input.slice(_position, state.position);
    if (typeof state.anchorMap !== "undefined" && !Object.prototype.hasOwnProperty.call(state.anchorMap, alias2)) {
        return throwError(state, `unidentified alias "${alias2}"`);
    }
    if (typeof state.anchorMap !== "undefined") {
        state.result = state.anchorMap[alias2];
    }
    skipSeparationSpace(state, true, -1);
    return true;
}
function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
    let allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, type4, flowIndent, blockIndent;
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
                type4 = state.implicitTypes[typeIndex];
                if (type4.resolve(state.result)) {
                    state.result = type4.construct(state.result);
                    state.tag = type4.tag;
                    if (state.anchor !== null && typeof state.anchorMap !== "undefined") {
                        state.anchorMap[state.anchor] = state.result;
                    }
                    break;
                }
            }
        } else if (_hasOwnProperty2.call(state.typeMap[state.kind || "fallback"], state.tag)) {
            type4 = state.typeMap[state.kind || "fallback"][state.tag];
            if (state.result !== null && type4.kind !== state.kind) {
                return throwError(state, `unacceptable node kind for !<${state.tag}> tag; it should be "${type4.kind}", not "${state.kind}"`);
            }
            if (!type4.resolve(state.result)) {
                return throwError(state, `cannot resolve a node with !<${state.tag}> explicit tag`);
            } else {
                state.result = type4.construct(state.result);
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
    let position2, directiveName, directiveArgs, hasDirectives = false, ch;
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
        position2 = state.position;
        while(ch !== 0 && !isWsOrEol(ch)){
            ch = state.input.charCodeAt(++state.position);
        }
        directiveName = state.input.slice(position2, state.position);
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
            position2 = state.position;
            while(ch !== 0 && !isWsOrEol(ch)){
                ch = state.input.charCodeAt(++state.position);
            }
            directiveArgs.push(state.input.slice(position2, state.position));
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
function loadDocuments(input1, options8) {
    input1 = String(input1);
    options8 = options8 || {
    };
    if (input1.length !== 0) {
        if (input1.charCodeAt(input1.length - 1) !== 10 && input1.charCodeAt(input1.length - 1) !== 13) {
            input1 += "\n";
        }
        if (input1.charCodeAt(0) === 65279) {
            input1 = input1.slice(1);
        }
    }
    const state = new LoaderState(input1, options8);
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
function load(input1, options8) {
    const documents = loadDocuments(input1, options8);
    if (documents.length === 0) {
        return;
    }
    if (documents.length === 1) {
        return documents[0];
    }
    throw new YAMLError("expected a single document in the stream, but found more");
}
function parse4(content, options8) {
    return load(content, options8);
}
const _hasOwnProperty3 = Object.prototype.hasOwnProperty;
function compileStyleMap(schema2, map1) {
    if (typeof map1 === "undefined" || map1 === null) return {
    };
    let type4;
    const result = {
    };
    const keys = Object.keys(map1);
    let tag2, style;
    for(let index = 0, length = keys.length; index < length; index += 1){
        tag2 = keys[index];
        style = String(map1[tag2]);
        if (tag2.slice(0, 2) === "!!") {
            tag2 = `tag:yaml.org,2002:${tag2.slice(2)}`;
        }
        type4 = schema2.compiledTypeMap.fallback[tag2];
        if (type4 && typeof type4.styleAliases !== "undefined" && _hasOwnProperty3.call(type4.styleAliases, style)) {
            style = type4.styleAliases[style];
        }
        result[tag2] = style;
    }
    return result;
}
class DumperState extends State {
    indent;
    noArrayIndent;
    skipInvalid;
    flowLevel;
    sortKeys;
    lineWidth;
    noRefs;
    noCompatMode;
    condenseFlow;
    implicitTypes;
    explicitTypes;
    tag = null;
    result = "";
    duplicates = [];
    usedDuplicates = [];
    styleMap;
    dump;
    constructor({ schema: schema2 , indent =2 , noArrayIndent =false , skipInvalid =false , flowLevel =-1 , styles =null , sortKeys =false , lineWidth =80 , noRefs =false , noCompatMode =false , condenseFlow =false  }){
        super(schema2);
        this.indent = Math.max(1, indent);
        this.noArrayIndent = noArrayIndent;
        this.skipInvalid = skipInvalid;
        this.flowLevel = flowLevel;
        this.styleMap = compileStyleMap(this.schema, styles);
        this.sortKeys = sortKeys;
        this.lineWidth = lineWidth;
        this.noRefs = noRefs;
        this.noCompatMode = noCompatMode;
        this.condenseFlow = condenseFlow;
        this.implicitTypes = this.schema.compiledImplicit;
        this.explicitTypes = this.schema.compiledExplicit;
    }
}
const _toString2 = Object.prototype.toString;
const _hasOwnProperty4 = Object.prototype.hasOwnProperty;
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
    const string1 = character.toString(16).toUpperCase();
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
    return `\\${handle}${repeat("0", length - string1.length)}${string1}`;
}
function indentString(string1, spaces) {
    const ind = repeat(" ", spaces), length = string1.length;
    let position2 = 0, next = -1, result = "", line2;
    while(position2 < length){
        next = string1.indexOf("\n", position2);
        if (next === -1) {
            line2 = string1.slice(position2);
            position2 = length;
        } else {
            line2 = string1.slice(position2, next + 1);
            position2 = next + 1;
        }
        if (line2.length && line2 !== "\n") result += ind;
        result += line2;
    }
    return result;
}
function generateNextLine(state, level) {
    return `\n${repeat(" ", state.indent * level)}`;
}
function testImplicitResolving(state, str1) {
    let type4;
    for(let index = 0, length = state.implicitTypes.length; index < length; index += 1){
        type4 = state.implicitTypes[index];
        if (type4.resolve(str1)) {
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
function needIndentIndicator(string1) {
    const leadingSpaceRe = /^\n* /;
    return leadingSpaceRe.test(string1);
}
const STYLE_PLAIN = 1, STYLE_SINGLE = 2, STYLE_LITERAL = 3, STYLE_FOLDED = 4, STYLE_DOUBLE = 5;
function chooseScalarStyle(string1, singleLineOnly, indentPerLevel, lineWidth1, testAmbiguousType) {
    const shouldTrackWidth = lineWidth1 !== -1;
    let hasLineBreak = false, hasFoldableLine = false, previousLineBreak = -1, plain = isPlainSafeFirst(string1.charCodeAt(0)) && !isWhitespace(string1.charCodeAt(string1.length - 1));
    let __char, i1;
    if (singleLineOnly) {
        for(i1 = 0; i1 < string1.length; i1++){
            __char = string1.charCodeAt(i1);
            if (!isPrintable(__char)) {
                return 5;
            }
            plain = plain && isPlainSafe(__char);
        }
    } else {
        for(i1 = 0; i1 < string1.length; i1++){
            __char = string1.charCodeAt(i1);
            if (__char === 10) {
                hasLineBreak = true;
                if (shouldTrackWidth) {
                    hasFoldableLine = hasFoldableLine || i1 - previousLineBreak - 1 > lineWidth1 && string1[previousLineBreak + 1] !== " ";
                    previousLineBreak = i1;
                }
            } else if (!isPrintable(__char)) {
                return 5;
            }
            plain = plain && isPlainSafe(__char);
        }
        hasFoldableLine = hasFoldableLine || shouldTrackWidth && i1 - previousLineBreak - 1 > lineWidth1 && string1[previousLineBreak + 1] !== " ";
    }
    if (!hasLineBreak && !hasFoldableLine) {
        return plain && !testAmbiguousType(string1) ? 1 : 2;
    }
    if (indentPerLevel > 9 && needIndentIndicator(string1)) {
        return 5;
    }
    return hasFoldableLine ? 4 : 3;
}
function foldLine(line2, width) {
    if (line2 === "" || line2[0] === " ") return line2;
    const breakRe = / [^ ]/g;
    let match;
    let start = 0, end, curr = 0, next = 0;
    let result = "";
    while(match = breakRe.exec(line2)){
        next = match.index;
        if (next - start > width) {
            end = curr > start ? curr : next;
            result += `\n${line2.slice(start, end)}`;
            start = end + 1;
        }
        curr = next;
    }
    result += "\n";
    if (line2.length - start > width && curr > start) {
        result += `${line2.slice(start, curr)}\n${line2.slice(curr + 1)}`;
    } else {
        result += line2.slice(start);
    }
    return result.slice(1);
}
function dropEndingNewline(string1) {
    return string1[string1.length - 1] === "\n" ? string1.slice(0, -1) : string1;
}
function foldString(string1, width) {
    const lineRe = /(\n+)([^\n]*)/g;
    let result = (()=>{
        let nextLF = string1.indexOf("\n");
        nextLF = nextLF !== -1 ? nextLF : string1.length;
        lineRe.lastIndex = nextLF;
        return foldLine(string1.slice(0, nextLF), width);
    })();
    let prevMoreIndented = string1[0] === "\n" || string1[0] === " ";
    let moreIndented;
    let match;
    while(match = lineRe.exec(string1)){
        const prefix = match[1], line2 = match[2];
        moreIndented = line2[0] === " ";
        result += prefix + (!prevMoreIndented && !moreIndented && line2 !== "" ? "\n" : "") + foldLine(line2, width);
        prevMoreIndented = moreIndented;
    }
    return result;
}
function escapeString(string1) {
    let result = "";
    let __char, nextChar;
    let escapeSeq;
    for(let i1 = 0; i1 < string1.length; i1++){
        __char = string1.charCodeAt(i1);
        if (__char >= 55296 && __char <= 56319) {
            nextChar = string1.charCodeAt(i1 + 1);
            if (nextChar >= 56320 && nextChar <= 57343) {
                result += encodeHex((__char - 55296) * 1024 + nextChar - 56320 + 65536);
                i1++;
                continue;
            }
        }
        escapeSeq = ESCAPE_SEQUENCES[__char];
        result += !escapeSeq && isPrintable(__char) ? string1[i1] : escapeSeq || encodeHex(__char);
    }
    return result;
}
function blockHeader(string1, indentPerLevel) {
    const indentIndicator = needIndentIndicator(string1) ? String(indentPerLevel) : "";
    const clip = string1[string1.length - 1] === "\n";
    const keep = clip && (string1[string1.length - 2] === "\n" || string1 === "\n");
    const chomp = keep ? "+" : clip ? "" : "-";
    return `${indentIndicator}${chomp}\n`;
}
function writeScalar(state, string1, level, iskey) {
    state.dump = (()=>{
        if (string1.length === 0) {
            return "''";
        }
        if (!state.noCompatMode && DEPRECATED_BOOLEANS_SYNTAX.indexOf(string1) !== -1) {
            return `'${string1}'`;
        }
        const indent1 = state.indent * Math.max(1, level);
        const lineWidth1 = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent1);
        const singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
        function testAmbiguity(str1) {
            return testImplicitResolving(state, str1);
        }
        switch(chooseScalarStyle(string1, singleLineOnly, state.indent, lineWidth1, testAmbiguity)){
            case STYLE_PLAIN:
                return string1;
            case STYLE_SINGLE:
                return `'${string1.replace(/'/g, "''")}'`;
            case STYLE_LITERAL:
                return `|${blockHeader(string1, state.indent)}${dropEndingNewline(indentString(string1, indent1))}`;
            case STYLE_FOLDED:
                return `>${blockHeader(string1, state.indent)}${dropEndingNewline(indentString(foldString(string1, lineWidth1), indent1))}`;
            case STYLE_DOUBLE:
                return `"${escapeString(string1)}"`;
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
    let type4;
    let style;
    let _result;
    for(let index = 0, length = typeList.length; index < length; index += 1){
        type4 = typeList[index];
        if ((type4.instanceOf || type4.predicate) && (!type4.instanceOf || typeof object === "object" && object instanceof type4.instanceOf) && (!type4.predicate || type4.predicate(object))) {
            state.tag = explicit ? type4.tag : "?";
            if (type4.represent) {
                style = state.styleMap[type4.tag] || type4.defaultStyle;
                if (_toString2.call(type4.represent) === "[object Function]") {
                    _result = type4.represent(object, style);
                } else if (_hasOwnProperty4.call(type4.represent, style)) {
                    _result = type4.represent[style](object, style);
                } else {
                    throw new YAMLError(`!<${type4.tag}> tag resolver accepts not "${style}" style`);
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
    const type4 = _toString2.call(state.dump);
    if (block) {
        block = state.flowLevel < 0 || state.flowLevel > level;
    }
    const objectOrArray = type4 === "[object Object]" || type4 === "[object Array]";
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
        if (type4 === "[object Object]") {
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
        } else if (type4 === "[object Array]") {
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
        } else if (type4 === "[object String]") {
            if (state.tag !== "?") {
                writeScalar(state, state.dump, level, iskey);
            }
        } else {
            if (state.skipInvalid) return false;
            throw new YAMLError(`unacceptable kind of an object to dump ${type4}`);
        }
        if (state.tag !== null && state.tag !== "?") {
            state.dump = `!<${state.tag}> ${state.dump}`;
        }
    }
    return true;
}
const { Deno: Deno1  } = globalThis;
const noColor1 = typeof Deno1?.noColor === "boolean" ? Deno1.noColor : true;
let enabled1 = !noColor1;
function code1(open, close) {
    return {
        open: `\x1b[${open.join(";")}m`,
        close: `\x1b[${close}m`,
        regexp: new RegExp(`\\x1b\\[${close}m`, "g")
    };
}
function run2(str1, code2) {
    return enabled1 ? `${code2.open}${str1.replace(code2.regexp, code2.open)}${code2.close}` : str1;
}
function red1(str1) {
    return run2(str1, code1([
        31
    ], 39));
}
function green1(str1) {
    return run2(str1, code1([
        32
    ], 39));
}
const ANSI_PATTERN1 = new RegExp([
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))", 
].join("|"), "g");
const cache = {
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
    const cached = cache[hex];
    if (cached) return cached;
    let similar = 0;
    const closest1 = {
    };
    xtermcolors.forEach((hexcode, i1)=>{
        const res = hexColorDelta(hex, hexcode);
        if (res > similar) {
            similar = res;
            closest1.hex = hexcode;
            closest1.x = i1;
        }
    });
    cache[closest1.hex] = closest1.x;
    return closest1.x;
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
function crash(message7, data) {
    console.log(red1("Error: " + message7));
    if (data) console.log(red1(dataToText(data)));
    Deno.exit(1);
}
function dataToText(data) {
    return Object.keys(data).map((key)=>`- ${key}: ${data[key]}`
    ).join("\n");
}
const osType1 = (()=>{
    if (globalThis.Deno != null) {
        return Deno.build.os;
    }
    const navigator = globalThis.navigator;
    if (navigator?.appVersion?.includes?.("Win") ?? false) {
        return "windows";
    }
    return "linux";
})();
const isWindows1 = osType1 === "windows";
const CHAR_FORWARD_SLASH1 = 47;
function assertPath1(path2) {
    if (typeof path2 !== "string") {
        throw new TypeError(`Path must be a string. Received ${JSON.stringify(path2)}`);
    }
}
function isPosixPathSeparator1(code2) {
    return code2 === 47;
}
function isPathSeparator1(code2) {
    return isPosixPathSeparator1(code2) || code2 === 92;
}
function isWindowsDeviceRoot1(code2) {
    return code2 >= 97 && code2 <= 122 || code2 >= 65 && code2 <= 90;
}
function normalizeString1(path2, allowAboveRoot, separator, isPathSeparator2) {
    let res = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let code2;
    for(let i1 = 0, len = path2.length; i1 <= len; ++i1){
        if (i1 < len) code2 = path2.charCodeAt(i1);
        else if (isPathSeparator2(code2)) break;
        else code2 = CHAR_FORWARD_SLASH1;
        if (isPathSeparator2(code2)) {
            if (lastSlash === i1 - 1 || dots === 1) {
            } else if (lastSlash !== i1 - 1 && dots === 2) {
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
                        lastSlash = i1;
                        dots = 0;
                        continue;
                    } else if (res.length === 2 || res.length === 1) {
                        res = "";
                        lastSegmentLength = 0;
                        lastSlash = i1;
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
                if (res.length > 0) res += separator + path2.slice(lastSlash + 1, i1);
                else res = path2.slice(lastSlash + 1, i1);
                lastSegmentLength = i1 - lastSlash - 1;
            }
            lastSlash = i1;
            dots = 0;
        } else if (code2 === 46 && dots !== -1) {
            ++dots;
        } else {
            dots = -1;
        }
    }
    return res;
}
function _format1(sep3, pathObject) {
    const dir = pathObject.dir || pathObject.root;
    const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
    if (!dir) return base;
    if (dir === pathObject.root) return dir + base;
    return dir + sep3 + base;
}
const WHITESPACE_ENCODINGS1 = {
    "\u0009": "%09",
    "\u000A": "%0A",
    "\u000B": "%0B",
    "\u000C": "%0C",
    "\u000D": "%0D",
    "\u0020": "%20"
};
function encodeWhitespace1(string1) {
    return string1.replaceAll(/[\s]/g, (c)=>{
        return WHITESPACE_ENCODINGS1[c] ?? c;
    });
}
const sep3 = "\\";
const delimiter3 = ";";
function resolve4(...pathSegments) {
    let resolvedDevice = "";
    let resolvedTail = "";
    let resolvedAbsolute = false;
    for(let i1 = pathSegments.length - 1; i1 >= -1; i1--){
        let path2;
        if (i1 >= 0) {
            path2 = pathSegments[i1];
        } else if (!resolvedDevice) {
            if (globalThis.Deno == null) {
                throw new TypeError("Resolved a drive-letter-less path without a CWD.");
            }
            path2 = Deno.cwd();
        } else {
            if (globalThis.Deno == null) {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path2 = Deno.env.get(`=${resolvedDevice}`) || Deno.cwd();
            if (path2 === undefined || path2.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
                path2 = `${resolvedDevice}\\`;
            }
        }
        assertPath1(path2);
        const len = path2.length;
        if (len === 0) continue;
        let rootEnd = 0;
        let device = "";
        let isAbsolute3 = false;
        const code2 = path2.charCodeAt(0);
        if (len > 1) {
            if (isPathSeparator1(code2)) {
                isAbsolute3 = true;
                if (isPathSeparator1(path2.charCodeAt(1))) {
                    let j = 2;
                    let last = j;
                    for(; j < len; ++j){
                        if (isPathSeparator1(path2.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        const firstPart = path2.slice(last, j);
                        last = j;
                        for(; j < len; ++j){
                            if (!isPathSeparator1(path2.charCodeAt(j))) break;
                        }
                        if (j < len && j !== last) {
                            last = j;
                            for(; j < len; ++j){
                                if (isPathSeparator1(path2.charCodeAt(j))) break;
                            }
                            if (j === len) {
                                device = `\\\\${firstPart}\\${path2.slice(last)}`;
                                rootEnd = j;
                            } else if (j !== last) {
                                device = `\\\\${firstPart}\\${path2.slice(last, j)}`;
                                rootEnd = j;
                            }
                        }
                    }
                } else {
                    rootEnd = 1;
                }
            } else if (isWindowsDeviceRoot1(code2)) {
                if (path2.charCodeAt(1) === 58) {
                    device = path2.slice(0, 2);
                    rootEnd = 2;
                    if (len > 2) {
                        if (isPathSeparator1(path2.charCodeAt(2))) {
                            isAbsolute3 = true;
                            rootEnd = 3;
                        }
                    }
                }
            }
        } else if (isPathSeparator1(code2)) {
            rootEnd = 1;
            isAbsolute3 = true;
        }
        if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
            continue;
        }
        if (resolvedDevice.length === 0 && device.length > 0) {
            resolvedDevice = device;
        }
        if (!resolvedAbsolute) {
            resolvedTail = `${path2.slice(rootEnd)}\\${resolvedTail}`;
            resolvedAbsolute = isAbsolute3;
        }
        if (resolvedAbsolute && resolvedDevice.length > 0) break;
    }
    resolvedTail = normalizeString1(resolvedTail, !resolvedAbsolute, "\\", isPathSeparator1);
    return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
function normalize4(path2) {
    assertPath1(path2);
    const len = path2.length;
    if (len === 0) return ".";
    let rootEnd = 0;
    let device;
    let isAbsolute3 = false;
    const code2 = path2.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator1(code2)) {
            isAbsolute3 = true;
            if (isPathSeparator1(path2.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator1(path2.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    const firstPart = path2.slice(last, j);
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator1(path2.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator1(path2.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            return `\\\\${firstPart}\\${path2.slice(last)}\\`;
                        } else if (j !== last) {
                            device = `\\\\${firstPart}\\${path2.slice(last, j)}`;
                            rootEnd = j;
                        }
                    }
                }
            } else {
                rootEnd = 1;
            }
        } else if (isWindowsDeviceRoot1(code2)) {
            if (path2.charCodeAt(1) === 58) {
                device = path2.slice(0, 2);
                rootEnd = 2;
                if (len > 2) {
                    if (isPathSeparator1(path2.charCodeAt(2))) {
                        isAbsolute3 = true;
                        rootEnd = 3;
                    }
                }
            }
        }
    } else if (isPathSeparator1(code2)) {
        return "\\";
    }
    let tail;
    if (rootEnd < len) {
        tail = normalizeString1(path2.slice(rootEnd), !isAbsolute3, "\\", isPathSeparator1);
    } else {
        tail = "";
    }
    if (tail.length === 0 && !isAbsolute3) tail = ".";
    if (tail.length > 0 && isPathSeparator1(path2.charCodeAt(len - 1))) {
        tail += "\\";
    }
    if (device === undefined) {
        if (isAbsolute3) {
            if (tail.length > 0) return `\\${tail}`;
            else return "\\";
        } else if (tail.length > 0) {
            return tail;
        } else {
            return "";
        }
    } else if (isAbsolute3) {
        if (tail.length > 0) return `${device}\\${tail}`;
        else return `${device}\\`;
    } else if (tail.length > 0) {
        return device + tail;
    } else {
        return device;
    }
}
function isAbsolute3(path2) {
    assertPath1(path2);
    const len = path2.length;
    if (len === 0) return false;
    const code2 = path2.charCodeAt(0);
    if (isPathSeparator1(code2)) {
        return true;
    } else if (isWindowsDeviceRoot1(code2)) {
        if (len > 2 && path2.charCodeAt(1) === 58) {
            if (isPathSeparator1(path2.charCodeAt(2))) return true;
        }
    }
    return false;
}
function join3(...paths) {
    const pathsCount = paths.length;
    if (pathsCount === 0) return ".";
    let joined;
    let firstPart = null;
    for(let i1 = 0; i1 < pathsCount; ++i1){
        const path2 = paths[i1];
        assertPath1(path2);
        if (path2.length > 0) {
            if (joined === undefined) joined = firstPart = path2;
            else joined += `\\${path2}`;
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
    const fromOrig = resolve4(from);
    const toOrig = resolve4(to);
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
    let i1 = 0;
    for(; i1 <= length; ++i1){
        if (i1 === length) {
            if (toLen > length) {
                if (to.charCodeAt(toStart + i1) === 92) {
                    return toOrig.slice(toStart + i1 + 1);
                } else if (i1 === 2) {
                    return toOrig.slice(toStart + i1);
                }
            }
            if (fromLen > length) {
                if (from.charCodeAt(fromStart + i1) === 92) {
                    lastCommonSep = i1;
                } else if (i1 === 2) {
                    lastCommonSep = 3;
                }
            }
            break;
        }
        const fromCode = from.charCodeAt(fromStart + i1);
        const toCode = to.charCodeAt(toStart + i1);
        if (fromCode !== toCode) break;
        else if (fromCode === 92) lastCommonSep = i1;
    }
    if (i1 !== length && lastCommonSep === -1) {
        return toOrig;
    }
    let out = "";
    if (lastCommonSep === -1) lastCommonSep = 0;
    for(i1 = fromStart + lastCommonSep + 1; i1 <= fromEnd; ++i1){
        if (i1 === fromEnd || from.charCodeAt(i1) === 92) {
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
function toNamespacedPath3(path2) {
    if (typeof path2 !== "string") return path2;
    if (path2.length === 0) return "";
    const resolvedPath = resolve4(path2);
    if (resolvedPath.length >= 3) {
        if (resolvedPath.charCodeAt(0) === 92) {
            if (resolvedPath.charCodeAt(1) === 92) {
                const code2 = resolvedPath.charCodeAt(2);
                if (code2 !== 63 && code2 !== 46) {
                    return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
                }
            }
        } else if (isWindowsDeviceRoot1(resolvedPath.charCodeAt(0))) {
            if (resolvedPath.charCodeAt(1) === 58 && resolvedPath.charCodeAt(2) === 92) {
                return `\\\\?\\${resolvedPath}`;
            }
        }
    }
    return path2;
}
function dirname3(path2) {
    assertPath1(path2);
    const len = path2.length;
    if (len === 0) return ".";
    let rootEnd = -1;
    let end = -1;
    let matchedSlash = true;
    let offset = 0;
    const code2 = path2.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator1(code2)) {
            rootEnd = offset = 1;
            if (isPathSeparator1(path2.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator1(path2.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator1(path2.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator1(path2.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            return path2;
                        }
                        if (j !== last) {
                            rootEnd = offset = j + 1;
                        }
                    }
                }
            }
        } else if (isWindowsDeviceRoot1(code2)) {
            if (path2.charCodeAt(1) === 58) {
                rootEnd = offset = 2;
                if (len > 2) {
                    if (isPathSeparator1(path2.charCodeAt(2))) rootEnd = offset = 3;
                }
            }
        }
    } else if (isPathSeparator1(code2)) {
        return path2;
    }
    for(let i1 = len - 1; i1 >= offset; --i1){
        if (isPathSeparator1(path2.charCodeAt(i1))) {
            if (!matchedSlash) {
                end = i1;
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
    return path2.slice(0, end);
}
function basename3(path2, ext = "") {
    if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
    }
    assertPath1(path2);
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i1;
    if (path2.length >= 2) {
        const drive = path2.charCodeAt(0);
        if (isWindowsDeviceRoot1(drive)) {
            if (path2.charCodeAt(1) === 58) start = 2;
        }
    }
    if (ext !== undefined && ext.length > 0 && ext.length <= path2.length) {
        if (ext.length === path2.length && ext === path2) return "";
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for(i1 = path2.length - 1; i1 >= start; --i1){
            const code2 = path2.charCodeAt(i1);
            if (isPathSeparator1(code2)) {
                if (!matchedSlash) {
                    start = i1 + 1;
                    break;
                }
            } else {
                if (firstNonSlashEnd === -1) {
                    matchedSlash = false;
                    firstNonSlashEnd = i1 + 1;
                }
                if (extIdx >= 0) {
                    if (code2 === ext.charCodeAt(extIdx)) {
                        if ((--extIdx) === -1) {
                            end = i1;
                        }
                    } else {
                        extIdx = -1;
                        end = firstNonSlashEnd;
                    }
                }
            }
        }
        if (start === end) end = firstNonSlashEnd;
        else if (end === -1) end = path2.length;
        return path2.slice(start, end);
    } else {
        for(i1 = path2.length - 1; i1 >= start; --i1){
            if (isPathSeparator1(path2.charCodeAt(i1))) {
                if (!matchedSlash) {
                    start = i1 + 1;
                    break;
                }
            } else if (end === -1) {
                matchedSlash = false;
                end = i1 + 1;
            }
        }
        if (end === -1) return "";
        return path2.slice(start, end);
    }
}
function extname3(path2) {
    assertPath1(path2);
    let start = 0;
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    if (path2.length >= 2 && path2.charCodeAt(1) === 58 && isWindowsDeviceRoot1(path2.charCodeAt(0))) {
        start = startPart = 2;
    }
    for(let i1 = path2.length - 1; i1 >= start; --i1){
        const code2 = path2.charCodeAt(i1);
        if (isPathSeparator1(code2)) {
            if (!matchedSlash) {
                startPart = i1 + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i1 + 1;
        }
        if (code2 === 46) {
            if (startDot === -1) startDot = i1;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
    }
    return path2.slice(startDot, end);
}
function format3(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
    }
    return _format1("\\", pathObject);
}
function parse5(path2) {
    assertPath1(path2);
    const ret = {
        root: "",
        dir: "",
        base: "",
        ext: "",
        name: ""
    };
    const len = path2.length;
    if (len === 0) return ret;
    let rootEnd = 0;
    let code2 = path2.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator1(code2)) {
            rootEnd = 1;
            if (isPathSeparator1(path2.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator1(path2.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator1(path2.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator1(path2.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            rootEnd = j;
                        } else if (j !== last) {
                            rootEnd = j + 1;
                        }
                    }
                }
            }
        } else if (isWindowsDeviceRoot1(code2)) {
            if (path2.charCodeAt(1) === 58) {
                rootEnd = 2;
                if (len > 2) {
                    if (isPathSeparator1(path2.charCodeAt(2))) {
                        if (len === 3) {
                            ret.root = ret.dir = path2;
                            return ret;
                        }
                        rootEnd = 3;
                    }
                } else {
                    ret.root = ret.dir = path2;
                    return ret;
                }
            }
        }
    } else if (isPathSeparator1(code2)) {
        ret.root = ret.dir = path2;
        return ret;
    }
    if (rootEnd > 0) ret.root = path2.slice(0, rootEnd);
    let startDot = -1;
    let startPart = rootEnd;
    let end = -1;
    let matchedSlash = true;
    let i1 = path2.length - 1;
    let preDotState = 0;
    for(; i1 >= rootEnd; --i1){
        code2 = path2.charCodeAt(i1);
        if (isPathSeparator1(code2)) {
            if (!matchedSlash) {
                startPart = i1 + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i1 + 1;
        }
        if (code2 === 46) {
            if (startDot === -1) startDot = i1;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        if (end !== -1) {
            ret.base = ret.name = path2.slice(startPart, end);
        }
    } else {
        ret.name = path2.slice(startPart, startDot);
        ret.base = path2.slice(startPart, end);
        ret.ext = path2.slice(startDot, end);
    }
    if (startPart > 0 && startPart !== rootEnd) {
        ret.dir = path2.slice(0, startPart - 1);
    } else ret.dir = ret.root;
    return ret;
}
function fromFileUrl3(url) {
    url = url instanceof URL ? url : new URL(url);
    if (url.protocol != "file:") {
        throw new TypeError("Must be a file URL.");
    }
    let path2 = decodeURIComponent(url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
    if (url.hostname != "") {
        path2 = `\\\\${url.hostname}${path2}`;
    }
    return path2;
}
function toFileUrl3(path2) {
    if (!isAbsolute3(path2)) {
        throw new TypeError("Must be an absolute path.");
    }
    const [, hostname, pathname] = path2.match(/^(?:[/\\]{2}([^/\\]+)(?=[/\\](?:[^/\\]|$)))?(.*)/);
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
const mod3 = function() {
    return {
        sep: sep3,
        delimiter: delimiter3,
        resolve: resolve4,
        normalize: normalize4,
        isAbsolute: isAbsolute3,
        join: join3,
        relative: relative3,
        toNamespacedPath: toNamespacedPath3,
        dirname: dirname3,
        basename: basename3,
        extname: extname3,
        format: format3,
        parse: parse5,
        fromFileUrl: fromFileUrl3,
        toFileUrl: toFileUrl3
    };
}();
const sep4 = "/";
const delimiter4 = ":";
function resolve5(...pathSegments) {
    let resolvedPath = "";
    let resolvedAbsolute = false;
    for(let i1 = pathSegments.length - 1; i1 >= -1 && !resolvedAbsolute; i1--){
        let path2;
        if (i1 >= 0) path2 = pathSegments[i1];
        else {
            if (globalThis.Deno == null) {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path2 = Deno.cwd();
        }
        assertPath1(path2);
        if (path2.length === 0) {
            continue;
        }
        resolvedPath = `${path2}/${resolvedPath}`;
        resolvedAbsolute = path2.charCodeAt(0) === CHAR_FORWARD_SLASH1;
    }
    resolvedPath = normalizeString1(resolvedPath, !resolvedAbsolute, "/", isPosixPathSeparator1);
    if (resolvedAbsolute) {
        if (resolvedPath.length > 0) return `/${resolvedPath}`;
        else return "/";
    } else if (resolvedPath.length > 0) return resolvedPath;
    else return ".";
}
function normalize5(path2) {
    assertPath1(path2);
    if (path2.length === 0) return ".";
    const isAbsolute4 = path2.charCodeAt(0) === 47;
    const trailingSeparator = path2.charCodeAt(path2.length - 1) === 47;
    path2 = normalizeString1(path2, !isAbsolute4, "/", isPosixPathSeparator1);
    if (path2.length === 0 && !isAbsolute4) path2 = ".";
    if (path2.length > 0 && trailingSeparator) path2 += "/";
    if (isAbsolute4) return `/${path2}`;
    return path2;
}
function isAbsolute4(path2) {
    assertPath1(path2);
    return path2.length > 0 && path2.charCodeAt(0) === 47;
}
function join4(...paths) {
    if (paths.length === 0) return ".";
    let joined;
    for(let i1 = 0, len = paths.length; i1 < len; ++i1){
        const path2 = paths[i1];
        assertPath1(path2);
        if (path2.length > 0) {
            if (!joined) joined = path2;
            else joined += `/${path2}`;
        }
    }
    if (!joined) return ".";
    return normalize5(joined);
}
function relative4(from, to) {
    assertPath1(from);
    assertPath1(to);
    if (from === to) return "";
    from = resolve5(from);
    to = resolve5(to);
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
    let i1 = 0;
    for(; i1 <= length; ++i1){
        if (i1 === length) {
            if (toLen > length) {
                if (to.charCodeAt(toStart + i1) === 47) {
                    return to.slice(toStart + i1 + 1);
                } else if (i1 === 0) {
                    return to.slice(toStart + i1);
                }
            } else if (fromLen > length) {
                if (from.charCodeAt(fromStart + i1) === 47) {
                    lastCommonSep = i1;
                } else if (i1 === 0) {
                    lastCommonSep = 0;
                }
            }
            break;
        }
        const fromCode = from.charCodeAt(fromStart + i1);
        const toCode = to.charCodeAt(toStart + i1);
        if (fromCode !== toCode) break;
        else if (fromCode === 47) lastCommonSep = i1;
    }
    let out = "";
    for(i1 = fromStart + lastCommonSep + 1; i1 <= fromEnd; ++i1){
        if (i1 === fromEnd || from.charCodeAt(i1) === 47) {
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
function toNamespacedPath4(path2) {
    return path2;
}
function dirname4(path2) {
    assertPath1(path2);
    if (path2.length === 0) return ".";
    const hasRoot = path2.charCodeAt(0) === 47;
    let end = -1;
    let matchedSlash = true;
    for(let i1 = path2.length - 1; i1 >= 1; --i1){
        if (path2.charCodeAt(i1) === 47) {
            if (!matchedSlash) {
                end = i1;
                break;
            }
        } else {
            matchedSlash = false;
        }
    }
    if (end === -1) return hasRoot ? "/" : ".";
    if (hasRoot && end === 1) return "//";
    return path2.slice(0, end);
}
function basename4(path2, ext = "") {
    if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
    }
    assertPath1(path2);
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i1;
    if (ext !== undefined && ext.length > 0 && ext.length <= path2.length) {
        if (ext.length === path2.length && ext === path2) return "";
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for(i1 = path2.length - 1; i1 >= 0; --i1){
            const code2 = path2.charCodeAt(i1);
            if (code2 === 47) {
                if (!matchedSlash) {
                    start = i1 + 1;
                    break;
                }
            } else {
                if (firstNonSlashEnd === -1) {
                    matchedSlash = false;
                    firstNonSlashEnd = i1 + 1;
                }
                if (extIdx >= 0) {
                    if (code2 === ext.charCodeAt(extIdx)) {
                        if ((--extIdx) === -1) {
                            end = i1;
                        }
                    } else {
                        extIdx = -1;
                        end = firstNonSlashEnd;
                    }
                }
            }
        }
        if (start === end) end = firstNonSlashEnd;
        else if (end === -1) end = path2.length;
        return path2.slice(start, end);
    } else {
        for(i1 = path2.length - 1; i1 >= 0; --i1){
            if (path2.charCodeAt(i1) === 47) {
                if (!matchedSlash) {
                    start = i1 + 1;
                    break;
                }
            } else if (end === -1) {
                matchedSlash = false;
                end = i1 + 1;
            }
        }
        if (end === -1) return "";
        return path2.slice(start, end);
    }
}
function extname4(path2) {
    assertPath1(path2);
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    for(let i1 = path2.length - 1; i1 >= 0; --i1){
        const code2 = path2.charCodeAt(i1);
        if (code2 === 47) {
            if (!matchedSlash) {
                startPart = i1 + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i1 + 1;
        }
        if (code2 === 46) {
            if (startDot === -1) startDot = i1;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
    }
    return path2.slice(startDot, end);
}
function format4(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
    }
    return _format1("/", pathObject);
}
function parse6(path2) {
    assertPath1(path2);
    const ret = {
        root: "",
        dir: "",
        base: "",
        ext: "",
        name: ""
    };
    if (path2.length === 0) return ret;
    const isAbsolute5 = path2.charCodeAt(0) === 47;
    let start;
    if (isAbsolute5) {
        ret.root = "/";
        start = 1;
    } else {
        start = 0;
    }
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let i1 = path2.length - 1;
    let preDotState = 0;
    for(; i1 >= start; --i1){
        const code2 = path2.charCodeAt(i1);
        if (code2 === 47) {
            if (!matchedSlash) {
                startPart = i1 + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i1 + 1;
        }
        if (code2 === 46) {
            if (startDot === -1) startDot = i1;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        if (end !== -1) {
            if (startPart === 0 && isAbsolute5) {
                ret.base = ret.name = path2.slice(1, end);
            } else {
                ret.base = ret.name = path2.slice(startPart, end);
            }
        }
    } else {
        if (startPart === 0 && isAbsolute5) {
            ret.name = path2.slice(1, startDot);
            ret.base = path2.slice(1, end);
        } else {
            ret.name = path2.slice(startPart, startDot);
            ret.base = path2.slice(startPart, end);
        }
        ret.ext = path2.slice(startDot, end);
    }
    if (startPart > 0) ret.dir = path2.slice(0, startPart - 1);
    else if (isAbsolute5) ret.dir = "/";
    return ret;
}
function fromFileUrl4(url) {
    url = url instanceof URL ? url : new URL(url);
    if (url.protocol != "file:") {
        throw new TypeError("Must be a file URL.");
    }
    return decodeURIComponent(url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"));
}
function toFileUrl4(path2) {
    if (!isAbsolute4(path2)) {
        throw new TypeError("Must be an absolute path.");
    }
    const url = new URL("file:///");
    url.pathname = encodeWhitespace1(path2.replace(/%/g, "%25").replace(/\\/g, "%5C"));
    return url;
}
const mod4 = function() {
    return {
        sep: sep4,
        delimiter: delimiter4,
        resolve: resolve5,
        normalize: normalize5,
        isAbsolute: isAbsolute4,
        join: join4,
        relative: relative4,
        toNamespacedPath: toNamespacedPath4,
        dirname: dirname4,
        basename: basename4,
        extname: extname4,
        format: format4,
        parse: parse6,
        fromFileUrl: fromFileUrl4,
        toFileUrl: toFileUrl4
    };
}();
const path2 = isWindows1 ? mod3 : mod4;
const { basename: basename5 , delimiter: delimiter5 , dirname: dirname5 , extname: extname5 , format: format5 , fromFileUrl: fromFileUrl5 , isAbsolute: isAbsolute5 , join: join5 , normalize: normalize6 , parse: parse7 , relative: relative5 , resolve: resolve6 , sep: sep5 , toFileUrl: toFileUrl5 , toNamespacedPath: toNamespacedPath5 ,  } = path2;
function _createWalkEntrySync(path3) {
    path3 = normalize6(path3);
    const name19 = basename5(path3);
    const info = Deno.statSync(path3);
    return {
        path: path3,
        name: name19,
        isFile: info.isFile,
        isDirectory: info.isDirectory,
        isSymlink: info.isSymlink
    };
}
function include(path3, exts, match, skip) {
    if (exts && !exts.some((ext)=>path3.endsWith(ext)
    )) {
        return false;
    }
    if (match && !match.some((pattern)=>!!path3.match(pattern)
    )) {
        return false;
    }
    if (skip && skip.some((pattern)=>!!path3.match(pattern)
    )) {
        return false;
    }
    return true;
}
function wrapErrorWithRootPath(err, root) {
    if (err.root) return err;
    err.root = root;
    err.message = `${err.message} for path "${root}"`;
    return err;
}
function* walkSync(root, { maxDepth =Infinity , includeFiles =true , includeDirs =true , followSymlinks =false , exts =undefined , match =undefined , skip =undefined  } = {
}) {
    if (maxDepth < 0) {
        return;
    }
    if (includeDirs && include(root, exts, match, skip)) {
        yield _createWalkEntrySync(root);
    }
    if (maxDepth < 1 || !include(root, undefined, undefined, skip)) {
        return;
    }
    let entries;
    try {
        entries = Deno.readDirSync(root);
    } catch (err) {
        throw wrapErrorWithRootPath(err, normalize6(root));
    }
    for (const entry of entries){
        assert1(entry.name != null);
        let path3 = join5(root, entry.name);
        if (entry.isSymlink) {
            if (followSymlinks) {
                path3 = Deno.realPathSync(path3);
            } else {
                continue;
            }
        }
        if (entry.isFile) {
            if (includeFiles && include(path3, exts, match, skip)) {
                yield {
                    path: path3,
                    ...entry
                };
            }
        } else {
            yield* walkSync(path3, {
                maxDepth: maxDepth - 1,
                includeFiles,
                includeDirs,
                followSymlinks,
                exts,
                match,
                skip
            });
        }
    }
}
var EOL1;
(function(EOL2) {
    EOL2["LF"] = "\n";
    EOL2["CRLF"] = "\r\n";
})(EOL1 || (EOL1 = {
}));
const isCompiled = Deno.mainModule === "file://$deno$/bundle.js";
function getConf(options8) {
    const baseUrl = options8.optionsUrl.replace(/[^\/]+$/, "").slice(7);
    const conf = {
        key: options8.key,
        baseUrl,
        entryUrl: resolve6(baseUrl, options8.entry),
        buckets: options8.buckets.map((opts)=>{
            const walkConf = {
            };
            if ("maxDepth" in opts) walkConf.maxDepth = opts.maxDepth;
            if ("exts" in opts) walkConf.exts = opts.exts;
            if ("match" in opts) walkConf.match = opts.match;
            if ("skip" in opts) walkConf.skip = opts.skip;
            return {
                name: opts.name,
                folderUrl: resolve6(baseUrl, opts.folder),
                walkConf,
                trimExtensions: opts.trimExtensions,
                decoder: opts.decoder
            };
        })
    };
    if ("output" in options8) {
        conf.outputUrl = resolve6(baseUrl, options8.output);
    }
    return conf;
}
function loadBuckets(options8) {
    return !isCompiled && !window.BUCKETS_FS?.[options8.key] ? Object.freeze(getStore(getConf(options8))) : window.BUCKETS_FS[options8.key];
}
function getStore(options8) {
    return Object.fromEntries(options8.buckets.map((conf)=>[
            conf.name,
            getBucketData(conf)
        ]
    ));
}
function getBucketData(conf) {
    const bucket = {
    };
    const walkConf = Object.assign({
        includeDirs: false
    }, conf.walkConf);
    for (const e of walkSync(conf.folderUrl, walkConf)){
        const propName = getPropPath(conf.folderUrl, e.path);
        const finalPropName = removeExtension(propName, conf);
        bucket[finalPropName] = conf.decoder ? conf.decoder(Deno.readFileSync(e.path)) : Deno.readTextFileSync(e.path);
    }
    return bucket;
}
function getPropPath(folder, file) {
    const len = folder.length - file.length + 1;
    return file.slice(len);
}
function removeExtension(name19, conf) {
    if (!conf.trimExtensions || !conf.walkConf.exts?.length) {
        return name19;
    }
    const extension = conf.walkConf.exts.find((ext)=>name19.endsWith(ext)
    ) || "";
    const len = extension.length;
    return name19.slice(0, name19.length - len);
}
const importMeta = {
    url: "file:///home/jacobo/dev/estilo/conf.ts",
    main: false
};
const __default2 = {
    key: "estilo-key",
    entry: "./estilo.ts",
    optionsUrl: importMeta.url,
    buckets: [
        {
            name: "mustaches",
            folder: "assets/mustaches",
            exts: [
                ".hbs"
            ]
        },
        {
            name: "syntax",
            folder: "assets/syntax",
            exts: [
                ".yml"
            ]
        },
        {
            name: "addons",
            folder: "assets/addons",
            exts: [
                ".yml"
            ]
        }, 
    ],
    output: "dist/estilo.js"
};
const buckets = loadBuckets(__default2);
const tick = green1("✓");
function installTemplates(projectPath, templates) {
    templates.forEach((name19)=>{
        const destination = resolve2(projectPath, "estilos/syntax", name19);
        try {
            Deno.writeTextFileSync(destination, buckets.syntax[name19]);
        } catch (err) {
            console.error(err);
        }
    });
    console.log(green1(`Added ${templates.length} templates:`));
    console.log(templates.map((name19)=>name19.slice(0, -4)
    ).map((name19)=>`${tick} ${name19}\n`
    ).join(""));
}
const defaultPalette = "myblue: '#99ccff'";
async function createProject(projectPath, noQuestions) {
    const options8 = noQuestions ? getDefaultConfig(projectPath) : await askConfig(projectPath);
    createBoilerplate(projectPath, options8);
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
        }, 
    ]);
}
function createBoilerplate(projectPath, options8) {
    const estiloStr = renderConfigFile(options8);
    const estilosFolder = resolve2(projectPath, "estilos");
    const syntaxFolder = resolve2(estilosFolder, "syntax");
    const palettesFolder = resolve2(estilosFolder, "palettes");
    ensureDirSync(estilosFolder);
    ensureDirSync(syntaxFolder);
    ensureDirSync(palettesFolder);
    Deno.writeTextFileSync(resolve2(projectPath, "estilo.yml"), estiloStr);
    Deno.writeTextFileSync(resolve2(estilosFolder, "terminal.yml"), buckets.addons["terminal.yml"]);
    Deno.writeTextFileSync(resolve2(palettesFolder, options8.name + ".yml"), defaultPalette);
    installTemplates(projectPath, [
        "base.yml"
    ]);
    console.log(green1("✓  Your project is ready\n"));
}
function renderConfigFile(options8) {
    const render = __default.compile(buckets.mustaches["project.hbs"]);
    return render(options8);
}
function isHexColor1(color) {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
}
function loadYml(folderPath, filename1) {
    const filepath = resolve2(folderPath, filename1 || "");
    const content = parse4(Deno.readTextFileSync(filepath));
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
    const colors = Object.keys(content).map((name19)=>{
        const hexcolor = content[name19].trim();
        if (!isHexColor1(hexcolor)) {
            crash("Wrong color in common palette", {
                name: name19
            });
        }
        return [
            name19,
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
        name: basename2(filepath, ".yml"),
        colors: {
        }
    };
    Object.entries(content).forEach(([name19, value4])=>{
        const hexcolor = value4.trim();
        if (hexcolor.startsWith("@")) {
            const propName = hexcolor.slice(1);
            const color = common[propName];
            if (!color) crash("Missing common color", {
                color
            });
            palette.colors[name19] = color;
            return;
        }
        if (!isHexColor1(hexcolor)) crash("Wrong color", {
            filepath,
            name: name19
        });
        palette.colors[name19] = {
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
    return Object.entries(file.content).map(([name19, value4])=>({
            filepath,
            name: name19,
            rule: value4.trim()
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
    const files1 = statusFiles.map(({ filepath , content  })=>{
        const style = formatStatusStyle(content, brand, filepath);
        return [
            style.name,
            style
        ];
    });
    return Object.fromEntries(files1);
}
function formatStatusStyle(content, brand, filepath) {
    const statusStyle = {
        name: basename2(filepath, ".yml"),
        filepath,
        syntax: {
        }
    };
    Object.keys(content).forEach((name19)=>{
        const txt = content[name19].trim();
        statusStyle.syntax[name19] = txt.split(/\s+/);
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
    return ymlsInFolder(folderUrl).map((filepath)=>loadYml(filepath)
    );
}
function ymlsInFolder(folderPath, folder2) {
    const finalPath = resolve2(folderPath, folder2 || "");
    if (!existsSync(finalPath)) return [];
    return Array.from(Deno.readDirSync(finalPath)).filter((file)=>file.name.endsWith(".yml")
    ).map((file)=>resolve2(finalPath, file.name)
    );
}
async function selectSyntax(projectPath, all = false) {
    const destFolder = resolve2(projectPath, "estilo/syntax");
    const libFiles = Object.keys(buckets.syntax);
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
    const options8 = libFiles.map((value4)=>{
        const disabled = destFiles.includes(value4);
        const name19 = value4.slice(0, -4);
        return {
            name: name19 + (disabled ? " (installed)" : ""),
            value: value4,
            disabled
        };
    });
    return await prompt([
        {
            type: Checkbox,
            message: "Select some extra syntax templates",
            name: "templates",
            options: options8
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
function isLegacyUi(value4) {
    return !value4.split("").some((character)=>{
        return !uis.has(character);
    });
}
function parseLegacyUi(style) {
    return style.split("").map((val)=>uiValues[val]
    ).join(",");
}
function renderColorscheme(config, project) {
    const palette = project.palettes[config.palette];
    if (!palette) {
        crash("Colorscheme palette does not exist", {
            colorscheme: config.name,
            palette: config.palette
        });
    }
    const render = __default.compile(buckets.mustaches["colorscheme.hbs"]);
    return render({
        info: {
            name: config.name,
            description: config.description,
            url: project.config.url,
            author: project.config.author,
            license: project.config.license,
            background: config.background,
            estiloVersion: __default1
        },
        stacks: parseSyntaxColors(project.syntax, palette),
        term: parseTermColors(project.terminalSyntax, palette)
    });
}
function parseTermColors(termSyntax, palette) {
    const values1 = Object.keys(termSyntax).map((prop)=>{
        const colorName = termSyntax[prop];
        const value4 = palette.colors[colorName];
        if (!value4) {
            crash("Missing terminal color", {
                colorName,
                property: prop,
                palette: palette.filepath
            });
        }
        return [
            prop,
            value4.hex
        ];
    });
    return Object.fromEntries(values1);
}
function parseSyntaxColors(syntax, palette) {
    const values1 = {
    };
    syntax.forEach((rule)=>{
        const [fgColor, bgColor, ui, curlColor] = rule.rule.split(/\s+/);
        const filepath = rule.filepath;
        if (fgColor.startsWith("@")) {
            values1[rule.name] = {
                link: fgColor.slice(1)
            };
        } else {
            values1[rule.name] = {
                fore: getColorCode(fgColor, palette, filepath),
                back: getColorCode(bgColor, palette, filepath),
                ui: getUI(ui),
                guisp: getCurlColor(curlColor, palette, filepath)
            };
        }
    });
    return values1;
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
function renderStatus(config, project, brand) {
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
        estiloVersion: __default1
    };
    const context = Object.assign(c, {
        info
    });
    const render = __default.compile(buckets.mustaches[brand + ".hbs"]);
    return render(context);
}
function renderProject(project) {
    const { config: projectConfig  } = project;
    for (const config of projectConfig.colorschemes){
        const rendered = renderColorscheme(config, project);
        writeScheme(rendered, config.name, project.projectUrl);
    }
    if (projectConfig.airline) {
        for (const config1 of projectConfig.airline){
            const rendered = renderStatus(config1, project, "airline");
            writeStatus("airline", rendered, config1.name, project.projectUrl);
        }
    }
    if (projectConfig.lightline) {
        for (const config1 of projectConfig.lightline){
            const rendered = renderStatus(config1, project, "lightline");
            writeStatus("lightline", rendered, config1.name, project.projectUrl);
        }
    }
    console.log(green1("✓  Done, your theme is ready\n"));
}
const paths = {
    airline: "autoload/airline/themes",
    lightline: "autoload/lightline/colorscheme"
};
function writeScheme(txt, name19, projectPath) {
    const folderPath = resolve2(projectPath, "colors");
    const filepath = resolve2(folderPath, name19 + ".vim");
    ensureDirSync(folderPath);
    Deno.writeTextFileSync(filepath, txt);
}
function writeStatus(kind, txt, name19, projectPath) {
    const folderPath = resolve2(projectPath, paths[kind]);
    const filepath = resolve2(folderPath, name19 + ".vim");
    ensureDirSync(folderPath);
    Deno.writeTextFileSync(filepath, txt);
}
async function installStatus(projectPath, brand, styleName) {
    const statusFolderPath = resolve2(projectPath, "estilo", brand);
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
            validate: (input1)=>{
                const stylename = input1.trim();
                if (!stylename) return "That's not a name";
                return installedStyles.includes(stylename) ? "That style already exists" : true;
            }
        }, 
    ]);
    addStatus(projectPath, brand, answers.stylename);
}
function addStatus(projectPath, brand, styleName) {
    const folderPath = resolve2(projectPath, "estilos", brand);
    ensureDirSync(folderPath);
    const filepath = resolve2(folderPath, styleName + ".yml");
    Deno.writeTextFileSync(filepath, buckets.addons[brand + ".yml"]);
    console.log(green1(`New ${brand} style: ${styleName}`));
    console.log(`==> ${filepath}`);
}
const estiloCommand = new Command();
const result = await estiloCommand.command("help", new HelpCommand().global()).reset().name("estilo").version(__default1).description("Generate colorschemes for (neo)vim, airline and lightline").command("create [folder]").description("Initialize an estilo project in [folder] or current folder").option("-y, --yes", "Skip questions").action((options8, folder = ".")=>{
    createProject(resolve2(folder), !!options8.yes);
}).reset().command("render [folder]").description("Render project").action((_, folder = ".")=>{
    const projectPath = resolve2(folder);
    checkProject(projectPath);
    const project = loadProjectFiles(projectPath);
    renderProject(project);
}).reset().command("add-syntax").description("Add syntax templates.").option("-a, --all [all:boolean]", "Add add available syntax templates").action((options8)=>{
    selectSyntax(".", !!options8.all);
}).reset().command("add-lightline [styleName]").description("Add new Lightline style").action((_, styleName)=>{
    installStatus(".", "lightline", styleName);
}).reset().command("add-airline [styleName]").description("Add new Airline style").action((_, styleName)=>{
    installStatus(".", "airline", styleName);
}).reset().parse(Deno.args);
if (!Object.entries(result.options).length && result.cmd._name === "estilo") {
    estiloCommand.showHelp();
}
function checkProject(projectPath) {
    const paths1 = [
        "estilo.yml",
        "estilos/syntax",
        "estilos/palettes",
        "estilos/terminal.yml", 
    ];
    const notOk = paths1.map((path3)=>resolve2(projectPath, path3)
    ).filter((path3)=>!existsSync(path3)
    );
    if (notOk.length) {
        if (existsSync(resolve2(projectPath, "estilo"))) {
            crash(`⚠ Wrong project folder. Follow upgrade instructions please`);
        } else {
            crash(`⚠ Wrong project folder. Missing paths:\n${notOk.join("\n")}`);
        }
    }
}
