/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteLineBackward()
}

export const input = (
  <value>
    
      <block>
        one two thr<cursor />ee
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <cursor />ee
      </block>
    
  </value>
)
