/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>one</block>
  </value>
)

export const run = editor => {
  return Array.from(editor.matches({ at: [], match: 'block' }))
}

export const output = [[<block>one</block>, [0]]]
