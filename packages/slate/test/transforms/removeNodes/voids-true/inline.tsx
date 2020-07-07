/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <text />
      <inline void>one</inline>
      <text />
    </block>
  </editor>
)
export const run = editor => {
  Transforms.removeNodes(editor, { at: [0, 1, 0], voids: true })
}
export const output = (
  <editor>
    <block>
      <text />
      <inline void>
        <text />
      </inline>
      <text />
    </block>
  </editor>
)
