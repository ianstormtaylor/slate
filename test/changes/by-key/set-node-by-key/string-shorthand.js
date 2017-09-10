/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.setNodeByKey('a', 'quote')
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
      <quote>
        word
      </quote>
    </document>
  </state>
)
