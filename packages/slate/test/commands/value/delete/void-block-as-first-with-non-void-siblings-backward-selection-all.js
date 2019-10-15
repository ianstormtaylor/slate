/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    
      <image>
        <focus />
      </image>
      <block>one</block>
      <block>
        two<anchor />
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
