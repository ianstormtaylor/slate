/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.toggleMark({
    type: 'bold',
    data: { thing: 'value' },
  })
}

export const input = (
  <value>
    
      <block>
        <b thing="value">
          <anchor />w<focus />
        </mark>
        ord
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <anchor />w<focus />ord
      </block>
    
  </value>
)
