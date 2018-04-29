/** @jsx h */

import { List } from 'immutable'
import assert from 'assert'

import h from '../helpers/h'

import getChildrenDecorations from '../../src/utils/get-children-decorations'

const value = (
  <value>
    <document key="a">
      <paragraph key="b">
        <text key="c">First line</text>
      </paragraph>
      <paragraph key="d">
        <text key="e">Second line</text>
      </paragraph>
    </document>
  </value>
)

const { document } = value
const [paragraphB] = document.nodes.toArray()

describe('getChildrenDecorations', () => {
  it('should return the child list when no decorations are given', () => {
    const actual = getChildrenDecorations(document, List())

    const expected = [[], []]

    assert.deepEqual(actual.map(l => l.toArray()), expected)
  })

  it('should wrap a block with the range it contains', () => {
    const decoration1 = {
      startKey: 'c',
      startOffset: 1,
      endKey: 'c',
      endOffset: 2,
      decoration: 'd1',
    }

    const actual = getChildrenDecorations(document, List([decoration1]))

    const expected = [[decoration1], []]

    assert.deepEqual(actual.map(l => l.toArray()), expected)
  })

  it('should sort two decorations inside a node', () => {
    const decoration1 = {
      startKey: 'c',
      startOffset: 1,
      endKey: 'c',
      endOffset: 2,
      decoration: 'd1',
    }

    const decoration2 = {
      startKey: 'c',
      startOffset: 1,
      endKey: 'e',
      endOffset: 2,
      decoration: 'd2',
    }

    const actual = getChildrenDecorations(
      document,
      List([decoration1, decoration2])
    )

    const expected = [[decoration1, decoration2], [decoration2]]

    assert.deepEqual(actual.map(l => l.toArray()), expected)
  })

  it('should sort decorations outside the node', () => {
    const decoration1 = {
      startKey: 'c',
      startOffset: 1,
      endKey: 'e',
      endOffset: 2,
      decoration: 'd1',
    }

    const actual = getChildrenDecorations(paragraphB, List([decoration1]))

    const expected = [[decoration1]]

    assert.deepEqual(actual.map(l => l.toArray()), expected)
  })
})
