/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertText('Cat')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <b>
          <cursor />
        </b>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <b>
          Cat<cursor />
        </b>
      </paragraph>
    </document>
  </value>
)
