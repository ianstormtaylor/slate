/** @jsx jsx */
import { jsx } from '../../..'
import { Transforms } from 'slate'

export const run = editor => {
  Transforms.unwrapNodes(editor, {
    match: n => !!n.a,
    mode: 'all',
    split: true,
  })
}
export const input = (
  <editor>
    <block a>
      <block a>
        <block>one</block>
        <block>
          <cursor />
          word
        </block>
        <block>now</block>
      </block>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block a>
      <block a>
        <block>one</block>
      </block>
    </block>
    <block>
      <cursor />
      word
    </block>
    <block a>
      <block a>
        <block>now</block>
      </block>
    </block>
  </editor>
)
