/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeMark('bold')
}

export const input = (
  <value>
    
      <block>
        w
        <b>
          <anchor />o
        </b>
        <focus />rd
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        w<anchor />o<focus />rd
      </block>
    
  </value>
)
