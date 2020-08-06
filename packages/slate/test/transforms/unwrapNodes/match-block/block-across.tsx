/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.unwrapNodes(editor, { match: n => n.a })
}
export const input = (
  <editor>
    <block a>
      <block>
        wo
        <anchor />
        rd
      </block>
      <block>
        an
        <focus />
        other
      </block>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      wo
      <anchor />
      rd
    </block>
    <block>
      an
      <focus />
      other
    </block>
  </editor>
)
