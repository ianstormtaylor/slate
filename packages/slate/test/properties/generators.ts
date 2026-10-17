import * as fc from 'fast-check'
import {
  Ancestor,
  createEditor,
  Descendant,
  Editor,
  Element,
  Node,
  NodeEntry,
  Operation,
  Path,
  Point,
  Range,
  Text,
} from 'slate'

export const shortText = fc
  .array(fc.constantFrom('a', 'b', ' ', 'é', '😀', 'e\u0301'), { maxLength: 4 })
  .map(parts => parts.join(''))

const data = fc.oneof(
  fc.boolean(),
  fc.integer({ min: -3, max: 3 }),
  shortText,
  fc.array(fc.integer({ min: -3, max: 3 }), { maxLength: 3 }),
  fc.record({ label: shortText, enabled: fc.boolean() })
)

export const text = fc.record(
  {
    text: shortText,
    bold: fc.constant<true>(true),
    italic: fc.constant<true>(true),
    id: shortText,
    data,
  },
  { requiredKeys: ['text'] }
)

const inline: fc.Arbitrary<Element> = fc
  .record({ children: fc.array(text, { maxLength: 3 }), void: fc.boolean() })
  .map(({ children, void: isVoid }) => ({
    inline: true,
    ...(isVoid ? { void: true as const } : {}),
    children,
  }))

const paragraph: fc.Arbitrary<Element> = fc
  .array(fc.oneof(text, inline), { maxLength: 4 })
  .map(children => ({ type: 'paragraph', children }))

const block: fc.Arbitrary<Element> = fc.oneof(
  paragraph,
  fc.array(paragraph, { maxLength: 3 }).map(children => ({
    type: 'container',
    children,
  })),
  text.map(child => ({ void: true as const, children: [child] }))
)

const deepBlock = (depth: number): fc.Arbitrary<Element> =>
  depth === 0
    ? paragraph
    : fc.oneof(
        paragraph,
        fc
          .array(deepBlock(depth - 1), { maxLength: 3 })
          .map(children => ({ type: 'container', children })),
        text.map(child => ({ void: true as const, children: [child] }))
      )

const generatedBlock = process.env.SLATE_FUZZ ? deepBlock(3) : block
const rootLimit = process.env.SLATE_FUZZ ? 6 : 4

export const rawDocument: fc.Arbitrary<Descendant[]> = fc.array(
  fc.oneof(text, inline, generatedBlock),
  { maxLength: rootLimit }
)

export const document = fc
  .tuple(
    text,
    fc.array(generatedBlock, { minLength: 1, maxLength: rootLimit - 1 })
  )
  .map(([first, rest]) => [
    { type: 'paragraph', children: [{ ...first, text: `a${first.text}` }] },
    ...rest,
  ])

export const create = (children: Descendant[], normalize = true) => {
  const editor = createEditor()
  editor.isInline = element => element.inline === true
  editor.isVoid = element => element.void === true
  editor.children = structuredClone(children)
  if (normalize) Editor.normalize(editor, { force: true })
  editor.operations = []
  return editor
}

export const points = (editor: Editor): Point[] =>
  Array.from(Node.texts(editor)).flatMap(([node, path]) =>
    Array.from({ length: node.text.length + 1 }, (_, offset) => ({
      path,
      offset,
    }))
  )

export const pick = <T>(values: T[], index: number): T =>
  values[index % values.length]

export const kinds = [
  'insert_node',
  'remove_node',
  'move_node',
  'merge_node',
  'split_node',
  'insert_text',
  'remove_text',
  'set_node',
  'set_selection',
] as const

export type Command = {
  kind: (typeof kinds)[number]
  index: number
  position: number
  text: string
}

export const command: fc.Arbitrary<Command> = fc.record({
  kind: fc.constantFrom(...kinds),
  index: fc.nat({ max: 1000 }),
  position: fc.nat({ max: 1000 }),
  text: shortText.map(value => `x${value}`),
})

export const operationFor = (
  editor: Editor,
  input: Command
): Operation | undefined => {
  const { kind, index, position, text: content } = input
  const entries = Array.from(Node.descendants(editor))
  const leaves = Array.from(Node.texts(editor))
  const parents: NodeEntry<Ancestor>[] = [[editor, []]]
  for (const [node, path] of entries) {
    if (Element.isElement(node)) parents.push([node, path])
  }
  const locations = parents.flatMap(([parent, path]) =>
    Array.from({ length: parent.children.length + 1 }, (_, i) => path.concat(i))
  )

  switch (kind) {
    case 'insert_node': {
      const path = pick(locations, index)
      const parent = Node.parent(editor, path)
      const node =
        Editor.isEditor(parent) || !Editor.hasInlines(editor, parent)
          ? { type: 'paragraph', children: [{ text: content }] }
          : { text: content }
      return { type: kind, path, node }
    }
    case 'remove_node': {
      if (!entries.length) return
      const [node, path] = pick(entries, index)
      return { type: kind, path, node: structuredClone(node) }
    }
    case 'move_node': {
      if (!entries.length) return
      const [, path] = pick(entries, index)
      const destinations = locations.filter(destination => {
        if (Path.isAncestor(path, destination)) return false
        if (!Path.isSibling(path, destination)) return true
        const parent = Node.parent(editor, path)
        return destination[destination.length - 1] < parent.children.length
      })
      return { type: kind, path, newPath: pick(destinations, position) }
    }
    case 'split_node': {
      if (!entries.length) return
      const [node, path] = pick(entries, index)
      const length = Text.isText(node) ? node.text.length : node.children.length
      return {
        type: kind,
        path,
        position: position % (length + 1),
        properties: Node.extractProps(node),
      }
    }
    case 'merge_node': {
      const candidates = entries.filter(([node, path]) => {
        const last = path[path.length - 1]
        if (last === 0) return false
        const previous = Node.get(editor, Path.previous(path))
        return Text.isText(node) === Text.isText(previous)
      })
      if (!candidates.length) return
      const [node, path] = pick(candidates, index)
      const previous = Node.get(editor, Path.previous(path))
      return {
        type: kind,
        path,
        position: Text.isText(previous)
          ? previous.text.length
          : previous.children.length,
        properties: Node.extractProps(node),
      }
    }
    case 'insert_text': {
      if (!leaves.length) return
      const [node, path] = pick(leaves, index)
      return {
        type: kind,
        path,
        offset: position % (node.text.length + 1),
        text: content,
      }
    }
    case 'remove_text': {
      const candidates = leaves.filter(([node]) => node.text.length > 0)
      if (!candidates.length) return
      const [node, path] = pick(candidates, index)
      const offset = position % node.text.length
      const length = 1 + (index % (node.text.length - offset))
      return {
        type: kind,
        path,
        offset,
        text: node.text.slice(offset, offset + length),
      }
    }
    case 'set_node': {
      if (!entries.length) return
      const [node, path] = pick(entries, index)
      return {
        type: kind,
        path,
        properties: node.id === undefined ? {} : { id: node.id },
        newProperties: position % 2 ? { id: content } : {},
      }
    }
    case 'set_selection': {
      const available = points(editor)
      if (!available.length) return
      const next = {
        anchor: pick(available, index),
        focus: pick(available, position),
      }
      if (!editor.selection) {
        return { type: kind, properties: null, newProperties: next }
      }
      return position % 2
        ? { type: kind, properties: editor.selection, newProperties: null }
        : { type: kind, properties: editor.selection, newProperties: next }
    }
  }
}

export const survives = (point: Point, operation: Operation) => {
  if (operation.type === 'remove_node') {
    return (
      !Path.equals(operation.path, point.path) &&
      !Path.isAncestor(operation.path, point.path)
    )
  }
  if (
    operation.type === 'remove_text' &&
    Path.equals(point.path, operation.path)
  ) {
    return (
      point.offset < operation.offset ||
      point.offset > operation.offset + operation.text.length
    )
  }
  if (
    operation.type === 'merge_node' &&
    Path.equals(point.path, operation.path) &&
    point.offset === 0
  ) {
    return false
  }
  if (
    operation.type === 'merge_node' &&
    Path.equals(point.path, Path.previous(operation.path))
  ) {
    return point.offset !== operation.position
  }
  return true
}

export const rangeFrom = (
  available: Point[],
  index: number,
  position: number
): Range => ({
  anchor: pick(available, index),
  focus: pick(available, position),
})
