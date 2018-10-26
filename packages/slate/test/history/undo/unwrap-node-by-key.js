/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.unwrapNodeByKey('a')
  editor.flush().undo()
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph key="a">
          <cursor />one
        </paragraph>
        <paragraph>two</paragraph>
        <paragraph>three</paragraph>
      </quote>
    </document>
  </value>
)

export const output = input
