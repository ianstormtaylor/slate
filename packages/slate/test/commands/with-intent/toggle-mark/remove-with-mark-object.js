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
        <b thing="value">
          <anchor />w<focus />
        </b>
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
