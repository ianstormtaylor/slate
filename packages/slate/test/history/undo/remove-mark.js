/** @jsx h */

import h from '../../helpers/h'

export default function (editor) {
  editor.removeMark('bold')
  editor.flush()
  editor.undo()
}

export const input = (
  <value>
    <document>
      <block>
        <mark key="a">
          <anchor />one<focus />
        </mark>
      </block>
    </document>
  </value>
)

export const output = input
