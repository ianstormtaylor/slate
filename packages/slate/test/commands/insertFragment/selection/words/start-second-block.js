/** @jsx h */

import h from '../../../../helpers/h'

export const run = editor => {
  editor.insertFragment(
    
      <block>fragment</block>
    
  )
}

export const input = (
  <value>
    
      <block>word</block>
      <block>
        <cursor />another
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>word</block>
      <block>
        fragment<cursor />another
      </block>
    
  </value>
)
