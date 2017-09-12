/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.setNodeByKey('a', {
    type: 'quote',
    data: { thing: false },
  })
}

export const input = (
  <state>
    <document>
      <paragraph key="a">
        word
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote thing={false}>
        word
      </quote>
    </document>
  </state>
)
