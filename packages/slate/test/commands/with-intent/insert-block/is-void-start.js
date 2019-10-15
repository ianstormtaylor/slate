/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertBlock('quote')
}

export const input = (
  <value>
    
      <image>
        <cursor />text
      </image>
      <block>text</block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <cursor />
      </block>
      <image>text</image>
      <block>text</block>
    
  </value>
)
