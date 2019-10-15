/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.unwrapInline('hashtag')
}

export const input = (
  <value>
    
      <block>
        w<anchor />
        <hashtag>
          or<focus />
        </hashtag>d
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        w<anchor />or<focus />d
      </block>
    
  </value>
)
