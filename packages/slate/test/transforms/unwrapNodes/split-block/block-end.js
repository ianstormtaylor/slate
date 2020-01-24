/** @jsx jsx */

import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.unwrapNodes(editor, { match: n => n.a, split: true })
}

export const input = (
  <editor>
    <block a>
      <block>one</block>
      <block>two</block>
      <block>three</block>
      <block>four</block>
      <block>
        <anchor />
        five
      </block>
      <block>
        six
        <focus />
      </block>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block a>
      <block>one</block>
      <block>two</block>
      <block>three</block>
      <block>four</block>
    </block>
    <block>
      <anchor />
      five
    </block>
    <block>
      six
      <focus />
    </block>
  </editor>
)
