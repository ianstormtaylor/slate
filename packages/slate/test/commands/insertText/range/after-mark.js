/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertText('a')
}

export const input = (
  <value>
    <block>
      w
      <mark key="a">
        or<cursor />
      </mark>
      d
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      w
      <mark key="a">
        ora<cursor />
      </mark>
      d
    </block>
  </value>
)
