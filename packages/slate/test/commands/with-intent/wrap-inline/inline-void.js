/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.wrapInline('link')
}

export const input = (
  <value>
    
      <block>
        <emoji>
          <cursor />
        </emoji>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <inline>
          <emoji>
            <cursor />
          </emoji>
        </inline>
      </block>
    
  </value>
)
