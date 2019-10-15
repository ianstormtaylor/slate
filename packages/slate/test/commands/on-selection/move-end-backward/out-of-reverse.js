/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveEndBackward(7)
}

export const input = (
  <value>
    
      <block>
        one <focus />two <anchor />three
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        o<anchor />ne <focus />two three
      </block>
    
  </value>
)
