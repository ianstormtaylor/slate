/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeMark('bold')
}

export const input = (
  <value>
    
      <block>
        <anchor />
        <b>w</b>
        <focus />ord
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <anchor />w<focus />ord
      </block>
    
  </value>
)
