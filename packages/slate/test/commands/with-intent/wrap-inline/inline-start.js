/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.wrapInline('hashtag')
}

export const input = (
  <value>
    
      <block>
        <text />
        <inline>
          <anchor />hel<focus />lo
        </inline>
        <text />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <text />
        <hashtag>
          <text />
          <inline>
            <anchor />hel
          </inline>
          <text />
        </hashtag>
        <text />
        <inline>
          <focus />lo
        </inline>
        <text />
      </block>
    
  </value>
)
