/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertTextByKey('a', 4, 'x')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text key="a">word</text>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>wordx</paragraph>
    </document>
  </value>
)
