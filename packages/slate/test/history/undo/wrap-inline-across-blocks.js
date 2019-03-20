/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.wrapInline('hashtag')
  editor.flush().undo()
}

export const input = (
  <value>
    <document>
      <paragraph>
        wo<anchor />rd
      </paragraph>
      <paragraph>
        an<focus />other
      </paragraph>
    </document>
  </value>
)

export const output = input
