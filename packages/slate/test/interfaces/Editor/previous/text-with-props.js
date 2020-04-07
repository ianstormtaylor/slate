/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <text>one</text>
      <text bold>two</text>
      <text>three</text>
      <text bold>four</text>
      <text>five</text>
      <text bold>six</text>
    </block>
  </editor>
)

export const test = editor => {
  const [node] = Editor.previous(editor, {
    at: [0, 5],
    match: n => {
      return !n.bold
    },
  })
  return node
}

export const output = { text: 'five' }
