/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveAnchorBackward()
}

export const input = (
  <value>
    
      <block>
        one <anchor />tw<focus />o three
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        one<anchor /> tw<focus />o three
      </block>
    
  </value>
)
