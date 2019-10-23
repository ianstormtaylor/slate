/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertFragment(
    
      <block>one</block>
      <block>two</block>
      <block>three</block>
    
  )
}

export const input = (
  <value>
    
      <block>
        word<cursor />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>wordone</block>
      <block>two</block>
      <block>
        three<cursor />
      </block>
    
  </value>
)
