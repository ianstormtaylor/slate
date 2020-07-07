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
      <anchor />
    </block>
    <block>
      <focus />
      two<inline>three</inline>four
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      one
      <cursor />
      two<inline>three</inline>four
    </block>
  </editor>
)
