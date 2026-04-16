/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor, options = {}) => {
  Transforms.insertNodes(
    editor,
    <block>
      <text />
    </block>,
    options
  )
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
    </block>
    <block>rd</block>
  </editor>
)
