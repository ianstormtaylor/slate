/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.wrapBlockByKey('a', 'quote')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text key="a">word</text>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <quote>word</quote>
      </paragraph>
    </document>
  </value>
)
