/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = (editor, options = {}) => {
  Transforms.insertFragment(
    editor,
    <fragment>
      <block>hello</block>
    </fragment>,
    {
      ...options,
      // No filter provided - should work as normal
    }
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
// Without filter, insertion works normally
export const output = (
  <editor>
    <block>
      wohello
      <cursor />
      rd
    </block>
  </editor>
)
