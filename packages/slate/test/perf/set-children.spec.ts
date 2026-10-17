import assert from 'assert'
import { performance } from 'perf_hooks'
import { createEditor, Descendant, Editor, Transforms } from 'slate'

const document = (tag: string): Descendant[] =>
  Array.from({ length: 4000 }, (_, i) => ({
    type: i % 2 ? 'paragraph' : 'heading',
    children: [{ text: `${tag}${i}` }],
  }))

for (const kind of ['edit text', 'replace blocks', 'reverse shared blocks']) {
  it(`setChildren can ${kind} across a large document without retaining path refs`, () => {
    const editor = createEditor()
    editor.children = document('a')
    const next =
      kind === 'edit text'
        ? document('b')
        : kind === 'replace blocks'
        ? document('c').reverse()
        : [...editor.children].reverse()
    const ref = Editor.pathRef(editor, [0, 0])
    const { apply } = editor
    let peakRefs = 0
    editor.apply = op => {
      peakRefs = Math.max(peakRefs, Editor.pathRefs(editor).size)
      apply(op)
    }
    const start = performance.now()
    Transforms.setChildren(editor, next)
    const elapsed = performance.now() - start
    assert.deepStrictEqual(editor.children, next)
    assert.strictEqual(peakRefs, 1)
    assert.deepStrictEqual(ref.current, [
      kind === 'reverse shared blocks' ? 3999 : 0,
      0,
    ])
    ref.unref()
    assert(elapsed < 1000, `${kind} took ${elapsed.toFixed(0)} ms`)
  })
}
