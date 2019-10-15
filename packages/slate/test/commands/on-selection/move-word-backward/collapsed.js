/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveWordBackward()
}

export const input = (
  <value>
    
      <block>
        one tw<cursor />o three
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        one <cursor />two three
      </block>
    
  </value>
)
