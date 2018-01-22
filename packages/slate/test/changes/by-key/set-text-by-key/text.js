/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.setTextByKey('1', 'wor')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text key="1">word</text>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <text key="1">wor</text>
      </paragraph>
    </document>
  </value>
)
