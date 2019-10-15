/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.replaceMark('italic', 'bold')
}

export const input = (
  <value>
    
      <block>
        <i>
          <anchor />word<focus />
        </i>
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
