/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    
      <block>
        word<anchor />
      </block>
      <block>
        <focus />another
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        word<cursor />another
      </block>
    
  </value>
)
