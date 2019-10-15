/** @jsx h */

import { h } from '../../../helpers'

const fragment = (
  
    <block>1</block>
    <block>2</block>
    <block>3</block>
  
)

export const run = editor => {
  editor.insertFragment(fragment)
}

export const input = (
  <value>
    
      <block>one</block>
      <block>
        <anchor />two
      </block>
      <block>
        <focus />three
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>one</block>
      <block>1</block>
      <block>2</block>
      <block>
        3<cursor />three
      </block>
    
  </value>
)
