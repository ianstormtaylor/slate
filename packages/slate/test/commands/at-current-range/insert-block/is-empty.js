/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertBlock('quote')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />
      </paragraph>
      <paragraph>not empty</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph />
      <quote>
        <cursor />
      </quote>
      <paragraph>not empty</paragraph>
    </document>
  </value>
)
