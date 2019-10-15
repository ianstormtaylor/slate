/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveAnchorForward(3)
}

export const input = (
  <value>
    
      <block>
        one <anchor />two thr<focus />ee
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        one two<anchor /> thr<focus />ee
      </block>
    
  </value>
)
