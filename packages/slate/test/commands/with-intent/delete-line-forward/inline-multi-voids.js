/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteLineForward()
}

export const input = (
  <value>
    
      <block>
        <cursor />
        one
        <emoji>😊</emoji>
        two
        <emoji>😊</emoji>
        three
        <emoji>😀</emoji>
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
