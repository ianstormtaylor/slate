/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.wrapNodes(editor, <inline a />)
}
export const input = (
  <editor>
    <block>
      <text />
      <inline>
        <cursor />
        word
      </inline>
      <text />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text />
      <inline>
        <text />
        <inline a>
          <cursor />
          word
        </inline>
        <text />
      </inline>
      <text />
    </block>
  </editor>
)
