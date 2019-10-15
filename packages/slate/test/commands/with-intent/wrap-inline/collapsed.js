/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.wrapInline('hashtag')
}

export const input = (
  <value>
    
      <block>
        w<cursor />d
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        w<inline>
          <text />
        </inline>
        <cursor />d
      </block>
    
  </value>
)
