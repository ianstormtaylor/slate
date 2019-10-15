/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertFragment(
    
      <block>one</block>
      <block>two</block>
    
  )
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
    
      <block>woone</block>
      <block>
        two<cursor />rd
      </block>
    
  </value>
)
