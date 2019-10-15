/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteWordBackward()
}

export const input = (
  <value>
    <block>
      <inline>
        wo📛rd<cursor />
      </inline>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />
      <inline>
        <text />
      </inline>
    </block>
  </value>
)
