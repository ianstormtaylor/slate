/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertBlock('quote')
}

export const input = (
  <value>
    
      <image>
        text<cursor />
      </image>
      <block>text</block>
    
  </value>
)

export const output = (
  <value>
    
      <image>text</image>
      <block>
        <cursor />
      </block>
      <block>text</block>
    
  </value>
)
