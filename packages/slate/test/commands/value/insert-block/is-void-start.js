/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertBlock('quote')
}

export const input = (
  <value>
    
      <block void>
        <cursor />text
      </block>
      <block>text</block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <cursor />
      </block>
      <block void>text</block>
      <block>text</block>
    
  </value>
)
