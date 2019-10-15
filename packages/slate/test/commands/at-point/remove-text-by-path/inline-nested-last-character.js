/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeTextAtPoint({ path: [0, 1, 1, 0], offset: 0 }, 1)
}

export const input = (
  <value>
    <block>
      <text />
      <inline>
        <text />
        <inline>
          <text>
            <cursor />a
          </text>
        </inline>
        <text />
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
        <inline>
          <cursor />
        </inline>
        <text />
      </inline>
      <text />
    </block>
  </value>
)
