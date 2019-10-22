/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitInline()
}

export const input = (
  <value>
    <block>
      <inline>
        <mark key="a">
          wo<cursor />rd
        </mark>
      </inline>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <inline>
        <mark key="a">wo</mark>
      </inline>
      <inline>
        <mark key="a">
          <cursor />rd
        </mark>
      </inline>
    </block>
  </value>
)
