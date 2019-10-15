/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.addMark('italic')
  editor.splitBlock()
  editor.insertText('cat is cute')
}

export const input = (
  <value>
    
      <block>
        <b>word</b>
        <cursor />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <b>word</b>
        <cursor />
      </block>
      <block>
        <i>
          <b>cat is cute</b>
        </i>
        <cursor />
      </block>
    
  </value>
)
