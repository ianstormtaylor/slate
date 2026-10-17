import {
  Descendant,
  Editor,
  Element,
  Node,
  Path,
  Operation,
  Text,
} from '../interfaces'
import { NodeTransforms } from '../interfaces/transforms/node'
import { NON_SETTABLE_NODE_PROPERTIES } from '../interfaces/transforms/general'
import { isDeepEqual } from '../utils/deep-equal'
import { batchDirtyPaths } from '../core/batch-dirty-paths'
import { updateDirtyPaths } from '../core/update-dirty-paths'
import { DIRTY_PATHS } from '../utils/weak-maps'

type Position = {
  node: Node
  parent?: Position
  children?: Position[]
}

const isSameNode = (a: Descendant, b: Descendant) =>
  a === b || isDeepEqual(a, b)

const edges = (before: Descendant[], after: Descendant[]) => {
  let start = 0
  let suffix = 0
  while (
    start < before.length &&
    start < after.length &&
    isSameNode(before[start], after[start])
  )
    start++
  while (
    suffix < before.length - start &&
    suffix < after.length - start &&
    isSameNode(
      before[before.length - 1 - suffix],
      after[after.length - 1 - suffix]
    )
  )
    suffix++
  return { start, suffix }
}

export const setChildren: NodeTransforms['setChildren'] = (
  editor,
  children
) => {
  if (children === editor.children) return
  const root: Position = { node: editor }
  const positions = (parent: Position): Position[] => {
    if (!parent.children) {
      parent.children = Text.isText(parent.node)
        ? []
        : parent.node.children.map(node => ({ node, parent }))
    }
    return parent.children
  }
  const positionAt = (path: Path): Position | undefined => {
    let position: Position | undefined = root
    for (const index of path) {
      position = position && positions(position)[index]
    }
    return position
  }
  const pathOf = (position: Position): Path | null => {
    const path: Path = []
    while (position !== root) {
      const parent = position.parent
      if (!parent) return null
      path.push(positions(parent).indexOf(position))
      position = parent
    }
    return path.reverse()
  }
  const sources = new Map<Descendant, Position>()
  const wanted = new Set<Descendant>()
  const candidates = new Set<Position>()
  const cleanups: { parent: Position; length: number; suffix: number }[] = []
  const dirty = new Set<Position>()
  for (const path of DIRTY_PATHS.get(editor) ?? []) {
    const position = positionAt(path)
    if (position) dirty.add(position)
  }
  const apply = (op: Exclude<Operation, { type: 'set_selection' }>) => {
    const paths = editor.getDirtyPaths(op)
    const position = positionAt(op.path)
    const parent = op.path.length ? positionAt(Path.parent(op.path)) : root
    const destination =
      op.type === 'move_node' ? positionAt(Path.parent(op.newPath)) : undefined
    if (parent) positions(parent)
    if (destination) positions(destination)
    editor.apply(op)
    if (op.type === 'insert_node') {
      positions(parent!).splice(op.path[op.path.length - 1], 0, {
        node: op.node,
        parent,
      })
    } else if (op.type === 'remove_node') {
      positions(parent!).splice(op.path[op.path.length - 1], 1)
      position!.parent = undefined
    } else if (op.type === 'move_node') {
      const path = Path.transform(op.path, op)!
      positions(parent!).splice(op.path[op.path.length - 1], 1)
      positions(destination!).splice(path[path.length - 1], 0, position!)
      position!.parent = destination
    }
    for (const path of paths) {
      const position = positionAt(path)
      if (position) dirty.add(position)
    }
  }
  const rememberTree = (position: Position) => {
    candidates.add(position)
    for (const child of positions(position)) rememberTree(child)
  }
  const wantTree = (node: Descendant) => {
    for (const [child] of Node.nodes(node)) {
      if (!Editor.isEditor(child)) wanted.add(child)
    }
  }
  const prepare = (
    parent: Position,
    before: Descendant[],
    after: Descendant[]
  ) => {
    const { start, suffix } = edges(before, after)
    const end = Math.max(before.length, after.length) - suffix
    for (let i = start; i < end; i++) {
      const old = i < before.length - suffix ? before[i] : undefined
      const next = i < after.length - suffix ? after[i] : undefined
      const position = old && positions(parent)[i]
      if (position) candidates.add(position)
      if (next) wanted.add(next)
      if (Element.isElement(old) && Element.isElement(next)) {
        prepare(position!, old.children, next.children)
      } else {
        if (position) rememberTree(position)
        if (next) wantTree(next)
      }
    }
  }
  const consume = (node: Descendant) => {
    for (const [child] of Node.nodes(node)) {
      if (!Editor.isEditor(child)) sources.delete(child)
    }
  }
  const containsSource = (node: Descendant) => {
    for (const [child] of Node.nodes(node)) {
      if (!Editor.isEditor(child) && wanted.has(child) && sources.has(child))
        return true
    }
    return false
  }
  const setProperties = (before: Descendant, after: Descendant, path: Path) => {
    const old = new Map(Object.entries(Node.extractProps(before)))
    const next = new Map(Object.entries(Node.extractProps(after)))
    const changed = [...new Set([...old.keys(), ...next.keys()])].filter(
      key =>
        !NON_SETTABLE_NODE_PROPERTIES.includes(key) &&
        !isDeepEqual(old.get(key), next.get(key))
    )
    if (changed.length)
      apply({
        type: 'set_node',
        path,
        properties: Object.fromEntries(changed.map(key => [key, old.get(key)])),
        newProperties: Object.fromEntries(
          changed.map(key => [key, next.get(key)])
        ),
      })
  }
  const reconcile = (parent: Position, after: Descendant[]) => {
    const before = Node.ancestor(editor, pathOf(parent)!).children
    const { start, suffix } = edges(before, after)
    if (start === before.length && start === after.length) return
    if (before.length > after.length || sources.size > 0)
      cleanups.push({ parent, length: after.length, suffix })
    for (let i = start; i < after.length - suffix; i++) {
      let path = pathOf(parent)!.concat(i)
      const next = after[i]
      const source = sources.get(next)
      const sourcePath = source && pathOf(source)
      if (sourcePath) {
        if (!Path.equals(sourcePath, path))
          apply({
            type: 'move_node',
            path: sourcePath,
            newPath: path,
          })
        consume(next)
        continue
      }
      const siblings = Node.ancestor(editor, pathOf(parent)!).children
      const current = i < siblings.length - suffix ? siblings[i] : undefined
      if (current === next) {
        consume(next)
        continue
      }
      const reserved = current && wanted.has(current) && sources.has(current)
      const sameKind =
        current &&
        Text.isText(current) === Text.isText(next) &&
        NON_SETTABLE_NODE_PROPERTIES.every(
          key =>
            key === 'text' ||
            key === 'children' ||
            isDeepEqual(
              Object.getOwnPropertyDescriptor(current, key)?.value,
              Object.getOwnPropertyDescriptor(next, key)?.value
            )
        )
      if (current && !reserved && sameKind) {
        if (isDeepEqual(current, next)) continue
        setProperties(current, next, path)
        if (Text.isText(current) && Text.isText(next)) {
          let prefix = 0
          let end = 0
          while (
            prefix < current.text.length &&
            prefix < next.text.length &&
            current.text[prefix] === next.text[prefix]
          )
            prefix++
          while (
            end < current.text.length - prefix &&
            end < next.text.length - prefix &&
            current.text[current.text.length - 1 - end] ===
              next.text[next.text.length - 1 - end]
          )
            end++
          const removed = current.text.slice(prefix, current.text.length - end)
          const inserted = next.text.slice(prefix, next.text.length - end)
          if (removed)
            apply({
              type: 'remove_text',
              path,
              offset: prefix,
              text: removed,
            })
          if (inserted)
            apply({
              type: 'insert_text',
              path,
              offset: prefix,
              text: inserted,
            })
        } else if (Element.isElement(next))
          reconcile(positionAt(path)!, next.children)
      } else {
        if (current && !containsSource(current))
          apply({ type: 'remove_node', path, node: current })
        path = pathOf(parent)!.concat(i)
        const split = Element.isElement(next) && containsSource(next)
        apply({
          type: 'insert_node',
          path,
          node: split ? { ...next, children: [] } : next,
        })
        if (split && Element.isElement(next))
          reconcile(positionAt(path)!, next.children)
      }
    }
  }
  prepare(root, editor.children, children)
  for (const position of candidates) {
    if (!Editor.isEditor(position.node) && wanted.has(position.node)) {
      sources.set(position.node, position)
    }
  }
  Editor.withoutNormalizing(editor, () => {
    batchDirtyPaths(
      editor,
      () => {
        reconcile(root, children)
        for (const { parent, length, suffix } of cleanups.reverse()) {
          const path = pathOf(parent)!
          while (Node.ancestor(editor, path).children.length > length) {
            const at = path.concat(length - suffix)
            apply({
              type: 'remove_node',
              path: at,
              node: Node.descendant(editor, at),
            })
          }
        }
      },
      () => {
        const paths = new Map<Position, Path>()
        const visit = (position: Position, path: Path) => {
          paths.set(position, path)
          position.children?.forEach((child, index) =>
            visit(child, path.concat(index))
          )
        }
        visit(root, [])
        const final: Path[] = []
        for (const position of dirty) {
          const path = paths.get(position)
          if (path) final.push(path)
        }
        updateDirtyPaths(editor, final, () => null)
      }
    )
  })
}
