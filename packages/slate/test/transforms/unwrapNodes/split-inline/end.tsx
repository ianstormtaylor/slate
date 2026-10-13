/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.unwrapNodes(editor, { match: n => n.a === true, split: true })
}
export const input = (
  <editor>
    <block>
      <text />
      <inline a>
        abcd
        <anchor />
        ef
        <focus />
      </inline>
      <text />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text />
      <inline a>abcd</inline>
      <anchor />
      ef
      <focus />
    </block>
  </editor>
)
