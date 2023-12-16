/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <text />
      <inline readOnly>
        read-only <cursor />
        inline
      </inline>
    </block>
  </editor>
)
export const run = editor => {
  Transforms.insertText(editor, 'x')
}
export const output = (
  <editor>
    <block>
      <text />
      <inline readOnly>
        read-only <cursor />
        inline
      </inline>
    </block>
  </editor>
)
