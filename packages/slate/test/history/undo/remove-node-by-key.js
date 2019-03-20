/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.removeNodeByKey('a')
  editor.flush().undo()
}

export const input = (
  <value>
    <document>
      <paragraph key="a">one</paragraph>
    </document>
  </value>
)

export const output = input

export const skip = true
