/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.surroundNodes(<inline a />)
}

export const input = (
  <value>
    <block>
      <cursor />word
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline a>
        <cursor />word
      </inline>
      <text />
    </block>
  </value>
)
