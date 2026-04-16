/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Editor } from 'slate'

export const input = (
  <editor>
    <block>one</block>
    <block>two</block>
  </editor>
)
export const test = (editor) => {
  return Editor.node(
    editor,
    {
      anchor: { path: [0, 0], offset: 1 },
      focus: { path: [1, 0], offset: 2 },
    },
    { edge: 'start' }
  )
}
export const output = [<text>one</text>, [0, 0]]
