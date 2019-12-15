/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.liftNodes(editor, { match: n => n.c })
}

export const input = (
  <editor>
    <block a>
      <block b>
        <block c>
          <cursor />
          one
        </block>
      </block>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block a>
      <block c>
        <cursor />
        one
      </block>
    </block>
  </editor>
)
