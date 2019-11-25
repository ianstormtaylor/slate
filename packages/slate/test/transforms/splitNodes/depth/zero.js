/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor, { match: ([, p]) => p.length === 0 })
}

export const input = (
  <value>
    <block>
      <block>
        <block>
          wo
          <cursor />
          rd
        </block>
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block>
        <block>wo</block>
      </block>
    </block>
    <block>
      <block>
        <block>
          <cursor />
          rd
        </block>
      </block>
    </block>
  </value>
)
