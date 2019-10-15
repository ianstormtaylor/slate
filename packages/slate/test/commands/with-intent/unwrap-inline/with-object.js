/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.unwrapInline({
    type: 'hashtag',
    data: { thing: 'value' },
  })
}

export const input = (
  <value>
    
      <block>
        w<hashtag thing="value">
          <inline>
            <cursor />or
          </inline>
        </inline>d
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        w<inline>
          <cursor />or
        </inline>d
      </block>
    
  </value>
)
