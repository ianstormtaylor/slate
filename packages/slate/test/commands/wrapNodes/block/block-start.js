/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      <anchor />wo<focus />rd
    </block>
  </value>
)

export const run = editor => {
  editor.wrapNodes(<block new />)
}

export const output = (
  <value>
    <block new>
      <block>
        <anchor />wo<focus />
      </block>
    </block>
    <block>rd</block>
  </value>
)
