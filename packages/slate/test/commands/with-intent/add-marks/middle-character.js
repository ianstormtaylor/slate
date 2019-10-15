/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.addMarks(['bold', 'italic'])
}

export const input = (
  <value>
    
      <block>
        w<anchor />o<focus />rd
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        w
        <i>
          <b>
            <anchor />o
          </b>
        </i>
        <focus />rd
      </block>
    
  </value>
)
