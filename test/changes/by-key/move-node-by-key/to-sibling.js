/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const first = document.getBlocks().first()
  const container = document.nodes.last()

  return state
    .change()
    .moveNodeByKey(first.key, container.key, 1)
}

export const input = (
  <state>
    <document>
      <paragraph>one</paragraph>
      <container>
        <paragraph>two</paragraph>
      </container>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <container>
        <paragraph>two</paragraph>
        <paragraph>one</paragraph>
      </container>
    </document>
  </state>
)
