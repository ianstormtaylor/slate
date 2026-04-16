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
      wor
      <anchor />d<focus />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      wor
      <cursor />
    </block>
  </editor>
)
