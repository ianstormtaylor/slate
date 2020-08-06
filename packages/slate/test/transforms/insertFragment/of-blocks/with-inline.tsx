/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.insertFragment(
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
  <editor>
    <block>
      wo
      <cursor />
      rd
    </block>
  </editor>
)
export const output = (
  <editor>
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
  </editor>
)
