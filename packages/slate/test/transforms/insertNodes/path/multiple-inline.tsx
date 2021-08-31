/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      hello
      <cursor />
    </block>
  </editor>
)
export const run = editor => {
  Transforms.insertNodes(
    editor,
    [
      <inline>
        <text />
      </inline>,
      <text>world</text>
    ],
  )
}
export const output = (
  <editor>
    <block>
      hello
      <inline>
        <text />
      </inline>
      world
      <cursor />
    </block>
  </editor>
)
