import assert from 'assert'
import { fixtures } from '../../../support/fixtures'
import { Editor } from 'slate'
import { createHyperscript } from 'slate-hyperscript'

describe('slate', () => {
  fixtures(__dirname, 'interfaces', ({ module }) => {
    const { input, test, output } = module
    const result = test(input)
    assert.deepEqual(result, output)
  })

  fixtures(__dirname, 'operations', ({ module }) => {
    const { input, operations, output } = module
    const editor = withTest(input)

    Editor.withoutNormalizing(editor, () => {
      for (const op of operations) {
        editor.apply(op)
      }
    })

    assert.deepEqual(editor.children, output.children)
  })

  fixtures(__dirname, 'normalization', ({ module }) => {
    const { input, output } = module
    const editor = withTest(input)
    Editor.normalize(editor, { force: true })
    assert.deepEqual(editor.children, output.children)
  })

  fixtures(__dirname, 'queries', ({ module }) => {
    const { input, run, output } = module
    const editor = withTest(input)
    const result = run(editor)
    assert.deepEqual(result, output)
  })

  fixtures(__dirname, 'transforms', ({ module }) => {
    const { input, run, output } = module
    const editor = withTest(input)
    run(editor)
    assert.deepEqual(editor.children, output.children)
  })
})

const withTest = editor => {
  const { isInline, isVoid } = editor

  editor.isInline = element => {
    return element.inline === true ? true : isInline(element)
  }

  editor.isVoid = node => {
    return node.void === true ? true : isVoid(node)
  }

  return editor
}

export const jsx = createHyperscript({
  elements: {
    block: {},
    inline: { inline: true },
  },
})
