/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.toggleMark('bold')
}

export const input = (
  <value>
    
      <block>
        <mark key="a">
          <anchor />word<focus />
        </mark>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <anchor />word<focus />
      </block>
    
  </value>
)
