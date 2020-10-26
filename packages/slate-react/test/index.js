import { fixtures } from '../../../support/fixtures'
import { Editor } from 'slate'

describe('slate-react', () => {
  fixtures(__dirname, 'selection', ({ module }) => {
    let { input, test, output } = module
    if (Editor.isEditor(input)) {
      input = withTest(input)
    }
    const result = test(input)
    expect(result).toEqual(output)
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
