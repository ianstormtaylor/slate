/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitBlock()
}

export const input = (
  <value>
    
      <block>
        <text />
        <inline>
          wo<anchor />rd
        </inline>
        <text />
      </block>
      <block>
        <text />
        <hashtag>
          an<focus />other
        </hashtag>
        <text />
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <text />
        <inline>wo</inline>
        <text />
        <hashtag>
          <text />
        </hashtag>
        <text />
      </block>
      <block>
        <text />
        <hashtag>
          <cursor />other
        </hashtag>
        <text />
      </block>
    
  </value>
)
