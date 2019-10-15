/** @jsx h */

import { h } from '../../../helpers'

import { Mark } from 'slate'

export const run = editor => {
  editor.addMarks([
    Mark.create({
      type: 'bold',
      data: { thing: 'value' },
    }),
    Mark.create({
      type: 'italic',
      data: { thing2: 'value2' },
    }),
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
