/** @jsx h */

import h from '../../../../helpers/h'

const fragment = (
  
    <block>fragment zero</block>
    <block>fragment one</block>
    <block>fragment two</block>
  
)

export const run = editor => {
  editor.insertFragment(fragment)
}

export const input = (
  <value>
    
      <block>zero</block>
      <block>
        <anchor />one
      </block>
      <block>
        <focus />two
      </block>
    
  </value>
)

// TODO: is this the right behavior?
export const output = (
  <value>
    
      <block>zero</block>
      <block>fragment zero</block>
      <block>fragment one</block>
      <block>
        fragment two<cursor />two
      </block>
    
  </value>
)
