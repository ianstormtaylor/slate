/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteLineBackward()
}

export const input = (
  <value>
    
      <block>
        <cursor />
        one two three
      </block>
    
  </value>
)

export const output = input
