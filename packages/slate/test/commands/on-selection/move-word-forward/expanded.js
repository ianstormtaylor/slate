/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveWordForward()
}

export const input = (
  <value>
    
      <block>
        one <anchor />two three f<focus />our five six
      </block>
    
  </value>
)

// Should move to next word after focus and collapse
export const output = (
  <value>
    
      <block>
        one two<anchor /> three four<focus /> five six
      </block>
    
  </value>
)
