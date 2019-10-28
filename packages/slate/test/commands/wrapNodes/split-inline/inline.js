/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      one
      <anchor />two<focus />
      three
    </block>
  </value>
)

export const run = editor => {
  editor.wrapNodes(<inline new />, { split: true })
}

export const output = (
  <value>
    <block>
      one
      <inline new>
        <anchor />two<focus />
      </inline>
      three
    </block>
  </value>
)
