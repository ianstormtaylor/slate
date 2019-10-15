/** @jsx h */

import h from '../../../../helpers/h'

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
        <cursor />word
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>one</block>
      <block>two</block>
      <block>
        three<cursor />word
      </block>
    
  </value>
)
