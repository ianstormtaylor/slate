/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeMark({
    type: 'bold',
    data: { thing: 'value' },
  })
}

export const input = (
  <value>
    
      <block>
        <b thing="value">
          <anchor />w<focus />
        </b>ord
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
