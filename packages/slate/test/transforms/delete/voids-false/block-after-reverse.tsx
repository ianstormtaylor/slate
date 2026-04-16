/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.delete(editor, { reverse: true })
}
export const input = (
  <editor>
    <block void>
      <text />
    </block>
    <block>
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
