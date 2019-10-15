/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.unwrapInline('hashtag')
}

export const input = (
  <value>
    <block>
      w<anchor />o<inline>rd</inline>
    </block>
    <block>
      <inline>an</inline>ot<focus />her
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      w<anchor />ord
    </block>
    <block>
      anot<focus />her
    </block>
  </value>
)
