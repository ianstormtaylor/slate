/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.insertFragment(
    
      <block>
        <block>one</block>
        <block>two</block>
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
    
      <block>wo</block>
      <block>
        <block>one</block>
        <block>
          two<cursor />
        </block>
      </block>
      <block>rd</block>
    
  </value>
)
