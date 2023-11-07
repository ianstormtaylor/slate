/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      hel
      <cursor />
      lo
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
      hel
      <inline>
        <text />
      </inline>
      world
      <cursor />
      lo
    </block>
  </editor>
)
