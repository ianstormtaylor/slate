/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block void>
      <cursor />
      one
    </block>
  </editor>
)
export const run = editor => {
  Transforms.removeNodes(editor, { at: [0] })
}
export const output = <editor />
