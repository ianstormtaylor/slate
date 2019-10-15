/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.wrapBlock('quote')
}

export const input = (
  <value>
    
      <block>
        <block>
          <cursor />word
        </block>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <block>
          <block>
            <cursor />word
          </block>
        </block>
      </block>
    
  </value>
)
