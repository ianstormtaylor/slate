/** @jsx jsx */

import { jsx } from '../../../helpers'

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
        word<cursor />
      </block>
      <block>another</block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        wordonetwo<cursor />
      </block>
      <block>another</block>
    
  </value>
)
