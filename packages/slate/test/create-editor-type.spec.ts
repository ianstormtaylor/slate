import assert from 'assert'
import { BaseEditor, createEditor } from 'slate'

interface CountedEditor extends BaseEditor {
  count: number
}

const withCount = <E extends BaseEditor>(editor: E) =>
  Object.assign(editor, { count: 0 }) as E & CountedEditor

type IsCounted<E> = E extends CountedEditor ? true : false

const requireCount = <E extends CountedEditor>(editor: E) => editor.count

describe('createEditor type parameter', () => {
  it('lets a plugin chain start from BaseEditor', () => {
    assert.equal(requireCount(withCount(createEditor<BaseEditor>())), 0)
  })

  it('types the editor as BaseEditor without the plugin', () => {
    const counted: IsCounted<ReturnType<typeof createEditor<BaseEditor>>> =
      false
    assert.equal(counted, false)
  })
})
