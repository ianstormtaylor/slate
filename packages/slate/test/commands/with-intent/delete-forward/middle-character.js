/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteForward()
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
        w<cursor />rd
      </block>
    
  </value>
)
