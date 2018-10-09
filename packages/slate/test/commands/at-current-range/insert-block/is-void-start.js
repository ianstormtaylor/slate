/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertBlock('quote')
}

export const input = (
  <value>
    <document>
      <image>
        <cursor />text
      </image>
      <paragraph>text</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <cursor />
      </quote>
      <image>text</image>
      <paragraph>text</paragraph>
    </document>
  </value>
)
