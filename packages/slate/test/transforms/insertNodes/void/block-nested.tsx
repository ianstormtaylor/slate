/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      one
      <cursor />
    </block>
  </editor>
)
export const run = editor => {
  Transforms.insertNodes(
    editor,
    <block void>
      <block>
        <text>two</text>
      </block>
    </block>
  )
}
export const output = (
  <editor>
    <block>one</block>
    <block void>
      <block>
        <text>
          two
          <cursor />
        </text>
      </block>
    </block>
  </editor>
)
