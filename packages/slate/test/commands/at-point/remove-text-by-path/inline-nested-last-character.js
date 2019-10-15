/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeTextAtPath([0, 1, 1, 0], 0, 1)
}

export const input = (
  <value>
    <block>
      <text />
      <inline>
        <text />
        <hashtag>
          <text>
            <cursor />a
          </text>
        </hashtag>
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
        <hashtag>
          <cursor />
        </hashtag>
        <text />
      </inline>
      <text />
    </block>
  </value>
)
