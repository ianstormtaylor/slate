/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>
      one
      <anchor />
      two
      <focus />
      three
    </block>
  </value>
)

export const run = editor => {
  Editor.wrapNodes(editor, <inline new />, { split: true })
}

export const output = (
  <value>
    <block>
      one
      <inline new>
        <anchor />
        two
        <focus />
      </inline>
      three
    </block>
  </value>
)
