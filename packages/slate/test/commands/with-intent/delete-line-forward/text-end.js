/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteLineForward()
}

export const input = (
  <value>
    
      <block>
        one two three
        <cursor />
      </block>
    
  </value>
)

export const output = input
