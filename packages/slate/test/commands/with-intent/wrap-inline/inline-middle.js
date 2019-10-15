/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.wrapInline('hashtag')
}

export const input = (
  <value>
    
      <block>
        <text />
        <inline>
          he<anchor />ll<focus />o
        </inline>
        <text />
      </block>
    
  </value>
)

// TODO: this selection logic isn't right
export const output = (
  <value>
    
      <block>
        <text />
        <inline>he</inline>
        <text />
        <hashtag>
          <inline>
            <anchor />ll
          </inline>
        </hashtag>
        <text />
        <inline>
          <focus />o
        </inline>
        <text />
      </block>
    
  </value>
)
