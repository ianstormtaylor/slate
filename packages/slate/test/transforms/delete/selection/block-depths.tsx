/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor)
}
export const input = (
  <editor>
    <block>
      wo
      <anchor />
      rd
    </block>
    <block>
      <block>middle</block>
      <block>
        an
        <focus />
        other
      </block>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      wo
      <cursor />
      other
    </block>
  </editor>
)
