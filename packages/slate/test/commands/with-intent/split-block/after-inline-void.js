/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitBlock()
}

export const input = (
  <value>
    
      <block>
        one<emoji />
        <cursor />two
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        one<emoji />
      </block>
      <block>
        <cursor />two
      </block>
    
  </value>
)
