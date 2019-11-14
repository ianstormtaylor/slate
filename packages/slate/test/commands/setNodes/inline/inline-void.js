/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.setNodes({ key: true }, { match: 'inline' })
}

export const input = (
  <value>
    <block>
      <text />
      <inline void>
        <cursor />
        word
      </inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline void key>
        <cursor />
        word
      </inline>
      <text />
    </block>
  </value>
)
