/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.wrapText('[[', ']]')
}

export const input = (
  <value>
    
      <block>
        w<focus />or<anchor />d
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        w[[<focus />or<anchor />]]d
      </block>
    
  </value>
)
