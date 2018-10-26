/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.wrapText('[[', ']]')
}

export const input = (
  <value>
    <document>
      <paragraph>
        w<focus />or<anchor />d
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        w[[<focus />or<anchor />]]d
      </paragraph>
    </document>
  </value>
)
