/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveFocusBackward(10)
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
        o<focus />ne <anchor />two three
      </block>
    
  </value>
)
