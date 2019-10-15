/** @jsx h */

import { h } from '../../../helpers'
import { Block } from 'slate'

export const run = editor => {
  editor.insertBlock(Block.create({ type: 'quote' }))
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
        <cursor />
      </block>
      <block>word</block>
    
  </value>
)
