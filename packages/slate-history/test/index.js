import assert from 'assert'
import { fixtures } from '../../../support/fixtures'
import { createHyperscript } from 'slate-hyperscript'
import { History, withHistory } from '..'

describe('slate-history', () => {
  fixtures(__dirname, 'undo', ({ module }) => {
    const { input, run, output } = module
    const editor = withTest(withHistory(input))
    run(editor)
    editor.undo()
    assert.deepEqual(editor.children, output.children)
    assert.deepEqual(editor.selection, output.selection)
  })

  fixtures(__dirname, 'isHistory', ({ module }) => {
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

const withTest = editor => {
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
