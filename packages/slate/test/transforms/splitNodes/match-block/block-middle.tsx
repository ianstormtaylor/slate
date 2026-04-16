/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Editor, Element, Transforms } from 'slate'

export const run = (editor) => {
  Transforms.splitNodes(editor, {
    match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
  })
}
export const input = (
  <editor>
    <block>
      wo
      <cursor />
      rd
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>wo</block>
    <block>
      <cursor />
      rd
    </block>
  </editor>
)
