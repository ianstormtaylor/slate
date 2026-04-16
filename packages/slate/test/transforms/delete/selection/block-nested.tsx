/** @jsx jsx */
import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.delete(editor)
}
export const input = (
  <editor>
    <block>
      <block>
        <anchor />
        one
      </block>
      <block>
        <block>two</block>
        <block>
          <block>
            three
            <focus />
          </block>
        </block>
      </block>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <block>
        <cursor />
      </block>
    </block>
  </editor>
)
