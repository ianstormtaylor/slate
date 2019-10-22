/** @jsx h */

import h from '../../helpers/h'

export default function (editor) {
  editor.addMarks([{ key: 'a' }])
  editor.flush()
  editor.removeMark('bold')
  editor.flush()
  editor.undo()
}

export const input = (
  <value>
    <document>
      <block>
        one <anchor />two<focus /> three
      </block>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <block>
        one{' '}
        <mark key="a">
          <anchor />two
        </mark>
        <focus /> three
      </block>
    </document>
  </value>
)
