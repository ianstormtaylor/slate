/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.addMarks(editor, [{ key: 'a' }])
}

export const input = (
  <editor>
    <block>
      <mark key="b">
        wo
        <anchor />
        rd
      </mark>
    </block>
    <block>
      <mark key="b">
        an
        <focus />
        other
      </mark>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <mark key="b">wo</mark>
      <mark key="a">
        <mark key="b">
          <anchor />
          rd
        </mark>
      </mark>
    </block>
    <block>
      <mark key="a">
        <mark key="b">
          an
          <focus />
        </mark>
      </mark>
      <mark key="b">other</mark>
    </block>
  </editor>
)
