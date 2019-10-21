/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      o<cursor />ne
    </block>
  </value>
)

export const run = editor => {
  return Array.from(editor.getActiveMarks())
}

export const output = []
