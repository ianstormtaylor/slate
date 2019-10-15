/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.addMark('bold')
}

export const input = (
  <value>
    
      <block>
        wo<i>
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
          <i>
            <anchor />rd
          </i>
        </b>
      </block>
      <block>
        <b>
          <i>an</i>
        </b>
        <focus />other
      </block>
    
  </value>
)
