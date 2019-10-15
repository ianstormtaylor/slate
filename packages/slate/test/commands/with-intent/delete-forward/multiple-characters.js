/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteForward(3)
}

export const input = (
  <value>
    
      <block>
        <cursor />word
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <cursor />d
      </block>
    
  </value>
)
