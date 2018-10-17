/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.wrapBlockByKey('a', 'quote')
}

export const input = (
  <value>
    <document>
      <paragraph key="a">word</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>word</paragraph>
      </quote>
    </document>
  </value>
)
