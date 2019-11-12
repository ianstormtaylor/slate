/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.insertFragment(
    
      <block>
        one
        <inline>two</inline>
        three
      </block>
    
  )
}

export const input = (
  <value>
    
      <block>
        wo<cursor />rd
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        woone<inline>two</inline>three<cursor />rd
      </block>
    
  </value>
)
