import { debounce } from 'lodash'
import { createEditor, Node } from 'slate'
import { IS_NODE_MAP_DIRTY } from 'slate-dom'
import { ReactEditor, withReact } from '../src'
import { createAndroidInputManager } from '../src/hooks/android-input-manager/android-input-manager'

const setup = (...texts: string[]) => {
  const editor = withReact(createEditor())
  editor.children = texts.map(text => ({ children: [{ text }] }))
  const last = texts.length - 1
  const caret = { path: [last, 0], offset: texts[last].length }
  editor.selection = { anchor: caret, focus: caret }
  editor.onChange = jest.fn()
  IS_NODE_MAP_DIRTY.set(editor, false)

  const outside = document.createElement('p')
  const outsideRange = document.createRange()
  outsideRange.setStart(outside, 0)

  jest.spyOn(ReactEditor, 'getWindow').mockReturnValue(window)
  jest
    .spyOn(ReactEditor, 'hasDOMNode')
    .mockImplementation((_, node) => node !== outside)
  jest
    .spyOn(ReactEditor, 'toSlateRange')
    .mockImplementation((_, range) =>
      range === outsideRange ? null : { anchor: caret, focus: caret }
    )

  const manager = createAndroidInputManager({
    editor,
    scheduleOnDOMSelectionChange: debounce(() => {}, 0),
    onDOMSelectionChange: debounce(() => {}, 0),
  })

  const insertOutside = (data: string) => {
    const event = new InputEvent('beforeinput', {
      inputType: 'insertText',
      data,
      cancelable: true,
    })
    Object.defineProperty(event, 'getTargetRanges', {
      value: () => [outsideRange],
    })
    manager.handleDOMBeforeInput(event)
    return event
  }

  const blocks = () => editor.children.map(block => Node.string(block))

  return { editor, insertOutside, blocks }
}

describe('a keyboard replacement whose target range is outside the editor', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  test('replaces the word before the caret', async () => {
    const { editor, insertOutside } = setup('This is rathe')

    const event = insertOutside('rather ')
    await jest.advanceTimersByTimeAsync(500)

    expect(event.defaultPrevented).toBe(true)
    expect(Node.string(editor)).toBe('This is rather ')
  })

  test('inserts at the caret when the replacement starts with another letter', async () => {
    const { editor, insertOutside } = setup('This is rathe')

    insertOutside('xyz ')
    await jest.advanceTimersByTimeAsync(500)

    expect(Node.string(editor)).toBe('This is rathexyz ')
  })

  test('inserts at the caret after a space', async () => {
    const { editor, insertOutside } = setup('This is ')

    insertOutside('is ')
    await jest.advanceTimersByTimeAsync(500)

    expect(Node.string(editor)).toBe('This is is ')
  })

  test('inserts at the caret at the start of a block', async () => {
    const { insertOutside, blocks } = setup('like', '')

    insertOutside('likes ')
    await jest.advanceTimersByTimeAsync(500)

    expect(blocks()).toEqual(['like', 'likes '])
  })

  test('inserts at the caret at the start of the document', async () => {
    const { editor, insertOutside } = setup('')

    insertOutside('a ')
    await jest.advanceTimersByTimeAsync(500)

    expect(Node.string(editor)).toBe('a ')
  })

  test('inserts a lone space at the caret', async () => {
    const { editor, insertOutside } = setup('This is rathe')

    insertOutside(' ')
    await jest.advanceTimersByTimeAsync(500)

    expect(Node.string(editor)).toBe('This is rathe ')
  })

  test('leaves the text alone for an empty insert', async () => {
    const { editor, insertOutside } = setup('This is rathe')

    insertOutside('')
    await jest.advanceTimersByTimeAsync(500)

    expect(Node.string(editor)).toBe('This is rathe')
  })
})
