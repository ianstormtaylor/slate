/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.wrapInline('hashtag')
}

export const input = (
  <state>
    <document>
      <quote>
        <paragraph>
          w<anchor />or<focus />d
        </paragraph>
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>
        <paragraph>
          w<hashtag><anchor />or</hashtag><focus />d
        </paragraph>
      </quote>
    </document>
  </state>
)
