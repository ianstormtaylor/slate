/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.insertFragment(
    editor,
    <block>
      <block>
        <block>
          <block>1</block>
          <block>2</block>
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
            <cursor />
          </block>
          <block>
            <text />
          </block>
        </block>
      </block>
    </block>
  </editor>
)
// TODO: paste "2" into second cell instead of creating new one?
export const output = (
  <editor>
    <block>
      <block>
        <block>
          <block>1</block>
          <block>
            2<cursor />
          </block>
          <block>
            <text />
          </block>
        </block>
      </block>
    </block>
  </editor>
)
export const skip = true
