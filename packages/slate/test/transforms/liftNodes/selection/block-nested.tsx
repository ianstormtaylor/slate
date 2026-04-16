/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.liftNodes(editor, { match: (n) => n.c })
}
export const input = (
  <editor>
    <block a>
      <block b>
        <block c>
          <cursor />
          one
        </block>
      </block>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block a>
      <block c>
        <cursor />
        one
      </block>
    </block>
  </editor>
)
