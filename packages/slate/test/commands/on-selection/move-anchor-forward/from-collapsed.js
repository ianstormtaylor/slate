/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.moveAnchorForward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one two t<cursor />hree
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one two t<focus />h<anchor />ree
      </paragraph>
    </document>
  </value>
)
