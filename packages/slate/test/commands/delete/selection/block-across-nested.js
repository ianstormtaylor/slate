/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block>
      <block>
        one<anchor />
      </block>
      <block>two</block>
    </block>
    <block>
      <block>
        <focus />three
      </block>
      <block>four</block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block>
        one<cursor />three
      </block>
    </block>
    <block>
      <block>four</block>
    </block>
  </value>
)
