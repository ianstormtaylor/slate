/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertText('a')
  editor.insertText('b')
}

export const input = (
  <value>
    
      <block>
        <mark key="a">
          <anchor />lorem
        </mark>
        ipsum
      </block>
      <block>
        ipsum<focus />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        ab<cursor />
      </block>
    
  </value>
)
