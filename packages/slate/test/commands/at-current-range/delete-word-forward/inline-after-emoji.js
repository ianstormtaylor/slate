/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.deleteWordForward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          <cursor />
          word
        </link>
        📛
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
