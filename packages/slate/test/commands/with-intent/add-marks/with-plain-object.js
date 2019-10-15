/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.addMarks([
    {
      type: 'bold',
      data: { thing: 'value' },
    },

    {
      type: 'italic',
      data: { thing2: 'value2' },
    },
  ])
}

export const input = (
  <value>
    
      <block>
        <anchor />w<focus />ord
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <i thing2="value2">
          <b thing="value">
            <anchor />w
          </b>
        </i>
        <focus />ord
      </block>
    
  </value>
)
