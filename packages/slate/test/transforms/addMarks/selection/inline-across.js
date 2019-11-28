/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.addMarks(editor, [{ key: 'a' }])
}

export const input = (
  <editor>
    <block>
      <text />
      <inline>
        wo
        <anchor />
        rd
      </inline>
      <text />
    </block>
    <block>
      <text />
      <inline>
        an
        <focus />
        other
      </inline>
      <text />
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <text />
      <inline>
        wo
        <mark key="a">
          <anchor />
          rd
        </mark>
      </inline>
      <mark key="a" />
    </block>
    <block>
      <mark key="a" />
      <inline>
        <mark key="a">
          an
          <focus />
        </mark>
        other
      </inline>
      <text />
    </block>
  </editor>
)
