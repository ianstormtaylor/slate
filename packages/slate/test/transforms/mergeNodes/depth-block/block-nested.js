/** @jsx jsx */

import { Editor, Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block />
    <block>
      <block>
        <block>
          <cursor />
          two
        </block>
        <block>three</block>
      </block>
    </block>
  </editor>
)

export const run = editor => {
  Transforms.mergeNodes(editor, { match: n => Editor.isBlock(editor, n) })
}

export const output = (
  <editor>
    <block>
      <cursor />
      two
    </block>
    <block>
      <block>
        <block>three</block>
      </block>
    </block>
  </editor>
)
