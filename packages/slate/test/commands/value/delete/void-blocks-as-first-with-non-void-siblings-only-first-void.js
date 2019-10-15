/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    
      <image>
        <anchor />
      </image>
      <image>
        <focus />
      </image>
      <block>one</block>
      <block>two</block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <cursor />one
      </block>
      <block>two</block>
    
  </value>
)
