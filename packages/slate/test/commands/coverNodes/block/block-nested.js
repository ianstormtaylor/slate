/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.coverNodes(<block new />)
}

export const input = (
  <value>
    <block a>
      <block b>
        <cursor />word
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block a>
      <block new>
        <block b>
          <cursor />word
        </block>
      </block>
    </block>
  </value>
)
