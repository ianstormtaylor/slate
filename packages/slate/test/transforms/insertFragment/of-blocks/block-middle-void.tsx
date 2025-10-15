/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = (editor, options = {}) => {
  Transforms.insertFragment(
    editor,
    <fragment>
      <block void />
    </fragment>,
    options
  )
}
export const input = (
  <editor>
    <block>
      wo
      <cursor />
      rd
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>wo</block>
    <block void>
      <text />
    </block>
    <block>
      <cursor />
      rd
    </block>
  </editor>
)
