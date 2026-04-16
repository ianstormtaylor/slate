/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Editor, Element, Transforms } from 'slate'

export const run = (editor) => {
  Transforms.setNodes(
    editor,
    { someKey: true },
    { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) }
  )
}
export const input = (
  <editor>
    <block>
      <anchor />
      word
    </block>
    <block>
      <focus />
      another
    </block>
  </editor>
)
export const output = (
  <editor>
    <block someKey>
      <anchor />
      word
    </block>
    <block>
      <focus />
      another
    </block>
  </editor>
)
