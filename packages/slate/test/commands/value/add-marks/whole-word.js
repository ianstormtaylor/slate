/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.addMarks(['bold', 'italic'])
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
        <i>
          <b>
            <anchor />word<focus />
          </b>
        </i>
      </block>
    
  </value>
)
