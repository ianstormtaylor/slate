/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveEndBackward()
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
        one <focus />two <anchor />three
      </block>
    
  </value>
)
