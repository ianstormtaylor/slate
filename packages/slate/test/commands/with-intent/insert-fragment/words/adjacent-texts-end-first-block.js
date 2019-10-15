/** @jsx h */

import h from '../../../../helpers/h'

export const run = editor => {
  editor.insertFragment(
    
      <block>
        <text>{'one '}</text>
        <text>two</text>
      </block>
    
  )
}

export const input = (
  <value>
    
      <block>
        {'word '}
        <cursor />
      </block>
      <block>another</block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        word one two<cursor />
      </block>
      <block>another</block>
    
  </value>
)
