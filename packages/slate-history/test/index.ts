import assert from 'assert'
import { fixtures } from '../../../support/fixtures'
import {
  createHyperscript,
  createEditor as createEditorCreator,
} from 'slate-hyperscript'
import { History, HistoryEditor, withHistory } from '..'
import { BaseEditor, Editor, createEditor as createBaseEditor } from 'slate'

declare module 'slate' {
  interface CustomTypes {
    // Editor is already defined in /support/types, but it will include this type
    PackageSpecificEditorForTests: HistoryEditor
  }
}

const withTest = (editor: Editor) => {
  const { isInline, isVoid, isElementReadOnly, isSelectable } = editor
  editor.isInline = element => {
    return element.inline === true ? true : isInline(element)
  }
  editor.isVoid = element => {
    return element.void === true ? true : isVoid(element)
  }
  editor.isElementReadOnly = element => {
    return element.readOnly === true ? true : isElementReadOnly(element)
  }
  editor.isSelectable = element => {
    return element.nonSelectable === true ? false : isSelectable(element)
  }
  return editor
}

export const jsx = createHyperscript({
  elements: {
    block: {},
    inline: { inline: true },
  },
  creators: {
    editor: createEditorCreator(() =>
      withTest(withHistory(createBaseEditor()))
    ),
  },
})

describe('slate-history', () => {
  fixtures<{
    input: BaseEditor
    run: (input: Editor) => void
    output: Pick<Editor, 'children' | 'selection'>
  }>(__dirname, 'undo', ({ module }) => {
    const { input, run, output } = module
    const editor = input as Editor
    run(editor)
    editor.undo()
    assert.deepEqual(editor.children, output.children)
    assert.deepEqual(editor.selection, output.selection)
  })

  fixtures<{
    input: BaseEditor
    run: (input: Editor) => void
    output: boolean
  }>(__dirname, 'isHistory', ({ module }) => {
    const { input, run, output } = module
    const editor = input as Editor
    run(editor)
    const result = History.isHistory(editor.history)
    assert.strictEqual(result, output)
  })
})
