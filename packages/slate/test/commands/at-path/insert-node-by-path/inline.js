/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      <cursor />word
    </block>
  </value>
)

export const run = editor => {
  editor.insertNodeAtPath(
    [0, 0],
    <inline>
      <text />
    </inline>
  )
}

export const output = (
  <value>
    <block>
      <text />
      <inline>
        <text />
      </inline>
      <cursor />word
    </block>
  </value>
)
