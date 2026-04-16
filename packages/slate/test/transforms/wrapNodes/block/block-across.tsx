/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.wrapNodes(editor, <block a />)
}
export const input = (
  <editor>
    <block>
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
    <block a>
      <block>
        wo
        <anchor />
        rd
      </block>
      <block>
        an
        <focus />
        other
      </block>
    </block>
  </editor>
)
