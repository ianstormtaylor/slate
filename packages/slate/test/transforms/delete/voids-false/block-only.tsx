/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.delete(editor)
}
export const input = (
  <editor>
    <block void>
      <cursor />
    </block>
  </editor>
)
export const output = <editor />
