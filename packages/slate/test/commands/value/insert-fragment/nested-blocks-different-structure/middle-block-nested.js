/** @jsx h */

import h from '../../../../helpers/h'

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
        <block>
          wo<cursor />rd
        </block>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <block>woone</block>
        <block>
          two<cursor />rd
        </block>
      </block>
    
  </value>
)

export const skip = true
