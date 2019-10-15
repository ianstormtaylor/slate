/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveToStart()
}

export const input = (
  <value>
    
      <block>
        <anchor />one<focus />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <cursor />one
      </block>
    
  </value>
)
