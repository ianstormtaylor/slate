/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = (editor, options = {}) => {
  Transforms.insertFragment(editor, <fragment>fragment</fragment>, options)
}
export const input = (
  <editor>
    <block>
      wo
      <anchor />
      rd
    </block>
    <block>
      an
      <focus />
      other
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      wofragment
      <cursor />
      other
    </block>
  </editor>
)
