/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteBackward()
}

export const input = (
  <value>
    
      <block>
        one<inline>two</inline>
        <cursor />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        one<inline>tw</inline>
        <cursor />
      </block>
    
  </value>
)
