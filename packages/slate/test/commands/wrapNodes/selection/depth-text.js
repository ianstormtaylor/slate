/** @jsx jsx */

import { jsx } from '../../../helpers'

export const input = (
  <value>
    <block>
      <text>
        <anchor />word<focus />
      </text>
    </block>
  </value>
)

export const run = editor => {
  editor.wrapNodes(<block new />, { match: 'text' })
}

export const output = (
  <value>
    <block>
      <block new>
        <anchor />word<focus />
      </block>
    </block>
  </value>
)
