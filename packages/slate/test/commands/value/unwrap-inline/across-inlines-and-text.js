/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.unwrapInline('link')
}

export const input = (
  <value>
    
      <block>
        <inline>
          <anchor />one
        </inline>two<inline>
          three<focus />
        </inline>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <anchor />onetwothree<focus />
      </block>
    
  </value>
)
