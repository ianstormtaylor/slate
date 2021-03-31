/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.wrapNodes(editor, <block a />, { at: [0] })
}
export const input = (
  <editor>
    <block>
      <cursor />
      word
    </block>
  </editor>
)
export const output = (
  <editor>
    <block a>
      <block>
        <cursor />
        word
      </block>
    </block>
  </editor>
)
