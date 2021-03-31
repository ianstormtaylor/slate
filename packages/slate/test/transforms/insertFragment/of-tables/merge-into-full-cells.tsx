/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.insertFragment(
    editor,
    <block>
      <block>
        <block>
          <block>New 1</block>
          <block>New 2</block>
        </block>
      </block>
    </block>
  )
}
export const input = (
  <editor>
    <block>
      <block>
        <block>
          <block>
            {'Existing 1 '}
            <cursor />
          </block>
          <block>Existing 2</block>
        </block>
      </block>
    </block>
  </editor>
)
// TODO: paste "Existing 2" before / after "New 2" in second cell?
export const output = (
  <editor>
    <block>
      <block>
        <block>
          <block>Existing 1 New 1</block>
          <block>
            New 2<cursor />
          </block>
          <block>Existing 2</block>
        </block>
      </block>
    </block>
  </editor>
)
export const skip = true
