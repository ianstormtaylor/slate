/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, )
}

export const input = (
  <value>
    <block>
      <block>
        <anchor />
        one
      </block>
      <block>
        <block>two</block>
        <block>
          <block>
            three
            <focus />
          </block>
        </block>
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block>
        <cursor />
      </block>
    </block>
  </value>
)
