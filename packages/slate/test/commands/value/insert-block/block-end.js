/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertBlock('quote')
}

export const input = (
  <value>
    
      <block>
        word<cursor />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>word</block>
      <block>
        <cursor />
      </block>
    
  </value>
)
