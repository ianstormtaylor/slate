/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveAnchorBackward(8)
}

export const input = (
  <value>
    
      <block>
        one <focus />two th<anchor />ree
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        on<anchor />e <focus />two three
      </block>
    
  </value>
)
