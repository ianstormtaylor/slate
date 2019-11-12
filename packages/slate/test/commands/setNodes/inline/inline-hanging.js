/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.setNodes({ key: true }, { match: 'inline' })
}

export const input = (
  <value>
    <block>
      <text />
      <inline>
        <anchor />word
      </inline>
      <focus />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline key>
        <anchor />word
      </inline>
      <focus />
    </block>
  </value>
)
