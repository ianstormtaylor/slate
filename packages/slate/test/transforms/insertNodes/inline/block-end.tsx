/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = (editor, options = {}) => {
  Transforms.insertNodes(
    editor,
    <inline void>
      <text />
    </inline>,
    options
  )
}
export const input = (
  <editor>
    <block>
      word
      <cursor />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      word
      <inline void>
        <cursor />
      </inline>
      <text />
    </block>
  </editor>
)
