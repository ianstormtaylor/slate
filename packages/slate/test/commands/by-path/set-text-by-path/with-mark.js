/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.setTextByPath([0, 0], 'two', ['bold'])
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />one
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <b>two</b>
        <cursor />
      </paragraph>
    </document>
  </value>
)
