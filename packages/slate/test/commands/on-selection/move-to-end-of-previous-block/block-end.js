/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveToEndOfPreviousBlock()
}

export const input = (
  <value>
    
      <block>one</block>
      <block>
        two<cursor />
      </block>
      <block>three</block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        one<cursor />
      </block>
      <block>two</block>
      <block>three</block>
    
  </value>
)
