import { NextApiRequest, NextApiResponse } from 'next'
import Game from '../../classes/Game'

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
    const game = new Game()
    await Game.Save(game)
    res.send(game.toString())
    return
  }

  if (method === 'GET' && query.id !== undefined && query.id !== '') {
    const game = await Game.Load(query.id as string)
    if (game === null) {
      res.status(403)
      res.send('No Such game')
    } else {
      res.status(202)
      res.send(game.toString())
    }
    return
  }

  if (method === 'PUT' && query.id !== undefined && query.id !== '') {
    const game = await Game.Load(query.id as string)
    if (game === null) {
      res.status(403)
      res.send('No Such game')
    } else if (game.status !== 'ongoing') {
      res.status(403)
      res.send('Game is finished')
    } else if (!game.addLetter(body.letter)) {
      res.status(403)
      res.send('Such letter exists')
    } else {
      await Game.Save(game)
      res.status(202)
      res.send(game.toString())
    }
    return
  }

  res.status(400)
  res.send('')
}
