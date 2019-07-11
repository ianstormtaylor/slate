/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertText('a')
  editor.insertText('b')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <b>
          <anchor />lorem
        </b>
        ipsum
      </paragraph>
      <paragraph>
        ipsum<focus />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <b>
          ab<cursor />
        </b>
      </paragraph>
    </document>
  </value>
)
