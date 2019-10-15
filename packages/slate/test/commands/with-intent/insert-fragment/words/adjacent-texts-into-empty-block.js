/** @jsx h */

import h from '../../../../helpers/h'

export const run = editor => {
  editor.insertFragment(
    
      <block>
        <text>one</text>
        <text>two</text>
      </block>
    
  )
}

export const input = (
  <value>
    
      <block>
        <cursor />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        onetwo<cursor />
      </block>
    
  </value>
)
