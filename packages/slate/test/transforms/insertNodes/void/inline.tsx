/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const input = (
  <editor>
    <block>
      one
      <inline>
        two
        <cursor />
      </inline>
      three
    </block>
  </editor>
)
export const run = (editor, options = {}) => {
  Transforms.insertNodes(
    editor,
    <inline void>
      <text>four</text>
    </inline>,
    options
  )
}
export const output = (
  <editor>
    <block>
      one
      <inline>
        two
        <inline void>
          four
          <cursor />
        </inline>
        <text />
      </inline>
      three
    </block>
  </editor>
)
