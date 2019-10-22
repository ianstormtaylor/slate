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
          <mark key="a">
            he<anchor />ll<focus />o
          </mark>
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
        <inline>
          <mark key="a">he</mark>
        </inline>
        <text />
        <inline>
          <inline>
            <mark key="a">
              <anchor />ll
            </mark>
          </inline>
        </inline>
        <text />
        <inline>
          <mark key="a">
            <focus />o
          </mark>
        </inline>
        <text />
      </block>
    
  </value>
)
