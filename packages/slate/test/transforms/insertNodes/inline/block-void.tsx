/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor, options = {}) => {
  Transforms.insertNodes(
    editor,
    <inline void>
      <text />
    </inline>,
    options
  )
}
export const input = (
  <editor>
    <block void>
      <cursor />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block void>
      <cursor />
    </block>
  </editor>
)
