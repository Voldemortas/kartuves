import { game } from '../types/index'

export const alphabet = 'aąbcčdeęėfghiįyjklmnoprsštuųūvzž'.split('')

export function blankName(game: game): game {
  const temp = JSON.parse(JSON.stringify(game))
  temp.word = temp.word.toLocaleLowerCase()
  let name = temp.word
    .split('')
    .map((e) => (temp.guessed.includes(e) ? e : '_'))
    .join('')
  temp.word = name
  return temp
}
export function isOver(game: game): game {
  let temp = game
  temp.word = temp.word.toLocaleLowerCase()
  const word = temp.word.split('')
  if (
    temp.guessed.reduce((acc: number, cur) => {
      return acc + (word.includes(cur) ? 0 : 1)
    }, 0) >= 10
  ) {
    return { ...temp, over: true, original: game.word }
  }
  if (Array.from(blankName(temp).word.matchAll(/_/g)).length === 0) {
    return { ...blankName(temp), over: true }
  }
  return { ...temp, over: false }
}
export function addLetter(game: game, letter: string): boolean {
  letter = letter.toLocaleLowerCase()
  game.word = game.word.toLocaleLowerCase()
  if (
    game.guessed.includes(letter) ||
    letter === undefined ||
    letter === null ||
    typeof letter !== 'string' ||
    !alphabet.includes(letter)
  ) {
    return false
  }
  if (isOver(game).over) {
    game.original = game.word
    return false
  }
  game.guessed.push(letter)
  return true
}
