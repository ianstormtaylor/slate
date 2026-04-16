/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const input = (
  <editor>
    <block>
      <cursor />
      word
    </block>
  </editor>
)
export const run = (editor) => {
  Transforms.wrapNodes(editor, <block new />, { split: true })
}
export const output = (
  <editor>
    <block new>
      <block>
        <cursor />
        word
      </block>
    </block>
  </editor>
)
