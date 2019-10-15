/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.setBlocks({ type: 'code' })
}

export const input = (
  <value>
    <block>
      <inline>
        <anchor />word
      </inline>
    </block>
    <block>
      <inline>
        another<focus />
      </inline>
    </block>
  </value>
)

export const output = (
  <value>
    <code>
      <inline>
        <anchor />word
      </inline>
    </code>
    <code>
      <inline>
        another<focus />
      </inline>
    </code>
  </value>
)
