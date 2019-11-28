/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const input = (
  <editor>
    <block>
      <mark key="a">
        <mark key="b">
          o<anchor />
          ne
        </mark>
      </mark>
    </block>
    <block>
      <mark key="a">
        <mark key="b">
          o<focus />
          ne
        </mark>
      </mark>
    </block>
  </editor>
)

export const run = editor => {
  return Array.from(Editor.activeMarks(editor))
}

export const output = [{ key: 'b' }, { key: 'a' }]
