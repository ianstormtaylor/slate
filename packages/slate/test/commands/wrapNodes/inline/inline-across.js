/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.wrapNodes(<inline a />)
}

export const input = (
  <value>
    <block>
      <text />
      <inline>
        wo
        <anchor />
        rd
      </inline>
      <text />
    </block>
    <block>
      <text />
      <inline>
        an
        <focus />
        other
      </inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline a>
        <text />
        <inline>
          wo
          <anchor />
          rd
        </inline>
        <text />
      </inline>
      <text />
    </block>
    <block>
      <text />
      <inline a>
        <text />
        <inline>
          an
          <focus />
          other
        </inline>
        <text />
      </inline>
      <text />
    </block>
  </value>
)
