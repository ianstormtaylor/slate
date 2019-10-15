/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteWordForward()
}

export const input = (
  <value>
    
      <block>
        o<cursor />ne two three
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        o<cursor /> two three
      </block>
    
  </value>
)
