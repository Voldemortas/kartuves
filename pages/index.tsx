import Main from '../components/Main'
import { useState } from 'react'
import axios from 'axios'
import { Button } from 'semantic-ui-react'

type state = {
  button: string
  open: boolean
  error: boolean
}
const buttonText = 'Pradėti naują žaidimą'

export default function Home() {
  const [state, setState] = useState<state>({
    button: buttonText,
    open: true,
    error: false,
  })
  const handleClick = async () => {
    setState({ ...state, button: 'Palaukite', open: false })
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
    } catch {
      setState({ ...state, button: buttonText, open: true, error: true })
    }
  }
  return (
    <Main>
      <h1>Kartuvės</h1>
      <div
        style={{
          height: 300,
          width: 300,
          backgroundColor: 'green',
          display: 'inline-block',
          margin: 20,
        }}
      >
        paveikslėlis
      </div>
      <br />
      <Button
        inverted
        color="green"
        onClick={state.open ? handleClick : () => {}}
        disabled={!state.open}
      >
        {state.button}
      </Button>
      <span>{state.error ? 'Klaida, bandykite dar kartą' : ''}</span>
    </Main>
  )
}
