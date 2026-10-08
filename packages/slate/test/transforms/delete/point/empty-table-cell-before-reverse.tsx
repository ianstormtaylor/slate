/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor, { reverse: true })
}
export const input = (
  <editor>
    <block table>
      <block row>
        <block cell>a</block>
        <block cell>
          <text />
        </block>
      </block>
    </block>
    <block paragraph>
      <cursor />
      after
    </block>
  </editor>
)
export const output = (
  <editor>
    <block table>
      <block row>
        <block cell>a</block>
        <block cell>
          <cursor />
          after
        </block>
      </block>
    </block>
  </editor>
)
