/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.insertText(editor, ' a few words ')
}
export const input = (
  <editor>
    <block>
      w<cursor />
      ord
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      w a few words <cursor />
      ord
    </block>
  </editor>
)
