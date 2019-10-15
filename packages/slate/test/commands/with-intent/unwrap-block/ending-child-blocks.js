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
        <block>three</block>
        <block>four</block>
        <block>
          <anchor />five
        </block>
        <block>
          <focus />six
        </block>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <block>one</block>
        <block>two</block>
        <block>three</block>
        <block>four</block>
      </block>
      <block>
        <anchor />five
      </block>
      <block>
        <focus />six
      </block>
    
  </value>
)
