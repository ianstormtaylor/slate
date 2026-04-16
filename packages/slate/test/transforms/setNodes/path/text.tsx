/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.setNodes(editor, { key: 'a' }, { at: [0, 0] })
}
export const input = (
  <editor>
    <block>word</block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text key="a">word</text>
    </block>
  </editor>
)
