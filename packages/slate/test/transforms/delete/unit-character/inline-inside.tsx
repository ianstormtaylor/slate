/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor)
}
export const input = (
  <editor>
    <block>
      one
      <inline>
        <cursor />a
      </inline>
      two
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      one
      <inline>
        <cursor />
      </inline>
      two
    </block>
  </editor>
)
