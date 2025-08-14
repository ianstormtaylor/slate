/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

// This is invalid due to the lack of a text node before the inline, but this
// case can arise prior to normalization so it needs to be handled anyway.
export const input = (
  <editor>
    <block>
      <inline nonSelectable>two</inline>three
    </block>
  </editor>
)

export const test = editor => {
  return Editor.before(editor, { path: [0, 1], offset: 0 })
}

export const output = undefined
