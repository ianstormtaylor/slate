/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.deleteWordBackward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one two three<cursor />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one two <cursor />
      </paragraph>
    </document>
  </value>
)
