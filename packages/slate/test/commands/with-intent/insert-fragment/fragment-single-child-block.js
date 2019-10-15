/** @jsx h */

import { h } from '../../../helpers'

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
          1<cursor />
        </block>
      </code>
    
  </value>
)

export const output = (
  <value>
    
      <code>
        <block>
          12<cursor />
        </block>
      </code>
    
  </value>
)
