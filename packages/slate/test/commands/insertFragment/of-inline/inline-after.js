/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.insertFragment(
    <fragment>
      <inline>fragment</inline>
    </fragment>
  )
}

export const input = (
  <value>
    <block>
      <text />
      <inline>word</inline>
      <cursor />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline>word</inline>
      <text />
      <inline>
        fragment
        <cursor />
      </inline>
      <text />
    </block>
  </value>
)
