/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitBlock()
}

export const input = (
  <value>
    
      <block>
        wo<anchor />rd
      </block>
      <block>
        an<focus />other
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>wo</block>
      <block>
        <cursor />other
      </block>
    
  </value>
)
