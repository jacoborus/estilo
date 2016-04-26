'use strict'

module.exports = function (info) {
  return `let colors_name="${info.scheme}"
hi clear
if exists("syntax_on")
syntax reset
endif
if has("gui_running")
set background=${info.background}
endif`
}
