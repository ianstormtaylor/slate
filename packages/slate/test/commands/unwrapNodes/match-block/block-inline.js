/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.unwrapNodes({ match: { key: 'a' } })
}

export const input = (
  <value>
    <block key="a">
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
    </block>
  </value>
)

export const output = (
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
