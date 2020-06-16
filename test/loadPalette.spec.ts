import { loadPalette } from '../src/loaders'
import * as util from '../src/util'

jest.mock('../src/util')

const mockedUtil = util as jest.Mocked<typeof util>

mockedUtil.loadYml.mockReturnValue({
  filepath: 'a-filepath',
  content: {
    blue: '#5af',
    green: '#5fa'
  }
})

mockedUtil.isHexColor.mockReturnValue(true)

describe('loadPalette', () => {
  test('loads normal palette', () => {
    const palette = loadPalette('whatever')
    expect(palette.filepath).toBe('whatever')
    expect(palette.name).toBe('whatever')
    expect(mockedUtil.loadYml).toBeCalledWith('whatever')
    expect(mockedUtil.isHexColor).toBeCalledWith('#5fa')
    expect(mockedUtil.isHexColor).toBeCalledWith('#5af')
  })
})
