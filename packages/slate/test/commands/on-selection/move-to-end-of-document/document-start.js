/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveToEndOfDocument()
}

export const input = (
  <value>
    
      <block>
        <cursor />one
      </block>
      <block>two</block>
      <block>three</block>
    
  </value>
)

export const output = (
  <value>
    
      <block>one</block>
      <block>two</block>
      <block>
        three<cursor />
      </block>
    
  </value>
)
