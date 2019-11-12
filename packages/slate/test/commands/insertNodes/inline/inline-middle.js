/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.insertNodes(
    <inline void>
      <text />
    </inline>
  )
}

export const input = (
  <value>
    <block>
      <text />
      <inline>
        wo<cursor />rd
      </inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline>wo</inline>
      <text />
      <inline void>
        <cursor />
      </inline>
      <text />
      <inline>rd</inline>
      <text />
    </block>
  </value>
)
