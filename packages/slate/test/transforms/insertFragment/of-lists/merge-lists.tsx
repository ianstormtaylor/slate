/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.insertFragment(
    editor,
    <block>
      <block>3</block>
      <block>4</block>
    </block>
  )
}
export const input = (
  <editor>
    <block>
      <block>1</block>
      <block>
        2<cursor />
      </block>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <block>1</block>
      <block>23</block>
      <block>
        4<cursor />
      </block>
    </block>
  </editor>
)
export const skip = true
