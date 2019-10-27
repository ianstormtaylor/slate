/** @jsx h */

import { h } from '../../helpers'

export const input = (
  <value>
    <block void>one</block>
  </value>
)

export const run = editor => {
  return Array.from(editor.texts())
}

export const output = []
