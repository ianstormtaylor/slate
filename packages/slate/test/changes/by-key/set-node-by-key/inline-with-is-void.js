/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.setNodeByKey('a', {
    type: 'emoji',
    isVoid: true
  })
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link key="a"><cursor />word</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <cursor /><emoji />
      </paragraph>
    </document>
  </state>
)
