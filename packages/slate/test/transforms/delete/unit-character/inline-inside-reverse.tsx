/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor, { unit: 'character', reverse: true })
}
export const input = (
  <editor>
    <block>
      one
      <inline>
        a<cursor />
      </inline>
      three
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      one
      <inline>
        <cursor />
      </inline>
      three
    </block>
  </editor>
)
