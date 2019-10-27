/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitNodes({ match: 'inline' })
}

export const input = (
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

export const output = (
  <value>
    <block>
      <text />
      <inline>
        <text />
      </inline>
      <text />
      <inline>
        <cursor />word
      </inline>
      <text />
    </block>
  </value>
)
