/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const input = (
  <editor>
    <block>
      on
      <anchor />e
    </block>
    <block>
      t<focus />
      wo
    </block>
    <block>three</block>
  </editor>
)
export const run = (editor) => {
  Transforms.removeNodes(editor)
}
export const output = (
  <editor>
    <block>
      <cursor />
      three
    </block>
  </editor>
)
