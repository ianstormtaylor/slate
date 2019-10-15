/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteBackward()
}

export const input = (
  <value>
    
      <block>
        w<cursor />ord
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <cursor />ord
      </block>
    
  </value>
)
