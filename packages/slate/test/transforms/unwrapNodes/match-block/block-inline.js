/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.unwrapNodes(editor, { match: n => n.a })
}

export const input = (
  <editor>
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
  </editor>
)

export const output = (
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
