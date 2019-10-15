/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.addMarks(['bold', 'italic'])
  editor.insertText('a')
}

export const input = (
  <value>
    
      <block>
        wo<cursor />rd
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        wo<i>
          <b>a</b>
        </i>
        <cursor />rd
      </block>
    
  </value>
)
