/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.wrapInline('hashtag')
}

export const input = (
  <value>
    
      <block>
        <anchor />word<focus />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <inline>
          <anchor />word<focus />
        </inline>
      </block>
    
  </value>
)
