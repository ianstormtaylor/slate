/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <text>one</text>
      <text>two</text>
    </block>
  </editor>
)

export const run = editor => {
  Transforms.mergeNodes(editor, { at: [0, 1] })
}

export const output = (
  <editor>
    <block>onetwo</block>
  </editor>
)
