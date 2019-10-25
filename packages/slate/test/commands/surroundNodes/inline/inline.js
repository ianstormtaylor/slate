/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.surroundNodes(<inline a />)
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
      <inline a>
        <text />
        <inline>
          <cursor />word
        </inline>
        <text />
      </inline>
      <text />
    </block>
  </value>
)
