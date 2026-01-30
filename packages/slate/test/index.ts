import assert from 'assert'
import { cloneDeep } from 'lodash'
import { fixtures } from '../../../support/fixtures'
import {
  Editor,
  Element,
  Operation,
  createEditor as createBaseEditor,
} from 'slate'
import {
  createHyperscript,
  createEditor as createEditorCreator,
} from 'slate-hyperscript'

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
    editor: createEditorCreator(() => withTest(createBaseEditor())),
  },
})

describe('slate', () => {
  fixtures<{
    input: unknown
    test: (input: unknown) => unknown
    output: unknown
  }>(__dirname, 'interfaces', ({ module }) => {
    const { input, test, output } = module
    const result = test(input)
    assert.deepEqual(result, output)
  })
  fixtures<{ input: Editor; operations: Operation[]; output: Editor }>(
    __dirname,
    'operations',
    ({ module }) => {
      const { input, operations, output } = module
      Editor.withoutNormalizing(input, () => {
        for (const op of operations) {
          input.apply(op)
        }
      })
      assert.deepEqual(input.children, output.children)
      assert.deepEqual(input.selection, output.selection)
    }
  )
  fixtures<{ input: Editor; withFallbackElement?: boolean; output: Editor }>(
    __dirname,
    'normalization',
    ({ module }) => {
      const { input, output, withFallbackElement } = module
      if (withFallbackElement) {
        const { normalizeNode } = input
        input.normalizeNode = (entry, options) => {
          normalizeNode(entry, {
            ...options,
            fallbackElement: () => ({}) as Element,
          })
        }
      }
      Editor.normalize(input, { force: true })
      assert.deepEqual(input.children, output.children)
      assert.deepEqual(input.selection, output.selection)
    }
  )
  fixtures<{ input: Editor; run: (input: Editor) => void; output: Editor }>(
    __dirname,
    'transforms',
    ({ module }) => {
      const { input, run, output } = module
      const editor = input
      run(editor)
      assert.deepEqual(editor.children, output.children)
      assert.deepEqual(editor.selection, output.selection)
    }
  )
  fixtures<{ input: Editor; test: (input: Editor) => void; output: Editor }>(
    __dirname,
    'utils/deep-equal',
    ({ module }) => {
      const { input, test, output } = module
      const result = test(input)
      assert.deepEqual(result, output)
    }
  )
  // make sure with or without batchDirty, the normalize result is the same

  type batchDirtyTestModule = {
    input: Editor
    run: (input: Editor, options: { batchDirty: boolean }) => void
  }
  const testBatchDirty = ({ module }: { module: batchDirtyTestModule }) => {
    const { input, run } = module

    const input2 = withTest(createBaseEditor())
    input2.children = cloneDeep(input.children)
    input2.selection = cloneDeep(input.selection)

    const dirties1: string[] = []
    const dirties2: string[] = []

    const editor1 = withBatchTest(input, dirties1)
    const editor2 = withBatchTest(input2, dirties2)

    run(editor1, { batchDirty: true })
    run(editor2, { batchDirty: false })

    assert.equal(dirties1.join(' '), dirties2.join(' '))
  }
  fixtures<batchDirtyTestModule>(
    __dirname,
    'transforms/insertNodes',
    ({ module }) => {
      testBatchDirty({ module })
    }
  )
  fixtures<batchDirtyTestModule>(
    __dirname,
    'transforms/insertFragment',
    ({ module }) => {
      testBatchDirty({ module })
    }
  )
})

const withBatchTest = (editor: Editor, dirties: string[]) => {
  const { normalizeNode } = editor
  editor.normalizeNode = ([node, path]) => {
    dirties.push(JSON.stringify(path))
    normalizeNode([node, path])
  }
  return editor
}
