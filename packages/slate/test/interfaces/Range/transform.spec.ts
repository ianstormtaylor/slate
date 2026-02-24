import assert from 'assert/strict'
import {
  Editor,
  Element,
  InsertTextOperation,
  MergeNodeOperation,
  MoveNodeOperation,
  Node,
  Operation,
  Path,
  Point,
  Range,
  RangeTransformOptions,
  RemoveTextOperation,
  SplitNodeOperation,
  Text,
  TextDirection,
  Transforms,
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

const getPointAffinities = (
  range: Range,
  affinity: RangeTransformOptions['affinity']
) => {
  let anchor: TextDirection | null | undefined
  let focus: TextDirection | null | undefined

  if (affinity === 'inward') {
    if (Range.isForward(range)) {
      anchor = 'forward'
      focus = Range.isCollapsed(range) ? anchor : 'backward'
    } else {
      anchor = 'backward'
      focus = Range.isCollapsed(range) ? anchor : 'forward'
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
              callback({ op, range, root, createDuplicateTree })
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
      const getTests = (
        result: Range,
        range: Range
      ): [string, unknown, unknown][] => [
        ['new range from old range', result, range],
        ['new focus from new anchor', result.anchor, result.focus],
        ['new anchor from old anchor', result.anchor, range.anchor],
        [
          'new anchor path from old anchor path',
          result.anchor.path,
          range.anchor.path,
        ],
        ['new focus from old focus', result.focus, range.focus],
        [
          'new focus path from old focus path',
          result.focus.path,
          range.focus.path,
        ],
      ]

      forEachCase(ops, ({ op, range }) => {
        const affinitiesToTest = isEdgeOnSplitPoint(range, op)
          ? affinities
          : [undefined]
        for (const affinity of affinitiesToTest) {
          const result = Range.transform(range, op, { affinity })
          if (!result) continue
          try {
            if (result === range) continue
            assert.notDeepEqual(result, range, `identical result`)
            if (result.anchor !== range.anchor) {
              assert.notDeepEqual(
                result.anchor,
                range.anchor,
                `identical anchor`
              )
              if (result.anchor.path !== range.anchor.path) {
                assert.notDeepEqual(
                  result.anchor,
                  range.anchor,
                  `identical path for anchor`
                )
              }
            }
            if (
              result.focus !== result.anchor &&
              result.focus !== range.focus
            ) {
              assert.notDeepEqual(result.focus, range.focus, `identical focus`)
              if (result.focus.path !== range.focus.path) {
                assert.notDeepEqual(
                  result.focus,
                  range.focus,
                  `identical path for focus`
                )
              }
            }
          } catch (e) {
            if (!(e instanceof Error)) throw e
            throw new Error(
              `${e.message} with different ref for ${affinity} affinity`,
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

  describe('called with insert_node, remove_node, and move_node', () => {
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
      ],
    }

    testItNeverMutatesInputs(ops)
    testItAlwaysReUsesRefsWhenPossible(ops)
    testItIsNotAffectedByAffinity(ops)

    it('never changes offset when not null', () => {
      forEachCase(ops, ({ op, range }) => {
        const result = Range.transform(range, op)
        if (!result) return
        assert.equal(result.offset, range.offset)
      })
    })

    it('matches Path.transform', () => {
      forEachCase(ops, ({ op, range }) => {
        const newRange = Range.transform(range, op)
        const newPath = Path.transform(range.path, op)
        assert.deepEqual(newRange === null ? null : newRange.path, newPath)
      })
    })
  })

  describe('called with merge_node', () => {
    // this means operand will be merged into earlier sibling
    const ops: TestOps<MergeNodeOperation> = {
      elementOps: [
        {
          type: 'merge_node',
          path: elementOperandPath,
          position: (
            Node.get(
              rootWithElementOperand,
              Path.previous(elementOperandPath)
            ) as Element
          ).children.length,
          properties: { ...elementOperandNode, children: undefined },
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
          properties: { ...textOperandNode, text: undefined },
        },
      ],
    }

    testItNeverMutatesInputs(ops)
    testItAlwaysReUsesRefsWhenPossible(ops)
    testItNeverReturnsNull(ops)
    testItIsNotAffectedByAffinity(ops)

    it('matches Transforms.transform with expected offset', () => {
      forEachCase(ops, ({ op, range, node, createDuplicateTree }) => {
        const newRange = Range.transform(range, op)

        const anotherTree = createDuplicateTree()

        Transforms.transform(anotherTree, op)
        const nodeAtNewRange = Node.get(anotherTree, newRange.path) as Text
        if (node.id === 'operand') {
          assert.equal(
            nodeAtNewRange.id,
            'earlier sibling',
            `does not match for operand merging into earlier sibling`
          )
          assert.equal(newRange.offset, range.offset + op.position)
        } else {
          assert.equal(nodeAtNewRange.id, node.id)
          assert.equal(newRange.offset, range.offset)
        }
      })
    })
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
        // this means operand will be split into two nodes containing "A" and "B" separately
        {
          type: 'split_node',
          path: textOperandPath,
          position: 1,
          properties: { id: 'split sibling' },
        },
      ],
    }

    testItNeverMutatesInputs(ops)
    testItAlwaysReUsesRefsWhenPossible(ops)

    it('only returns null at split range with null affinity', () => {
      forEachCase(ops, ({ op, range, node }) => {
        for (const affinity of affinities) {
          const newRange = Range.transform(range, op, { affinity })

          if (
            node.id === 'operand' &&
            range.offset === op.position &&
            affinity === null
          ) {
            assert.equal(newRange, null, `null affinity`)
          } else {
            assert.notEqual(newRange, null, `${affinity} affinity`)
          }
        }
      })
    })

    it('is affected by affinity only at split range', () => {
      forEachCase(ops, ({ op, range, node }) => {
        if (node.id === 'operand' && range.offset === op.position) {
          const backwardAffinity = Range.transform(range, op, {
            affinity: 'backward',
          })
          const forwardAffinity = Range.transform(range, op, {
            affinity: 'forward',
          })
          assert.notDeepEqual(backwardAffinity, forwardAffinity)
          assert(
            Range.isBefore(backwardAffinity, forwardAffinity),
            `backward affinity ${backwardAffinity} should be before forward affinity ${forwardAffinity}`
          )
        } else {
          const baseline = Range.transform(range, op)

          for (const affinity of affinities) {
            assert.deepEqual(
              Range.transform(range, op, { affinity }),
              baseline,
              `${affinity} affinity should match baseline`
            )
          }
        }
      })
    })

    it('defaults to forward affinity', () => {
      const range = { path: textOperandPath, offset: 1 }
      const noOptions = Range.transform(range, ops.textOps![0])
      const undefinedAffinity = Range.transform(range, ops.textOps![0], {
        affinity: undefined,
      })
      const forwardAffinity = Range.transform(range, ops.textOps![0], {
        affinity: 'forward',
      })
      assert.deepEqual(
        noOptions,
        forwardAffinity,
        `with no options has different result`
      )
      assert.deepEqual(
        undefinedAffinity,
        forwardAffinity,
        `with undefined affinity has different result`
      )
    })

    it('matches Transforms.transform with expected offset', () => {
      forEachCase(ops, ({ op, range, node, createDuplicateTree }) => {
        const newRange = Range.transform(range, op, {
          affinity: 'forward',
        })

        const anotherTree = createDuplicateTree()

        Transforms.transform(anotherTree, op)
        const nodeAtNewRange = Node.get(anotherTree, newRange.path) as Text
        if (node.id === 'operand' && range.offset >= op.position) {
          assert.equal(nodeAtNewRange.id, op.properties.id)
          assert.equal(newRange.offset, range.offset - op.position)

          if (range.offset === op.position) {
            const otherNewRange = Range.transform(range, op, {
              affinity: 'backward',
            })
            const nodeAtOtherNewRange = Node.get(
              anotherTree,
              otherNewRange.path
            )
            assert.equal(nodeAtOtherNewRange.id, node.id)
            assert.equal(otherNewRange.offset, range.offset)
          }
        } else {
          assert.equal(nodeAtNewRange.id, node.id)
          assert.equal(newRange.offset, range.offset)
        }
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

    it('always returns the same path', () => {
      forEachCase(ops, ({ op, range }) => {
        assert.equal(Range.transform(range, op).path, range.path)
      })
    })

    it('is affected by affinity only at insertion range', () => {
      forEachCase(ops, ({ op, range, node }) => {
        if (node.id === 'operand' && range.offset === op.offset) {
          const backwardAffinity = Range.transform(range, op, {
            affinity: 'backward',
          })
          const forwardAffinity = Range.transform(range, op, {
            affinity: 'forward',
          })
          assert.deepEqual(backwardAffinity.path, forwardAffinity.path)
          assert.equal(
            forwardAffinity.offset,
            backwardAffinity.offset + op.text.length
          )
        } else {
          const baseline = Range.transform(range, op)

          for (const affinity of affinities) {
            assert.deepEqual(
              Range.transform(range, op, { affinity }),
              baseline,
              `${affinity} affinity should match baseline`
            )
          }
        }
      })
    })

    it('defaults to forward affinity', () => {
      const range = { path: textOperandPath, offset: 1 }
      const noOptions = Range.transform(range, ops.textOps![0])
      const undefinedAffinity = Range.transform(range, ops.textOps![0], {
        affinity: undefined,
      })
      const forwardAffinity = Range.transform(range, ops.textOps![0], {
        affinity: 'forward',
      })
      assert.deepEqual(
        noOptions,
        forwardAffinity,
        `with no options has different result`
      )
      assert.deepEqual(
        undefinedAffinity,
        forwardAffinity,
        `with undefined affinity has different result`
      )
    })

    it('has expected offset at insertion node', () => {
      forEachCase(ops, ({ op, range, node }) => {
        if (node.id !== 'operand') return // we only need to test the operand
        const newRange = Range.transform(range, op, {
          affinity: 'forward',
        })

        if (range.offset >= op.offset) {
          assert.equal(newRange.offset, range.offset + op.text.length)

          if (range.offset === op.offset) {
            const otherNewRange = Range.transform(range, op, {
              affinity: 'backward',
            })
            assert.equal(otherNewRange.offset, range.offset)
          }
        } else {
          assert.equal(newRange.offset, range.offset)
        }
      })
    })
  })

  describe('called with remove_text', () => {
    const ops: TestOps<RemoveTextOperation> = {
      textOps: [
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
    testItNeverReturnsNull(ops)
    testItIsNotAffectedByAffinity(ops)

    it('always returns the same path', () => {
      forEachCase(ops, ({ op, range }) => {
        assert.equal(Range.transform(range, op).path, range.path)
      })
    })

    it('has expected offset at removal node', () => {
      forEachCase(ops, ({ op, range, node }) => {
        if (node.id !== 'operand') return // we only need to test the operand
        const newRange = Range.transform(range, op)

        if (range.offset > op.offset + op.text.length) {
          assert.equal(newRange.offset, range.offset - op.text.length) // after removal
        } else if (range.offset > op.offset) {
          assert.equal(newRange.offset, op.offset) // within removal
        } else {
          assert.equal(newRange.offset, range.offset) // before removal
        }
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
