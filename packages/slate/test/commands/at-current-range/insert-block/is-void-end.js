/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertBlock('quote')
}

export const input = (
  <value>
    <document>
      <image>
        text<cursor />
      </image>
      <paragraph>text</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <image>text</image>
      <quote>
        <cursor />
      </quote>
      <paragraph>text</paragraph>
    </document>
  </value>
)
