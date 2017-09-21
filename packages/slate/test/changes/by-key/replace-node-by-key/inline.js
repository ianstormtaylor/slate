/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const quote = { kind: 'block', type: 'quote' }
  change.replaceNodeByKey('a', quote)
}

export const input = (
  <state>
    <document>
      <paragraph>
        one <link key="a">two</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        one <quote />
      </paragraph>
    </document>
  </state>
)
