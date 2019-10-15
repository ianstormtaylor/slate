/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveEndBackward(6)
}

export const input = (
  <value>
    
      <block>
        one <anchor />two<focus /> three
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
