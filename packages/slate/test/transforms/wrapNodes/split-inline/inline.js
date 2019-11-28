/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      one
      <anchor />
      two
      <focus />
      three
    </block>
  </editor>
)

export const run = editor => {
  Editor.wrapNodes(editor, <inline new />, { split: true })
}

export const output = (
  <editor>
    <block>
      one
      <inline new>
        <anchor />
        two
        <focus />
      </inline>
      three
    </block>
  </editor>
)
