/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.insertText(editor, 'a')
}
export const input = (
  <editor>
    <block>
      <anchor />
      first paragraph
    </block>
    <block>
      second
      <focus /> paragraph
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      a<cursor /> paragraph
    </block>
  </editor>
)
