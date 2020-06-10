import { renderStatus } from '../src/render-status'

const result = `if exists('g:pkgName_lightline') && g:pkgName_lightline
  let s:p = {"normal": {}, "inactive": {}, "insert": {}, "replace": {}, "visual": {}, "tabline": {}}
  let s:p.normal.left = [[["#111111", 233], ["#555555", 240]], [["#999999", 246], ["#111111", 233]]]
  let s:p.normal.middle = [[["#555555", 240], ["#999999", 246]]]
  let s:p.normal.right = [[["#111111", 233], ["#555555", 240]], [["#999999", 246], ["#111111", 233]]]
  let s:p.normal.error = [[["#555555", 240], ["#999999", 246]]]
  let s:p.normal.warning = [[["#555555", 240], ["#999999", 246]]]
  let s:p.inactive.left = [[["#111111", 233], ["#555555", 240]], [["#999999", 246], ["#111111", 233]]]
  let s:p.inactive.middle = [[["#555555", 240], ["#999999", 246]]]
  let s:p.inactive.right = [[["#111111", 233], ["#555555", 240]], [["#999999", 246], ["#111111", 233]]]
  let s:p.insert.left = [[["#111111", 233], ["#555555", 240]], [["#999999", 246], ["#111111", 233]]]
  let s:p.insert.middle = [[["#555555", 240], ["#999999", 246]]]
  let s:p.insert.right = [[["#111111", 233], ["#555555", 240]], [["#999999", 246], ["#111111", 233]]]
  let s:p.replace.left = [[["#111111", 233], ["#555555", 240]], [["#999999", 246], ["#111111", 233]]]
  let s:p.replace.middle = [[["#555555", 240], ["#999999", 246]]]
  let s:p.replace.right = [[["#111111", 233], ["#555555", 240]], [["#999999", 246], ["#111111", 233]]]
  let s:p.visual.left = [[["#111111", 233], ["#555555", 240]], [["#999999", 246], ["#111111", 233]]]
  let s:p.visual.middle = [[["#555555", 240], ["#999999", 246]]]
  let s:p.visual.right = [[["#111111", 233], ["#555555", 240]], [["#999999", 246], ["#111111", 233]]]
  let s:p.tabline.left = [[["#555555", 240], ["#999999", 246]]]
  let s:p.tabline.tabsel = [[["#555555", 240], ["#999999", 246]]]
  let s:p.tabline.middle = [[["#555555", 240], ["#999999", 246]]]
  let s:p.tabline.right = [[["#555555", 240], ["#999999", 246]]]
  let g:lightline#colorscheme#testing#palette = lightline#colorscheme#flatten(s:p)
endif
`

const tmpl = {
  normal1: 'one five',
  normal2: 'nine one',
  normal3: 'five nine',
  normal4: 'one five',
  normal5: 'nine one',
  normalError: 'five nine',
  normalWarning: 'five nine',
  inactive1: 'one five',
  inactive2: 'nine one',
  inactive3: 'five nine',
  inactive4: 'one five',
  inactive5: 'nine one',
  insert1: 'one five',
  insert2: 'nine one',
  insert3: 'five nine',
  insert4: 'one five',
  insert5: 'nine one',
  replace1: 'one five',
  replace2: 'nine one',
  replace3: 'five nine',
  replace4: 'one five',
  replace5: 'nine one',
  visual1: 'one five',
  visual2: 'nine one',
  visual3: 'five nine',
  visual4: 'one five',
  visual5: 'nine one',
  tablineLeft: 'five nine',
  tablineSelected: 'five nine',
  tablineMiddle: 'five nine',
  tablineRight: 'five nine'
}

const colors = {
  one: '#111111',
  five: '#555555',
  nine: '#999999'
}

test.skip('printLightline', () => {
  renderStatus()
  const rendered = renderStatus(config, project, 'lightline')
  expect(rendered).toBe(result)
})
