/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.insertFragment(
    
      <block>
        <text>two</text>
      </block>
    
  )
}

export const input = (
  <value>
    
      <block>
        one<cursor />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        onetwo<cursor />
      </block>
    
  </value>
)
