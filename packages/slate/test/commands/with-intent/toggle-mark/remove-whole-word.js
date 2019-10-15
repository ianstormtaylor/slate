/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.toggleMark('bold')
}

export const input = (
  <value>
    
      <block>
        <b>
          <anchor />word<focus />
        </b>
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
