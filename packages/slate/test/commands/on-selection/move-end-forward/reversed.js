/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.moveEndForward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one <focus />two t<anchor />hree
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one <focus />two th<anchor />ree
      </paragraph>
    </document>
  </value>
)
