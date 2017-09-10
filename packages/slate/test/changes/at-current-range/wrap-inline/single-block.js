/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.wrapInline('hashtag')
}

export const input = (
  <state>
    <document>
      <paragraph>
        w<anchor />or<focus />d
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        w<hashtag><anchor />or</hashtag><focus />d
      </paragraph>
    </document>
  </state>
)
