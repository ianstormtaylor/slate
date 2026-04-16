/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.wrapNodes(editor, <inline a />)
}
export const input = (
  <editor>
    <block>
      <cursor />
      word
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text />
      <inline a>
        <cursor />
        word
      </inline>
      <text />
    </block>
  </editor>
)
