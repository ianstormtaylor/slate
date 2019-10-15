/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.unwrapInline('hashtag')
}

export const input = (
  <value>
    
      <block>
        <block>
          w<anchor />
          <hashtag>
            or<focus />
          </hashtag>d
        </block>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <block>
          w<anchor />or<focus />d
        </block>
      </block>
    
  </value>
)
