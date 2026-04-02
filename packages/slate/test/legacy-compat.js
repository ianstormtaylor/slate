import assert from 'assert'
import { Command, Mark, Operation, createEditor } from '../src'

describe('slate legacy compatibility', () => {
  it('re-exports Command and Mark from the slate package', () => {
    assert.equal(typeof Command.isCommand, 'function')
    assert.equal(Command.isCommand({ type: 'insert_text', text: 'x' }), true)
    assert.equal(typeof Mark.isMark, 'function')
    assert.equal(Mark.isMark({ bold: true }), true)
  })

  it('keeps editor.exec available for legacy command dispatch', () => {
    const editor = createEditor()

    editor.children = [{ type: 'paragraph', children: [{ text: 'one' }] }]
    editor.selection = {
      anchor: { path: [0, 0], offset: 1 },
      focus: { path: [0, 0], offset: 1 },
    }

    editor.exec({ type: 'insert_text', text: '!' })

    assert.deepEqual(editor.children, [
      { type: 'paragraph', children: [{ text: 'o!ne' }] },
    ])
  })

  it('maps legacy mark command payloads to current mark semantics', () => {
    const editor = createEditor()

    editor.children = [{ type: 'paragraph', children: [{ text: 'one' }] }]
    editor.selection = {
      anchor: { path: [0, 0], offset: 1 },
      focus: { path: [0, 0], offset: 1 },
    }

    editor.exec({ type: 'add_mark', mark: { key: 'a' } })

    assert.deepEqual(editor.marks, { a: true })

    editor.exec({ type: 'remove_mark', mark: { key: 'a' } })

    assert.deepEqual(editor.marks, {})
  })

  it('still accepts master-era mark operations', () => {
    assert.equal(
      Operation.isOperation({
        type: 'add_mark',
        path: [0, 0],
        mark: { key: 'a' },
      }),
      true
    )
    assert.equal(
      Operation.isOperation({
        type: 'remove_mark',
        path: [0, 0],
        mark: { key: 'a' },
      }),
      true
    )
    assert.equal(
      Operation.isOperation({
        type: 'set_mark',
        path: [0, 0],
        properties: { key: 'a' },
        newProperties: { key: 'b' },
      }),
      true
    )
  })

  it('keeps legacy validators limited to plain objects', () => {
    assert.equal(Command.isCommand([]), false)
    assert.equal(Mark.isMark([]), false)
    assert.equal(
      Operation.isOperation({
        type: 'set_node',
        path: [0],
        properties: [],
        newProperties: {},
      }),
      false
    )
  })

  it('calls editor.onChange with children and operations during a flush', async () => {
    const editor = createEditor()
    const calls = []

    editor.children = [{ type: 'paragraph', children: [{ text: 'one' }] }]
    editor.selection = {
      anchor: { path: [0, 0], offset: 1 },
      focus: { path: [0, 0], offset: 1 },
    }

    editor.onChange = (...args) => {
      calls.push(args)
    }

    editor.insertText('!')
    await Promise.resolve()

    assert.equal(calls.length, 1)
    assert.deepEqual(calls[0][0], editor.children)
    assert.deepEqual(calls[0][1], [
      {
        type: 'insert_text',
        path: [0, 0],
        offset: 1,
        text: '!',
      },
    ])
  })
})
