/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor)
}
export const input = (
  <editor>
    <block void>
      <text />
    </block>
    <block void>
      <cursor />
    </block>
    <block void>
      <text />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block void>
      <text />
    </block>
    <block void>
      <cursor />
    </block>
  </editor>
)
