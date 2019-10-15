/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteLineBackward()
}

export const input = (
  <value>
    
      <block>
        <emoji>😊</emoji>
        one
        <emoji>😊</emoji>
        two
        <emoji>😀</emoji>
        three
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
