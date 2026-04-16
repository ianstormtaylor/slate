/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.delete(editor, { reverse: true })
}
export const input = (
  <editor>
    <block>Hello</block>
    <block>
      <block>
        <cursor />
        world!
      </block>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      Hello
      <cursor />
      world!
    </block>
  </editor>
)
