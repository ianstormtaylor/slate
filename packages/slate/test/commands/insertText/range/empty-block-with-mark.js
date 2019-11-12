/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.insertText('Cat')
}

export const input = (
  <value>
    
      <block>
        <mark key="a">
          <cursor />
        </mark>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <mark key="a">
          Cat<cursor />
        </mark>
      </block>
    
  </value>
)
