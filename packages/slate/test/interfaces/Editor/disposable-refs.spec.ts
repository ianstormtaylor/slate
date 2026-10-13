import assert from 'assert'
import { readFileSync } from 'fs'
import { runInNewContext } from 'vm'
import { createEditor, Editor, Transforms } from 'slate'

describe('disposable location refs', () => {
  for (const kind of ['path', 'point', 'range'] as const) {
    const makeRef = (editor: Editor) => {
      const point = { path: [0, 0], offset: 1 }
      return kind === 'path'
        ? Editor.pathRef(editor, point.path)
        : kind === 'point'
        ? Editor.pointRef(editor, point)
        : Editor.rangeRef(editor, { anchor: point, focus: point })
    }
    const refs = (editor: Editor) =>
      kind === 'path'
        ? Editor.pathRefs(editor)
        : kind === 'point'
        ? Editor.pointRefs(editor)
        : Editor.rangeRefs(editor)

    it(`disposes a tracked ${kind} ref and leaves other refs active`, () => {
      const editor = createEditor()
      editor.children = [{ children: [{ text: 'text' }] }]
      const ref = makeRef(editor)
      const other = makeRef(editor)
      Transforms.insertNodes(
        editor,
        { children: [{ text: 'before' }] },
        { at: [0] }
      )
      assert.strictEqual(refs(editor).size, 2)
      assert.strictEqual(ref[Symbol.dispose](), undefined)
      assert.strictEqual(ref.current, null)
      assert.strictEqual(refs(editor).size, 1)
      ref[Symbol.dispose]()
      assert.strictEqual(ref.unref(), null)
      other.unref()
      assert.strictEqual(refs(editor).size, 0)
    })

    it(`allows disposal after explicit and automatic ${kind} release`, () => {
      const editor = createEditor()
      editor.children = [{ children: [{ text: 'text' }] }]
      const manual = makeRef(editor)
      const removed = makeRef(editor)
      assert.notStrictEqual(manual.unref(), null)
      manual[Symbol.dispose]()
      Transforms.removeNodes(editor, { at: [0] })
      assert.strictEqual(removed.current, null)
      removed[Symbol.dispose]()
      assert.strictEqual(refs(editor).size, 0)
    })
  }
})

describe('refs without native Symbol.dispose', () => {
  it('keeps unref working and uses the fallback symbol without changing globals', () => {
    const symbol = (description?: string) => Symbol(description)
    for (const key of Reflect.ownKeys(Symbol)) {
      if (key !== 'dispose') {
        Object.defineProperty(
          symbol,
          key,
          Object.getOwnPropertyDescriptor(Symbol, key)!
        )
      }
    }
    const slate = runInNewContext(
      `${readFileSync(require.resolve('slate'), 'utf8')}; exports`,
      { exports: {}, require, Symbol: symbol }
    ) as typeof import('slate')
    const editor = slate.createEditor()
    editor.children = [{ children: [{ text: 'text' }] }]
    const point = { path: [0, 0], offset: 1 }
    const range = { anchor: point, focus: point }
    for (const ref of [
      slate.Editor.pathRef(editor, point.path),
      slate.Editor.pointRef(editor, point),
      slate.Editor.rangeRef(editor, range),
    ]) {
      assert(!Object.hasOwn(ref, 'undefined'))
      const dispose = Reflect.get(ref, Symbol.for('Symbol.dispose'))
      assert.strictEqual(typeof dispose, 'function')
      dispose()
      assert.strictEqual(ref.current, null)
      assert.strictEqual(ref.unref(), null)
    }
    assert.strictEqual(slate.Editor.pathRefs(editor).size, 0)
    assert.strictEqual(slate.Editor.pointRefs(editor).size, 0)
    assert.strictEqual(slate.Editor.rangeRefs(editor).size, 0)
    assert.strictEqual(Reflect.get(symbol, 'dispose'), undefined)
    Object.defineProperty(symbol, 'dispose', { value: Symbol.dispose })
    const late = slate.Editor.pathRef(editor, [0, 0])
    late[Symbol.dispose]()
    assert.strictEqual(late.current, null)
  })
})
