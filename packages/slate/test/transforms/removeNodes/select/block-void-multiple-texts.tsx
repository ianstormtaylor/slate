/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const input = (
  <editor>
    <block void>
      <text>
        <cursor />
        one
      </text>
      <text>two</text>
    </block>
    <block>three</block>
  </editor>
)
export const run = (editor) => {
  Transforms.removeNodes(editor, { at: [0] })
}
export const output = (
  <editor>
    <block>
      <cursor />
      three
    </block>
  </editor>
)
