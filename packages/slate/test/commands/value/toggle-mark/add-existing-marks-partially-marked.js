/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.toggleMark('bold')
}

export const input = (
  <value>
    
      <block>
        <b>
          <anchor />a
        </b>
        <i>
          wo<focus />rd
        </i>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <b>
          <anchor />a
        </b>
        <b>
          <i>wo</i>
        </b>
        <i>
          <focus />rd
        </i>
      </block>
    
  </value>
)
