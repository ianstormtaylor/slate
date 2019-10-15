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
          <b>rd</b>
        </inline>
      </block>
      <block>
        <inline>
          <b>an</b>
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
