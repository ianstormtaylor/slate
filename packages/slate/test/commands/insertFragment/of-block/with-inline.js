/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.insertFragment(
    <fragment>
      <block>
        one<inline>two</inline>three
      </block>
      <block>
        four<inline>five</inline>six
      </block>
      <block>
        seven<inline>eight</inline>nine
      </block>
    </fragment>
  )
}

export const input = (
  <value>
    <block>
      wo
      <cursor />
      rd
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      woone<inline>two</inline>three
    </block>
    <block>
      four<inline>five</inline>six
    </block>
    <block>
      seven<inline>eight</inline>nine
      <cursor />
      rd
    </block>
  </value>
)
