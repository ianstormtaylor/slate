/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.insertNodes(
    <block>
      <text />
    </block>
  )
}

export const input = (
  <value>
    <block void>
      text
      <cursor />
    </block>
    <block>text</block>
  </value>
)

export const output = (
  <value>
    <block void>text</block>
    <block>
      <cursor />
    </block>
    <block>text</block>
  </value>
)

export const skip = true
