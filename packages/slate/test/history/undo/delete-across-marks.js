/** @jsx h */

import h from '../../helpers/h'

export default function (editor) {
  editor.delete()
  editor.flush()
  editor.undo()
}

export const input = (
  <value>
    <document>
      <block>
        <mark key="a">
          on<anchor />e
        </mark>
        <mark key="c">
          tw<focus />o
        </mark>
      </block>
    </document>
  </value>
)

export const output = input
