/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>word</block>
  </editor>
)
export const run = editor => {
  Transforms.setNodes(editor, { key: 'a' }, { at: [0] })
}
export const output = (
  <editor>
    <block key="a">word</block>
  </editor>
)
