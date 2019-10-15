/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveStartForward()
}

export const input = (
  <value>
    
      <block>
        one two t<cursor />hree
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        one two t<focus />h<anchor />ree
      </block>
    
  </value>
)
