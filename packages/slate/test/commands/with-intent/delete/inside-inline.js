/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    
      <block>
        <inline>
          wo<anchor />r<focus />d
        </inline>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <inline>
          wo<cursor />d
        </inline>
      </block>
    
  </value>
)
