/** @jsx h */

import { h } from '../../../helpers'

import { Data } from 'slate'

export const run = editor => {
  editor.setBlocks({ data: Data.create({ thing: 'value' }) })
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
    
      <paragraph thing="value">
        <cursor />word
      </block>
    
  </value>
)
