/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.wrapInline('hashtag')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>he<anchor />llo<focus /></link>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <link>he<hashtag><anchor />llo<focus /></hashtag></link>
      </paragraph>
    </document>
  </value>
)
