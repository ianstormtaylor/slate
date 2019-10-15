/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.wrapText('[[', ']]')
}

export const input = (
  <value>
    
      <block>
        wo<anchor />rd<focus />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        wo[[<anchor />rd<focus />]]
      </block>
    
  </value>
)
