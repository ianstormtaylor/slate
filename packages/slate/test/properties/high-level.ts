import assert from 'assert'
import * as fc from 'fast-check'
import { Editor, Element, Node, Path, Range, Transforms } from 'slate'
import { command, Command, pick, points, rangeFrom } from './generators'
import { assertNormalized, assertValidSelection } from './checks'

export const transformNames = [
  'delete',
  'insertText',
  'insertFragment',
  'insertNodes',
  'splitNodes',
  'mergeNodes',
  'wrapInline',
  'unwrapInline',
  'wrapBlock',
  'unwrapBlock',
  'liftNodes',
  'moveNodes',
  'setNodes',
  'unsetNodes',
  'removeNodes',
] as const

export const highLevelCommand = fc.record({
  name: fc.constantFrom(...transformNames),
  input: command,
})

const units = ['character', 'word', 'line', 'block'] as const

const surrounding = (editor: Editor, range: Range) => {
  const [start, end] = Range.edges(range)
  return {
    prefix: Editor.string(
      editor,
      { anchor: Editor.start(editor, []), focus: start },
      { voids: true }
    ),
    suffix: Editor.string(
      editor,
      { anchor: end, focus: Editor.end(editor, []) },
      { voids: true }
    ),
  }
}

export const runTransform = (
  editor: Editor,
  name: (typeof transformNames)[number],
  input: Command
) => {
  if (!editor.children.length) {
    Transforms.insertNodes(
      editor,
      { type: 'paragraph', children: [{ text: input.text }] },
      { at: [0] }
    )
    assert.strictEqual(Node.string(editor), input.text)
    assertNormalized(editor)
    assertValidSelection(editor)
    return
  }
  const available = points(editor)
  const point = pick(available, input.index)
  const range = rangeFrom(available, input.index, input.position)
  const before = Node.string(editor)
  let expected = before
  switch (name) {
    case 'delete': {
      const unit = pick([...units], input.index)
      const distance = 1 + (input.position % 3)
      const reverse = input.position % 2 === 0
      if (input.index % 2 && Range.isExpanded(range)) {
        const { prefix, suffix } = surrounding(editor, range)
        Transforms.delete(editor, {
          at: range,
          hanging: true,
          voids: true,
          unit,
          distance,
          reverse,
        })
        expected = prefix + suffix
      } else {
        const target =
          (reverse ? Editor.before : Editor.after)(editor, point, {
            unit,
            distance,
          }) || (reverse ? Editor.start : Editor.end)(editor, [])
        const low = Math.max(0, Math.min(point.path[0], target.path[0]) - 1)
        const high = Math.min(
          editor.children.length - 1,
          Math.max(point.path[0], target.path[0]) + 1
        )
        const prefix = editor.children.slice(0, low).map(Node.string).join('')
        const suffix = editor.children
          .slice(high + 1)
          .map(Node.string)
          .join('')
        Transforms.delete(editor, {
          at: point,
          unit,
          distance,
          reverse,
          voids: true,
        })
        const after = Node.string(editor)
        assert(after.startsWith(prefix) && after.endsWith(suffix))
        assert(after.length >= prefix.length + suffix.length)
        expected = after
      }
      break
    }
    case 'insertText': {
      const at = input.index % 2 ? range : { anchor: point, focus: point }
      const { prefix, suffix } = surrounding(editor, at)
      Transforms.insertText(editor, input.text, { at, voids: true })
      expected = prefix + input.text + suffix
      break
    }
    case 'insertFragment': {
      const at = input.index % 2 ? range : { anchor: point, focus: point }
      const { prefix, suffix } = surrounding(editor, at)
      Transforms.insertFragment(
        editor,
        [
          { type: 'paragraph', children: [{ text: input.text }] },
          { type: 'paragraph', children: [{ text: input.text, bold: true }] },
        ],
        { at, voids: true }
      )
      expected = prefix + input.text + input.text + suffix
      break
    }
    case 'insertNodes': {
      if (input.position % 2) {
        const at = input.index % (editor.children.length + 1)
        expected =
          editor.children.slice(0, at).map(Node.string).join('') +
          input.text +
          editor.children.slice(at).map(Node.string).join('')
        Transforms.insertNodes(
          editor,
          { type: 'paragraph', children: [{ text: input.text }] },
          { at: [at] }
        )
      } else {
        const { prefix, suffix } = surrounding(editor, {
          anchor: point,
          focus: point,
        })
        Transforms.insertNodes(
          editor,
          { inline: true, children: [{ text: input.text }] },
          { at: point, voids: true }
        )
        expected = prefix + input.text + suffix
      }
      break
    }
    case 'splitNodes':
      Transforms.splitNodes(editor, { at: point, always: true, voids: true })
      break
    case 'mergeNodes': {
      const compatible = editor.children.flatMap((node, index) => {
        const previous = editor.children[index - 1]
        return index > 0 &&
          Element.isElement(node) &&
          Element.isElement(previous) &&
          Editor.hasInlines(editor, node) ===
            Editor.hasInlines(editor, previous)
          ? [index]
          : []
      })
      if (compatible.length)
        Transforms.mergeNodes(editor, {
          at: [pick(compatible, input.index)],
          voids: true,
        })
      break
    }
    case 'wrapInline':
    case 'unwrapInline': {
      const [leaf, path] = Array.from(Node.texts(editor))[0]
      const start = input.index % (leaf.text.length + 1)
      const end = start + (input.position % (leaf.text.length - start + 1))
      const at = {
        anchor: { path, offset: start },
        focus: { path, offset: end },
      }
      Transforms.wrapNodes(
        editor,
        { inline: true, type: 'property-inline', children: [] },
        { at, split: true, voids: true }
      )
      assertNormalized(editor)
      if (name === 'unwrapInline')
        Transforms.unwrapNodes(editor, {
          at: [],
          match: node =>
            Element.isElement(node) && node.type === 'property-inline',
          split: true,
          voids: true,
        })
      break
    }
    case 'wrapBlock':
    case 'unwrapBlock': {
      const at = [input.index % editor.children.length]
      Transforms.wrapNodes(
        editor,
        { type: 'property-block', children: [] },
        { at, split: true, voids: true }
      )
      assertNormalized(editor)
      if (name === 'unwrapBlock')
        Transforms.unwrapNodes(editor, { at, split: true, voids: true })
      break
    }
    case 'liftNodes': {
      const index = input.index % editor.children.length
      Transforms.wrapNodes(
        editor,
        { type: 'property-parent', children: [] },
        { at: [index] }
      )
      assertNormalized(editor)
      Transforms.liftNodes(editor, { at: [index, 0], voids: true })
      break
    }
    case 'moveNodes': {
      const from = input.index % editor.children.length
      const to = input.position % editor.children.length
      const reordered = editor.children.slice()
      const [moved] = reordered.splice(from, 1)
      reordered.splice(to, 0, moved)
      expected = reordered.map(Node.string).join('')
      Transforms.moveNodes(editor, { at: [from], to: [to], voids: true })
      break
    }
    case 'setNodes':
    case 'unsetNodes': {
      const [, path] = pick(Array.from(Node.descendants(editor)), input.index)
      if (name === 'setNodes')
        Transforms.setNodes(
          editor,
          { id: input.text },
          { at: path, voids: true }
        )
      else Transforms.unsetNodes(editor, 'id', { at: path, voids: true })
      break
    }
    case 'removeNodes': {
      const [, path] = pick(Array.from(Node.descendants(editor)), input.index)
      expected = Array.from(Node.texts(editor))
        .filter(
          ([, leaf]) => !Path.equals(path, leaf) && !Path.isAncestor(path, leaf)
        )
        .map(([leaf]) => leaf.text)
        .join('')
      Transforms.removeNodes(editor, { at: path, voids: true })
      break
    }
  }
  assert.strictEqual(
    Node.string(editor),
    expected,
    `${name} changed text outside its affected content`
  )
  assertNormalized(editor)
  assertValidSelection(editor)
}
