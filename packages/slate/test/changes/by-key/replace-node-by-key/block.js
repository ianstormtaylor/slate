/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.replaceNodeByKey('a', { object: 'block', type: 'quote' })
}

export const input = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <paragraph key="a">
        two<cursor />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <quote>
        <cursor />
      </quote>
    </document>
  </value>
)
