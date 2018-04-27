/** @jsx h */

import { List } from 'immutable'
import assert from 'assert'

import h from '../helpers/h'

import orderChildDecorations from '../../src/utils/order-child-decorations'

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
const [paragraphB, paragraphD] = document.nodes.toArray()
const [textC] = paragraphB.nodes.toArray()

describe('orderChildDecorations', () => {
  it('should return the child list when no decorations are given', () => {
    const actual = orderChildDecorations(document, List())

    const expected = [
      {
        child: paragraphB,
        index: 0,
      },
      {
        child: paragraphD,
        index: 1,
      },
    ]

    assert.deepEqual(actual, expected)
  })

  it('should wrap a block with the range it contains', () => {
    const decoration1 = {
      startKey: 'c',
      startOffset: 1,
      endKey: 'c',
      endOffset: 2,
      decoration: 'd1',
    }

    const actual = orderChildDecorations(document, List([decoration1]))

    const expected = [
      {
        decoration: decoration1,
        isRangeStart: true,
        order: 0.5,
      },

      {
        child: paragraphB,
        index: 0,
        order: 1,
      },
      {
        decoration: decoration1,
        isRangeEnd: true,
        order: 2.5,
      },
      {
        child: paragraphD,
        index: 1,
        order: 3,
      },
    ]

    assert.deepEqual(actual, expected)
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

    const actual = orderChildDecorations(
      document,
      List([decoration1, decoration2])
    )

    const expected = [
      {
        decoration: decoration1,
        isRangeStart: true,
        order: 0.5,
      },
      {
        decoration: decoration2,
        isRangeStart: true,
        order: 0.5,
      },
      {
        child: paragraphB,
        index: 0,
        order: 1,
      },
      {
        decoration: decoration1,
        isRangeEnd: true,
        order: 2.5,
      },
      {
        child: paragraphD,
        index: 1,
        order: 3,
      },
      {
        decoration: decoration2,
        isRangeEnd: true,
        order: 4.5,
      },
    ]

    assert.deepEqual(actual, expected)
  })

  it('should sort decorations outside the node', () => {
    const decoration1 = {
      startKey: 'c',
      startOffset: 1,
      endKey: 'e',
      endOffset: 2,
      decoration: 'd1',
    }

    const actual = orderChildDecorations(paragraphB, List([decoration1]))

    const expected = [
      {
        decoration: decoration1,
        isRangeStart: true,
        order: -0.5,
      },

      {
        child: textC,
        index: 0,
        order: 1,
      },
      {
        decoration: decoration1,
        isRangeEnd: true,
        order: 2.5,
      },
    ]

    assert.deepEqual(actual, expected)
  })
})
