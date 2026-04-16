/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const input = (
  <editor>
    <block>
      <text />
      <inline>one</inline>
      <text />
    </block>
  </editor>
)
export const run = (editor) => {
  Transforms.delete(editor, { at: [0, 1] })
}
export const output = (
  <editor>
    <block>
      <text />
    </block>
  </editor>
)
