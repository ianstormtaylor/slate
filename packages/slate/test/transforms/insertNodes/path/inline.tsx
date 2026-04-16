/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const input = (
  <editor>
    <block>
      <cursor />
      word
    </block>
  </editor>
)
export const run = (editor, options = {}) => {
  Transforms.insertNodes(
    editor,
    <inline>
      <text />
    </inline>,
    { at: [0, 0], ...options }
  )
}
export const output = (
  <editor>
    <block>
      <text />
      <inline>
        <text />
      </inline>
      <cursor />
      word
    </block>
  </editor>
)
