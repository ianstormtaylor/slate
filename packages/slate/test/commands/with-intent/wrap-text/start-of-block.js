/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.wrapText('[[', ']]')
}

export const input = (
  <value>
    
      <block>
        <anchor />wo<focus />rd
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        [[<anchor />wo<focus />]]rd
      </block>
    
  </value>
)
