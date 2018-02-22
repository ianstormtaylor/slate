/** @jsx h */

import h from '../../helpers/h'
import assert from 'assert'

export function runTest() {
  const { document } = (
    <value>
      <document>
        <paragraph>Some Text</paragraph>
      </document>
    </value>
  )
  const pNode = document.nodes.first()
  const textNode = pNode.getFirstText()

  assert.equal(document.getFurthestOnlyChildAncestor(pNode.key), null)
  assert.equal(pNode.getFurthestOnlyChildAncestor(textNode.key), null)
  assert.equal(document.getFurthestOnlyChildAncestor(textNode.key), pNode)
}
