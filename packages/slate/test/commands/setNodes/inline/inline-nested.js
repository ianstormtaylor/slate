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
        <text />
        <inline>
          <cursor />word
        </inline>
        <text />
      </inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline key>
        <text />
        <inline>
          <cursor />word
        </inline>
        <text />
      </inline>
      <text />
    </block>
  </value>
)
