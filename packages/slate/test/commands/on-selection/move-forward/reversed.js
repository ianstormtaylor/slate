/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveForward()
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
        one t<focus />wo thr<anchor />ee
      </block>
    
  </value>
)
