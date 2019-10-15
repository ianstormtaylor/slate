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
        <hashtag>
          <text />
          <inline>
            <anchor />or
          </inline>
          <text />
        </hashtag>
        <focus />d
      </block>
    
  </value>
)
