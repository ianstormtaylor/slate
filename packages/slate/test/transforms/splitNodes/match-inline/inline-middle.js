/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor, { match: n => Editor.isInline(editor, n) })
}

export const input = (
  <editor>
    <block>
      <text />
      <inline>
        wo
        <cursor />
        rd
      </inline>
      <text />
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <text />
      <inline>wo</inline>
      <text />
      <inline>
        <cursor />
        rd
      </inline>
      <text />
    </block>
  </editor>
)
