/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertFragment(
    
      <block>fragment</block>
    
  )
}

export const input = (
  <value>
    
      <block>
        <inline>
          wo<cursor />rd
        </inline>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <inline>wo</inline>
        fragment<cursor />
        <inline>rd</inline>
      </block>
    
  </value>
)
