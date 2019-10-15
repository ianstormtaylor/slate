/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeTextAtPoint({ path: [0, 0], offset: 2 }, 1)
}

export const input = (
  <value>
    <block>
      <text>
        w<annotation atomic key="a">
          or
        </annotation>d
      </text>
    </block>
  </value>
)

export const output = (
  <value>
    <block>wod</block>
  </value>
)
