/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.unwrapInline('hashtag')
}

export const input = (
  <state>
    <document>
      <quote>
        <paragraph>
          w<anchor /><hashtag>or<focus /></hashtag>d
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
          w<anchor />or<focus />d
        </paragraph>
      </quote>
    </document>
  </state>
)
