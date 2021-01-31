import { NextApiRequest, NextApiResponse } from 'next'
import Word from '../../classes/Word'

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

  if (query.word === undefined) {
    const words = await Word.Load()
    res.send(
      JSON.stringify(
        words.map((e) => JSON.parse(e.toJSON())),
        null,
        2
      )
    )
  } else {
    const word = await Word.Load(query.word as string)
    res.send(word ? word.toJSON() : {})
  }
}
