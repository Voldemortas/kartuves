import { blankName, isOver, addLetter } from '../functions/game'
import { game } from '../types'

test('Test blankName', () => {
  expect(blankName({ word: 'mama', guessed: ['a', 'm'], uuid: '' }).word).toBe(
    'mama'
  )

  expect(blankName({ word: 'mama', guessed: ['m', 'a'], uuid: '' }).word).toBe(
    'mama'
  )

  expect(
    blankName({ word: 'mama', guessed: ['a', 'b', 'm'], uuid: '' }).word
  ).toBe('mama')

  expect(blankName({ word: 'mama', guessed: ['b', 'm'], uuid: '' }).word).toBe(
    'm_m_'
  )

  expect(blankName({ word: 'mama', guessed: ['b', 'c'], uuid: '' }).word).toBe(
    '____'
  )

  expect(blankName({ word: 'mama', guessed: [], uuid: '' }).word).toBe('____')
})

test('Test isOver', () => {
  expect(
    isOver({ word: 'mama', guessed: ['a', 'm'], uuid: '' }).over
  ).toBeTruthy()
  expect(isOver({ word: 'mama', guessed: [], uuid: '' }).over).toBeFalsy()
  expect(
    isOver({
      word: 'mama',
      guessed: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
      uuid: '',
    }).over
  ).toBeFalsy()
  expect(
    isOver({
      word: 'mama',
      guessed: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'],
      uuid: '',
    }).over
  ).toBeTruthy()
})

test('Test addLetter', () => {
  let game: game = {
    word: 'mama',
    guessed: [],
    uuid: '',
  }
  expect(addLetter(game, 'A')).toBeTruthy()
  expect(addLetter(game, 'ab')).toBeFalsy()
  expect(addLetter(game, 'a0')).toBeFalsy()
  expect(addLetter(game, '0a')).toBeFalsy()
  expect(addLetter(game, '1')).toBeFalsy()
  expect(game.word).toBe('mama')
  expect(game.guessed).toMatchObject(['a'])
  expect(addLetter(game, 'A')).toBeFalsy()
  expect(game.guessed).toMatchObject(['a'])
  expect(addLetter(game, 'b')).toBeTruthy()
  expect(game.guessed).toMatchObject(['a', 'b'])
  expect(game.word).toBe('mama')

  let game2: game = {
    word: 'xwq',
    guessed: [],
    uuid: '',
  }
  expect(addLetter(game2, 'A')).toBeTruthy()
  expect(addLetter(game2, 'B')).toBeTruthy()
  expect(addLetter(game2, 'C')).toBeTruthy()
  expect(addLetter(game2, 'D')).toBeTruthy()
  expect(addLetter(game2, 'E')).toBeTruthy()
  expect(addLetter(game2, 'F')).toBeTruthy()
  expect(addLetter(game2, 'G')).toBeTruthy()
  expect(addLetter(game2, 'H')).toBeTruthy()
  expect(addLetter(game2, 'I')).toBeTruthy()
  expect(addLetter(game2, 'J')).toBeTruthy()
  expect(game2.original).toBe(undefined)
  expect(addLetter(game2, 'K')).toBeFalsy()
  expect(game2.original).toBe(game2.word)
})
