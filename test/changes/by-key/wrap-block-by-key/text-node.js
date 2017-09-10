/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  return state
    .change()
    .wrapBlockByKey('key', 'quote')
}

export const input = (
  <state>
    <document>
      <paragraph>some</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <quote>some</quote>
      </paragraph>
    </document>
  </state>
)
