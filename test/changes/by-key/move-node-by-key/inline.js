/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const block = document.getBlocks().first()
  const first = document.getInlines().first()

  return state
    .change()
    .moveNodeByKey(first.key, block.key, 3)
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link>one</link>
        <link>two</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link>two</link>
        <link>one</link>
      </paragraph>
    </document>
  </state>
)
