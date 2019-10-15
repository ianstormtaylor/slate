/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.setInlines({
    type: 'hashtag',
    data: { thing: 'value' },
  })
}

export const input = (
  <value>
    
      <block>
        <inline>
          <cursor />word
        </inline>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <hashtag thing="value">
          <cursor />word
        </hashtag>
      </block>
    
  </value>
)
