/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.replaceTextAtPath([0, 0], 3, 1, 'three')
}

export const input = (
  <value>
    
      <block>
        one<cursor />two
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        onethree<cursor />wo
      </block>
    
  </value>
)
