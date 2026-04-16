/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.delete(editor)
}
export const input = (
  <editor>
    <block>
      <anchor />w<focus />
      ord
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <cursor />
      ord
    </block>
  </editor>
)
