/** @jsx h */

import { h } from '../../../../helpers'

export const run = editor => {
  editor.delete({ unit: 'character', reverse: true })
}

export const input = (
  <value>
    <block>
      <text />
      <inline>
        word📛<cursor />
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
        word<cursor />
      </inline>
      <text />
    </block>
  </value>
)
