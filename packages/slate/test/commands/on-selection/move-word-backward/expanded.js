/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveWordBackward()
}

export const input = (
  <value>
    
      <block>
        one <anchor />two three f<focus />our five six
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <anchor />one two three <focus />four five six
      </block>
    
  </value>
)
