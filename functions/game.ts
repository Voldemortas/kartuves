import { game } from '../types/index'
export function blankName(game: game): game {
  let name = game.word
    .split('')
    .map((e) => (game.guessed.includes(e) ? e : '_'))
    .join('')
  game.word = name
  return game
}
export function isOver(game: game): game {
  const word = game.word.split('')
  if (
    game.guessed.reduce((acc: number, cur) => {
      return acc + (word.includes(cur) ? 0 : 1)
    }, 0) >= 10
  ) {
    return { ...game, over: true }
  }
  if (Array.from(blankName(game).word.matchAll(/_/g)).length === 0) {
    return { ...blankName(game), over: true }
  }
  return { ...game, over: false }
}
export function addLetter(game: game, letter: string): boolean {
  if (
    game.guessed.includes(letter) ||
    letter === undefined ||
    letter === null ||
    typeof letter !== 'string'
  ) {
    return false
  }
  game.guessed.push(letter)
  return true
}
