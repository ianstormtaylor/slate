/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  const { value: { document } } = editor
  const point = document.createPoint({ path: [0, 0], offset: 2 })
  editor.splitNodeAtPoint(point, [0])
}

export const input = (
  <value>
    
      <block>
        <text>word</text>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>wo</block>
      <block>rd</block>
    
  </value>
)
