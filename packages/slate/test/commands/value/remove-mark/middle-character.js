/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeMark('bold')
}

export const input = (
  <value>
    
      <block>
        w
        <mark key="a">
          <anchor />o
        </mark>
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
