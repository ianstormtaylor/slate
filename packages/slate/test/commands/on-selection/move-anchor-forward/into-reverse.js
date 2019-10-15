/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveAnchorForward(8)
}

export const input = (
  <value>
    
      <block>
        one <anchor />two th<focus />ree
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        one two th<focus />re<anchor />e
      </block>
    
  </value>
)
