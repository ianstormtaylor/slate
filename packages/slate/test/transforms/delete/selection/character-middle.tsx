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
      w<anchor />o<focus />
      rd
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      w<cursor />
      rd
    </block>
  </editor>
)
