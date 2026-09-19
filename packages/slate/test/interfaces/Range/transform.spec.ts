import assert from 'assert/strict'
import {
  Editor,
  Element,
  InsertTextOperation,
  MoveNodeOperation,
  Node,
  Operation,
  Path,
  Point,
  Range,
  RangeTransformOptions,
  SplitNodeOperation,
  Text,
  TextDirection,
} from 'slate'
import { createTree } from '../../test-utils/transforms'

const affinities: RangeTransformOptions['affinity'][] = [
  undefined,
  'forward',
  'backward',
  'inward',
  'outward',
  null,
]

const getExpectedPointAffinities = (
  range: Range,
  affinity: RangeTransformOptions['affinity']
) => {
  let anchor: TextDirection | null | undefined
  let focus: TextDirection | null | undefined

  if (affinity === 'inward' || affinity === undefined) {
    if (Range.isCollapsed(range)) {
      anchor = 'forward'
      focus = 'forward'
    } else if (Range.isForward(range)) {
      anchor = 'forward'
      focus = 'backward'
    } else {
      anchor = 'backward'
      focus = 'forward'
    }
  } else if (affinity === 'outward') {
    if (Range.isForward(range)) {
      anchor = 'backward'
      focus = 'forward'
    } else {
      anchor = 'forward'
      focus = 'backward'
    }
  } else {
    anchor = affinity
    focus = affinity
  }

  return { anchor, focus }
}

function isEdgeOnSplitPoint(range: Range, op: Operation) {
  let splitPoint: Point | undefined = undefined
  if (op.type === 'insert_text') {
    splitPoint = { path: op.path, offset: op.offset }
  } else if (op.type === 'split_node') {
    splitPoint = { path: op.path, offset: op.position }
  } else {
    return false
  }
  return (
    Point.equals(range.anchor, splitPoint) ||
    Point.equals(range.focus, splitPoint)
  )
}

describe('.transform', () => {
  const rootWithElementOperand = createTree('element')
  const rootWithTextOperand = createTree('text')

  const [[elementOperandNode, elementOperandPath]] = Editor.nodes<Element>(
    rootWithElementOperand,
    {
      at: [],
      match: n => n.id === 'operand',
    }
  )

  const [[textOperandNode, textOperandPath]] = Editor.nodes<Text>(
    rootWithTextOperand,
    {
      at: [],
      match: n => n.id === 'operand',
    }
  )

  interface TestOps<T extends Operation = Operation> {
    elementOps?: T[]
    textOps?: T[]
  }

  const forEachCase = <T extends Operation>(
    { elementOps = [], textOps = [] }: TestOps<T>,
    callback: (args: {
      op: T
      range: Range
      anchorNode: Text
      focusNode: Text
      root: Editor
      createDuplicateTree: () => Editor
    }) => void
  ) => {
    for (const { ops, root, createDuplicateTree } of [
      {
        ops: elementOps,
        root: rootWithElementOperand,
        createDuplicateTree: () => createTree('element'),
      },
      {
        ops: textOps,
        root: rootWithTextOperand,
        createDuplicateTree: () => createTree('text'),
      },
    ]) {
      for (const op of ops) {
        for (const anchor of Editor.positions(root, {
          at: [],
        })) {
          for (const focus of Editor.positions(root, {
            at: [],
          })) {
            const range = { anchor, focus }
            const anchorNode = Node.get(root, anchor.path) as Text
            const focusNode = Node.get(root, focus.path) as Text
            try {
              callback({
                op,
                range,
                anchorNode,
                focusNode,
                root,
                createDuplicateTree,
              })
            } catch (e) {
              if (!(e instanceof Error)) throw e
              const { node: _, ...slimmedOp } = op as T & { node?: unknown }
              throw new Error(
                `${e.message}\n([${anchorNode.id}]@${anchor.offset}->[${
                  focusNode.id
                }]@${focus.offset}) => ${JSON.stringify(slimmedOp)}`,
                { cause: e }
              )
            }
          }
        }
      }
    }
  }

  const testItNeverMutatesInputs = (ops: TestOps) => {
    return it('never mutates inputs', () => {
      forEachCase(ops, ({ op, range }) => {
        const opCopy = structuredClone(op)
        const rangeCopy = structuredClone(range)
        Range.transform(range, op)
        assert.deepEqual(range, rangeCopy)
        assert.deepEqual(op, opCopy)
      })
    })
  }

  const testItAlwaysReUsesRefsWhenPossible = (ops: TestOps) => {
    return it('always re-uses refs when possible', () => {
      function assertEqualOrDeeplyDifferent<T>(a: T, b: T, message: string) {
        if (a === b) return
        assert.notDeepEqual(a, b, message)
      }

      forEachCase(ops, ({ op, range }) => {
        const affinitiesToTest = isEdgeOnSplitPoint(range, op)
          ? affinities
          : [undefined]
        for (const affinity of affinitiesToTest) {
          const result = Range.transform(range, op, { affinity })
          if (!result) continue
          try {
            // matching the input ref if possible is top priority, even if points within the input have duplicate refs.
            if (result === range) continue
            assert.notDeepEqual(result, range, `result`)
            // matching point refs for collapsed ranges is more important than the output focus matching the input focus.
            if (result.focus === result.anchor) {
              const resultPoint = result.anchor
              if (
                !(resultPoint === range.anchor || resultPoint === range.focus)
              ) {
                // make sure we couldnt have resused an input point ref for the collapse
                assert.notDeepEqual(resultPoint, range.anchor, `anchor`)
                assert.notDeepEqual(resultPoint, range.focus, `focus`)
              }
              continue
            }
            assert.notDeepEqual(result.focus, result.anchor, `edges`)

            assertEqualOrDeeplyDifferent(result.anchor, range.anchor, `anchor`)
            assertEqualOrDeeplyDifferent(
              result.anchor.path,
              range.anchor.path,
              `anchor path`
            )

            assertEqualOrDeeplyDifferent(result.focus, range.focus, `focus`)
            assertEqualOrDeeplyDifferent(
              result.focus.path,
              range.focus.path,
              `focus path`
            )
          } catch (e) {
            if (!(e instanceof Error)) throw e
            throw new Error(
              `identical ${e.message} with different ref for ${affinity} affinity`,
              { cause: e }
            )
          }
        }
      })
    })
  }

  const testItNeverReturnsNull = (ops: TestOps) => {
    return it('never returns null', () => {
      forEachCase(ops, ({ op, range }) => {
        assert.notEqual(Range.transform(range, op), null)
      })
    })
  }

  const testItIsNotAffectedByAffinity = (ops: TestOps) => {
    return it('is not affected by affinity', () => {
      forEachCase(ops, ({ op, range }) => {
        const baseline = Range.transform(range, op)
        for (const affinity of affinities) {
          assert.deepEqual(
            Range.transform(range, op, { affinity }),
            baseline,
            `${affinity} affinity`
          )
        }
      })
    })
  }

  const testItMatchesPointTransformOnEdges = (ops: TestOps) => {
    return it('matches Point.transform on edges', () => {
      forEachCase(ops, ({ op, range }) => {
        const affinitiesToTest = isEdgeOnSplitPoint(range, op)
          ? affinities
          : [undefined]
        for (const affinity of affinitiesToTest) {
          const newRange = Range.transform(range, op, { affinity })

          const pointAffinities = getExpectedPointAffinities(range, affinity)
          const newAnchor = Point.transform(range.anchor, op, {
            affinity: pointAffinities.anchor,
          })
          const newFocus = Point.transform(range.focus, op, {
            affinity: pointAffinities.focus,
          })

          if (newRange === null) {
            assert(
              newAnchor === null || newFocus === null,
              `expected edge to be null if range is null, but got newAnchor=${newAnchor} and newFocus=${newFocus}`
            )
          } else {
            assert.deepEqual(newRange.anchor, newAnchor)
            assert.deepEqual(newRange.focus, newFocus)
          }
        }
      })
    })
  }

  describe('called with insert_node, remove_node, move_node, and remove_text', () => {
    const ops: TestOps = {
      elementOps: [
        {
          type: 'insert_node',
          path: elementOperandPath,
          node: { id: 'inserted', text: '' },
        },
        {
          type: 'remove_node',
          path: elementOperandPath,
          node: elementOperandNode,
        },
        ...Array.from(Node.nodes(rootWithElementOperand))
          .map(
            ([, newPath]): MoveNodeOperation => ({
              type: 'move_node',
              path: elementOperandPath,
              newPath,
            })
          )
          // filter out illegal moves:
          .filter(op => op.newPath.length !== 0) // can't move the root
          .filter(op => !Path.isDescendant(op.newPath, op.path)), // can't become a descendant of yourself
        {
          type: 'merge_node',
          path: elementOperandPath,
          position: (
            Node.get(
              rootWithElementOperand,
              Path.previous(elementOperandPath)
            ) as Element
          ).children.length,
          properties: Node.extractProps(elementOperandNode),
        },
      ],
      textOps: [
        {
          type: 'merge_node',
          path: textOperandPath,
          position: (
            Node.get(
              rootWithTextOperand,
              Path.previous(textOperandPath)
            ) as Text
          ).text.length,
          properties: Node.extractProps(textOperandNode),
        },
        {
          type: 'remove_text',
          path: textOperandPath,
          offset: 2,
          text: 'CD',
        },
        {
          type: 'remove_text',
          path: textOperandPath,
          offset: 2,
          text: '',
        },
      ],
    }

    testItNeverMutatesInputs(ops)
    testItAlwaysReUsesRefsWhenPossible(ops)
    testItIsNotAffectedByAffinity(ops)
    testItMatchesPointTransformOnEdges(ops)
  })

  describe('called with split_node', () => {
    const ops: TestOps<SplitNodeOperation> = {
      elementOps: [
        // this means operand will be split into nodes containing its first child and its second and third children
        {
          type: 'split_node',
          path: elementOperandPath,
          position: 1,
          properties: { id: 'split sibling' },
        },
      ],
      textOps: [
        // this means operand will be split into two nodes containing "ABC" and "DEF" separately
        {
          type: 'split_node',
          path: textOperandPath,
          position: 3,
          properties: { id: 'split sibling' },
        },
      ],
    }

    testItNeverMutatesInputs(ops)
    testItAlwaysReUsesRefsWhenPossible(ops)
    testItMatchesPointTransformOnEdges(ops)

    it('is not affected by affinity when edges not on split point', () => {
      forEachCase(ops, ({ op, range }) => {
        if (isEdgeOnSplitPoint(range, op)) return
        const baseline = Range.transform(range, op)
        for (const affinity of affinities) {
          assert.deepEqual(
            Range.transform(range, op, { affinity }),
            baseline,
            `${affinity} affinity`
          )
        }
      })
    })

    it('defaults to inward affinity', () => {
      forEachCase(ops, ({ op, range }) => {
        if (!isEdgeOnSplitPoint(range, op)) return
        const noOptions = Range.transform(range, op)
        const undefinedAffinity = Range.transform(range, op, {
          affinity: undefined,
        })
        const inwardAffinity = Range.transform(range, op, {
          affinity: 'inward',
        })
        assert.deepEqual(
          noOptions,
          inwardAffinity,
          `with no options has different result`
        )
        assert.deepEqual(
          undefinedAffinity,
          inwardAffinity,
          `with undefined affinity has different result`
        )
      })
    })
  })

  describe('called with insert_text', () => {
    const ops: TestOps<InsertTextOperation> = {
      textOps: [
        {
          type: 'insert_text',
          path: textOperandPath,
          offset: 2,
          text: 'insert',
        },
        {
          type: 'insert_text',
          path: textOperandPath,
          offset: 2,
          text: '',
        },
      ],
    }

    testItNeverMutatesInputs(ops)
    testItAlwaysReUsesRefsWhenPossible(ops)
    testItNeverReturnsNull(ops)
    testItMatchesPointTransformOnEdges(ops)

    it('is not affected by affinity when edges not on insertion point', () => {
      forEachCase(ops, ({ op, range }) => {
        if (isEdgeOnSplitPoint(range, op)) return
        const baseline = Range.transform(range, op)
        for (const affinity of affinities) {
          assert.deepEqual(
            Range.transform(range, op, { affinity }),
            baseline,
            `${affinity} affinity`
          )
        }
      })
    })

    it('defaults to inward affinity', () => {
      forEachCase(ops, ({ op, range }) => {
        if (!isEdgeOnSplitPoint(range, op)) return
        const noOptions = Range.transform(range, op)
        const undefinedAffinity = Range.transform(range, op, {
          affinity: undefined,
        })
        const inwardAffinity = Range.transform(range, op, {
          affinity: 'inward',
        })
        assert.deepEqual(
          noOptions,
          inwardAffinity,
          `with no options has different result`
        )
        assert.deepEqual(
          undefinedAffinity,
          inwardAffinity,
          `with undefined affinity has different result`
        )
      })
    })
  })

  describe('called with other operations', () => {
    const setNodeOps: TestOps = {
      elementOps: [
        {
          type: 'set_node',
          path: elementOperandPath,
          properties: { id: 'operand' },
          newProperties: { id: 'operand', key: 'modified' },
        },
      ],
      textOps: [
        {
          type: 'set_node',
          path: textOperandPath,
          properties: { id: 'operand' },
          newProperties: { id: 'operand', key: 'modified' },
        },
      ],
    }
    const setSelectionOps: TestOps = {
      elementOps: [
        {
          type: 'set_selection',
          properties: null,
          newProperties: {
            anchor: rootWithElementOperand.start(elementOperandPath),
            focus: rootWithElementOperand.end(elementOperandPath),
          },
        },
      ],
      textOps: [
        {
          type: 'set_selection',
          properties: null,
          newProperties: {
            anchor: rootWithTextOperand.start(textOperandPath),
            focus: rootWithTextOperand.end(textOperandPath),
          },
        },
      ],
    }

    const opGroups = [
      { type: 'set_node', ops: setNodeOps },
      { type: 'set_selection', ops: setSelectionOps },
    ]

    for (const { type, ops } of opGroups) {
      it(`${type} no-ops gracefully without mutating inputs`, () => {
        forEachCase(ops, ({ op, range }) => {
          const opCopy = structuredClone(op)
          const rangeCopy = structuredClone(range)
          const newRange = Range.transform(range, op)
          assert.deepEqual(range, rangeCopy)
          assert.deepEqual(op, opCopy)
          assert.equal(newRange, range, `returned different ref`)
        })
      })
    }
  })
})
