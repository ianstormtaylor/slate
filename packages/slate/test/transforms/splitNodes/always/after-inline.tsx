/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Editor, Element, Transforms } from 'slate'

export const run = (editor) => {
  Transforms.splitNodes(editor, {
    match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
    always: true,
  })
}
export const input = (
  <editor>
    <block>
      word
      <inline>hyperlink</inline>
      <cursor />
      word
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      word
      <inline>hyperlink</inline>
      <text />
    </block>
    <block>
      <cursor />
      word
    </block>
  </editor>
)
