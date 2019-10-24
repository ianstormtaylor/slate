/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitNodes({ at: [0, 2] })
}

export const input = (
  <value>
    <block>
      <text />
      <inline>
        o<anchor />ne
      </inline>
      <text />
      <inline>
        tw<focus />o
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
        o<anchor />ne
      </inline>
      <text />
    </block>
    <block>
      <text />
      <inline>
        tw<focus />o
      </inline>
      <text />
    </block>
  </value>
)
