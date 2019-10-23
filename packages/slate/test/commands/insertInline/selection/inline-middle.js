/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertInline(
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
      <inline>
        wo
        <inline void>
          <cursor />
        </inline>
        rd
      </inline>
      <text />
    </block>
  </value>
)
