/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.setNodes(editor, { key: 'a' }, { at: [0, 1] })
}
export const input = (
  <editor>
    <block>
      <text />
      <inline>word</inline>
      <text />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text />
      <inline key="a">word</inline>
      <text />
    </block>
  </editor>
)
