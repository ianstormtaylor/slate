/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.unwrapInline('hashtag')
}

export const input = (
  <value>
    <block>
      <inline>
        wo<anchor />
      </inline>
      <inline>
        <inline>rd</inline>
      </inline>
      <inline>
        <inline>an</inline>
      </inline>
      <inline>
        ot<focus />her
      </inline>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <inline>
        wo<anchor />
      </inline>
      <inline>rd</inline>
      <inline>an</inline>
      <inline>
        ot<focus />her
      </inline>
    </block>
  </value>
)
