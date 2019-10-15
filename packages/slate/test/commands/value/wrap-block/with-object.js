/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.wrapBlock({
    type: 'quote',
    data: { thing: 'value' },
  })
}

export const input = (
  <value>
    
      <block>
        <cursor />word
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <quote thing="value">
        <block>
          <cursor />word
        </block>
      </block>
    
  </value>
)
