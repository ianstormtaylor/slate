/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.addMarks(['bold', 'underline'])
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
        <u>
          <b>
            <i>
              <anchor />wo
            </i>
          </b>
        </u>
        <i>
          <focus />rd
        </i>
      </block>
    
  </value>
)
