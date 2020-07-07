/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor, { unit: 'word' })
}
export const input = (
  <editor>
    <block>
      o<cursor />
      ne two three
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      o<cursor /> two three
    </block>
  </editor>
)
