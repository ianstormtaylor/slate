/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.replaceMark('italic', 'bold')
}

export const input = (
  <value>
    
      <block>
        <i>
          <anchor />wo<focus />rd
        </i>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <anchor />
        <b>wo</b>
        <i>
          <focus />rd
        </i>
      </block>
    
  </value>
)
