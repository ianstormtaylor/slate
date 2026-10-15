/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = (editor, options = {}) => {
  Transforms.insertFragment(
    editor,
    <fragment>
      <block void>
        <text />
      </block>
    </fragment>,
    options
  )
}
export const input = (
  <editor>
    <block>
      <block>
        wo
        <cursor />
        rd
      </block>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <block>wo</block>
      <block void>
        <text />
      </block>
      <block>
        <cursor />
        rd
      </block>
    </block>
  </editor>
)
