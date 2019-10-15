/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertText('a')
}

export const input = (
  <value>
    
      <block>
        w<cursor />
        <b>or</b>d
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        wa<cursor />
        <b>or</b>d
      </block>
    
  </value>
)
