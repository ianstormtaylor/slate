/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.replaceMark('italic', 'bold')
}

export const input = (
  <value>
    
      <block>
        w
        <i>
          <anchor />o
        </i>
        <focus />rd
      </block>
    
  </value>
)

export const output = (
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
