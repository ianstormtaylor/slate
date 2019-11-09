/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block void>
      <block>one</block>
    </block>
  </value>
)

export const run = editor => {
  return Array.from(editor.matches({ at: [], match: 'block' }))
}

export const output = []
