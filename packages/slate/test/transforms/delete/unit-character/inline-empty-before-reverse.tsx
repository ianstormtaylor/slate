/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor, { unit: 'character', reverse: true })
}
export const input = (
  <editor>
    <block>
      before
      <inline>
        <text />
      </inline>
      <cursor />
      after
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      before
      <cursor />
      after
    </block>
  </editor>
)
