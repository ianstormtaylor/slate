/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteForward()
}

export const input = (
  <value>
    
      <block>
        <cursor />
      </block>
      <image />
    
  </value>
)

export const output = (
  <value>
    
      <image>
        <cursor />
      </image>
    
  </value>
)
