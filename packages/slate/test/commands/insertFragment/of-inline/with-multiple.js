/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.insertFragment(
    <fragment>
      <inline>one</inline>
      <inline>two</inline>
      <inline>three</inline>
    </fragment>
  )
}

export const input = (
  <value>
    <block>
      <text />
      <inline>
        wo
        <cursor />
        rd
      </inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline>wo</inline>
      <text />
      <inline>one</inline>
      <text />
      <inline>two</inline>
      <text />
      <inline>
        three
        <cursor />
      </inline>
      <text />
      <inline>rd</inline>
      <text />
    </block>
  </value>
)
