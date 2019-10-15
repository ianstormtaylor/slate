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
          <anchor />three
        </block>
        <block>
          <focus />four
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
        <anchor />three
      </block>
      <block>
        <focus />four
      </block>
      <block>
        <block>five</block>
        <block>six</block>
      </block>
    
  </value>
)
