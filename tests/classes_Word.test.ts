import Word, { errors } from '../classes/Word'

test('Test word method', () => {
  expect(new Word('labas').word).toBe('labas')
  expect(() => new Word('0')).toThrow(errors.Lithuanian)
  expect(() => new Word('aqua')).toThrow(errors.Lithuanian)
  expect(() => new Word('')).toThrow(errors.Lithuanian)
  expect(() => new Word(' ')).toThrow(errors.Lithuanian)
  expect(() => new Word('labas vakaras')).toThrow(errors.Lithuanian)
})
test('Test English method', () => {
  const word = new Word('labas')

  expect(
    (() => {
      word.english = 'hi'
      return word.english
    })()
  ).toBe('hi')

  expect(
    (() => {
      word.english = ''
      return word.english
    })()
  ).toBe('')

  expect(() => (word.english = 'ačiū')).toThrow(errors.English)
  expect(() => (word.english = 'a5')).toThrow(errors.English)
})
