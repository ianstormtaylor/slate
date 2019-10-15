/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.wrapInline('hashtag')
}

export const input = (
  <value>
    
      <block>
        w<anchor />or<focus />d
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        w<inline>
          <anchor />or
        </inline>
        <focus />d
      </block>
    
  </value>
)
