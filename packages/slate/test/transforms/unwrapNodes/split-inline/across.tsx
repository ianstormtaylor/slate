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
      </inline>
      middle
      <inline a>
        ef
        <focus />
        gh
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
      cdmiddleef
      <focus />
      <inline a>gh</inline>
      <text />
    </block>
  </editor>
)
