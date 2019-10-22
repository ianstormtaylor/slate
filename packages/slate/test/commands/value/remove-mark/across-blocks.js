/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeMark('bold')
}

export const input = (
  <value>
    
      <block>
        wo<anchor />
        <mark key="a">rd</mark>
      </block>
      <block>
        <mark key="a">an</mark>
        <focus />other
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        wo<anchor />rd
      </block>
      <block>
        an<focus />other
      </block>
    
  </value>
)
