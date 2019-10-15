/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.replaceMark('italic', 'bold')
}

export const input = (
  <value>
    
      <block>
        <anchor />
        <i>w</i>
        <focus />ord
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <anchor />
        <b>w</b>
        <focus />ord
      </block>
    
  </value>
)
