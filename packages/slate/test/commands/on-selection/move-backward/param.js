/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveBackward(6)
}

export const input = (
  <value>
    
      <block>
        one two th<cursor />ree
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        one <cursor />two three
      </block>
    
  </value>
)
