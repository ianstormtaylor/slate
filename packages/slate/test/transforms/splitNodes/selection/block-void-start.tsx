/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.splitNodes(editor)
}
export const input = (
  <editor>
    <block void>
      wo
      <anchor />
      rd
    </block>
    <block>
      an
      <focus />
      other
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <cursor />
      other
    </block>
  </editor>
)
