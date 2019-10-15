/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveWordForward()
}

export const input = (
  <value>
    
      <block>
        one <cursor />two three
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        one two<cursor /> three
      </block>
    
  </value>
)
