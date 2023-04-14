/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      one<inline nonSelectable>two</inline>three
    </block>
  </editor>
)

export const test = editor => {
  return Editor.before(
    editor,
    { path: [0, 2], offset: 0 },
    { ignoreNonSelectable: true }
  )
}

export const output = { path: [0, 0], offset: 3 }
