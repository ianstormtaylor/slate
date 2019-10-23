/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.unwrapBlock('quote')
}

export const input = (
  <value>
    
      <block>
        <block>one</block>
        <block>two</block>
        <block>
          <focus />three
        </block>
        <block>
          <anchor />four
        </block>
        <block>five</block>
        <block>six</block>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <block>one</block>
        <block>two</block>
      </block>
      <block>
        <focus />three
      </block>
      <block>
        <anchor />four
      </block>
      <block>
        <block>five</block>
        <block>six</block>
      </block>
    
  </value>
)
