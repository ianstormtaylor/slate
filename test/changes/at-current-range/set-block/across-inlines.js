/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.setBlock({ type: 'code' })
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link><anchor />word</link>
      </paragraph>
      <paragraph>
        <link><focus />another</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <code>
        <link><anchor />word</link>
      </code>
      <code>
        <link><focus />another</link>
      </code>
    </document>
  </state>
)
