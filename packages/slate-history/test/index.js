import assert from 'assert'
import { fixtures } from '../../../support/fixtures'
import { createHyperscript } from 'slate-hyperscript'
import { withHistory } from '..'

describe('slate-history', () => {
  fixtures(__dirname, 'undo', ({ module }) => {
    const { input, run, output } = module
    const editor = withTest(withHistory(input))
    run(editor)
    editor.exec({ type: 'undo' })
    assert.deepEqual(editor.children, output.children)
  })
})

export const jsx = createHyperscript({
  elements: {
    block: {},
    inline: { inline: true },
  },
})

const withTest = editor => {
  const { isInline, isVoid } = editor

  editor.isInline = element => {
    return element.inline === true ? true : isInline(element)
  }

  editor.isVoid = element => {
    return element.void === true ? true : isVoid(element)
  }

  return editor
}
