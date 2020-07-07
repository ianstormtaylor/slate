/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.insertFragment(editor, <fragment>fragment</fragment>)
}
export const input = (
  <editor>
    <block>
      <text />
      <inline>
        <cursor />
      </inline>
      <text />
    </block>
  </editor>
)
// TODO: argument to made that fragment should go into the inline
export const output = (
  <editor>
    <block>
      <text />
      <inline>
        <text />
      </inline>
      fragment
      <cursor />
    </block>
  </editor>
)
