/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.splitNodes(editor)
}
export const input = (
  <editor>
    <block>
      <text />
      <inline void>
        word
        <cursor />
      </inline>
      <text />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text />
      <inline void>word</inline>
      <text />
    </block>
    <block>
      <cursor />
    </block>
  </editor>
)
