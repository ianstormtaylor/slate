/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveEndBackward(3)
}

export const input = (
  <value>
    
      <block>
        one <anchor />two t<focus />hree
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        one <anchor />tw<focus />o three
      </block>
    
  </value>
)
