import { fixtures } from '../../../support/fixtures'
import { Editor } from 'slate'
import { createHyperscript } from 'slate-hyperscript'

describe('slate', () => {
  fixtures(__dirname, 'interfaces', ({ module }) => {
    let { input, test, output } = module
    if (Editor.isEditor(input)) {
      input = withTest(input)
    }
    const result = test(input)
    expect(result).toEqual(output)
  })
  fixtures(__dirname, 'operations', ({ module }) => {
    const { input, operations, output } = module
    const editor = withTest(input)
    Editor.withoutNormalizing(editor, () => {
      for (const op of operations) {
        editor.apply(op)
      }
    })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })
  fixtures(__dirname, 'normalization', ({ module }) => {
    const { input, output } = module
    const editor = withTest(input)
    Editor.normalize(editor, { force: true })
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })
  fixtures(__dirname, 'transforms', ({ module }) => {
    const { input, run, output } = module
    const editor = withTest(input)
    run(editor)
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })
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
export const jsx = createHyperscript({
  elements: {
    block: {},
    inline: { inline: true },
  },
})
