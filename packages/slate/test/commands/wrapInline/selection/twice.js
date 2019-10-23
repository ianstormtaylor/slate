/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.wrapInline('link')
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
        w
        <inline>
          <text />
          <inline>
            <anchor />or
          </inline>
          <text />
        </inline>
        <focus />d
      </block>
    
  </value>
)
