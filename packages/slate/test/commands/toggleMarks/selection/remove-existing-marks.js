/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.toggleMarks([{ key: 'a' }])
}

export const input = (
  <value>
    <block>
      <mark key="a">
        <mark key="b">
          <anchor />
          wo
        </mark>
      </mark>
      <mark key="b">
        <focus />
        rd
      </mark>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <mark key="b">
        <anchor />
        wo
        <focus />
        rd
      </mark>
    </block>
  </value>
)
