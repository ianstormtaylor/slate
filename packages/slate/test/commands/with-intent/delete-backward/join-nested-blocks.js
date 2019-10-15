/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteBackward()
}

export const input = (
  <value>
    
      <block>
        <block>word</block>
        <block>
          <cursor />another
        </block>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <block>
          word<cursor />another
        </block>
      </block>
    
  </value>
)
