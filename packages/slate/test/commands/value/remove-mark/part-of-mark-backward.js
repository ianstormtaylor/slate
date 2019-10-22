/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeMark('bold')
}

export const input = (
  <value>
    
      <block>
        <mark key="a">
          wor<focus />d<anchor />
        </mark>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <mark key="a">wor</mark>
        <focus />d<anchor />
      </block>
    
  </value>
)
