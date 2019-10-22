/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.addMarks([{ key: 'b' }])
  editor.splitBlock()
  editor.insertText('cat is cute')
}

export const input = (
  <value>
    <block>
      <mark key="a">word</mark>
      <cursor />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <mark key="a">word</mark>
      <cursor />
    </block>
    <block>
      <mark key="b">
        <mark key="a">cat is cute</mark>
      </mark>
      <cursor />
    </block>
  </value>
)
