/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.move({ edge: 'focus', distance: 7 })
}

export const input = (
  <value>
    <block>
      one <focus />two <anchor />three
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one two <anchor />thr<focus />ee
    </block>
  </value>
)
