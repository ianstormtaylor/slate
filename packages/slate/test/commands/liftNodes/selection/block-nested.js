/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.liftNodes({ depth: 3 })
}

export const input = (
  <value>
    <block a>
      <block b>
        <block c>
          <cursor />one
        </block>
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block a>
      <block c>
        <cursor />one
      </block>
    </block>
  </value>
)
