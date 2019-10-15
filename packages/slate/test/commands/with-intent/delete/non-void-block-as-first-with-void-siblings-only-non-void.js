/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    
      <block>
        <anchor />one
      </block>
      <image>
        <focus />
      </image>
      <block>two</block>
    
  </value>
)

export const output = (
  <value>
    
      <image>
        <cursor />
      </image>
      <block>two</block>
    
  </value>
)
