/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertText('is ')
}

export const input = (
  <value>
    <block>
      <mark key="a">
        <mark key="b">Cat</mark>
      </mark>
    </block>
    <block>
      <mark key="a">
        <cursor />Cute
      </mark>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <mark key="a">
        <mark key="b">Cat</mark>
      </mark>
    </block>
    <block>
      <mark key="a">
        is <cursor />Cute
      </mark>
    </block>
  </value>
)
