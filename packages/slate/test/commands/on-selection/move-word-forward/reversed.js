/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveWordForward()
}

export const input = (
  <value>
    
      <block>
        one <focus />two three fou<anchor />r five six
      </block>
    
  </value>
)

// Should move to next word after focus and collapse
export const output = (
  <value>
    
      <block>
        one two<focus /> three four<anchor /> five six
      </block>
    
  </value>
)
