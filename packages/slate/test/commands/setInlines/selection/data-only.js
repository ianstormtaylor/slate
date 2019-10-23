/** @jsx h */

import { h } from '../../../helpers'
import { Data } from 'slate'

export const run = editor => {
  editor.setInlines({ data: Data.create({ thing: 'value' }) })
}

export const input = (
  <value>
    
      <block>
        <inline>
          <cursor />word
        </inline>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <link thing="value">
          <cursor />word
        </inline>
      </block>
    
  </value>
)
