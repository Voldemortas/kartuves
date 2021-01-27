import Game from '../classes/Game'

test('Test blank name', () => {
  expect(new Game('mama').word).toBe('____')
  expect(new Game('mama', '', ['c']).word).toBe('____')
  expect(new Game('mama', '', ['a']).word).toBe('_a_a')
  expect(new Game('mama', '', ['a', 'k']).word).toBe('_a_a')
  expect(new Game('mama', '', ['a', 'm']).word).toBe('mama')
  expect(new Game('mama', '', ['m', 'a']).word).toBe('mama')
  expect(new Game('mama', '', ['m', 'k', 'a']).word).toBe('mama')
})

test('Test status', () => {
  expect(new Game('mama').status).toBe('ongoing')
  expect(new Game('mama').original).toBe(null)
  expect(new Game('mama', '', ['c']).status).toBe('ongoing')
  expect(new Game('mama', '', ['a']).status).toBe('ongoing')
  expect(new Game('mama', '', ['a', 'k']).status).toBe('ongoing')
  expect(new Game('mama', '', ['a', 'm']).status).toBe('victory')
  expect(new Game('mama', '', ['m', 'a']).status).toBe('victory')
  expect(new Game('mama', '', ['m', 'k', 'a']).status).toBe('victory')
  expect(new Game('mama', '', ['m', 'k', 'a']).original).toBe(null)
  expect(
    new Game('mama', '', [
      'a',
      'k',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'b',
      'c',
    ]).status
  ).toBe('loss')
  expect(
    new Game('mama', '', ['k', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'b', 'c'])
      .status
  ).toBe('loss')
  expect(
    new Game('mama', '', ['k', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'b', 'c'])
      .original
  ).toBe('mama')
})

test('Test add letter name', () => {
  let game = new Game('katė')
  expect(game.addLetter('a')).toBeTruthy()
  expect(game.guessed).toMatchObject(['a'])
  expect(game.addLetter('a')).toBeFalsy()
  expect(game.guessed).toMatchObject(['a'])
  expect(game.addLetter('b')).toBeTruthy()
  expect(game.guessed).toMatchObject(['a', 'b'])
  expect(game.addLetter('')).toBeFalsy()
  expect(game.guessed).toMatchObject(['a', 'b'])
  expect(game.addLetter('ab')).toBeFalsy()
  expect(game.guessed).toMatchObject(['a', 'b'])
  expect(game.addLetter('5')).toBeFalsy()
  expect(game.guessed).toMatchObject(['a', 'b'])
  expect(game.addLetter('q')).toBeFalsy()
  expect(game.guessed).toMatchObject(['a', 'b'])
  expect(game.addLetter('š')).toBeTruthy()
  expect(game.guessed).toMatchObject(['a', 'b', 'š'])
  game.addLetter('ą')
  game.addLetter('c')
  game.addLetter('č')
  game.addLetter('d')
  game.addLetter('e')
  game.addLetter('ę')
  game.addLetter('f')
  expect(game.status).toBe('ongoing')
  game.addLetter('f')
  expect(game.status).toBe('ongoing')
  game.addLetter('h')
  expect(game.status).toBe('loss')
})
