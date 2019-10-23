/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete({ unit: 'character', reverse: true })
}

export const input = (
  <value>
    <block>
      one
      <inline>
        a<cursor />
      </inline>
      three
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one
      <inline>
        <cursor />
      </inline>
      three
    </block>
  </value>
)
