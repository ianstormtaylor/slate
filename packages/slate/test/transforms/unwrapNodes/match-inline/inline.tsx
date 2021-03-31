/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.unwrapNodes(editor, { match: n => n.a })
}
export const input = (
  <editor>
    <block>
      w<anchor />
      <inline a>
        or
        <focus />
      </inline>
      d
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      w<anchor />
      or
      <focus />d
    </block>
  </editor>
)
