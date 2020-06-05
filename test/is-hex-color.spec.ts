import isHex from '../src/is-hex-color'

test('isHexColor recognizes 3 characters color codes', () => {
  expect(isHex('#333')).toBe(true)
  expect(isHex('#abc')).toBe(true)
  expect(isHex('333')).toBe(false)
  expect(isHex('#abc#')).toBe(false)
  expect(isHex('ab')).toBe(false)
  expect(isHex('abcd')).toBe(false)
})

it('isHexColor recognizes 6 characters color codes', () => {
  expect(isHex('#333def')).toBe(true)
  expect(isHex('#abc123')).toBe(true)
  expect(isHex('abc123')).toBe(false)
  expect(isHex('#abc#88')).toBe(false)
})
