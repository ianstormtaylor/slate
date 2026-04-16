/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor, options = {}) => {
  Transforms.insertNodes(
    editor,
    <block>
      <text />
    </block>,
    options
  )
}
export const input = (
  <editor>
    <block>
      <text />
      <inline void>
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
      <inline void>
        <text />
      </inline>
      <text />
    </block>
    <block>
      <cursor />
    </block>
    <block>
      <text />
    </block>
  </editor>
)
