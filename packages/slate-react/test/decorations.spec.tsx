import React from 'react'
import {
  DecoratedRange,
  Node,
  NodeEntry,
  Path,
  createEditor as slateCreateEditor,
  Editor,
  Text,
  Transforms,
} from 'slate'
import { act, render } from '@testing-library/react'
import {
  Slate,
  withReact,
  Editable,
  RenderLeafProps,
  ReactEditor,
} from '../src'

const renderLeaf = ({ leaf, attributes, children }: RenderLeafProps) => {
  const decorations = Object.keys(Node.extractProps(leaf)).sort()

  return (
    <span {...attributes} data-decorations={JSON.stringify(decorations)}>
      {children}
    </span>
  )
}

interface DecorateConfig {
  path: Path
  decorations: (node: Node) => (DecoratedRange & Record<string, unknown>)[]
}

const decoratePaths =
  (editor: ReactEditor, configs: DecorateConfig[]) =>
  ([node, path]: NodeEntry): DecoratedRange[] => {
    // Validate that decorate was called with a node matching the path
    if (Node.get(editor, path) !== node) {
      throw new Error('decorate was called with an incorrect node entry')
    }

    const matchingConfig = configs.find(({ path: p }) => Path.equals(path, p))
    if (!matchingConfig) return []

    return matchingConfig.decorations(node)
  }

const getDecoratedLeaves = (
  editor: ReactEditor,
  path: Path
): { text: string; decorations: string[] }[] => {
  const text = ReactEditor.toDOMNode(editor, Node.leaf(editor, path))
  const leaves = Array.from(text.children) as HTMLElement[]

  return leaves.map(leaf => ({
    text: leaf.textContent!,
    decorations: JSON.parse(leaf.dataset.decorations!),
  }))
}

// Pad children arrays with additional nodes to test whether decorations work
// correctly on chunked children
const otherNodes = () =>
  Array.from({ length: 7 }, () => ({ children: [{ text: '' }] }))

describe('decorations', () => {
  const withChunking = (chunking: boolean) => {
    const createEditor = () => {
      const editor = withReact(slateCreateEditor())

      if (chunking) {
        editor.getChunkSize = () => 2
      }

      return editor
    }

    describe('decorating initial value', () => {
      it('decorates part of a single text node', () => {
        const editor = createEditor()

        const initialValue = [
          { children: [{ text: 'Hello world!' }] },
          ...otherNodes(),
        ]

        const decorate = decoratePaths(editor, [
          {
            path: [0, 0],
            decorations: () => [
              {
                anchor: { path: [0, 0], offset: 6 },
                focus: { path: [0, 0], offset: 11 },
                bold: true,
              },
            ],
          },
        ])

        render(
          <Slate editor={editor} initialValue={initialValue}>
            <Editable decorate={decorate} renderLeaf={renderLeaf} />
          </Slate>
        )

        expect(getDecoratedLeaves(editor, [0, 0])).toEqual([
          { text: 'Hello ', decorations: [] },
          { text: 'world', decorations: ['bold'] },
          { text: '!', decorations: [] },
        ])
      })

      it('decorates an entire text node', () => {
        const editor = createEditor()

        const initialValue = [
          {
            children: [{ text: 'before' }, { text: 'bold' }, { text: 'after' }],
          },
          ...otherNodes(),
        ]

        const decorate = decoratePaths(editor, [
          {
            path: [0, 1],
            decorations: () => [
              {
                ...Editor.range(editor, [0, 1]),
                bold: true,
              },
            ],
          },
        ])

        render(
          <Slate editor={editor} initialValue={initialValue}>
            <Editable decorate={decorate} renderLeaf={renderLeaf} />
          </Slate>
        )

        expect(getDecoratedLeaves(editor, [0, 0])).toEqual([
          { text: 'before', decorations: [] },
        ])

        expect(getDecoratedLeaves(editor, [0, 1])).toEqual([
          { text: 'bold', decorations: ['bold'] },
        ])

        expect(getDecoratedLeaves(editor, [0, 2])).toEqual([
          { text: 'after', decorations: [] },
        ])
      })

      it('applies multiple overlapping decorations in a single text node', () => {
        const editor = createEditor()

        const initialValue = [
          { children: [{ text: 'Hello world!' }] },
          ...otherNodes(),
        ]

        const decorate = decoratePaths(editor, [
          {
            path: [0, 0],
            decorations: () => [
              {
                anchor: { path: [0, 0], offset: 0 },
                focus: { path: [0, 0], offset: 11 },
                bold: true,
              },
              {
                anchor: { path: [0, 0], offset: 6 },
                focus: { path: [0, 0], offset: 12 },
                italic: true,
              },
            ],
          },
        ])

        render(
          <Slate editor={editor} initialValue={initialValue}>
            <Editable decorate={decorate} renderLeaf={renderLeaf} />
          </Slate>
        )

        expect(getDecoratedLeaves(editor, [0, 0])).toEqual([
          { text: 'Hello ', decorations: ['bold'] },
          { text: 'world', decorations: ['bold', 'italic'] },
          { text: '!', decorations: ['italic'] },
        ])
      })

      it('passes down decorations from the parent element', () => {
        const editor = createEditor()

        const initialValue = [
          {
            children: [
              { text: 'before' },
              { text: 'middle' },
              { text: 'after' },
            ],
          },
          ...otherNodes(),
        ]

        const decorate = decoratePaths(editor, [
          {
            path: [0],
            decorations: () => [
              {
                anchor: { path: [0, 0], offset: 2 },
                focus: { path: [0, 2], offset: 2 },
                bold: true,
              },
            ],
          },
        ])

        render(
          <Slate editor={editor} initialValue={initialValue}>
            <Editable decorate={decorate} renderLeaf={renderLeaf} />
          </Slate>
        )

        expect(getDecoratedLeaves(editor, [0, 0])).toEqual([
          { text: 'be', decorations: [] },
          { text: 'fore', decorations: ['bold'] },
        ])

        expect(getDecoratedLeaves(editor, [0, 1])).toEqual([
          { text: 'middle', decorations: ['bold'] },
        ])

        expect(getDecoratedLeaves(editor, [0, 2])).toEqual([
          { text: 'af', decorations: ['bold'] },
          { text: 'ter', decorations: [] },
        ])
      })

      it('passes decorations down from the editor', () => {
        const editor = createEditor()

        const initialValue = [
          {
            children: [{ text: '0.0' }, { text: '0.1' }, { text: '0.2' }],
          },
          {
            children: [{ text: '1.0' }],
          },
          {
            children: [{ text: '2.0' }],
          },
          ...otherNodes(),
        ]

        const decorate = decoratePaths(editor, [
          {
            path: [],
            decorations: () => [
              {
                anchor: { path: [0, 1], offset: 0 },
                focus: { path: [1, 0], offset: 3 },
                bold: true,
              },
            ],
          },
          {
            path: [0],
            decorations: () => [
              {
                ...Editor.range(editor, [0, 2]),
                italic: true,
              },
            ],
          },
          {
            path: [1, 0],
            decorations: () => [
              {
                ...Editor.range(editor, [1, 0]),
                underline: true,
              },
            ],
          },
        ])

        render(
          <Slate editor={editor} initialValue={initialValue}>
            <Editable decorate={decorate} renderLeaf={renderLeaf} />
          </Slate>
        )

        expect(getDecoratedLeaves(editor, [0, 0])).toEqual([
          { text: '0.0', decorations: [] },
        ])

        expect(getDecoratedLeaves(editor, [0, 1])).toEqual([
          { text: '0.1', decorations: ['bold'] },
        ])

        expect(getDecoratedLeaves(editor, [0, 2])).toEqual([
          { text: '0.2', decorations: ['bold', 'italic'] },
        ])

        expect(getDecoratedLeaves(editor, [1, 0])).toEqual([
          { text: '1.0', decorations: ['bold', 'underline'] },
        ])

        expect(getDecoratedLeaves(editor, [2, 0])).toEqual([
          { text: '2.0', decorations: [] },
        ])
      })
    })

    describe('redecorating', () => {
      it('redecorates all nodes when the decorate function changes', () => {
        const editor = createEditor()

        const initialValue = [
          {
            children: [{ text: '0.0' }, { text: '0.1' }, { text: '0.2' }],
          },
          {
            children: [{ text: '1.0' }, { text: '1.1' }, { text: '1.2' }],
          },
          ...otherNodes(),
        ]

        const decorate1 = decoratePaths(editor, [
          {
            path: [],
            decorations: () => [
              {
                ...Editor.range(editor, [0, 0]),
                bold: true,
              },
              {
                ...Editor.range(editor, [0, 1]),
                italic: true,
              },
            ],
          },
          {
            path: [1, 0],
            decorations: () => [
              {
                ...Editor.range(editor, [1, 0]),
                bold: true,
              },
            ],
          },
          {
            path: [1, 1],
            decorations: () => [
              {
                ...Editor.range(editor, [1, 1]),
                italic: true,
              },
            ],
          },
        ])

        const decorate2 = decoratePaths(editor, [
          {
            path: [0],
            decorations: () => [
              {
                ...Editor.range(editor, [0, 1]),
                underline: true,
              },
              {
                ...Editor.range(editor, [0, 2]),
                bold: true,
              },
            ],
          },
          {
            path: [1, 1],
            decorations: () => [
              {
                ...Editor.range(editor, [1, 1]),
                underline: true,
              },
            ],
          },
          {
            path: [1, 2],
            decorations: () => [
              {
                ...Editor.range(editor, [1, 2]),
                bold: true,
              },
            ],
          },
        ])

        const { rerender } = render(
          <Slate editor={editor} initialValue={initialValue}>
            <Editable decorate={decorate1} renderLeaf={renderLeaf} />
          </Slate>
        )

        expect(getDecoratedLeaves(editor, [0, 0])).toEqual([
          { text: '0.0', decorations: ['bold'] },
        ])

        expect(getDecoratedLeaves(editor, [0, 1])).toEqual([
          { text: '0.1', decorations: ['italic'] },
        ])

        expect(getDecoratedLeaves(editor, [0, 2])).toEqual([
          { text: '0.2', decorations: [] },
        ])

        expect(getDecoratedLeaves(editor, [1, 0])).toEqual([
          { text: '1.0', decorations: ['bold'] },
        ])

        expect(getDecoratedLeaves(editor, [1, 1])).toEqual([
          { text: '1.1', decorations: ['italic'] },
        ])

        expect(getDecoratedLeaves(editor, [1, 2])).toEqual([
          { text: '1.2', decorations: [] },
        ])

        rerender(
          <Slate editor={editor} initialValue={initialValue}>
            <Editable decorate={decorate2} renderLeaf={renderLeaf} />
          </Slate>
        )

        expect(getDecoratedLeaves(editor, [0, 0])).toEqual([
          { text: '0.0', decorations: [] },
        ])

        expect(getDecoratedLeaves(editor, [0, 1])).toEqual([
          { text: '0.1', decorations: ['underline'] },
        ])

        expect(getDecoratedLeaves(editor, [0, 2])).toEqual([
          { text: '0.2', decorations: ['bold'] },
        ])

        expect(getDecoratedLeaves(editor, [1, 0])).toEqual([
          { text: '1.0', decorations: [] },
        ])

        expect(getDecoratedLeaves(editor, [1, 1])).toEqual([
          { text: '1.1', decorations: ['underline'] },
        ])

        expect(getDecoratedLeaves(editor, [1, 2])).toEqual([
          { text: '1.2', decorations: ['bold'] },
        ])
      })

      it('redecorates undecorated nodes when they change', async () => {
        const editor = createEditor()

        const initialValue = [
          { children: [{ text: 'The quick brown fox' }] },
          ...otherNodes(),
        ]

        const decorate = decoratePaths(editor, [
          {
            path: [0, 0],
            decorations: node =>
              Text.isText(node) && node.text.includes('box')
                ? [
                    {
                      ...Editor.range(editor, [0, 0]),
                      bold: true,
                    },
                  ]
                : [],
          },
        ])

        render(
          <Slate editor={editor} initialValue={initialValue}>
            <Editable decorate={decorate} renderLeaf={renderLeaf} />
          </Slate>
        )

        expect(getDecoratedLeaves(editor, [0, 0])).toEqual([
          { text: 'The quick brown fox', decorations: [] },
        ])

        await act(async () => {
          Transforms.insertText(editor, 'b', {
            at: {
              anchor: { path: [0, 0], offset: 16 },
              focus: { path: [0, 0], offset: 17 },
            },
          })
        })

        expect(getDecoratedLeaves(editor, [0, 0])).toEqual([
          { text: 'The quick brown box', decorations: ['bold'] },
        ])
      })

      it('redecorates decorated nodes when they change', async () => {
        const editor = createEditor()

        const initialValue = [
          { children: [{ text: 'The quick brown box' }] },
          ...otherNodes(),
        ]

        const decorate = decoratePaths(editor, [
          {
            path: [0, 0],
            decorations: node =>
              Text.isText(node) && node.text.includes('box')
                ? [
                    {
                      ...Editor.range(editor, [0, 0]),
                      bold: true,
                    },
                  ]
                : [],
          },
        ])

        render(
          <Slate editor={editor} initialValue={initialValue}>
            <Editable decorate={decorate} renderLeaf={renderLeaf} />
          </Slate>
        )

        expect(getDecoratedLeaves(editor, [0, 0])).toEqual([
          { text: 'The quick brown box', decorations: ['bold'] },
        ])

        await act(async () => {
          Transforms.insertText(editor, 'f', {
            at: {
              anchor: { path: [0, 0], offset: 16 },
              focus: { path: [0, 0], offset: 17 },
            },
          })
        })

        expect(getDecoratedLeaves(editor, [0, 0])).toEqual([
          { text: 'The quick brown fox', decorations: [] },
        ])
      })

      it('passes down new decorations from changed ancestors', async () => {
        const editor = createEditor()

        const initialValue = [
          {
            children: [
              { children: [{ text: 'Hello world!' }] },
              ...otherNodes(),
            ],
          },
        ]

        const decorate = decoratePaths(editor, [
          {
            path: [0],
            decorations: node =>
              'bold' in node
                ? [
                    {
                      ...Editor.range(editor, [0, 0, 0]),
                      bold: true,
                    },
                  ]
                : [],
          },
        ])

        render(
          <Slate editor={editor} initialValue={initialValue}>
            <Editable decorate={decorate} renderLeaf={renderLeaf} />
          </Slate>
        )

        expect(getDecoratedLeaves(editor, [0, 0, 0])).toEqual([
          { text: 'Hello world!', decorations: [] },
        ])

        await act(async () => {
          Transforms.setNodes(editor, { bold: true } as any, {
            at: [0],
          })
        })

        expect(getDecoratedLeaves(editor, [0, 0, 0])).toEqual([
          { text: 'Hello world!', decorations: ['bold'] },
        ])
      })

      it('does not redecorate unchanged nodes when their paths change', async () => {
        const editor = createEditor()

        const initialValue = [
          { children: [{ text: 'A' }] },
          { children: [{ text: 'B' }] },
          ...otherNodes(),
        ]

        const decorate = decoratePaths(editor, [
          {
            path: [1, 0],
            decorations: () => [
              {
                ...Editor.range(editor, [1, 0]),
                bold: true,
              },
            ],
          },
        ])

        render(
          <Slate editor={editor} initialValue={initialValue}>
            <Editable decorate={decorate} renderLeaf={renderLeaf} />
          </Slate>
        )

        expect(getDecoratedLeaves(editor, [0, 0])).toEqual([
          { text: 'A', decorations: [] },
        ])

        expect(getDecoratedLeaves(editor, [1, 0])).toEqual([
          { text: 'B', decorations: ['bold'] },
        ])

        await act(async () => {
          Transforms.insertNodes(
            editor,
            { children: [{ text: '0' }] },
            {
              at: [0],
            }
          )
        })

        expect(getDecoratedLeaves(editor, [0, 0])).toEqual([
          { text: '0', decorations: [] },
        ])

        // A does not become bold even though it now matches the decoration
        expect(getDecoratedLeaves(editor, [1, 0])).toEqual([
          { text: 'A', decorations: [] },
        ])

        // B remains bold even though it no longer matches the decoration
        expect(getDecoratedLeaves(editor, [2, 0])).toEqual([
          { text: 'B', decorations: ['bold'] },
        ])
      })
    })
  }

  describe('without chunking', () => {
    withChunking(false)
  })

  describe('with chunking', () => {
    withChunking(true)
  })
})
