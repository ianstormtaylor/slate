/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.insertFragment(
    
      <block>
        <inline>fragment</inline>
      </block>
    
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
        <inline>
          fragment<cursor />
        </inline>
        <inline>rd</inline>
      </block>
    
  </value>
)
