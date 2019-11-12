/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.setMarks([{ existing: true }], { key: true }, { at: [0, 0] })
}

export const input = (
  <value>
    <block>
      <mark existing>word</mark>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <mark existing key>
        word
      </mark>
    </block>
  </value>
)
