/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.wrapInline('hashtag')
}

export const input = (
  <state>
    <document>
      <paragraph>
        <anchor />word<focus />
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <hashtag><anchor />word</hashtag><focus />
      </paragraph>
    </document>
  </state>
)
