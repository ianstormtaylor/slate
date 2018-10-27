/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.deleteWordBackward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>word</link>📛<cursor />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <link />
        <cursor />
      </paragraph>
    </document>
  </value>
)
