/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block void>one</block>
  </editor>
)

export const test = editor => {
  return Editor.before(editor, { path: [0, 0], offset: 1 }, { voids: true })
}

export const output = { path: [0, 0], offset: 0 }
