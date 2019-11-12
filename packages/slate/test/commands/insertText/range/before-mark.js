/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.insertText('a')
}

export const input = (
  <value>
    
      <block>
        w<cursor />
        <mark key="a">or</mark>d
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        wa<cursor />
        <mark key="a">or</mark>d
      </block>
    
  </value>
)
