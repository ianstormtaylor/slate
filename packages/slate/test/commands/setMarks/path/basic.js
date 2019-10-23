/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.setMarks([{ key: 'a' }], { thing: true }, { at: [0, 0] })
}

export const input = (
  <value>
    <block>
      <mark key="a">word</mark>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <mark key="a" thing>
        word
      </mark>
    </block>
  </value>
)
