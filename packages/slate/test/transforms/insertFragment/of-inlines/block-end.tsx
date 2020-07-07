/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.insertFragment(
    editor,
    <fragment>
      <inline>fragment</inline>
    </fragment>
  )
}
export const input = (
  <editor>
    <block>
      word
      <cursor />
    </block>
  </editor>
)
// TODO: this cursor placement seems off
export const output = (
  <editor>
    <block>
      word
      <inline>
        fragment
        <cursor />
      </inline>
      <text />
    </block>
  </editor>
)
