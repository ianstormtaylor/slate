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
      <block>
        word
        <cursor />
      </block>
      <block>another</block>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <block>
        word
        <cursor />
        another
      </block>
    </block>
  </editor>
)
