/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteCharBackward()
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
        wor<cursor />
      </block>
    
  </value>
)
