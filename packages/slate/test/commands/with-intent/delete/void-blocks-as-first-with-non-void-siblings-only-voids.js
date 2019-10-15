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
      <image />
      <block>
        <focus />one
      </block>
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
