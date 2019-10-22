/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    
      <block void>
        <anchor />
      </block>
      <block>
        tw<focus />o
      </block>
      <block>three</block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <cursor />o
      </block>
      <block>three</block>
    
  </value>
)
