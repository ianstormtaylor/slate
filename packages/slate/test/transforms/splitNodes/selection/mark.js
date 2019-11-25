/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor, { match: 'inline' })
}

export const input = (
  <value>
    <block>
      <text />
      <inline>
        <mark key="a">
          wo
          <cursor />
          rd
        </mark>
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
        <mark key="a">wo</mark>
      </inline>
      <text />
      <inline>
        <mark key="a">
          <cursor />
          rd
        </mark>
      </inline>
      <text />
    </block>
  </value>
)
