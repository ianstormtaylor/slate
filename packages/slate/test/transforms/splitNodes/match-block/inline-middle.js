/** @jsx jsx */

import { Editor, Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.splitNodes(editor, { match: n => Editor.isBlock(editor, n) })
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
    </block>
    <block>
      <text />
      <inline>
        <cursor />
        rd
      </inline>
      <text />
    </block>
  </editor>
)
