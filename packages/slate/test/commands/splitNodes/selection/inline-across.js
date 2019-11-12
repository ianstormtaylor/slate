/** @jsx jsx */

import { jsx } from '../../../helpers'

export const input = (
  <value>
    <block>
      <text />
      <inline>
        wo<anchor />rd
      </inline>
      <text />
    </block>
    <block>
      <text />
      <inline>
        an<focus />other
      </inline>
      <text />
    </block>
  </value>
)

export const run = editor => {
  editor.splitNodes()
}

export const output = (
  <value>
    <block>
      <text />
      <inline>wo</inline>
      <text />
    </block>
    <block>
      <text />
      <inline>
        <cursor />other
      </inline>
      <text />
    </block>
  </value>
)
