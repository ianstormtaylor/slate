/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteLineBackward()
}

export const input = (
  <value>
    
      <block>
        one <inline>wo📛rd</inline>
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
