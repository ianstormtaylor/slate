/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertText('a')
}

export const input = (
  <value>
    <document>
      <paragraph>
        w<b>or</b>
        <cursor />d
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        w<b>ora</b>
        <cursor />d
      </paragraph>
    </document>
  </value>
)
