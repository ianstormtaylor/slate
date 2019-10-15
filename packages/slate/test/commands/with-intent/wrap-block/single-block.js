/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.wrapBlock('quote')
}

export const input = (
  <value>
    
      <block>
        <cursor />word
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <block>
          <cursor />word
        </block>
      </block>
    
  </value>
)
