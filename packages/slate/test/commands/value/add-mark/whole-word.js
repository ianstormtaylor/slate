/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.addMark('bold')
}

export const input = (
  <value>
    
      <block>
        <anchor />word<focus />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <b>
          <anchor />word<focus />
        </b>
      </block>
    
  </value>
)
