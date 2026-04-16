/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.delete(editor, { unit: 'line', reverse: true })
}
export const input = (
  <editor>
    <block>
      one two three
      <cursor />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <cursor />
    </block>
  </editor>
)
