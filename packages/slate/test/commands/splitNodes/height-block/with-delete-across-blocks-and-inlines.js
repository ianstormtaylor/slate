/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitNodes({ height: 'block' })
}

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

export const output = (
  <value>
    <block>
      <text />
      <inline>wo</inline>
      <text />
      <inline>
        <text />
      </inline>
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
