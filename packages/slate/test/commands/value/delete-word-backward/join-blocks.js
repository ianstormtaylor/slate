/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteWordBackward()
}

export const input = (
  <value>
    
      <block>word</block>
      <block>
        <cursor />another
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        word<cursor />another
      </block>
    
  </value>
)
