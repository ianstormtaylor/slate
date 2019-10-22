/** @jsx h */

import { h } from '../../../../helpers'

export const run = editor => {
  editor.delete({ unit: 'character' })
}

export const input = (
  <value>
    <block>
      <text />
      <inline>
        <cursor />📛word
      </inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline>
        <cursor />word
      </inline>
      <text />
    </block>
  </value>
)
