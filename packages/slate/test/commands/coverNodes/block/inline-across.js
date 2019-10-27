/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.coverNodes(<block a />)
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
    <block a>
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
