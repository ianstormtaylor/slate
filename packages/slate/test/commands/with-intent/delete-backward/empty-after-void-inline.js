/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteBackward()
}

export const input = (
  <value>
    
      <block>
        <text />
        <emoji />
        <text>
          <cursor />
        </text>
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
