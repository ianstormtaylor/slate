/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.insertFragment(
    
      <block>
        <block>one</block>
        <block>two</block>
      </block>
      <block>after quote</block>
    
  )
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
        <block>one</block>
        <block>two</block>
      </block>
      <block>
        after quote<cursor />
      </block>
    
  </value>
)

export const skip = true
