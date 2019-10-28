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
  editor.wrapNodes(<block new />, { split: true })
}

export const output = (
  <value>
    <block>on</block>
    <block new>
      <block>
        <anchor />e
      </block>
      <block>
        t<focus />
      </block>
    </block>
    <block>wo</block>
  </value>
)
