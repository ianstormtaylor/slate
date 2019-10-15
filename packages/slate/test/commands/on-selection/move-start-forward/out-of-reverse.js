/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveStartForward(7)
}

export const input = (
  <value>
    
      <block>
        one <focus />two t<anchor />hree
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        one two t<anchor />hr<focus />ee
      </block>
    
  </value>
)
