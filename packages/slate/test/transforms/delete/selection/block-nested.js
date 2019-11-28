/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor)
}

export const input = (
  <editor>
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
  </editor>
)

export const output = (
  <editor>
    <block>
      <block>
        <cursor />
      </block>
    </block>
  </editor>
)
