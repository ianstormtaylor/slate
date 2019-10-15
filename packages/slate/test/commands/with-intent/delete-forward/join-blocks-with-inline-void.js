/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteForward()
}

export const input = (
  <value>
    
      <block>
        word<cursor />
      </block>
      <block>
        <emoji />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        word<cursor />
        <emoji />
      </block>
    
  </value>
)
