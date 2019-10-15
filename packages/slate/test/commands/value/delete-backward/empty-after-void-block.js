/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteBackward()
}

export const input = (
  <value>
    
      <image />
      <block>
        <cursor />
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
