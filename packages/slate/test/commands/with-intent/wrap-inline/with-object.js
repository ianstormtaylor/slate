/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.wrapInline({
    type: 'hashtag',
    data: { thing: 'value' },
  })
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
        w<hashtag thing="value">
          <anchor />or
        </inline>
        <focus />d
      </block>
    
  </value>
)
