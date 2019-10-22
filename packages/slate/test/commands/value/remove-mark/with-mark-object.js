/** @jsx h */

import { h } from '../../../helpers'
import { Mark } from 'slate'

export const run = editor => {
  editor.removeMark(
    Mark.create({
      type: 'bold',
      data: { thing: 'value' },
    })
  )
}

export const input = (
  <value>
    
      <block>
        <anchor />
        <b thing="value">w</mark>
        <focus />ord
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
