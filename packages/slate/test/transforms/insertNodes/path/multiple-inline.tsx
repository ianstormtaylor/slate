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
export const run = (editor, options = {}) => {
  Transforms.insertNodes(
    editor,
    [
      <inline>
        <text />
      </inline>,
      <text>world</text>,
    ],
    options
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
