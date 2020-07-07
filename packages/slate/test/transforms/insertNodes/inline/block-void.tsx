/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.insertNodes(
    editor,
    <inline void>
      <text />
    </inline>
  )
}
export const input = (
  <editor>
    <block void>
      <cursor />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block void>
      <cursor />
    </block>
  </editor>
)
