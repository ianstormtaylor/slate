import assert from 'assert'
import { cloneDeep } from 'lodash'
import { fixtures } from '../../../support/fixtures'
import { Editor, createEditor } from 'slate'
import { createHyperscript } from 'slate-hyperscript'

describe('slate', () => {
  fixtures(__dirname, 'interfaces', ({ module }) => {
    let { input, test, output } = module
    if (Editor.isEditor(input)) {
      input = withTest(input)
    }
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
    assert.deepEqual(editor.selection, output.selection)
  })
  fixtures(__dirname, 'normalization', ({ module }) => {
    const { input, output } = module
    const editor = withTest(input)
    Editor.normalize(editor, { force: true })
    assert.deepEqual(editor.children, output.children)
    assert.deepEqual(editor.selection, output.selection)
  })
  fixtures(__dirname, 'transforms', ({ module }) => {
    const { input, run, output } = module
    const editor = withTest(input)
    run(editor)
    assert.deepEqual(editor.children, output.children)
    assert.deepEqual(editor.selection, output.selection)
  })
  fixtures(__dirname, 'utils/deep-equal', ({ module }) => {
    let { input, test, output } = module
    if (Editor.isEditor(input)) {
      input = withTest(input)
    }
    const result = test(input)
    assert.deepEqual(result, output)
  })
  // make sure with or without batchDirty, the normalize result is the same
  const testBatchDirty = ({ module }) => {
    const { input, run } = module

    const input2 = createEditor()
    input2.children = cloneDeep(input.children)
    input2.selection = cloneDeep(input.selection)

    const dirties1 = []
    const dirties2 = []

    const editor1 = withBatchTest(withTest(input), dirties1)
    const editor2 = withBatchTest(withTest(input2), dirties2)

    run(editor1, { batchDirty: true })
    run(editor2, { batchDirty: false })

    assert.equal(dirties1.join(' '), dirties2.join(' '))
  }
  fixtures(__dirname, 'transforms/insertNodes', ({ module }) => {
    testBatchDirty({ module })
  })
  fixtures(__dirname, 'transforms/insertFragment', ({ module }) => {
    testBatchDirty({ module })
  })
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
const withBatchTest = (editor, dirties) => {
  const { normalizeNode } = editor
  editor.normalizeNode = ([node, path]) => {
    dirties.push(JSON.stringify(path))
    normalizeNode([node, path])
  }
  return editor
}
export const jsx = createHyperscript({
  elements: {
    block: {},
    inline: { inline: true },
  },
})
