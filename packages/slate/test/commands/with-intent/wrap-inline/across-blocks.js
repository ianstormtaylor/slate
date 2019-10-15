/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.wrapInline('hashtag')
}

export const input = (
  <value>
    
      <block>
        wo<anchor />rd
      </block>
      <block>
        an<focus />other
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        wo<inline>
          <anchor />rd
        </inline>
        <text />
      </block>
      <block>
        <text />
        <inline>an</inline>
        <focus />other
      </block>
    
  </value>
)
