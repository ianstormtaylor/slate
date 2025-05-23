import {
  Descendant,
  Editor,
  Element,
  Node,
  Transforms,
  createEditor,
} from 'slate'
import { Key } from 'slate-dom'
import { ReactEditor, withReact } from '../src'
import {
  Chunk,
  ChunkAncestor,
  ChunkDescendant,
  ChunkLeaf,
  ChunkNode,
  ChunkTree,
  KEY_TO_CHUNK_TREE,
  getChunkTreeForNode,
} from '../src/chunking'
import { ReconcileOptions } from '../src/chunking/reconcile-children'

const block = (text: string): Element => ({ children: [{ text }] })

const blocks = (count: number) =>
  Array.from(
    {
      length: count,
    },
    (_, i) => block(i.toString())
  )

const reconcileEditor = (
  editor: ReactEditor,
  options: Omit<ReconcileOptions, 'chunkTree' | 'children' | 'chunkSize'> = {}
) =>
  getChunkTreeForNode(editor, editor, {
    reconcile: {
      chunkSize: 3,
      debug: true,
      ...options,
    },
  })

type TreeShape = string | TreeShape[]

const getTreeShape = (chunkNode: ChunkNode): TreeShape => {
  if (chunkNode.type === 'leaf') {
    return Node.string(chunkNode.node)
  }

  return chunkNode.children.map(getTreeShape)
}

const getChildrenAndTreeForShape = (
  editor: ReactEditor,
  treeShape: TreeShape[]
): { children: Descendant[]; chunkTree: ChunkTree } => {
  const children: Descendant[] = []

  const shapeToNode = (
    ts: TreeShape,
    parent: ChunkAncestor
  ): ChunkDescendant => {
    if (Array.isArray(ts)) {
      const chunk: Chunk = {
        type: 'chunk',
        key: new Key(),
        parent,
        children: [],
      }

      chunk.children = ts.map(child => shapeToNode(child, chunk))

      return chunk
    }

    const node = block(ts)
    const index = children.length
    children.push(node)

    return {
      type: 'leaf',
      key: ReactEditor.findKey(editor, node),
      node,
      index,
    }
  }

  const chunkTree: ChunkTree = {
    type: 'root',
    modifiedChunks: new Set(),
    movedNodeKeys: new Set(),
    children: [],
  }

  chunkTree.children = treeShape.map(child => shapeToNode(child, chunkTree))

  return { children, chunkTree }
}

const withChunking = (editor: ReactEditor) => {
  editor.getChunkSize = node => (Editor.isEditor(node) ? 3 : null)
  return editor
}

const createEditorWithShape = (treeShape: TreeShape[]) => {
  const editor = withChunking(withReact(createEditor()))
  const { children, chunkTree } = getChildrenAndTreeForShape(editor, treeShape)
  editor.children = children
  const key = ReactEditor.findKey(editor, editor)
  KEY_TO_CHUNK_TREE.set(key, chunkTree)
  return editor
}

// https://stackoverflow.com/a/29450606
const createPRNG = (seed: number) => {
  const mask = 0xffffffff
  let m_w = (123456789 + seed) & mask
  let m_z = (987654321 - seed) & mask

  return () => {
    m_z = (36969 * (m_z & 65535) + (m_z >>> 16)) & mask
    m_w = (18000 * (m_w & 65535) + (m_w >>> 16)) & mask

    let result = ((m_z << 16) + (m_w & 65535)) >>> 0
    result /= 4294967296
    return result
  }
}

describe('getChunkTreeForNode', () => {
  describe('chunking initial value', () => {
    const getShapeForInitialCount = (count: number) => {
      const editor = withChunking(withReact(createEditor()))
      editor.children = blocks(count)
      const chunkTree = reconcileEditor(editor)
      return getTreeShape(chunkTree)
    }

    it('returns empty tree for 0 children', () => {
      expect(getShapeForInitialCount(0)).toEqual([])
    })

    it('returns flat tree for 1 child', () => {
      expect(getShapeForInitialCount(1)).toEqual(['0'])
    })

    it('returns flat tree for 3 children', () => {
      expect(getShapeForInitialCount(3)).toEqual(['0', '1', '2'])
    })

    it('returns 1 layer of chunking for 4 children', () => {
      expect(getShapeForInitialCount(4)).toEqual([['0', '1', '2'], ['3']])
    })

    it('returns 1 layer of chunking for 9 children', () => {
      expect(getShapeForInitialCount(9)).toEqual([
        ['0', '1', '2'],
        ['3', '4', '5'],
        ['6', '7', '8'],
      ])
    })

    it('returns 2 layers of chunking for 10 children', () => {
      expect(getShapeForInitialCount(10)).toEqual([
        [
          ['0', '1', '2'],
          ['3', '4', '5'],
          ['6', '7', '8'],
        ],
        [['9']],
      ])
    })

    it('returns 2 layers of chunking for 27 children', () => {
      expect(getShapeForInitialCount(27)).toEqual([
        [
          ['0', '1', '2'],
          ['3', '4', '5'],
          ['6', '7', '8'],
        ],
        [
          ['9', '10', '11'],
          ['12', '13', '14'],
          ['15', '16', '17'],
        ],
        [
          ['18', '19', '20'],
          ['21', '22', '23'],
          ['24', '25', '26'],
        ],
      ])
    })

    it('returns 3 layers of chunking for 28 children', () => {
      expect(getShapeForInitialCount(28)).toEqual([
        [
          [
            ['0', '1', '2'],
            ['3', '4', '5'],
            ['6', '7', '8'],
          ],
          [
            ['9', '10', '11'],
            ['12', '13', '14'],
            ['15', '16', '17'],
          ],
          [
            ['18', '19', '20'],
            ['21', '22', '23'],
            ['24', '25', '26'],
          ],
        ],
        [[['27']]],
      ])
    })

    it('calls onInsert for initial children', () => {
      const editor = withChunking(withReact(createEditor()))
      editor.children = blocks(3)

      const onInsert = jest.fn()
      reconcileEditor(editor, { onInsert })

      expect(onInsert.mock.calls).toEqual([
        [editor.children[0], 0],
        [editor.children[1], 1],
        [editor.children[2], 2],
      ])
    })

    it('sets the index of each chunk leaf', () => {
      const editor = withChunking(withReact(createEditor()))
      editor.children = blocks(9)

      const chunkTree = reconcileEditor(editor)
      const chunks = chunkTree.children as Chunk[]
      const leaves = chunks.map(chunk => chunk.children)

      expect(leaves).toMatchObject([
        [{ index: 0 }, { index: 1 }, { index: 2 }],
        [{ index: 3 }, { index: 4 }, { index: 5 }],
        [{ index: 6 }, { index: 7 }, { index: 8 }],
      ])
    })
  })

  describe('inserting nodes', () => {
    describe('in empty editor', () => {
      it('inserts a single node', () => {
        const editor = createEditorWithShape([])
        Transforms.insertNodes(editor, block('x'), { at: [0] })
        const chunkTree = reconcileEditor(editor)
        expect(getTreeShape(chunkTree)).toEqual(['x'])
      })

      it('inserts 27 nodes with 2 layers of chunking', () => {
        const editor = createEditorWithShape([])
        Transforms.insertNodes(editor, blocks(27), { at: [0] })
        const chunkTree = reconcileEditor(editor)

        expect(getTreeShape(chunkTree)).toEqual([
          [
            ['0', '1', '2'],
            ['3', '4', '5'],
            ['6', '7', '8'],
          ],
          [
            ['9', '10', '11'],
            ['12', '13', '14'],
            ['15', '16', '17'],
          ],
          [
            ['18', '19', '20'],
            ['21', '22', '23'],
            ['24', '25', '26'],
          ],
        ])
      })

      it('inserts 28 nodes with 3 layers of chunking', () => {
        const editor = createEditorWithShape([])
        Transforms.insertNodes(editor, blocks(28), { at: [0] })
        const chunkTree = reconcileEditor(editor)

        expect(getTreeShape(chunkTree)).toEqual([
          [
            [
              ['0', '1', '2'],
              ['3', '4', '5'],
              ['6', '7', '8'],
            ],
            [
              ['9', '10', '11'],
              ['12', '13', '14'],
              ['15', '16', '17'],
            ],
            [
              ['18', '19', '20'],
              ['21', '22', '23'],
              ['24', '25', '26'],
            ],
          ],
          [[['27']]],
        ])
      })

      it('inserts nodes one by one', () => {
        const editor = createEditorWithShape([])
        let chunkTree: ChunkTree

        blocks(31).forEach((node, i) => {
          Transforms.insertNodes(editor, node, { at: [i] })
          chunkTree = reconcileEditor(editor)
        })

        expect(getTreeShape(chunkTree!)).toEqual([
          '0',
          '1',
          '2',
          ['3', '4', '5'],
          ['6', '7', '8'],
          ['9', '10', '11'],
          ['12', '13', '14'],
          ['15', '16', '17'],
          ['18', '19', '20'],
          [
            ['21', '22', '23'],
            ['24', '25', '26'],
            ['27', '28', '29'],
          ],
          [['30']],
        ])
      })

      it('inserts nodes one by one in reverse order', () => {
        const editor = createEditorWithShape([])
        let chunkTree: ChunkTree

        blocks(31)
          .reverse()
          .forEach(node => {
            Transforms.insertNodes(editor, node, { at: [0] })
            chunkTree = reconcileEditor(editor)
          })

        expect(getTreeShape(chunkTree!)).toEqual([
          [['0']],
          [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
          ],
          ['10', '11', '12'],
          ['13', '14', '15'],
          ['16', '17', '18'],
          ['19', '20', '21'],
          ['22', '23', '24'],
          ['25', '26', '27'],
          '28',
          '29',
          '30',
        ])
      })
    })

    describe('at end of editor', () => {
      it('inserts a single node at the top level', () => {
        const editor = createEditorWithShape(['0', ['1', '2', ['3', '4', '5']]])
        Transforms.insertNodes(editor, block('x'), { at: [6] })
        const chunkTree = reconcileEditor(editor)

        expect(getTreeShape(chunkTree)).toEqual([
          '0',
          ['1', '2', ['3', '4', '5']],
          [['x']],
        ])
      })

      it('inserts a single node into a chunk', () => {
        const editor = createEditorWithShape(['0', ['1', ['2', '3', '4']]])
        Transforms.insertNodes(editor, block('x'), { at: [5] })
        const chunkTree = reconcileEditor(editor)

        expect(getTreeShape(chunkTree)).toEqual([
          '0',
          ['1', ['2', '3', '4'], ['x']],
        ])
      })

      it('inserts a single node into a nested chunk', () => {
        const editor = createEditorWithShape(['0', ['1', '2', ['3', '4']]])
        Transforms.insertNodes(editor, block('x'), { at: [5] })
        const chunkTree = reconcileEditor(editor)

        expect(getTreeShape(chunkTree)).toEqual([
          '0',
          ['1', '2', ['3', '4', 'x']],
        ])
      })

      it('inserts 25 nodes after 2 nodes with 2 layers of chunking', () => {
        const editor = createEditorWithShape(['a', 'b'])
        Transforms.insertNodes(editor, blocks(25), { at: [2] })
        const chunkTree = reconcileEditor(editor)

        expect(getTreeShape(chunkTree)).toEqual([
          'a',
          'b',
          [
            ['0', '1', '2'],
            ['3', '4', '5'],
            ['6', '7', '8'],
          ],
          [
            ['9', '10', '11'],
            ['12', '13', '14'],
            ['15', '16', '17'],
          ],
          [['18', '19', '20'], ['21', '22', '23'], ['24']],
        ])
      })

      it('inserts 25 nodes after 3 nodes with 3 layers of chunking', () => {
        const editor = createEditorWithShape(['a', 'b', 'c'])
        Transforms.insertNodes(editor, blocks(25), { at: [3] })
        const chunkTree = reconcileEditor(editor)

        expect(getTreeShape(chunkTree)).toEqual([
          'a',
          'b',
          'c',
          [
            [
              ['0', '1', '2'],
              ['3', '4', '5'],
              ['6', '7', '8'],
            ],
            [
              ['9', '10', '11'],
              ['12', '13', '14'],
              ['15', '16', '17'],
            ],
            [['18', '19', '20'], ['21', '22', '23'], ['24']],
          ],
        ])
      })

      it('inserts many nodes at the ends of multiple nested chunks', () => {
        const editor = createEditorWithShape(['a', ['b', ['c']]])
        Transforms.insertNodes(editor, blocks(12), { at: [3] })
        const chunkTree = reconcileEditor(editor)

        expect(getTreeShape(chunkTree)).toEqual([
          'a',
          ['b', ['c', '0', '1'], ['2']],
          [
            ['3', '4', '5'],
            ['6', '7', '8'],
            ['9', '10', '11'],
          ],
        ])
      })

      it('calls onInsert for inserted nodes', () => {
        const editor = createEditorWithShape(['a', 'b', 'c'])
        Transforms.insertNodes(editor, blocks(2), { at: [3] })

        const onInsert = jest.fn()
        reconcileEditor(editor, { onInsert })

        expect(onInsert.mock.calls).toEqual([
          [editor.children[3], 3],
          [editor.children[4], 4],
        ])
      })

      it('sets the index of inserted leaves', () => {
        const editor = createEditorWithShape(['a', 'b', 'c'])
        Transforms.insertNodes(editor, blocks(2), { at: [3] })

        const chunkTree = reconcileEditor(editor)
        const chunk = chunkTree.children[3] as Chunk

        expect(chunk.children).toMatchObject([{ index: 3 }, { index: 4 }])
      })
    })

    describe('at start of editor', () => {
      it('inserts a single node at the top level', () => {
        const editor = createEditorWithShape(['0', '1'])
        Transforms.insertNodes(editor, block('x'), { at: [0] })
        const chunkTree = reconcileEditor(editor)
        expect(getTreeShape(chunkTree)).toEqual(['x', '0', '1'])
      })

      it('inserts many nodes at the starts of multiple nested chunks', () => {
        const editor = createEditorWithShape([[['a'], 'b'], 'c'])
        Transforms.insertNodes(editor, blocks(12), { at: [0] })
        const chunkTree = reconcileEditor(editor)

        expect(getTreeShape(chunkTree)).toEqual([
          [
            ['0', '1', '2'],
            ['3', '4', '5'],
            ['6', '7', '8'],
          ],
          [['9'], ['10', '11', 'a'], 'b'],
          'c',
        ])
      })
    })

    describe('in the middle of editor', () => {
      describe('at the top level', () => {
        it('inserts a single node', () => {
          const editor = createEditorWithShape(['0', '1'])
          Transforms.insertNodes(editor, block('x'), { at: [1] })
          const chunkTree = reconcileEditor(editor)

          expect(getTreeShape(chunkTree)).toEqual(['0', 'x', '1'])
        })

        it('inserts nodes at the start of subsequent sibling chunks', () => {
          const editor = createEditorWithShape(['a', [['b', 'c'], 'd'], 'e'])
          Transforms.insertNodes(editor, blocks(3), { at: [1] })
          const chunkTree = reconcileEditor(editor)

          expect(getTreeShape(chunkTree)).toEqual([
            'a',
            [['0']],
            [['1'], ['2', 'b', 'c'], 'd'],
            'e',
          ])
        })

        it('calls onInsert for inserted nodes', () => {
          const editor = createEditorWithShape(['a', 'b', 'c'])
          Transforms.insertNodes(editor, blocks(2), { at: [1] })

          const onInsert = jest.fn()
          reconcileEditor(editor, { onInsert })

          expect(onInsert.mock.calls).toEqual([
            [editor.children[1], 1],
            [editor.children[2], 2],
          ])
        })

        it('calls onIndexChange for subsequent nodes', () => {
          const editor = createEditorWithShape(['a', 'b', 'c'])
          Transforms.insertNodes(editor, blocks(2), { at: [1] })

          const onIndexChange = jest.fn()
          reconcileEditor(editor, { onIndexChange })

          expect(onIndexChange.mock.calls).toEqual([
            [editor.children[3], 3],
            [editor.children[4], 4],
          ])
        })

        it('updates the index of subsequent leaves', () => {
          const editor = createEditorWithShape(['a', 'b', 'c'])
          Transforms.insertNodes(editor, blocks(3), { at: [1] })

          const chunkTree = reconcileEditor(editor)
          const subsequentLeaves = chunkTree.children.slice(2)

          expect(subsequentLeaves).toMatchObject([{ index: 4 }, { index: 5 }])
        })
      })

      describe('in the middle of a chunk', () => {
        it('inserts a single node', () => {
          const editor = createEditorWithShape([[['0', '1']]])
          Transforms.insertNodes(editor, block('x'), { at: [1] })
          const chunkTree = reconcileEditor(editor)
          expect(getTreeShape(chunkTree)).toEqual([[['0', 'x', '1']]])
        })

        it('inserts 8 nodes between 2 nodes', () => {
          const editor = createEditorWithShape([[['a', 'b']]])
          Transforms.insertNodes(editor, blocks(8), { at: [1] })
          const chunkTree = reconcileEditor(editor)

          expect(getTreeShape(chunkTree)).toEqual([
            [
              [
                'a',
                [
                  ['0', '1', '2'],
                  ['3', '4', '5'],
                  ['6', '7'],
                ],
                'b',
              ],
            ],
          ])
        })

        it('inserts nodes at the start of subsequent sibling chunks', () => {
          const editor = createEditorWithShape([['a', [['b', 'c'], 'd'], 'e']])
          Transforms.insertNodes(editor, blocks(3), { at: [1] })
          const chunkTree = reconcileEditor(editor)

          expect(getTreeShape(chunkTree)).toEqual([
            ['a', [['0']], [['1'], ['2', 'b', 'c'], 'd'], 'e'],
          ])
        })
      })

      describe('at the end of a chunk', () => {
        it('inserts 2 nodes in 2 adjacent shallow chunks', () => {
          const editor = createEditorWithShape([['a', 'b'], ['c']])
          Transforms.insertNodes(editor, blocks(2), { at: [2] })
          const chunkTree = reconcileEditor(editor)

          expect(getTreeShape(chunkTree)).toEqual([
            ['a', 'b', '0'],
            ['1', 'c'],
          ])
        })

        it('inserts nodes in many adjacent nested chunks', () => {
          const editor = createEditorWithShape([
            [
              ['a', ['b', ['c']]],
              [[['d'], 'e'], 'f'],
            ],
          ])

          Transforms.insertNodes(editor, blocks(17), { at: [3] })
          const chunkTree = reconcileEditor(editor)

          expect(getTreeShape(chunkTree)).toEqual([
            [
              ['a', ['b', ['c', '0', '1'], ['2']], [['3']]],
              [
                [
                  ['4', '5', '6'],
                  ['7', '8', '9'],
                  ['10', '11', '12'],
                ],
              ],
              [[['13']], [['14'], ['15', '16', 'd'], 'e'], 'f'],
            ],
          ])
        })
      })
    })
  })

  describe('removing nodes', () => {
    it('removes a node', () => {
      const editor = createEditorWithShape(['0', [['1']], '2'])
      Transforms.removeNodes(editor, { at: [1] })
      const chunkTree = reconcileEditor(editor)
      expect(getTreeShape(chunkTree)).toEqual(['0', '2'])
    })

    it('removes multiple consecutive nodes', () => {
      const editor = createEditorWithShape(['0', ['1', '2', '3'], '4'])
      Transforms.removeNodes(editor, { at: [3] })
      Transforms.removeNodes(editor, { at: [2] })
      const chunkTree = reconcileEditor(editor)
      expect(getTreeShape(chunkTree)).toEqual(['0', ['1'], '4'])
    })

    it('removes multiple non-consecutive nodes', () => {
      const editor = createEditorWithShape(['0', ['1', '2', '3'], '4'])
      Transforms.removeNodes(editor, { at: [3] })
      Transforms.removeNodes(editor, { at: [1] })
      const chunkTree = reconcileEditor(editor)
      expect(getTreeShape(chunkTree)).toEqual(['0', ['2'], '4'])
    })

    it('calls onIndexChange for subsequent nodes', () => {
      const editor = createEditorWithShape(['a', 'b', 'c', 'd'])
      Transforms.removeNodes(editor, { at: [1] })

      const onIndexChange = jest.fn()
      reconcileEditor(editor, { onIndexChange })

      expect(onIndexChange.mock.calls).toEqual([
        [editor.children[1], 1],
        [editor.children[2], 2],
      ])
    })

    it('updates the index of subsequent leaves', () => {
      const editor = createEditorWithShape(['a', 'b', 'c', 'd'])
      Transforms.removeNodes(editor, { at: [1] })

      const chunkTree = reconcileEditor(editor)
      const subsequentLeaves = chunkTree.children.slice(1)

      expect(subsequentLeaves).toMatchObject([{ index: 1 }, { index: 2 }])
    })
  })

  describe('removing and inserting nodes', () => {
    it('removes and inserts a node from the start', () => {
      const editor = createEditorWithShape(['0', [['1']], '2'])
      Transforms.removeNodes(editor, { at: [0] })
      Transforms.insertNodes(editor, block('x'), { at: [0] })
      const chunkTree = reconcileEditor(editor)
      expect(getTreeShape(chunkTree)).toEqual([[['x', '1']], '2'])
    })

    it('removes and inserts a node from the middle', () => {
      const editor = createEditorWithShape(['0', [['1']], '2'])
      Transforms.removeNodes(editor, { at: [1] })
      Transforms.insertNodes(editor, block('x'), { at: [1] })
      const chunkTree = reconcileEditor(editor)
      expect(getTreeShape(chunkTree)).toEqual(['0', 'x', '2'])
    })

    it('removes and inserts a node from the end', () => {
      const editor = createEditorWithShape(['0', [['1']], '2'])
      Transforms.removeNodes(editor, { at: [2] })
      Transforms.insertNodes(editor, block('x'), { at: [2] })
      const chunkTree = reconcileEditor(editor)
      expect(getTreeShape(chunkTree)).toEqual(['0', [['1', 'x']]])
    })

    it('removes 2 nodes and inserts 1 node', () => {
      const editor = createEditorWithShape(['0', ['1', '2'], '2'])
      Transforms.removeNodes(editor, { at: [2] })
      Transforms.removeNodes(editor, { at: [1] })
      Transforms.insertNodes(editor, block('x'), { at: [1] })
      const chunkTree = reconcileEditor(editor)
      expect(getTreeShape(chunkTree)).toEqual(['0', 'x', '2'])
    })

    it('removes 1 nodes and inserts 2 node', () => {
      const editor = createEditorWithShape(['0', ['1'], '2'])
      Transforms.removeNodes(editor, { at: [1] })
      Transforms.insertNodes(editor, block('x'), { at: [1] })
      Transforms.insertNodes(editor, block('y'), { at: [2] })
      const chunkTree = reconcileEditor(editor)
      expect(getTreeShape(chunkTree)).toEqual(['0', ['x', 'y'], '2'])
    })

    it('calls onIndexChange for nodes until insertions equal removals', () => {
      const editor = createEditorWithShape([
        'a',
        // Insert 2 here
        'b',
        'c',
        'd', // Remove
        'e',
        'f',
        'g', // Remove
        'h',
      ])

      Transforms.removeNodes(editor, { at: [6] })
      Transforms.removeNodes(editor, { at: [3] })
      Transforms.insertNodes(editor, blocks(2), { at: [1] })

      const onIndexChange = jest.fn()
      reconcileEditor(editor, { onIndexChange })

      expect(onIndexChange.mock.calls).toEqual([
        [editor.children[3], 3],
        [editor.children[4], 4],
        [editor.children[5], 5],
        [editor.children[6], 6],
      ])
    })
  })

  describe('updating nodes', () => {
    it('replaces updated Slate nodes in the chunk tree', () => {
      const editor = createEditorWithShape(['0', ['1'], '2'])
      Transforms.setNodes(editor, { updated: true } as any, { at: [1] })

      const chunkTree = reconcileEditor(editor)
      const chunk = chunkTree.children[1] as Chunk
      const leaf = chunk.children[0] as ChunkLeaf

      expect(leaf.node).toMatchObject({ updated: true })
    })

    it('invalidates ancestor chunks of updated Slate nodes', () => {
      const editor = createEditorWithShape(['0', [['1']], '2'])
      Transforms.insertText(editor, 'x', { at: [1, 0] })

      const chunkTree = reconcileEditor(editor)
      const outerChunk = chunkTree.children[1] as Chunk
      const innerChunk = outerChunk.children[0]

      expect(getTreeShape(chunkTree)).toEqual(['0', [['x']], '2'])

      expect(chunkTree.modifiedChunks).toEqual(
        new Set([outerChunk, innerChunk])
      )
    })

    it('calls onUpdate for updated Slate nodes', () => {
      const editor = createEditorWithShape(['0', '1', '2', '3'])
      Transforms.setNodes(editor, { updated: true } as any, { at: [1] })
      Transforms.setNodes(editor, { updated: true } as any, { at: [2] })

      const onUpdate = jest.fn()
      reconcileEditor(editor, { onUpdate })

      expect(onUpdate.mock.calls).toEqual([
        [editor.children[1], 1],
        [editor.children[2], 2],
      ])
    })
  })

  describe('moving nodes', () => {
    it('moves a node down', () => {
      const editor = createEditorWithShape([['0'], ['1'], ['2'], ['3'], ['4']])

      // Move 1 to after 3
      Transforms.moveNodes(editor, { at: [1], to: [3] })

      const onInsert = jest.fn()
      const onIndexChange = jest.fn()
      const chunkTree = reconcileEditor(editor, { onInsert, onIndexChange })

      expect(getTreeShape(chunkTree)).toEqual([['0'], ['2'], ['3', '1'], ['4']])

      expect(onInsert.mock.calls).toEqual([[editor.children[3], 3]])

      expect(onIndexChange.mock.calls).toEqual([
        [editor.children[1], 1],
        [editor.children[2], 2],
      ])

      expect(chunkTree.movedNodeKeys.size).toBe(0)
    })

    it('moves a node up', () => {
      const editor = createEditorWithShape([['0'], ['1'], ['2'], ['3'], ['4']])

      // Move 3 to after 0
      Transforms.moveNodes(editor, { at: [3], to: [1] })

      const onInsert = jest.fn()
      const onIndexChange = jest.fn()
      const chunkTree = reconcileEditor(editor, { onInsert, onIndexChange })

      expect(getTreeShape(chunkTree)).toEqual([['0', '3'], ['1'], ['2'], ['4']])

      expect(onInsert.mock.calls).toEqual([[editor.children[1], 1]])

      expect(onIndexChange.mock.calls).toEqual([
        [editor.children[2], 2],
        [editor.children[3], 3],
      ])

      expect(chunkTree.movedNodeKeys.size).toBe(0)
    })
  })

  describe('manual rerendering', () => {
    it('invalidates specific child indices', () => {
      const editor = createEditorWithShape([
        ['0'],
        ['1', ['2'], '3'],
        ['4'],
        '5',
      ])

      reconcileEditor(editor)

      const chunkTree = reconcileEditor(editor, { rerenderChildren: [2, 4] })
      const twoOuterChunk = chunkTree.children[1] as Chunk
      const twoInnerChunk = twoOuterChunk.children[1]
      const fourChunk = chunkTree.children[2]

      expect(chunkTree.modifiedChunks).toEqual(
        new Set([twoOuterChunk, twoInnerChunk, fourChunk])
      )
    })
  })

  describe('random testing', () => {
    it('remains correct after random operations', () => {
      // Hard code a value here to reproduce a test failure
      const seed = Math.floor(10000000 * Math.random())
      const random = createPRNG(seed)

      const duration = 250
      const startTime = performance.now()
      const endTime = startTime + duration
      let iteration = 0

      try {
        while (performance.now() < endTime) {
          iteration++

          const editor = withChunking(withReact(createEditor()))

          const randomPosition = (includeEnd: boolean) =>
            Math.floor(
              random() * (editor.children.length + (includeEnd ? 1 : 0))
            )

          for (let i = 0; i < 30; i++) {
            const randomValue = random()

            if (randomValue < 0.33) {
              reconcileEditor(editor)
            } else if (randomValue < 0.66) {
              Transforms.insertNodes(editor, block(i.toString()), {
                at: [randomPosition(true)],
              })
            } else if (randomValue < 0.8) {
              if (editor.children.length > 0) {
                Transforms.removeNodes(editor, { at: [randomPosition(false)] })
              }
            } else {
              if (editor.children.length > 0) {
                Transforms.setNodes(editor, { updated: i } as any, {
                  at: [randomPosition(false)],
                })
              }
            }
          }

          const chunkTree = reconcileEditor(editor)
          const chunkTreeSlateNodes: Descendant[] = []

          const flattenTree = (node: ChunkNode) => {
            if (node.type === 'leaf') {
              chunkTreeSlateNodes.push(node.node)
            } else {
              node.children.forEach(flattenTree)
            }
          }

          flattenTree(chunkTree)

          expect(chunkTreeSlateNodes).toEqual(editor.children)
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(
          `Random testing encountered an error or test failure on iteration ${iteration}. To reproduce this failure reliably, use the random seed: ${seed}`
        )
        throw e
      }
    })
  })
})
