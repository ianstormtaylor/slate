/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeMark('bold')
}

export const input = (
  <value>
    
      <block>
        <anchor />
        <b>
          <i>wo</i>
        </b>
        <i>
          <focus />rd
        </i>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <i>
          <anchor />wo<focus />rd
        </i>
      </block>
    
  </value>
)
