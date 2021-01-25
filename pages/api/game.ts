import { NextApiRequest, NextApiResponse } from 'next'
import { readFileSync, existsSync, writeFileSync } from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { game } from '../../types'
import { blankName, isOver, addLetter } from '../../functions/game'

const database = process.cwd() + '/database'

async function createGame(): Promise<game> {
  return new Promise<game>((resolve) => {
    const words = JSON.parse(readFileSync(`${database}/words.json`, 'utf8'))
      .words as string[]
    const uuid = uuidv4()

    const game: game = {
      word: words[Math.floor(Math.random() * words.length)],
      guessed: [],
      uuid,
    }
    writeFileSync(`${database}/game-${uuid}.json`, JSON.stringify(game))
    resolve(game)
  })
}

async function getGame(uuid: string): Promise<game | null> {
  return new Promise<game | null>((resolve) => {
    if (existsSync(`${database}/game-${uuid}.json`)) {
      const game = JSON.parse(
        readFileSync(`${database}/game-${uuid}.json`, 'utf8')
      ) as game
      resolve(game)
    } else {
      resolve(null)
    }
  })
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method
  const query = req.query
  const body = (() => {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  })()
  if (
    method === 'POST' &&
    (query.id === '' || query.id === undefined) &&
    body.start
  ) {
    const game = await createGame()
    res.status(202)
    res.send(blankName(game))
    return
  }

  if (method === 'GET' && query.id !== undefined && query.id !== '') {
    const game = await getGame(query.id as string)
    if (game === null) {
      res.status(403)
      res.send('No Such game')
    } else {
      res.status(202)
      res.send(blankName(isOver(game)))
    }
    return
  }

  if (method === 'PUT' && query.id !== undefined && query.id !== '') {
    const game = await getGame(query.id as string)
    const over = isOver(game).over
    if (game === null) {
      res.status(403)
      res.send('No Such game')
    } else if (over) {
      res.status(403)
      res.send('Game is finished')
    } else if (!addLetter(game, body.letter)) {
      res.status(403)
      res.send('Such letter exists')
    } else {
      await writeFileSync(
        `${database}/game-${query.id}.json`,
        JSON.stringify(game)
      )
      res.status(202)
      res.send(blankName(isOver(game)))
    }
    return
  }

  res.status(400)
  res.send('')
}
