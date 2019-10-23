/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.unwrapBlock('quote')
}

export const input = (
  <value>
    
      <block>
        <block>
          <anchor />one
        </block>
        <block>
          <focus />two
        </block>
        <block>three</block>
        <block>four</block>
        <block>five</block>
        <block>six</block>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <anchor />one
      </block>
      <block>
        <focus />two
      </block>
      <block>
        <block>three</block>
        <block>four</block>
        <block>five</block>
        <block>six</block>
      </block>
    
  </value>
)
