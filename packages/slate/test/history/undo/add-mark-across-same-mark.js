/** @jsx h */

import h from '../../helpers/h'

export default function (editor) {
  editor.addMarks([{ key: 'a' }])
  editor.flush()
  editor.undo()
}

export const input = (
  <value>
    <document>
      <block>
        <mark key="a">
          w<anchor />o
        </mark>r<focus />d
      </block>
    </document>
  </value>
)

export const output = input
