/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const key = '123'
  const quote = { kind: 'block', type: 'quote' }
  change.replaceNodeByKey(key, quote)
}

export const input = (
  <state>
    <document>
      <paragraph key="123">
        word
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote />
    </document>
  </state>
)
