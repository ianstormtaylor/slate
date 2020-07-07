/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.unwrapNodes(editor, { match: n => n.a, mode: 'all' })
}
export const input = (
  <editor>
    <block a>
      <block a>
        <block>
          <cursor />
          word
        </block>
      </block>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <cursor />
      word
    </block>
  </editor>
)
