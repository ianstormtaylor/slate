/** @jsx h */

import h from '../../helpers/h'

const fragment = (
  <document>
    <block type="d">
      <paragraph>A</paragraph>
      <block type="c">
        <block type="d">
          <paragraph>B</paragraph>
          <paragraph>
            <block type="d">
              <paragraph>C</paragraph>
            </block>
          </paragraph>
        </block>
        <block type="d">
          <paragraph>D</paragraph>
        </block>
      </block>
    </block>
  </document>
)

export default function(editor) {
  editor
    .insertFragment(fragment)
    .flush()
    .undo()
}

export const input = (
  <value>
    <document>
      <block type="d">
        <paragraph>
          <text>
            <cursor />
          </text>
        </paragraph>
      </block>
    </document>
  </value>
)

export const output = input
