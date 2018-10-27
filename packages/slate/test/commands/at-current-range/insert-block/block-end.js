/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertBlock('quote')
}

export const input = (
  <value>
    <document>
      <paragraph>
        word<cursor />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>word</paragraph>
      <quote>
        <cursor />
      </quote>
    </document>
  </value>
)
