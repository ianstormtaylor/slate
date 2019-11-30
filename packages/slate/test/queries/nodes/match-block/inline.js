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

export const run = editor => {
  return Array.from(
    Editor.nodes(editor, { at: [], match: 'block', mode: 'highest' })
  )
}

export const output = [
  [
    <block>
      one<inline>two</inline>three
    </block>,
    [0],
  ],
]
