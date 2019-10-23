/** @jsx h */

import h from '../../../../helpers/h'

export const run = editor => {
  editor.insertFragment(
    
      <block>fragment</block>
    
  )
}

export const input = (
  <value>
    
      <block>
        <inline>word</inline>
        <cursor />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <inline>word</inline>
        fragment<cursor />
      </block>
    
  </value>
)
