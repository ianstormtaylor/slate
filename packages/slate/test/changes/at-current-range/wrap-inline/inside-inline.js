/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.wrapInline('hashtag')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>w<anchor />or<focus />d</link>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <link>w<hashtag><anchor />or<focus /></hashtag>d</link>
      </paragraph>
    </document>
  </value>
)
