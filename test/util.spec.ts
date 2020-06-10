import { isHexColor } from '../src/util'

test('isHexColor recognizes 3 characters color codes', () => {
  expect(isHexColor('#333')).toBe(true)
  expect(isHexColor('#abc')).toBe(true)
  expect(isHexColor('333')).toBe(false)
  expect(isHexColor('#abc#')).toBe(false)
  expect(isHexColor('ab')).toBe(false)
  expect(isHexColor('abcd')).toBe(false)
})

it('isHexColor recognizes 6 characters color codes', () => {
  expect(isHexColor('#333def')).toBe(true)
  expect(isHexColor('#abc123')).toBe(true)
  expect(isHexColor('abc123')).toBe(false)
  expect(isHexColor('#abc#88')).toBe(false)
})
