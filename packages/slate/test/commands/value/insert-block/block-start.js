/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertBlock('quote')
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
        <cursor />
      </block>
      <block>word</block>
    
  </value>
)
