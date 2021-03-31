/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <text />
      <inline>one</inline>
      <text />
      <inline>two</inline>
      <text />
    </block>
  </editor>
)
export const run = editor => {
  Transforms.removeNodes(editor, { at: [0, 1] })
}
export const output = (
  <editor>
    <block>
      <text />
      <inline>two</inline>
      <text />
    </block>
  </editor>
)
