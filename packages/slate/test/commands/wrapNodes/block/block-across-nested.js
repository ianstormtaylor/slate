/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.wrapNodes(<block a />)
}

export const input = (
  <value>
    <block>
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

export const output = (
  <value>
    <block>
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
    </block>
  </value>
)
