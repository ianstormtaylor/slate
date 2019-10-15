/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.toggleMark('bold')
}

export const input = (
  <value>
    
      <block>
        wo<anchor />rd
      </block>
      <block>
        an<focus />other
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
