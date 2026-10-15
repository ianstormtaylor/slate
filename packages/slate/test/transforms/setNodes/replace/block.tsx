/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.setNodes(editor, { type: 'paragraph' }, { replace: true })
}
export const input = (
  <editor>
    <block type="callout" data="blue">
      <cursor />
      word
    </block>
  </editor>
)
export const output = (
  <editor>
    <block type="paragraph">
      <cursor />
      word
    </block>
  </editor>
)
