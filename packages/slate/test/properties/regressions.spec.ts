import assert from 'assert'
import { Editor, Transforms } from 'slate'
import { withHistory } from 'slate-history'
import { create } from './generators'

it('fragment replacement honors voids when deleting the expanded target', () => {
  const editor = create([
    { type: 'paragraph', children: [{ text: 'a' }] },
    { void: true, children: [{ text: '' }] },
    { void: true, children: [{ text: 'a' }] },
  ])
  Transforms.insertFragment(
    editor,
    [
      { type: 'paragraph', children: [{ text: 'x' }] },
      { type: 'paragraph', children: [{ text: 'x', bold: true }] },
    ],
    {
      at: {
        anchor: { path: [1, 0], offset: 0 },
        focus: { path: [2, 0], offset: 1 },
      },
      voids: true,
    }
  )
  assert.strictEqual(Editor.string(editor, [], { voids: true }), 'axx')
})

it('undo restores a saved selection after removing the only block', () => {
  const editor = withHistory(create([{ children: [{ text: 'a' }] }]))
  const selection = {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [0, 0], offset: 1 },
  }
  Transforms.select(editor, selection)
  Transforms.removeNodes(editor, { at: [0] })
  assert.strictEqual(editor.selection, null)
  editor.undo()
  assert.deepStrictEqual(editor.children, [{ children: [{ text: 'a' }] }])
  assert.deepStrictEqual(editor.selection, selection)
})

for (const unit of ['character', 'word', 'line', 'block'] as const) {
  it(`${unit} traversal includes text after an inline void`, () => {
    const editor = create([
      {
        children: [
          { text: '' },
          { inline: true, void: true, children: [{ text: '' }] },
          { text: '' },
        ],
      },
      { children: [{ text: '' }] },
    ])
    const expected = [
      { path: [0, 0], offset: 0 },
      { path: [0, 1, 0], offset: 0 },
      { path: [0, 2], offset: 0 },
      { path: [1, 0], offset: 0 },
    ]
    assert.deepStrictEqual(
      Array.from(Editor.positions(editor, { at: [], unit })),
      expected
    )
    assert.deepStrictEqual(
      Editor.after(editor, expected[1], { unit }),
      expected[2]
    )
    assert.deepStrictEqual(
      Array.from(Editor.positions(editor, { at: [], unit, reverse: true })),
      expected.slice().reverse()
    )
  })
}

it('fragment replacement keeps the surviving prefix inside a void', () => {
  const editor = create([
    { children: [{ text: 'a' }] },
    { void: true, children: [{ text: 'ab' }] },
    { children: [{ inline: true, children: [{ text: 'cd' }] }] },
  ])
  Transforms.insertFragment(
    editor,
    [{ children: [{ text: 'x' }] }, { children: [{ text: 'y', bold: true }] }],
    {
      at: {
        anchor: { path: [1, 0], offset: 1 },
        focus: { path: [2, 1, 0], offset: 1 },
      },
      voids: true,
    }
  )
  assert.strictEqual(Editor.string(editor, [], { voids: true }), 'aaxyd')
})

it('word traversal restarts segmentation after an inline void', () => {
  const editor = create([
    {
      children: [
        { inline: true, children: [{ text: '😀' }] },
        { inline: true, void: true, children: [{ text: '' }] },
        { text: 'a😀' },
      ],
    },
  ])
  for (const reverse of [false, true]) {
    const positions = Array.from(
      Editor.positions(editor, { at: [], unit: 'word', reverse })
    )
    for (let index = 1; index < positions.length; index++) {
      assert.deepStrictEqual(
        (reverse ? Editor.before : Editor.after)(editor, positions[index - 1], {
          unit: 'word',
        }),
        positions[index]
      )
    }
  }
})

for (const precedingBlock of [false, true]) {
  for (const backward of [false, true]) {
    it(`fragment replacement pads a leading inline with preceding block ${precedingBlock} and backward range ${backward}`, () => {
      const prefix = precedingBlock ? [{ children: [{ text: 'keep' }] }] : []
      const index = prefix.length
      const editor = create([
        ...prefix,
        { children: [{ text: 'a' }] },
        {
          children: [
            { inline: true, children: [{ text: 'aa', data: [] }] },
            { text: 'a' },
          ],
        },
        { type: 'container', children: [] },
      ])
      const start = { path: [index, 0], offset: 0 }
      const end = { path: [index + 1, 1, 0], offset: 1 }
      Transforms.insertFragment(
        editor,
        [
          { children: [{ text: 'x' }] },
          { children: [{ text: 'x', bold: true }] },
        ],
        {
          at: backward
            ? { anchor: end, focus: start }
            : { anchor: start, focus: end },
          voids: true,
        }
      )
      assert.strictEqual(
        Editor.string(editor, [], { voids: true }),
        `${precedingBlock ? 'keep' : ''}xxaa`
      )
      if (precedingBlock) assert.deepStrictEqual(editor.children[0], prefix[0])
    })
  }
}

it('fragment replacement resolves an inline edge before trailing containers normalize', () => {
  const editor = create([
    { type: 'paragraph', children: [{ text: 'a' }] },
    {
      type: 'paragraph',
      children: [{ inline: true, children: [{ text: 'a', data: [] }] }],
    },
    {
      type: 'container',
      children: [
        {
          type: 'container',
          children: [
            { type: 'container', children: [] },
            {
              type: 'paragraph',
              children: [{ inline: true, children: [{ text: 'aaa' }] }],
            },
          ],
        },
      ],
    },
  ])
  Transforms.insertFragment(
    editor,
    [{ children: [{ text: 'x' }] }, { children: [{ text: 'x', bold: true }] }],
    {
      at: {
        anchor: { path: [1, 1, 0], offset: 0 },
        focus: { path: [2, 0, 1, 1, 0], offset: 1 },
      },
      voids: true,
    }
  )
  assert.strictEqual(Editor.string(editor, [], { voids: true }), 'axxaa')
})
