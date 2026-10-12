import { createEditor } from 'slate'
import { getCharacterMoveUnit } from '../src/utils/character-move'

const setup = (before = '', after = '', text = 'link') => {
  const editor = createEditor()
  editor.isInline = element => 'type' in element && element.type === 'link'
  const children = [
    {
      children: [
        { text: before },
        { type: 'link', children: [{ text }] },
        { text: after },
      ],
    },
  ]
  editor.children = children
  return editor
}

describe('character movement at inline boundaries', () => {
  test.each([true, false])(
    'leaves an inline for its empty sibling, reverse=%s',
    reverse => {
      const editor = setup()
      expect(
        getCharacterMoveUnit(
          editor,
          { path: [0, 1, 0], offset: reverse ? 0 : 4 },
          reverse
        )
      ).toBe('offset')
    }
  )

  test.each([true, false])(
    'keeps character movement beside nonempty text, reverse=%s',
    reverse => {
      const editor = setup('before', 'after')
      expect(
        getCharacterMoveUnit(
          editor,
          { path: [0, 1, 0], offset: reverse ? 0 : 4 },
          reverse
        )
      ).toBe('character')
    }
  )

  test.each([true, false])(
    'keeps character movement within an inline, reverse=%s',
    reverse => {
      const editor = setup('', '', 'a👩‍👩‍👧‍👦b')
      expect(
        getCharacterMoveUnit(editor, { path: [0, 1, 0], offset: 1 }, reverse)
      ).toBe('character')
    }
  )

  test.each([true, false])(
    'keeps character movement in the empty sibling, reverse=%s',
    reverse => {
      const editor = setup()
      expect(
        getCharacterMoveUnit(
          editor,
          { path: [0, reverse ? 0 : 2], offset: 0 },
          reverse
        )
      ).toBe('character')
    }
  )

  test.each(['void', 'readOnly'])('keeps movement across a %s inline', kind => {
    const editor = setup()
    if (kind === 'void')
      editor.isVoid = element => 'type' in element && element.type === 'link'
    else
      editor.isElementReadOnly = element =>
        'type' in element && element.type === 'link'
    expect(
      getCharacterMoveUnit(editor, { path: [0, 1, 0], offset: 0 }, true)
    ).toBe('character')
    expect(
      getCharacterMoveUnit(editor, { path: [0, 1, 0], offset: 4 }, false)
    ).toBe('character')
  })

  test('finds the adjacent text inside a nested block', () => {
    const editor = setup()
    editor.children = [{ children: editor.children }]
    expect(
      getCharacterMoveUnit(editor, { path: [0, 0, 1, 0], offset: 0 }, true)
    ).toBe('offset')
  })

  test('leaves the innermost inline for its empty sibling', () => {
    const editor = setup()
    const inline = {
      type: 'link',
      children: [
        { text: '' },
        { type: 'link', children: [{ text: 'link' }] },
        { text: '' },
      ],
    }
    editor.children = [{ children: [{ text: '' }, inline, { text: '' }] }]
    expect(
      getCharacterMoveUnit(editor, { path: [0, 1, 1, 0], offset: 0 }, true)
    ).toBe('offset')
  })
})
