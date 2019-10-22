/** @jsx h */

import { h } from '../../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block>
      o<anchor />ne<inline>two</inline>thre<focus />e
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      o<cursor />e
    </block>
  </value>
)
