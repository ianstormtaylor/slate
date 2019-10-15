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
        wo<hashtag>
          <anchor />rd
        </hashtag>
        <text />
      </block>
      <block>
        <text />
        <hashtag>an</hashtag>
        <focus />other
      </block>
    
  </value>
)
