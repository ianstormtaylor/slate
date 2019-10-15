/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteBackward()
}

export const input = (
  <value>
    
      <block>
        a<cursor />
        <inline>two</inline>
        <text />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <text />
        <inline>
          <cursor />two
        </inline>
        <text />
      </block>
    
  </value>
)
