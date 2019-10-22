/** @jsx h */

import h from '../../helpers/h'

const fragment = (
  <document>
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
  </document>
)

export default function (editor) {
  editor.insertFragment(fragment)
  editor.flush()
  editor.undo()
}

export const input = (
  <value>
    <document>
      <block type="d">
        <block>
          <text>
            <cursor />
          </text>
        </block>
      </block>
    </document>
  </value>
)

export const output = input
