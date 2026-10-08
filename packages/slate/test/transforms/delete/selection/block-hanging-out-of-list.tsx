/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor)
}
export const input = (
  <editor>
    <block list>
      <block item>
        <anchor />
        one
      </block>
    </block>
    <block paragraph>
      tw
      <focus />o
    </block>
  </editor>
)
export const output = (
  <editor>
    <block list>
      <block item>
        <cursor />o
      </block>
    </block>
  </editor>
)
