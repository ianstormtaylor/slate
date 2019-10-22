/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeMark('bold')
}

export const input = (
  <value>

      <block>
        <inline>
          wo<anchor />
          <mark key="a">rd</mark>
        </inline>
      </block>
      <block>
        <inline>
          <mark key="a">an</mark>
          <focus />other
        </inline>
      </block>

  </value>
)

export const output = (
  <value>

      <block>
        <inline>
          wo<anchor />rd
        </inline>
      </block>
      <block>
        <inline>
          an<focus />other
        </inline>
      </block>

  </value>
)
