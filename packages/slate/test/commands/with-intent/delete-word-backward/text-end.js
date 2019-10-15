/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteWordBackward()
}

export const input = (
  <value>
    
      <block>
        one two three<cursor />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        one two <cursor />
      </block>
    
  </value>
)
