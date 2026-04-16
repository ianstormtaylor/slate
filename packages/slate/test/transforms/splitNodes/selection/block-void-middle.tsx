/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.splitNodes(editor)
}
export const input = (
  <editor>
    <block>
      on
      <anchor />e
    </block>
    <block void>two</block>
    <block>
      th
      <focus />
      ree
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>on</block>
    <block>
      <cursor />
      ree
    </block>
  </editor>
)
