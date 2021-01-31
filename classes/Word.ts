import { readFileSync, existsSync, writeFileSync } from 'fs'
import { alphabet } from './Game'
const database = process.cwd() + '/database'

export const errors = {
  Lithuanian:
    "The word must be written in Lithuanian alphabet and can't be empty ",
  English: 'The word must be written in English alphabet',
}

export default class Word {
  private _english: string
  private _word: string
  private _image: string
  constructor(word: string, english = '', image = '') {
    this.word = word
    this._image = image
    this.english = english
  }
  public get word() {
    return this._word
  }
  public set word(str: string) {
    str = str.toLocaleLowerCase()
    if (str.split('').some((e) => !alphabet.includes(e)) || str === '') {
      throw Error(errors.Lithuanian)
    }
    this._word = str
  }
  public get english() {
    return this._english
  }
  public set english(str: string) {
    str = str.toLocaleLowerCase()
    if (!/^[a-z\s]+$/.test(str) && str !== '') {
      throw Error(errors.English)
    }
    this._english = str
  }
  public get image() {
    return this._image
  }
  public toJSON(): string {
    return JSON.stringify({
      word: this.word,
      english: this.english,
      image: this.image,
    })
  }

  static Load(word: string): Promise<Word | null>
  static Load(): Promise<Word[] | null>
  public static async Load(word?: string): Promise<Word[] | Word | null> {
    return new Promise<Word[] | Word | null>((resolve) => {
      if (word === undefined) {
        if (existsSync(`${database}/words.json`)) {
          const words = JSON.parse(
            readFileSync(`${database}/words.json`, 'utf8')
          ).words as Word[]
          const mappedWords: Word[] = words.map((e) => {
            if (typeof e === 'string') {
              return new Word(e as string)
            }
            if (typeof e === 'object') {
              const temp: Word = e as Word
              return new Word(e.word, e.english, e.image)
            }
            try {
              return e as Word
            } catch {
              //throw Error ('Failed to conver to Word')
              resolve(null)
            }
          })
          resolve(mappedWords)
        } else {
          resolve(null)
        }
      } else {
        return resolve(this.LoadP(word))
      }
    })
  }

  private static async LoadP(word: string): Promise<Word | null> {
    return new Promise<Word | null>(async (resolve) => {
      const words = await this.Load()
      const found = words.findIndex((e) => e.word === word)
      if (found > -1 && words !== null) {
        resolve(words[found])
      } else {
        resolve(null)
      }
    })
  }
  /*public static async Save(game: Game): Promise<boolean> {
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
  }*/
}
