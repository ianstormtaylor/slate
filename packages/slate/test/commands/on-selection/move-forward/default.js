/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveForward()
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
        one t<cursor />wo three
      </block>
    
  </value>
)
