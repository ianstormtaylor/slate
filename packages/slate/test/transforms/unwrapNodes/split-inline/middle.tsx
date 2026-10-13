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
        <anchor />
        cd
        <focus />
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
      <anchor />
      cd
      <focus />
      <inline a>ef</inline>
      <text />
    </block>
  </editor>
)
