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
        wo<anchor />rd
      </block>
      <block>
        an<focus />other
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        wofragment<cursor />other
      </block>
    
  </value>
)
