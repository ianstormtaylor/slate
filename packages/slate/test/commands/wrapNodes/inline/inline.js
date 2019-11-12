/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.wrapNodes(<inline a />)
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
