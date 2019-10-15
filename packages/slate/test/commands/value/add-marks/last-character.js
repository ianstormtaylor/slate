/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.addMarks(['bold', 'italic'])
}

export const input = (
  <value>
    
      <block>
        wor<anchor />d<focus />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        wor
        <i>
          <b>
            <anchor />d<focus />
          </b>
        </i>
      </block>
    
  </value>
)
