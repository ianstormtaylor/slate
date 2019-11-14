/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.insertFragment(
    <fragment>
      <mark a>one</mark>
      <mark b>one</mark>
      <mark c>one</mark>
    </fragment>
  )
}

export const input = (
  <value>
    <block>
      wo
      <cursor />
      rd
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      wo
      <mark a>one</mark>
      <mark b>two</mark>
      <mark c>three</mark>
      <cursor />
      rd
    </block>
  </value>
)
