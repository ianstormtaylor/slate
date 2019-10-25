/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitNodes({ depth: 0 })
}

export const input = (
  <value>
    <block>
      <block>
        <block>
          wo<cursor />rd
        </block>
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block>
        <block>wo</block>
      </block>
    </block>
    <block>
      <block>
        <block>
          <cursor />rd
        </block>
      </block>
    </block>
  </value>
)
