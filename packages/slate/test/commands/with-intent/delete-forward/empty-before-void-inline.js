/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteForward()
}

export const input = (
  <value>
    
      <block>
        <text>
          <cursor />
        </text>
        <emoji />
        <text />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <text>
          <cursor />
        </text>
      </block>
    
  </value>
)
