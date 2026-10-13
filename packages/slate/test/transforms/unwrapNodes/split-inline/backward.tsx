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
        ab
        <focus />
        cd
        <anchor />
        ef
      </inline>
      <text />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text />
      <inline a>ab</inline>
      <focus />
      cd
      <anchor />
      <inline a>ef</inline>
      <text />
    </block>
  </editor>
)
