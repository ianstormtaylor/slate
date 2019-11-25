/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.wrapNodes(editor, <block a />)
}

export const input = (
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

export const output = (
  <value>
    <block a>
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
    </block>
  </value>
)
