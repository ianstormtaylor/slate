/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const block = document.nodes.get(0)

  return state
    .change()
    .unwrapBlockByKey(block.key, 'quote')
}

export const input = (
  <state>
    <document>
      <quote>
        <paragraph>word</paragraph>
      </quote>
      <quote>
        <paragraph>word</paragraph>
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>word</paragraph>
      <quote>
        <paragraph>word</paragraph>
      </quote>
    </document>
  </state>
)
