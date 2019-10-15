/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.addMark('bold')
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
        <b>
          <i>
            <anchor />wo
          </i>
        </b>
        <i>
          <focus />rd
        </i>
      </block>
    
  </value>
)
