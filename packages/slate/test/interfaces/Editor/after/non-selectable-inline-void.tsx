/** @jsx jsx */

import { Editor } from 'slate'

export const input = (
  <editor>
    <block>
      one
      <inline nonSelectable void>
        <text />
      </inline>
      three
    </block>
  </editor>
)

export const test = (editor) => {
  return Editor.after(editor, { path: [0, 0], offset: 3 })
}

export const output = { path: [0, 2], offset: 0 }
