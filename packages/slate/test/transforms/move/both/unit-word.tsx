/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.move(editor, { unit: 'word' })
}
export const input = (
  <editor>
    <block>
      one <cursor />
      two three
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      one two
      <cursor /> three
    </block>
  </editor>
)
