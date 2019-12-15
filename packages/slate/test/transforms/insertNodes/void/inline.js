/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      one
      <inline>
        two
        <cursor />
      </inline>
      three
    </block>
  </editor>
)

export const run = editor => {
  Editor.insertNodes(
    editor,
    <inline void>
      <text>four</text>
    </inline>
  )
}

export const output = (
  <editor>
    <block>
      one
      <inline>
        two
        <inline void>
          four
          <cursor />
        </inline>
        <text />
      </inline>
      three
    </block>
  </editor>
)
