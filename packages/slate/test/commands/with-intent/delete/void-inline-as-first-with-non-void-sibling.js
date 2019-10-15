/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    
      <block>
        <emoji>
          <anchor />
        </emoji>
        <focus />abc
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <cursor />abc
      </block>
    
  </value>
)
