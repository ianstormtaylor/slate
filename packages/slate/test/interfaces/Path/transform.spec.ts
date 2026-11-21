import assert from 'assert/strict'
import {
  Editor,
  Element,
  MoveNodeOperation,
  Node,
  Operation,
  Path,
  PathTransformOptions,
  Transforms,
} from 'slate'
import { createTree } from '../../test-utils/transforms'

const affinities: PathTransformOptions['affinity'][] = [
  undefined,
  'forward',
  'backward',
  null,
]

describe('.transform', () => {
  const root = createTree()

  const [[operandNode, operandPath]] = Editor.nodes<Element>(root, {
    at: [],
    match: n => n.id === 'operand',
  })

  const testItNeverMutatesInputs = (op: Operation) => {
    return it('never mutates inputs', () => {
      const opCopy = structuredClone(op)
      for (const [node, path] of Node.nodes(root)) {
        const pathCopy = path.slice()
        Path.transform(path, op)
        assert.deepEqual(path, pathCopy, `mutates path for ${node.id}`)
        assert.deepEqual(op, opCopy, `mutates op for ${node.id}`)
      }
    })
  }

  const testItReturnsTheInputIfUnchanged = (op: Operation) => {
    return it('returns the input if unchanged', () => {
      for (const [node, path] of Node.nodes(root)) {
        if (node.id === 'operand') {
          for (const affinity of affinities) {
            const result = Path.transform(path, op, { affinity })
            if (result !== path) {
              assert.notDeepEqual(
                result,
                path,
                `returned different ref with same value for ${node.id} with ${affinity} affinity`
              )
            }
          }
        } else {
          const result = Path.transform(path, op)
          if (result !== path) {
            assert.notDeepEqual(
              result,
              path,
              `returned different ref with same value for ${node.id}`
            )
          }
        }
      }
    })
  }

  const testItNeverReturnsNull = (op: Operation) => {
    return it('never returns null', () => {
      for (const [node, path] of Node.nodes(root)) {
        assert.notEqual(
          Path.transform(path, op),
          null,
          `returns null for ${node.id}`
        )
      }
    })
  }

  const testItIsNotAffectedByAffinity = (op: Operation) => {
    return it('is not affected by affinity', () => {
      for (const [node, path] of Node.nodes(root)) {
        const baseline = Path.transform(path, op)

        for (const affinity of affinities) {
          assert.deepEqual(
            Path.transform(path, op, { affinity }),
            baseline,
            `is for ${node.id} called with affinity ${affinity}`
          )
        }
      }
    })
  }

  describe('called with insert_node', () => {
    const op: Operation = {
      type: 'insert_node',
      path: operandPath,
      node: { id: 'inserted', children: [] },
    }

    testItNeverMutatesInputs(op)
    testItReturnsTheInputIfUnchanged(op)
    testItNeverReturnsNull(op)
    testItIsNotAffectedByAffinity(op)

    it('matches Transforms.transform', () => {
      for (const [node, path] of Node.nodes(root)) {
        const newPath = Path.transform(path, op)

        const anotherTree = createTree()
        Transforms.transform(anotherTree, op)
        const nodeAtNewPath = Node.get(anotherTree, newPath)
        assert.equal(nodeAtNewPath.id, node.id, `does not match for ${node.id}`)
      }
    })
  })

  describe('called with remove_node', () => {
    const op: Operation = {
      type: 'remove_node',
      path: operandPath,
      node: operandNode,
    }

    testItNeverMutatesInputs(op)
    testItReturnsTheInputIfUnchanged(op)
    testItIsNotAffectedByAffinity(op)

    it('matches Transforms.transform', () => {
      for (const [node, path] of Node.nodes(root)) {
        const newPath = Path.transform(path, op)

        const anotherTree = createTree()
        Transforms.transform(anotherTree, op)
        if (newPath) {
          const nodeAtNewPath = Node.get(anotherTree, newPath)
          assert.equal(
            nodeAtNewPath.id,
            node.id,
            `does not match for ${node.id}`
          )
        } else {
          const [entry] = Editor.nodes<Element>(anotherTree, {
            at: [],
            match: n => n.id === node.id,
          })
          assert.equal(entry, undefined, `does not match for ${node.id}`)
        }
      }
    })
  })

  describe('called with merge_node', () => {
    // this means operand will be merged into earlier sibling
    const op: Operation = {
      type: 'merge_node',
      path: operandPath,
      position: 3,
      properties: { ...operandNode, children: undefined },
    }

    testItNeverMutatesInputs(op)
    testItReturnsTheInputIfUnchanged(op)
    testItNeverReturnsNull(op)
    testItIsNotAffectedByAffinity(op)

    it('matches Transforms.transform', () => {
      for (const [node, path] of Node.nodes(root)) {
        const newPath = Path.transform(path, op)

        const anotherTree = createTree()
        Transforms.transform(anotherTree, op)
        const nodeAtNewPath = Node.get(anotherTree, newPath)
        if (node.id === 'operand') {
          assert.equal(
            nodeAtNewPath.id,
            'earlier sibling',
            `does not match for operand merging into earlier sibling`
          )
        } else {
          assert.equal(
            nodeAtNewPath.id,
            node.id,
            `does not match for ${node.id}`
          )
        }
      }
    })
  })

  describe('called with split_node', () => {
    // this means operand will be split into nodes containing its first child and its second and third children
    const op: Operation = {
      type: 'split_node',
      path: operandPath,
      position: 1,
      properties: { id: 'split sibling' },
    }

    testItNeverMutatesInputs(op)
    testItReturnsTheInputIfUnchanged(op)

    it('returns null only for split node with null affinity', () => {
      for (const [node, path] of Node.nodes(root)) {
        for (const affinity of affinities) {
          if (node.id === 'operand' && affinity === null) {
            assert.equal(
              Path.transform(operandPath, op, { affinity: null }),
              null,
              `does not return null for operand with null affinity`
            )
          } else {
            assert.notEqual(
              Path.transform(path, op, { affinity }),
              null,
              `returns null for ${node.id} with ${affinity} affinity`
            )
          }
        }
      }
    })

    it('is affected by affinity only for split node', () => {
      for (const [node, path] of Node.nodes(root)) {
        if (node.id === 'operand') {
          const backwardAffinity = Path.transform(operandPath, op, {
            affinity: 'backward',
          })
          const forwardAffinity = Path.transform(operandPath, op, {
            affinity: 'forward',
          })
          assert.notDeepEqual(backwardAffinity, forwardAffinity)
        } else {
          const baseline = Path.transform(path, op)

          for (const affinity of affinities) {
            assert.deepEqual(
              Path.transform(path, op, { affinity }),
              baseline,
              `is for ${node.id} called with affinity ${affinity}`
            )
          }
        }
      }
    })

    it('defaults to forward affinity', () => {
      const noOptions = Path.transform(operandPath, op)
      const undefinedAffinity = Path.transform(operandPath, op, {
        affinity: undefined,
      })
      const forwardAffinity = Path.transform(operandPath, op, {
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

    it('matches Transforms.transform', () => {
      for (const [node, path] of Node.nodes(root)) {
        const newPath = Path.transform(path, op, { affinity: 'backward' })

        const anotherTree = createTree()
        Transforms.transform(anotherTree, op)
        const nodeAtNewPath = Node.get(anotherTree, newPath)
        assert.equal(nodeAtNewPath.id, node.id, `does not match for ${node.id}`)
        if (node.id === 'operand') {
          // now for split sibling
          const otherNewPath = Path.transform(path, op, { affinity: 'forward' })

          const nodeAtOtherNewPath = Node.get(anotherTree, otherNewPath)
          assert.equal(
            nodeAtOtherNewPath.id,
            op.properties.id,
            `does not match for ${op.properties.id}`
          )
        }
      }
    })
  })

  describe('called with move_node', () => {
    const ops = Array.from(Node.nodes(root))
      .map(
        ([node, newPath]) =>
          [
            node,
            {
              type: 'move_node',
              path: operandPath,
              newPath,
            },
          ] as [Node, MoveNodeOperation]
      )
      // filter out illegal moves:
      .filter(([node]) => node.id !== 'root') // can't move the root
      .filter(([, op]) => !Path.isDescendant(op.newPath, op.path)) // can't become a descendant of yourself

    it('never mutates inputs', () => {
      for (const [opNode, op] of ops) {
        const opCopy = structuredClone(op)
        for (const [node, path] of Node.nodes(root)) {
          const pathCopy = path.slice()
          Path.transform(path, op)
          assert.deepEqual(
            path,
            pathCopy,
            `mutates path for ${node.id} when moving from ${opNode.id}`
          )
          assert.deepEqual(
            op,
            opCopy,
            `mutates op for ${node.id} when moving from ${opNode.id}`
          )
        }
      }
    })

    it('returns the input if unchanged', () => {
      for (const [opNode, op] of ops) {
        for (const [node, path] of Node.nodes(root)) {
          const result = Path.transform(path, op)
          if (result !== path) {
            assert.notDeepEqual(
              result,
              path,
              `returned different ref with same value for ${node.id} when moving from ${opNode.id}`
            )
          }
        }
      }
    })

    it('never returns null', () => {
      for (const [opNode, op] of ops) {
        for (const [node, path] of Node.nodes(root)) {
          const newPath = Path.transform(path, op)
          assert.notEqual(
            newPath,
            null,
            `returns null for ${node.id} when moving from ${opNode.id}`
          )
        }
      }
    })

    it('is not affected by affinity', () => {
      for (const [opNode, op] of ops) {
        for (const [node, path] of Node.nodes(root)) {
          const baseline = Path.transform(path, op)

          for (const affinity of affinities) {
            assert.deepEqual(
              Path.transform(path, op, { affinity }),
              baseline,
              `is for ${node.id} called with affinity ${affinity} when moving from ${opNode.id}`
            )
          }
        }
      }
    })

    it('matches Transforms.transform', () => {
      for (const [opNode, op] of ops) {
        for (const [node, path] of Node.nodes(root)) {
          const newPath = Path.transform(path, op)

          const anotherTree = createTree()
          Transforms.transform(anotherTree, op)
          const nodeAtNewPath = Node.get(anotherTree, newPath)
          assert.equal(
            nodeAtNewPath.id,
            node.id,
            `does not match for ${node.id} when moving from ${opNode.id}`
          )
        }
      }
    })
  })

  describe('called with other operations', () => {
    const ops: Operation[] = [
      {
        type: 'set_node',
        path: operandPath,
        properties: { id: 'operand' },
        newProperties: { id: 'operand', key: 'modified' },
      },
      {
        type: 'set_selection',
        properties: null,
        newProperties: {
          anchor: { path: operandPath, offset: 0 },
          focus: { path: operandPath, offset: 4 },
        },
      },
      {
        type: 'insert_text',
        path: operandPath,
        offset: 2,
        text: 'inserted',
      },
      {
        type: 'remove_text',
        path: operandPath,
        offset: 2,
        text: 'removed',
      },
    ]

    for (const op of ops) {
      it(`${op.type} no-ops gracefully without mutating inputs`, () => {
        const opCopy = structuredClone(op)
        for (const [node, path] of Node.nodes(root)) {
          const pathCopy = path.slice()
          const newPath = Path.transform(path, op)
          assert.deepEqual(path, pathCopy, `mutates op for ${node.id}`)
          assert.deepEqual(op, opCopy, `mutates op for ${node.id}`)
          assert.equal(newPath, path, `returned different ref for ${node.id}`)
        }
      })
    }
  })
})
