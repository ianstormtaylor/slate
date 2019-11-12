/** @jsx jsx */

import { jsx } from '../../../helpers'

export const input = (
  <value>
    <block>one</block>
  </value>
)

export const run = editor => {
  return Array.from(editor.matches({ at: [], match: 'inline' }))
}

export const output = [[<text>one</text>, [0, 0]]]
