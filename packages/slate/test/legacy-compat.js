import assert from 'assert'
import { Command, Mark, createEditor } from '../src'

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
