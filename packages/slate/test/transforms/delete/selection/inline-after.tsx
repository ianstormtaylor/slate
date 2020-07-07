/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor)
}
export const input = (
  <editor>
    <block>
      one<inline>two</inline>
      <anchor />a<focus />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      one<inline>two</inline>
      <text>
        <cursor />
      </text>
    </block>
  </editor>
)
