/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteCharBackward()
}

export const input = (
  <value>
    <block>
      <inline>
        📛<cursor />
      </inline>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />
      <inline>
        <text />
      </inline>
    </block>
  </value>
)
