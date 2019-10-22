/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeMark('bold')
}

export const input = (
  <value>
    
      <block>
        <mark key="a">
          wor<anchor />d<focus />
        </mark>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <mark key="a">wor</mark>
        <anchor />d<focus />
      </block>
    
  </value>
)
