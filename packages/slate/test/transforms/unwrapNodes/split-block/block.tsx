/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.unwrapNodes(editor, { match: n => n.a === true, split: true })
}
export const input = (
  <editor>
    <block a>
      <block>
        <cursor />
        one
      </block>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <cursor />
      one
    </block>
  </editor>
)
