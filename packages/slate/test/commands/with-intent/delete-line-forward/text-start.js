/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteLineForward()
}

export const input = (
  <value>
    
      <block>
        <cursor />
        one two three
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <cursor />
      </block>
    
  </value>
)
