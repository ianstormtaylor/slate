/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor, options = {}) => {
  Transforms.insertFragment(
    editor,
    <fragment>
      <inline>one</inline>
      <inline>two</inline>
      <inline>three</inline>
    </fragment>,
    options
  )
}
export const input = (
  <editor>
    <block>
      <text />
      <inline>
        wo
        <cursor />
        rd
      </inline>
      <text />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text />
      <inline>wo</inline>
      <text />
      <inline>one</inline>
      <text />
      <inline>two</inline>
      <text />
      <inline>
        three
        <cursor />
      </inline>
      <text />
      <inline>rd</inline>
      <text />
    </block>
  </editor>
)
