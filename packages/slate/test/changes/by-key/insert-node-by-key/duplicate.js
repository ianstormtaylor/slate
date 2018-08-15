/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  const node = change.value.document.getBlocks().first()
  change.insertNodeByKey('a', 0, node)
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
      <paragraph>one</paragraph>
      <paragraph>
        <cursor />one
      </paragraph>
    </document>
  </value>
)

/*
 * Slate v0.37: We no longer support duplicate key check in either insertNode and replaceNode
*/

export const skip = true
