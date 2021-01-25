import Main from '../components/Main'
import { useState } from 'react'
import NewGameButton from '../components/NewGameButton'

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
  return (
    <Main>
      <>
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
        <NewGameButton />
        <span>{state.error ? 'Klaida, bandykite dar kartą' : ''}</span>
      </>
    </Main>
  )
}
