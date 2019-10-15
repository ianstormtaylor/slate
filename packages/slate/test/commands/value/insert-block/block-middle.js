/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertBlock('quote')
}

export const input = (
  <value>
    
      <block>
        wo<cursor />rd
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>wo</block>
      <block>
        <cursor />
      </block>
      <block>rd</block>
    
  </value>
)
