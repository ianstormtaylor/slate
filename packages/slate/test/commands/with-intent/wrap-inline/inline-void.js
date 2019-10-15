/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.wrapInline('link')
}

export const input = (
  <value>
    <block>
      <inline void>
        <cursor />
      </inline>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <inline>
        <inline void>
          <cursor />
        </inline>
      </inline>
    </block>
  </value>
)
