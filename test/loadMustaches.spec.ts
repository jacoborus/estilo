import path from 'path'
import fs from 'fs'
import { loadMustaches } from '../src/loaders'

jest.mock('path')
const mockedPath = path as jest.Mocked<typeof path>
mockedPath.resolve.mockReturnValue('mypath')

jest.mock('fs')
const mockedFs = fs as jest.Mocked<typeof fs>
mockedFs.readFileSync.mockReturnValue('hola')

test('loadMustaches', () => {
  const mustaches = loadMustaches()
  expect(mockedPath.resolve).toHaveBeenCalledWith('mypath', 'airline.hbs')
  expect(mockedPath.resolve).toHaveBeenCalledWith('mypath', 'lightline.hbs')
  expect(mockedPath.resolve).toHaveBeenCalledWith('mypath', 'colorscheme.hbs')
  expect(mockedFs.readFileSync).toHaveBeenCalledWith('mypath', 'utf8')
  expect(mockedFs.readFileSync).toHaveBeenCalledWith('mypath', 'utf8')
  expect(mockedFs.readFileSync).toHaveBeenCalledWith('mypath', 'utf8')
  expect(mustaches.colorscheme).toBe('hola')
  expect(mustaches.airline).toBe('hola')
  expect(mustaches.lightline).toBe('hola')
})
