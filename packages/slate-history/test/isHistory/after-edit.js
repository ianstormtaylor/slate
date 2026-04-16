/** @jsx jsx */

import { Transforms } from 'slate'

export const input = (
  <editor>
    <block>
      Initial text <cursor />
    </block>
  </editor>
)

export const run = (editor) => {
  Transforms.insertText(editor, 'additional text')
}

export const output = true
