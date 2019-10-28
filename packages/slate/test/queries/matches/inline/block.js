/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>one</block>
  </value>
)

export const run = editor => {
  return Array.from(editor.matches({ match: 'inline' }))
}

export const output = [[<text>one</text>, [0, 0]]]
