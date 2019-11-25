/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor, {
    at: { path: [0, 1, 0], offset: 2 },
    match: ([, p]) => p.length === 2,
  })
}

export const input = (
  <value>
    <block>
      <text />
      <inline>
        <text>word</text>
      </inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline>
        <text>wo</text>
      </inline>
      <text />
      <inline>
        <text>rd</text>
      </inline>
      <text />
    </block>
  </value>
)
