import { readFileSync, existsSync, writeFileSync } from 'fs'
import { v4 as uuidv4 } from 'uuid'
import Word from './Word'
const database = process.cwd() + '/database'

const maxWordSize = 10
export const alphabet = 'aąbcčdeęėfghiįyjklmnoprsštuųūvzž'.split('')

export default class Game {
  private _uuid: string
  private _word: string
  private _guessed: string[]
  constructor(word = '', uuid = '', guessed = []) {
    if (word === '') {
      const words = JSON.parse(readFileSync(`${database}/words.json`, 'utf8'))
        .words as Word[]
      word = words[Math.floor(Math.random() * words.length)].word
    }
    if (uuid === '') {
      uuid = uuidv4()
    }
    this._word = word.toLocaleLowerCase()
    this._uuid = uuid
    this._guessed = guessed
  }

  public get status(): 'victory' | 'loss' | 'ongoing' {
    if (
      this._guessed.filter((e) => !this._word.includes(e)).length >= maxWordSize
    ) {
      return 'loss'
    }
    if (this.word === this._word) {
      return 'victory'
    }
    return 'ongoing'
  }
  public get uuid(): string {
    return this._uuid
  }
  public get guessed(): string[] {
    return this._guessed
  }
  public get word(): string {
    const temp = this._word + ''
    let name = temp
      .split('')
      .map((e) => (this._guessed.includes(e) ? e : '_'))
      .join('')
    return name
  }
  public get original(): string | null {
    if (this.status === 'loss') {
      return this._word
    }
    return null
  }
  public addLetter(letter: string): boolean {
    if (
      !alphabet.includes(letter) ||
      this._guessed.includes(letter) ||
      this._guessed.filter((e) => !this._word.includes(e)).length >= maxWordSize
    ) {
      return false
    }
    this._guessed.push(letter)
    return true
  }
  public toString(): string {
    return JSON.stringify({
      word: this.word,
      guessed: this._guessed,
      uuid: this._uuid,
      status: this.status,
      original: this.original,
    })
  }
  public toJson(): string {
    return JSON.stringify({
      word: this._word,
      guessed: this._guessed,
      uuid: this._uuid,
    })
  }
  public static async Save(game: Game): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        writeFileSync(`${database}/game-${game.uuid}.json`, game.toJson())
        resolve(true)
      } catch {
        reject(false)
      }
    })
  }
  public static async Load(uuid: string): Promise<Game | null> {
    return new Promise<Game | null>((resolve) => {
      if (existsSync(`${database}/game-${uuid}.json`)) {
        const game = JSON.parse(
          readFileSync(`${database}/game-${uuid}.json`, 'utf8')
        ) as Game
        resolve(new Game(game.word, game.uuid, game.guessed))
      } else {
        resolve(null)
      }
    })
  }
}
