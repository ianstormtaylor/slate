/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertFragment(
    
      <block>
        <block>one</block>
        <block>two</block>
      </block>
      <block>after quote</block>
    
  )
}

export const input = (
  <value>
    
      <block>
        <cursor />word
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>one</block>
      <block>
        <block>two</block>
      </block>
      <block>
        after quote<cursor />word
      </block>
    
  </value>
)
