/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveWordBackward()
}

export const input = (
  <value>
    
      <block>
        one <focus />two three fou<anchor />r five six
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <focus />one two three <anchor />four five six
      </block>
    
  </value>
)
