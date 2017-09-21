/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.replaceNodeByKey('a', { kind: 'inline', type: 'emoji', isVoid: true })
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
        one <emoji />
      </paragraph>
    </document>
  </state>
)
