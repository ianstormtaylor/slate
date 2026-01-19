import assert from 'assert'
import { fixtures } from '../../../support/fixtures'
import { createHyperscript } from 'slate-hyperscript'
import { History, HistoryEditor, withHistory } from '..'
import { BaseEditor, Editor } from 'slate'

declare module 'slate' {
  interface CustomTypes {
    // Editor is already defined in /support/types, but it will include this type
    PackageSpecificEditorForTests: HistoryEditor
  }
}

describe('slate-history', () => {
  fixtures<{
    input: BaseEditor
    run: (input: Editor) => void
    output: Pick<Editor, 'children' | 'selection'>
  }>(__dirname, 'undo', ({ module }) => {
    const { input, run, output } = module
    const editor = withTest(withHistory(input))
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
    const editor = withTest(withHistory(input))
    run(editor)
    const result = History.isHistory(editor.history)
    assert.strictEqual(result, output)
  })
})

export const jsx = createHyperscript({
  elements: {
    block: {},
    inline: { inline: true },
  },
})

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
