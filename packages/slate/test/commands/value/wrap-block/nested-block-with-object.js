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
        <block>
          <cursor />word
        </block>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <quote thing="value">
          <block>
            <cursor />word
          </block>
        </block>
      </block>
    
  </value>
)
