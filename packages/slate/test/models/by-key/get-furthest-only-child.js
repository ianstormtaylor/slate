/** @jsx h */

import h from '../../helpers/h'

const { document } = (
  <value>
    <document>
      <paragraph>Some Text</paragraph>
    </document>
  </value>
)
const pNode = document.nodes.first()
const textNode = pNode.getFirstText()

export const actual = [
  document.getFurthestOnlyChildAncestor(pNode.key),
  pNode.getFurthestOnlyChildAncestor(textNode.key),
  document.getFurthestOnlyChildAncestor(textNode.key),
]
export const expected = [null, null, pNode]
