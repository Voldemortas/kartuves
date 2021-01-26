import Main from '../components/Main'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Button } from 'semantic-ui-react'
import { game } from '../types'
import NewGameButton from '../components/NewGameButton'
import { alphabet } from '../functions/game'

type state = {
  game: game | null
  id: string | null
  error: string | null
}

export default function Home() {
  const refs: React.RefObject<HTMLButtonElement>[] = alphabet.map((e) =>
    useRef(null)
  )
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
  useEffect(() => {
    function press(event: KeyboardEvent): void {
      const buttonNames: string[][] = [
        ['Digit1', 'ą'],
        ['Digit2', 'č'],
        ['Digit3', 'ę'],
        ['Digit4', 'ė'],
        ['Digit5', 'į'],
        ['Digit6', 'š'],
        ['Digit7', 'ų'],
        ['Digit8', 'ū'],
        ['Equal', 'ž'],
      ]
      const buttons = refs.map((e) => e.current!)
      //@ts-ignore
      const filtered = buttons.filter((e) => e.props.children === event.key)
      if (filtered.length === 1) {
        //@ts-ignore
        filtered[0].ref.current.click()
        return
      }
      const filteredButtons = buttonNames.filter((e) => event.code === e[0])
      if (filteredButtons.length === 1) {
        buttons
          //@ts-ignore
          .filter((e) => e.props.children === event.key)[0]
          //@ts-ignore
          .ref.current.click()
      }
    }
    document.addEventListener('keyup', press)
  }, [])

  return (
    <Main>
      <>
        <h1>Kartuvės</h1>
        {state.game === null ? (
          <>
            KRAUNAMA
            <br />
            <img src="0.png" />
          </>
        ) : (
          <>
            <img
              src={
                state.game.guessed.filter(
                  (e) => !state.game.word.split('').includes(e)
                ).length + '.png'
              }
            />
            <div className="hangman">{state.game.word}</div>
            <div className="game-failure">{state.error}</div>
            <div className="game-sucess">
              {state.game.over && !state.game.word.split('').includes('_') ? (
                <>
                  Pergalė <br />
                </>
              ) : state.game.over ? (
                'Pralošėte, žodis buvo ' + state.game.original
              ) : (
                ''
              )}
            </div>
            <div className="buttons">
              {alphabet.map((e, i) => (
                <Button
                  //@ts-ignore
                  ref={refs[i]}
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
            <a href="/" className="ui red button fullWidth">
              Atgal
            </a>
            <NewGameButton className="fullWidth" inverted={false} />
          </>
        )}
      </>
    </Main>
  )
}
