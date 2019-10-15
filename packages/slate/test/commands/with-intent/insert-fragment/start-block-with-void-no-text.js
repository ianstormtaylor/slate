/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertFragment(
    
      <block>
        <text>one</text>
        <text>two</text>
      </block>
    
  )
}

export const input = (
  <value>
    
      <block>
        <emoji />
        <cursor />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <emoji />
        <text>
          onetwo<cursor />
        </text>
      </block>
    
  </value>
)
