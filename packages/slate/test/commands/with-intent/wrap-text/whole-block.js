/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.wrapText('[[', ']]')
}

export const input = (
  <value>
    
      <block>
        <anchor />word<focus />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        [[<anchor />word<focus />]]
      </block>
    
  </value>
)
