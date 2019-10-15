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
          <hashtag>
            <cursor />or
          </hashtag>
        </hashtag>d
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        w<hashtag>
          <cursor />or
        </hashtag>d
      </block>
    
  </value>
)
