/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.unwrapBlock({
    type: 'quote',
    data: { thing: 'value' },
  })
}

export const input = (
  <value>
    
      <quote thing="value">
        <block>word</block>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>word</block>
    
  </value>
)
