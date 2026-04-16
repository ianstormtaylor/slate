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
      word
      <anchor />
    </block>
    <block>
      <focus />
      another
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      word
      <cursor />
      another
    </block>
  </editor>
)
