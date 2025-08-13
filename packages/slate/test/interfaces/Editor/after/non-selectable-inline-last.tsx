/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

// This is invalid due to the lack of a text node after the inline, but this
// case can arise prior to normalization so it needs to be handled anyway.
export const input = (
  <editor>
    <block>
      one<inline nonSelectable>two</inline>
    </block>
  </editor>
)

export const test = editor => {
  return Editor.after(editor, { path: [0, 0], offset: 3 })
}

export const output = undefined
