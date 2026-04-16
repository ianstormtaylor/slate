/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.move(editor, { reverse: true, unit: 'word' })
}
export const input = (
  <editor>
    <block>
      one tw
      <cursor />o three
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      one <cursor />
      two three
    </block>
  </editor>
)
