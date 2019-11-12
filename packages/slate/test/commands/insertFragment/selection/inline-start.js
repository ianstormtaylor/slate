/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.insertFragment(
    
      <block>fragment</block>
    
  )
}

export const input = (
  <value>
    
      <block>
        <cursor />
        <inline>word</inline>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        fragment<cursor />
        <inline>word</inline>
      </block>
    
  </value>
)
