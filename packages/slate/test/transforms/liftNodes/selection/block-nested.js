/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.liftNodes(editor, { match: ([, p]) => p.length === 3 })
}

export const input = (
  <value>
    <block a>
      <block b>
        <block c>
          <cursor />
          one
        </block>
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block a>
      <block c>
        <cursor />
        one
      </block>
    </block>
  </value>
)
