/** @jsx jsx */
import { jsx } from '../..'
import { cloneDeep } from 'lodash'

const fragment = (
  <block type="d">
    <block>A</block>
    <block type="c">
      <block type="d">
        <block>B</block>
        <block>
          <block type="d">
            <block>C</block>
          </block>
        </block>
      </block>
      <block type="d">
        <block>D</block>
      </block>
    </block>
  </block>
)
export const run = editor => {
  editor.insertFragment(fragment)
}
export const input = (
  <editor>
    <block type="d">
      <block>
        <text>
          <cursor />
        </text>
      </block>
    </block>
  </editor>
)
export const output = cloneDeep(input)
export const skip = true
