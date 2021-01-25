import Main from '../components/Main'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button, Icon } from 'semantic-ui-react'
import { game } from '../types'
import NewGameButton from '../components/NewGameButton'

type state = {
  game: game | null
  id: string | null
  error: string | null
}

const alphabet = 'aąbcčdeęėfghiįyjklmnoprsštuųūvzž'.split('')

const newGame = async () => {
  try {
    const response = await axios.post(
      '/api/game',
      JSON.stringify({ start: true }),
      {
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8',
        },
      }
    )
    window.localStorage.setItem('id', response.data.uuid)
    window.location.href = '/game'
  } catch {}
}

export default function Home() {
  const [state, setState] = useState<state>({
    game: null,
    id: null,
    error: null,
  })
  useEffect(() => {
    const url = window.location.toString().split('?')[1]
    const id: string = url === undefined ? localStorage.id : url
    ;(async () => {
      const game = await axios.get('/api/game?id=' + id)
      setState({ ...state, game: game.data, id })
    })()
  }, [])

  return (
    <Main>
      <>
        <h1>Kartuvės</h1>
        {state.game === null ? (
          <>KRAUNAMA</>
        ) : (
          <>
            <div className="hangman">{state.game.word}</div>
            <div className="game-failure">{state.error}</div>
            <div className="game-sucess">
              {state.game.over && !state.game.word.split('').includes('_') ? (
                <>
                  Pergalė <br />
                </>
              ) : state.game.over ? (
                'Pralošėte'
              ) : (
                ''
              )}
            </div>
            <div className="buttons">
              {alphabet.map((e) => (
                <Button
                  key={e}
                  inverted
                  color={
                    state.game.guessed.includes(e) &&
                    !state.game.word.includes(e)
                      ? 'red'
                      : state.game.over && !state.game.word.includes(e)
                      ? 'yellow'
                      : 'green'
                  }
                  disabled={state.game.guessed.includes(e) || state.game.over}
                  onClick={
                    !state.game.guessed.includes(e)
                      ? async () => {
                          try {
                            const game = (
                              await axios.put(
                                '/api/game?id=' + state.id,
                                JSON.stringify({ letter: e }),
                                {
                                  headers: {
                                    'Content-Type': 'text/plain;charset=UTF-8',
                                  },
                                }
                              )
                            ).data
                            setState({ ...state, game })
                          } catch (error) {
                            setState({ ...state, error: error.response.data })
                          }
                        }
                      : null
                  }
                >
                  {e}
                </Button>
              ))}
            </div>
            <Button
              color="red"
              className="fullWidth"
              onClick={() => {
                location.href = '/'
              }}
            >
              Atgal
            </Button>
            <NewGameButton className="fullWidth" inverted={false} />
          </>
        )}
      </>
    </Main>
  )
}
