/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor)
}
export const input = (
  <editor>
    <block>
      o<anchor />
      ne<inline>two</inline>thre
      <focus />e
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      o<cursor />e
    </block>
  </editor>
)
