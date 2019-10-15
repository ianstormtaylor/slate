/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.addMarks(['bold', 'italic'])
}

export const input = (
  <value>
    
      <block>
        wo<anchor />rd
      </block>
      <block>
        an<focus />other
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        wo
        <i>
          <b>
            <anchor />rd
          </b>
        </i>
      </block>
      <block>
        <i>
          <b>an</b>
        </i>
        <focus />other
      </block>
    
  </value>
)
