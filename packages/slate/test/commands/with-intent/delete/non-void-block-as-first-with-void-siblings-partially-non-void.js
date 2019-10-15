/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    
      <block>
        on<anchor />e<focus />
      </block>
      <image />
      <block>three</block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        on<cursor />
      </block>
      <image />
      <block>three</block>
    
  </value>
)
