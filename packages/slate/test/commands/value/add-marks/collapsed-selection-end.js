/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.addMarks(['bold', 'italic'])
  editor.insertText('a')
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
        word
        <i>
          <b>
            a<cursor />
          </b>
        </i>
      </block>
    
  </value>
)
