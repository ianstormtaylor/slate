/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.insertFragment(
    
      <block>
        <text>one</text>
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
        one<cursor />
      </block>
    
  </value>
)
