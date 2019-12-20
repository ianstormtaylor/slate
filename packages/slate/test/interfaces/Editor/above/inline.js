/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      one<inline>two</inline>three
    </block>
  </editor>
)

export const test = editor => {
  return Editor.above(editor, {
    at: [0, 1, 0],
    match: n => Editor.isInline(editor, n),
  })
}

export const output = [<inline>two</inline>, [0, 1]]
