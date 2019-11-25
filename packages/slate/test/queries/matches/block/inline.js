/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>
      one<inline>two</inline>three
    </block>
  </value>
)

export const run = editor => {
  return Array.from(Editor.matches(editor, { at: [], match: 'block' }))
}

export const output = [
  [
    <block>
      one<inline>two</inline>three
    </block>,
    [0],
  ],
]
