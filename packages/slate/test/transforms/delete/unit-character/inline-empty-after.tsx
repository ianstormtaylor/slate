/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor)
}
export const input = (
  <editor>
    <block>
      before
      <cursor />
      <inline>
        <text />
      </inline>
      after
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      before
      <cursor />
      after
    </block>
  </editor>
)
