/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.toggleMark('bold')
  editor.toggleMark('bold')
  editor.insertText('a')
}

export const input = (
  <value>
    
      <block>
        <cursor />word
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        a<cursor />word
      </block>
    
  </value>
)
