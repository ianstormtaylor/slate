/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.addMark('bold')
}

export const input = (
  <value>
    
      <block>
        <anchor />w<focus />ord
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <b>
          <anchor />w
        </b>
        <focus />ord
      </block>
    
  </value>
)
