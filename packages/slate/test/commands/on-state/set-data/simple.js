/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.setData({ thing: 'value' })
}

export const input = (
  <value>
    
      <block>word</block>
      <block>another</block>
    
  </value>
)

export const output = (
  <value data={{ thing: 'value' }}>
    
      <block>word</block>
      <block>another</block>
    
  </value>
)
