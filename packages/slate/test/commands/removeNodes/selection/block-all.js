/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      on<anchor />e
    </block>
    <block>
      t<focus />wo
    </block>
  </value>
)

export const run = editor => {
  editor.removeNodes()
}

export const output = <value />
