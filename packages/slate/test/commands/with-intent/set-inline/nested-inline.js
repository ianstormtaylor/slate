/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.setInlines({ type: 'comment' })
}

export const input = (
  <value>

      <block>
        <hashtag>
          <inline>
            <cursor />word
          </inline>
        </hashtag>
      </block>

  </value>
)

export const output = (
  <value>

      <block>
        <hashtag>
          <comment>
            <cursor />word
          </comment>
        </hashtag>
      </block>

  </value>
)
