/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.deleteLineBackward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <emoji>😊</emoji>
        one
        <emoji>😊</emoji>
        two
        <emoji>😀</emoji>
        three
        <cursor />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <cursor />
      </paragraph>
    </document>
  </value>
)
