/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.addMark('bold')
}

export const input = (
  <value>
    
      <block>
        <i>
          wo<anchor />rd
        </i>
      </block>
      <block>
        <i>
          an<focus />other
        </i>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <i>wo</i>
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
        <i>
          <focus />other
        </i>
      </block>
    
  </value>
)
