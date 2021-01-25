import Head from 'next/head'
import React, { ReactChild } from 'react'
import { Segment } from 'semantic-ui-react'

export default function Main({ children }: { children: ReactChild }) {
  return (
    <Segment inverted style={{ height: '100%' }}>
      <Head>
        <title>Kartuvės</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
        />
      </Head>

      <main>{children}</main>

      {/*<footer>
        Andrius Simanaitis © 2021
        {new Date().getFullYear() !== 2021
          ? ` - ${new Date().getFullYear()}`
          : ''}
        </footer>*/}
    </Segment>
  )
}
