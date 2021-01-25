import { useState } from 'react'
import axios from 'axios'
import { Button } from 'semantic-ui-react'

type state = {
  button: string
  open: boolean
  error: boolean
}

type props = {
  className?: string
  inverted?: boolean
}

const buttonText = 'Pradėti naują žaidimą'

export default function NewGameButton(
  { className, inverted }: props = { inverted: true }
) {
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
    <>
      <Button
        className={className}
        inverted={inverted}
        color="green"
        onClick={state.open ? handleClick : () => {}}
        disabled={!state.open}
      >
        {state.button}
      </Button>
      <span>{state.error ? 'Klaida, bandykite dar kartą' : ''}</span>
    </>
  )
}
