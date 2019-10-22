/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block>
      <block>
        <anchor />one
      </block>
      <block>
        <block>two</block>
        <block>
          <block>
            three<focus />
          </block>
        </block>
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block>
        <cursor />
      </block>
    </block>
  </value>
)
