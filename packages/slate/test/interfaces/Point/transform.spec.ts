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
  PointTransformOptions,
  RemoveTextOperation,
  SplitNodeOperation,
  Text,
  Transforms,
} from 'slate'
import { createTree } from '../../test-utils/transforms'

const affinities: PointTransformOptions['affinity'][] = [
  undefined,
  'forward',
  'backward',
  null,
]

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
      point: Point
      node: Text
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
        for (const point of Editor.positions(root, {
          at: [],
        })) {
          const node = Node.get(root, point.path) as Text
          try {
            callback({ op, point, node, root, createDuplicateTree })
          } catch (e) {
            if (!(e instanceof Error)) throw e
            const { node: _, ...slimmedOp } = op as T & { node?: unknown }
            throw new Error(
              `${e.message}\n[${node.id}]@${point.offset} => ${JSON.stringify(
                slimmedOp
              )}`,
              { cause: e }
            )
          }
        }
      }
    }
  }

  const testItNeverMutatesInputs = (ops: TestOps) => {
    return it('never mutates inputs', () => {
      forEachCase(ops, ({ op, point }) => {
        const opCopy = structuredClone(op)
        const pointCopy = structuredClone(point)
        Point.transform(point, op)
        assert.deepEqual(point, pointCopy)
        assert.deepEqual(op, opCopy)
      })
    })
  }

  const testItAlwaysReUsesRefsWhenPossible = (ops: TestOps) => {
    return it('always re-uses refs when possible', () => {
      forEachCase(ops, ({ op, point }) => {
        let splitPoint: Point | undefined = undefined
        if (op.type === 'insert_text') {
          splitPoint = { path: op.path, offset: op.offset }
        } else if (op.type === 'split_node') {
          splitPoint = { path: op.path, offset: op.position }
        }
        if (splitPoint && Point.equals(point, splitPoint)) {
          for (const affinity of affinities) {
            const result = Point.transform(point, op, { affinity })
            if (!result || result === point) continue
            assert.notDeepEqual(
              result,
              point,
              `returned identical point with different ref for ${affinity} affinity`
            )
            if (result.path === point.path) continue
            assert.notDeepEqual(
              result.path,
              point.path,
              `returned identical point.path with different ref for ${affinity} affinity`
            )
          }
        } else {
          const result = Point.transform(point, op)
          if (!result || result === point) return
          assert.notDeepEqual(
            result,
            point,
            `returned identical point with different ref`
          )
          if (result.path === point.path) return
          assert.notDeepEqual(
            result.path,
            point.path,
            `returned identical point.path with different ref`
          )
        }
      })
    })
  }

  const testItNeverReturnsNull = (ops: TestOps) => {
    return it('never returns null', () => {
      forEachCase(ops, ({ op, point }) => {
        assert.notEqual(Point.transform(point, op), null)
      })
    })
  }

  const testItIsNotAffectedByAffinity = (ops: TestOps) => {
    return it('is not affected by affinity', () => {
      forEachCase(ops, ({ op, point }) => {
        const baseline = Point.transform(point, op)
        for (const affinity of affinities) {
          assert.deepEqual(
            Point.transform(point, op, { affinity }),
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
      forEachCase(ops, ({ op, point }) => {
        const result = Point.transform(point, op)
        if (!result) return
        assert.equal(result.offset, point.offset)
      })
    })

    it('matches Path.transform', () => {
      forEachCase(ops, ({ op, point }) => {
        const newPoint = Point.transform(point, op)
        const newPath = Path.transform(point.path, op)
        assert.deepEqual(newPoint === null ? null : newPoint.path, newPath)
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
      ],
    }

    testItNeverMutatesInputs(ops)
    testItAlwaysReUsesRefsWhenPossible(ops)
    testItNeverReturnsNull(ops)
    testItIsNotAffectedByAffinity(ops)

    it('matches Transforms.transform with expected offset', () => {
      forEachCase(ops, ({ op, point, node, createDuplicateTree }) => {
        const newPoint = Point.transform(point, op)

        const anotherTree = createDuplicateTree()

        Transforms.transform(anotherTree, op)
        const nodeAtNewPoint = Node.get(anotherTree, newPoint.path) as Text
        if (node.id === 'operand') {
          assert.equal(
            nodeAtNewPoint.id,
            'earlier sibling',
            `does not match for operand merging into earlier sibling`
          )
          assert.equal(newPoint.offset, point.offset + op.position)
        } else {
          assert.equal(nodeAtNewPoint.id, node.id)
          assert.equal(newPoint.offset, point.offset)
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

    it('returns null at and only at split point with null affinity', () => {
      forEachCase(ops, ({ op, point, node }) => {
        for (const affinity of affinities) {
          const newPoint = Point.transform(point, op, { affinity })

          if (
            node.id === 'operand' &&
            point.offset === op.position &&
            affinity === null
          ) {
            assert.equal(newPoint, null, `null affinity`)
          } else {
            assert.notEqual(newPoint, null, `${affinity} affinity`)
          }
        }
      })
    })

    it('is affected by affinity at and only at split point', () => {
      forEachCase(ops, ({ op, point, node }) => {
        if (node.id === 'operand' && point.offset === op.position) {
          const backwardAffinity = Point.transform(point, op, {
            affinity: 'backward',
          })
          const forwardAffinity = Point.transform(point, op, {
            affinity: 'forward',
          })
          assert.notDeepEqual(backwardAffinity, forwardAffinity)
          assert(
            Point.isBefore(backwardAffinity, forwardAffinity),
            `backward affinity ${backwardAffinity} should be before forward affinity ${forwardAffinity}`
          )
        } else {
          const baseline = Point.transform(point, op)

          for (const affinity of affinities) {
            assert.deepEqual(
              Point.transform(point, op, { affinity }),
              baseline,
              `${affinity} affinity doesn't match baseline`
            )
          }
        }
      })
    })

    it('defaults to forward affinity', () => {
      const point = { path: textOperandPath, offset: 1 }
      const noOptions = Point.transform(point, ops.textOps![0])
      const undefinedAffinity = Point.transform(point, ops.textOps![0], {
        affinity: undefined,
      })
      const forwardAffinity = Point.transform(point, ops.textOps![0], {
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
      forEachCase(ops, ({ op, point, node, createDuplicateTree }) => {
        const newPoint = Point.transform(point, op, {
          affinity: 'forward',
        })

        const anotherTree = createDuplicateTree()

        Transforms.transform(anotherTree, op)
        const nodeAtNewPoint = Node.get(anotherTree, newPoint.path) as Text
        if (node.id === 'operand' && point.offset >= op.position) {
          assert.equal(nodeAtNewPoint.id, op.properties.id)
          assert.equal(newPoint.offset, point.offset - op.position)

          if (point.offset === op.position) {
            const otherNewPoint = Point.transform(point, op, {
              affinity: 'backward',
            })
            const nodeAtOtherNewPoint = Node.get(
              anotherTree,
              otherNewPoint.path
            )
            assert.equal(nodeAtOtherNewPoint.id, node.id)
            assert.equal(otherNewPoint.offset, point.offset)
          }
        } else {
          assert.equal(nodeAtNewPoint.id, node.id)
          assert.equal(newPoint.offset, point.offset)
        }
      })
    })
  })

  describe('called with insert_text', () => {
    const ops = {
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
    } satisfies TestOps<InsertTextOperation>

    testItNeverMutatesInputs(ops)
    testItAlwaysReUsesRefsWhenPossible(ops)
    testItNeverReturnsNull(ops)

    it('always returns the same path', () => {
      forEachCase(ops, ({ op, point }) => {
        assert.equal(Point.transform(point, op).path, point.path)
      })
    })

    it('is affected by affinity at and only at insertion point', () => {
      forEachCase(ops, ({ op, point, node }) => {
        if (node.id === 'operand' && point.offset === op.offset) {
          const backwardAffinity = Point.transform(point, op, {
            affinity: 'backward',
          })
          const forwardAffinity = Point.transform(point, op, {
            affinity: 'forward',
          })
          assert.deepEqual(backwardAffinity.path, forwardAffinity.path)
          assert.equal(
            forwardAffinity.offset,
            backwardAffinity.offset + op.text.length
          )
          assert(
            Point.isBefore(backwardAffinity, forwardAffinity),
            `backward affinity ${backwardAffinity} should be before forward affinity ${forwardAffinity}`
          )
        } else {
          const baseline = Point.transform(point, op)

          for (const affinity of affinities) {
            assert.deepEqual(
              Point.transform(point, op, { affinity }),
              baseline,
              `${affinity} affinity should match baseline`
            )
          }
        }
      })
    })

    it('defaults to forward affinity', () => {
      const op = ops.textOps[0]
      const point = { path: textOperandPath, offset: 1 }
      const noOptions = Point.transform(point, op)
      const undefinedAffinity = Point.transform(point, op, {
        affinity: undefined,
      })
      const forwardAffinity = Point.transform(point, op, {
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

    it('changes offset only in the insertion node', () => {
      forEachCase(ops, ({ op, point, node }) => {
        const newPoint = Point.transform(point, op)
        if (node.id === 'operand' && point.offset > op.offset) {
          assert.equal(newPoint.offset, point.offset + op.text.length)
        } else if (node.id === 'operand' && point.offset === op.offset) {
          const otherNewPoint = Point.transform(point, op, {
            affinity: 'backward',
          })
          assert.equal(newPoint.offset, point.offset + op.text.length)
          assert.equal(otherNewPoint.offset, point.offset)
        } else {
          assert.equal(newPoint.offset, point.offset)
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
      forEachCase(ops, ({ op, point }) => {
        assert.equal(Point.transform(point, op).path, point.path)
      })
    })

    it('changes offset only in the insertion node', () => {
      forEachCase(ops, ({ op, point, node }) => {
        const newPoint = Point.transform(point, op)
        if (
          node.id === 'operand' &&
          point.offset > op.offset + op.text.length
        ) {
          assert.equal(newPoint.offset, point.offset - op.text.length) // after removal range
        } else if (node.id === 'operand' && point.offset > op.offset) {
          assert.equal(newPoint.offset, op.offset) // within removal range
        } else {
          assert.equal(newPoint.offset, point.offset) // different node or before removal range
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
        forEachCase(ops, ({ op, point }) => {
          const opCopy = structuredClone(op)
          const pointCopy = structuredClone(point)
          const newPoint = Point.transform(point, op)
          assert.deepEqual(point, pointCopy)
          assert.deepEqual(op, opCopy)
          assert.equal(newPoint, point, `returned different ref`)
        })
      })
    }
  })
})
