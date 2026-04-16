/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Text, Transforms } from 'slate'

export const input = (
  <editor>
    <block>
      <text>
        <anchor />
        word
        <focus />
      </text>
    </block>
  </editor>
)
export const run = (editor) => {
  Transforms.wrapNodes(editor, <block new />, { match: Text.isText })
}
export const output = (
  <editor>
    <block>
      <block new>
        <anchor />
        word
        <focus />
      </block>
    </block>
  </editor>
)
