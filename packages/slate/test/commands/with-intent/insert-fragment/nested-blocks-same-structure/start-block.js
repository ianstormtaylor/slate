/** @jsx h */

import h from '../../../../helpers/h'

export const run = editor => {
  editor.insertFragment(
    
      <code>
        <block>2</block>
      </code>
    
  )
}

export const input = (
  <value>
    
      <code>
        <block>
          {'1 '}
          <cursor />
        </block>
      </code>
    
  </value>
)

export const output = (
  <value>
    
      <code>
        <block>
          1 2<cursor />
        </block>
      </code>
    
  </value>
)

export const skip = true
