import assert from 'assert'
import { createEditor, Transforms } from '../src'

const applyBatchAndReplay = (children, ops) => {
  const editor = createEditor()
  const replayEditor = createEditor()

  editor.children = JSON.parse(JSON.stringify(children))
  replayEditor.children = JSON.parse(JSON.stringify(children))

  Transforms.applyBatch(editor, ops)

  for (const op of ops) {
    replayEditor.apply(op)
  }

  assert.deepEqual(editor.children, replayEditor.children)
  assert.deepEqual(editor.selection, replayEditor.selection)
  assert.deepEqual(editor.operations, ops)
}

describe('Transforms.applyBatch generic tree ops', () => {
  it('matches replay semantics for insert_node', () => {
    applyBatchAndReplay(
      [
        { type: 'paragraph', children: [{ text: 'one' }] },
        { type: 'paragraph', children: [{ text: 'three' }] },
      ],
      [
        {
          type: 'insert_node',
          path: [1],
          node: { type: 'paragraph', children: [{ text: 'two' }] },
        },
      ]
    )
  })

  it('matches replay semantics for remove_node', () => {
    applyBatchAndReplay(
      [
        { type: 'paragraph', children: [{ text: 'one' }] },
        { type: 'paragraph', children: [{ text: 'two' }] },
        { type: 'paragraph', children: [{ text: 'three' }] },
      ],
      [
        {
          type: 'remove_node',
          path: [1],
          node: { type: 'paragraph', children: [{ text: 'two' }] },
        },
      ]
    )
  })

  it('matches replay semantics for move_node', () => {
    applyBatchAndReplay(
      [
        { type: 'paragraph', children: [{ text: 'one' }] },
        { type: 'paragraph', children: [{ text: 'two' }] },
      ],
      [
        {
          type: 'move_node',
          path: [0],
          newPath: [1],
        },
      ]
    )
  })

  it('matches replay semantics for split_node', () => {
    applyBatchAndReplay(
      [
        {
          type: 'paragraph',
          children: [{ text: 'before text' }, { text: 'after text' }],
        },
      ],
      [
        {
          type: 'split_node',
          path: [0],
          position: 1,
          properties: { type: 'paragraph' },
        },
      ]
    )
  })
})
