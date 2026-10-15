import assert from 'assert'
import { Editor, Element, Node, Text } from 'slate'

export const settings = {
  seed: Number(process.env.SLATE_FUZZ_SEED || 20261014),
  numRuns: Number(
    process.env.SLATE_FUZZ_RUNS || (process.env.SLATE_FUZZ ? 5000 : 100)
  ),
  ...(process.env.SLATE_FUZZ_PATH ? { path: process.env.SLATE_FUZZ_PATH } : {}),
  includeErrorInReport: true,
}

export const marks = ({ text: content, ...properties }: Text) =>
  Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined)
  )

export const assertNormalized = (editor: Editor) => {
  for (const [parent] of Node.nodes(editor)) {
    if (Text.isText(parent)) continue
    if (parent !== editor) assert(parent.children.length > 0)
    const inlineChildren =
      Element.isElement(parent) &&
      (editor.isInline(parent) ||
        Text.isText(parent.children[0]) ||
        editor.isInline(parent.children[0]))
    parent.children.forEach((child, index) => {
      assert.strictEqual(
        Text.isText(child) || editor.isInline(child),
        inlineChildren
      )
      const previous = parent.children[index - 1]
      if (Text.isText(child) && previous && Text.isText(previous)) {
        assert.notDeepStrictEqual(marks(child), marks(previous))
        assert(child.text.length > 0 && previous.text.length > 0)
      }
      if (!Text.isText(child) && editor.isInline(child)) {
        assert(Text.isText(previous))
        assert(Text.isText(parent.children[index + 1]))
      }
    })
  }
}

export const assertValidSelection = (editor: Editor) => {
  if (!editor.selection) return
  for (const point of [editor.selection.anchor, editor.selection.focus]) {
    const node = Node.get(editor, point.path)
    assert(Text.isText(node))
    assert(
      Number.isInteger(point.offset) &&
        point.offset >= 0 &&
        point.offset <= node.text.length
    )
  }
}
