/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.replaceMark('italic', 'bold')
}

export const input = (
  <value>
    
      <block>
        wo
        <i>
          <anchor />rd
        </i>
      </block>
      <block>
        <i>an</i>
        <focus />other
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        wo
        <b>
          <anchor />rd
        </b>
      </block>
      <block>
        <b>an</b>
        <focus />other
      </block>
    
  </value>
)
