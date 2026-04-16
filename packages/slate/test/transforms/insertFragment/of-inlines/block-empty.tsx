/** @jsx jsx */
import { Transforms } from 'slate'

export const run = (editor, options = {}) => {
  Transforms.insertFragment(
    editor,
    <fragment>
      <inline>fragment</inline>
    </fragment>,
    options
  )
}
export const input = (
  <editor>
    <block>
      <cursor />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text />
      <inline>
        fragment
        <cursor />
      </inline>
      <text />
    </block>
  </editor>
)
