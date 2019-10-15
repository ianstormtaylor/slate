/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteBackward(3)
}

export const input = (
  <value>
    
      <block>
        word<cursor />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        w<cursor />
      </block>
    
  </value>
)
