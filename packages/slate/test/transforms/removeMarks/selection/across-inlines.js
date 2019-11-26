/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.removeMarks(editor, [{ key: 'a' }])
}

export const input = (
  <value>
    <block>
      <text />
      <inline>
        wo
        <anchor />
        <mark key="a">rd</mark>
      </inline>
      <text />
    </block>
    <block>
      <text />
      <inline>
        <mark key="a">an</mark>
        <focus />
        other
      </inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
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
  </value>
)
