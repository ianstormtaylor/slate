/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteCharBackward()
}

export const input = (
  <value>
    
      <block>
        wor<cursor />d
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        wo<cursor />d
      </block>
    
  </value>
)
