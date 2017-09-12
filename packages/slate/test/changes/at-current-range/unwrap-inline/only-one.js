/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.unwrapInline('hashtag')
}

export const input = (
  <state>
    <document>
      <paragraph>
        he<hashtag>ll</hashtag>o <anchor />w<hashtag>or<focus /></hashtag>d
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        he<hashtag>ll</hashtag>o <anchor />wo<focus />rd</paragraph>
    </document>
  </state>
)
