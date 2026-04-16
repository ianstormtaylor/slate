/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.delete(editor, { unit: 'character' })
}
export const input = (
  <editor>
    <block>
      <text />
      <inline>
        wo
        <cursor />
        📛rd
      </inline>
      <text />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text />
      <inline>
        wo
        <cursor />
        rd
      </inline>
      <text />
    </block>
  </editor>
)
