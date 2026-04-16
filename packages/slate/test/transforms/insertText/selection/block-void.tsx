/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.insertText(editor, 'a')
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
