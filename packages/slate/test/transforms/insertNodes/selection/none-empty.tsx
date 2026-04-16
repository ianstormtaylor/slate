/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const input = <editor />
export const run = (editor, options = {}) => {
  Transforms.insertNodes(editor, <block>one</block>, options)
}
export const output = (
  <editor>
    <block>
      one
      <cursor />
    </block>
  </editor>
)
