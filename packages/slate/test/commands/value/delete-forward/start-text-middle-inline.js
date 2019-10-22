/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block>
      <anchor />one<inline>
        t<focus />wo
      </inline>
    </block>
  </value>
)

// TODO: this output selection seems bad
export const output = (
  <value>
    <block>
      <inline>
        <cursor />wo
      </inline>
    </block>
  </value>
)
