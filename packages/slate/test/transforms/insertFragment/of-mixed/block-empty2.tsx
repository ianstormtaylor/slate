/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor, options = {}) => {
  Transforms.insertFragment(
    editor,
    <fragment>
      <block>two</block>
      <text>three</text>
    </fragment>,
    options
  )
}
export const input = (
  <editor>
    <block>word</block>
    <block>
      <cursor />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>word</block>
    <block>two</block>
    <block>
      <text>
        three
        <cursor />
      </text>
    </block>
  </editor>
)
