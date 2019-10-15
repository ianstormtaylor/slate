/** @jsx h */

import { h } from '../../../helpers'

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
    
      <block>woone</block>
      <block>
        <block>
          two<cursor />rd
        </block>
      </block>
    
  </value>
)
