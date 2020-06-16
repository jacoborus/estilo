import { loadSyntax } from '../src/loaders'
import * as util from '../src/util'

jest.mock('../src/util')

const mockedUtil = util as jest.Mocked<typeof util>

mockedUtil.loadYml.mockReturnValue({
  filepath: 'filepath.yml',
  content: {
    rule0: '   rule0 content  ',
    rule1: '   rule1 content  '
  }
})

test('loadSyntax', () => {
  const syntax = loadSyntax('whatever.yml')

  expect(syntax[0].filepath).toBe('whatever.yml')
  expect(syntax[0].name).toBe('rule0')
  expect(syntax[0].rule).toBe('rule0 content')

  expect(syntax[1].filepath).toBe('whatever.yml')
  expect(syntax[1].name).toBe('rule1')
  expect(syntax[1].rule).toBe('rule1 content')

  expect(mockedUtil.loadYml).toBeCalledWith('whatever.yml')
})
