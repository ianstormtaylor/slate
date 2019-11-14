/** @jsx jsx */

import { jsx } from '../../helpers'

export const run = editor => {
  editor.toggleMarks([{ key: 'a' }])
}

export const input = (
  <value>
    <block>
      one
      <mark a>
        <anchor />
        two
        <focus />
      </mark>
      three
    </block>
  </value>
)

export const output = input
