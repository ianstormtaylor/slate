/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.wrapNodes(
    <block a>
      <block b>
        <text />
      </block>
    </block>
  )
}

export const input = (
  <value>
    <block>
      wo
      <anchor />
      rd
    </block>
    <block>
      an
      <focus />
      other
    </block>
  </value>
)

export const output = (
  <value>
    <block a>
      <block>
        wo
        <anchor />
        rd
      </block>
      <block>
        an
        <focus />
        other
      </block>
    </block>
  </value>
)
