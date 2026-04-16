/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const input = (
  <editor>
    <block>
      <cursor />
      one
    </block>
  </editor>
)
export const run = (editor, options = {}) => {
  Transforms.insertNodes(
    editor,
    <block>
      <text />
    </block>,
    { at: [0], ...options }
  )
}
export const output = (
  <editor>
    <block>
      <text />
    </block>
    <block>
      <cursor />
      one
    </block>
  </editor>
)
