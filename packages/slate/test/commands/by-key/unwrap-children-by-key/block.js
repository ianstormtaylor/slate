/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.unwrapChildrenByKey('a')
}

export const input = (
  <value>
    <document>
      <quote key="a">
        <paragraph>word</paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>word</paragraph>
    </document>
  </value>
)
