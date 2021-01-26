type Game = {
  word: string
  guessed: string[]
  uuid: string
  over?: undefined | boolean
  original?: string
}

export default Game
