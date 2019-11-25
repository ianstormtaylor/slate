/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertFragment(
    editor,
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
