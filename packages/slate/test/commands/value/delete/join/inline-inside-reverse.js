/** @jsx h */

import { h } from '../../../../helpers'

export const run = editor => {
  editor.delete({ reverse: true })
}

export const input = (
  <value>
    <block>
      one
      <inline>two</inline>
      <text />
    </block>
    <block>
      <text />
      <inline>
        <cursor />three
      </inline>
      four
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one
      <inline>two</inline>
      <text />
      <inline>
        <cursor />three
      </inline>
      four
    </block>
  </value>
)
