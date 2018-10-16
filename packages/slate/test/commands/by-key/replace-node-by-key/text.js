/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.replaceNodeByKey('a', { object: 'text', leaves: [{ text: 'three' }] })
}

export const input = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <paragraph>
        <text key="a">one</text>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <paragraph>three</paragraph>
    </document>
  </value>
)
