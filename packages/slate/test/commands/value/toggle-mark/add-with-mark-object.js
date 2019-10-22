/** @jsx h */

import { h } from '../../../helpers'
import { Mark } from 'slate'

export const run = editor => {
  editor.toggleMark(
    Mark.create({
      type: 'bold',
      data: { thing: 'value' },
    })
  )
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
        <b thing="value">
          <anchor />w
        </mark>
        <focus />ord
      </block>
    
  </value>
)
