/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.delete(editor, { unit: 'character', reverse: true })
}
export const input = (
  <editor>
    <block>
      one
      <inline>two</inline>
      <cursor />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      one
      <inline>
        tw
        <cursor />
      </inline>
      <text />
    </block>
  </editor>
)
