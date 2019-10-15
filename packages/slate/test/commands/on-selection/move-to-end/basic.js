/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveToEnd()
}

export const input = (
  <value>
    
      <block>
        <anchor />one<focus />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        one<cursor />
      </block>
    
  </value>
)
