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
        <text bold>
          <anchor />
          cd
          <focus />
        </text>
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
      <text bold>
        <anchor />
        cd
        <focus />
      </text>
      <inline a>ef</inline>
      <text />
    </block>
  </editor>
)
