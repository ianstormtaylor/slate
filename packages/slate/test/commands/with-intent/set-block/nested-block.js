/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.setBlocks({ type: 'code' })
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
        <code>
          <cursor />word
        </code>
      </block>
    
  </value>
)
