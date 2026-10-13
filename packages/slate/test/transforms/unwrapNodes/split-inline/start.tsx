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
        <anchor />
        ab
        <focus />
        cdef
      </inline>
      <text />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <anchor />
      ab
      <focus />
      <inline a>cdef</inline>
      <text />
    </block>
  </editor>
)
