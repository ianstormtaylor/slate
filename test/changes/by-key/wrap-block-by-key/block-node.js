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
      <paragraph>
        <code>some code</code>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <quote>
          <code>some code</code>
        </quote>
      </paragraph>
    </document>
  </state>
)
