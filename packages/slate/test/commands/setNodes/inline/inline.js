/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.setNodes({ thing: true }, { match: 'inline' })
}

export const input = (
  <value>
    <block>
      <text />
      <inline>
        <cursor />word
      </inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline thing>
        <cursor />word
      </inline>
      <text />
    </block>
  </value>
)
