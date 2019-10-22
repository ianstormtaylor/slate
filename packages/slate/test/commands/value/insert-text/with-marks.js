/** @jsx h */

import { h } from '../../../helpers'
import { Mark } from 'slate'

export const run = editor => {
  const marks = Mark.createSet([{ type: 'bold' }])
  editor.insertText('a', marks)
}

export const input = (
  <value>
    
      <block>
        word<cursor />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        word<mark key="a">a</mark>
        <cursor />
      </block>
    
  </value>
)
