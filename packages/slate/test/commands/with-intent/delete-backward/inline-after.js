/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteBackward()
}

export const input = (
  <value>
    
      <block>
        one<inline>two</inline>a<cursor />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        one<inline>
          two<cursor />
        </inline>
      </block>
    
  </value>
)
