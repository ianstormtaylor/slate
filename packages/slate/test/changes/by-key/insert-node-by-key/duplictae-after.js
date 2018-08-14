/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  const node = change.value.document.getBlocks().first()
  change.insertNodeByKey('a', 1, node)
}

export const input = (
  <value>
    <document key="a">
      <paragraph>
        <cursor />one
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document key="a">
      <paragraph>
        <cursor />one
      </paragraph>
      <paragraph>one</paragraph>
    </document>
  </value>
)
