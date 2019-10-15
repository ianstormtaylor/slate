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
          hel<anchor />lo<focus />
        </inline>
        <text />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <text />
        <inline>hel</inline>
        <text />
        <inline>
          <text />
          <inline>
            <anchor />lo<focus />
          </inline>
          <text />
        </inline>
        <text />
      </block>
    
  </value>
)
