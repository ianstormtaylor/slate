/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.wrapNodes(editor, <inline a />)
}
export const input = (
  <editor>
    <block>
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
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
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
    </block>
  </editor>
)
