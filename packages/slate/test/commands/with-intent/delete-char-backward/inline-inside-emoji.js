/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteCharBackward()
}

export const input = (
  <value>
    
      <block>
        <inline>
          wor📛<cursor />d
        </inline>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <inline>
          wor<cursor />d
        </inline>
      </block>
    
  </value>
)
