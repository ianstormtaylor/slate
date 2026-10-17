import { Operation, Path, Point, Range } from 'slate'
import { History } from './history'

type Side = 'before' | 'after'

type Offset = { path: Path; offset: number }

const isChildOf = (path: Path, parent: Path) =>
  path.length === parent.length + 1 && Path.isParent(parent, path)

const mapPath = (path: Path, by: Operation): Path | null =>
  Path.transform(path, by)

const mapSlot = (path: Path, by: Operation): Path | null => {
  if (
    (by.type === 'remove_node' || by.type === 'merge_node') &&
    Path.equals(by.path, path)
  ) {
    return path
  }
  if (by.type === 'move_node' && Path.equals(by.path, path)) {
    return Path.transform(path, {
      type: 'insert_node',
      path: by.newPath,
      node: { text: '' },
    })
  }
  return mapPath(path, by)
}

const mapOffset = (
  { path, offset }: Offset,
  by: Operation,
  side: Side
): Offset | null => {
  if (by.type === 'set_selection' || by.type === 'set_node')
    return { path, offset }
  if (
    by.type === 'insert_node' ||
    by.type === 'remove_node' ||
    by.type === 'split_node' ||
    by.type === 'merge_node'
  ) {
    if (isChildOf(by.path, path)) {
      const index = by.path[by.path.length - 1]
      if (by.type === 'insert_node' || by.type === 'split_node') {
        const at = by.type === 'split_node' ? index + 1 : index
        if (at < offset || (at === offset && side === 'after')) offset++
      } else if (by.type === 'remove_node') {
        if (index < offset) offset--
      } else if (index < offset) {
        offset--
      } else if (index === offset) {
        return null
      }
      const mapped = mapPath(path, by)
      return mapped && { path: mapped, offset }
    }
  }
  if (by.type === 'move_node') {
    const from = isChildOf(by.path, path)
    const to = Path.transform(by.path, by)
    const into = to !== null && isChildOf(to, path)
    if (from || into) return null
  }
  const point = Point.transform({ path, offset }, by, {
    affinity: side === 'after' ? 'forward' : 'backward',
  })
  return point && { path: point.path, offset: point.offset }
}

const transformRemoveText = (
  op: Extract<Operation, { type: 'remove_text' }>,
  by: Operation
): Operation[] | null => {
  const end = op.offset + op.text.length
  if (by.type !== 'set_selection' && Path.equals(by.path, op.path)) {
    if (by.type === 'insert_text' && by.offset > op.offset && by.offset < end) {
      const split = by.offset - op.offset
      return [
        { ...op, text: op.text.slice(0, split) },
        {
          ...op,
          offset: op.offset + by.text.length,
          text: op.text.slice(split),
        },
      ]
    }
    if (by.type === 'remove_text') {
      const removedStart = by.offset
      const removedEnd = by.offset + by.text.length
      let text = ''
      for (let i = op.offset; i < end; i++) {
        if (i < removedStart || i >= removedEnd) text += op.text[i - op.offset]
      }
      if (!text) return []
      const offset =
        op.offset - Math.max(0, Math.min(op.offset, removedEnd) - removedStart)
      return [{ ...op, offset, text }]
    }
    if (
      by.type === 'split_node' &&
      by.position > op.offset &&
      by.position < end
    ) {
      const split = by.position - op.offset
      return [
        { ...op, text: op.text.slice(0, split) },
        {
          ...op,
          path: Path.next(op.path),
          offset: 0,
          text: op.text.slice(split),
        },
      ]
    }
  }
  const start = mapOffset({ path: op.path, offset: op.offset }, by, 'after')
  return start ? [{ ...op, path: start.path, offset: start.offset }] : []
}

const unchanged = (op: Operation, next: Operation) => {
  const a = op as Partial<Record<string, unknown>>
  const b = next as Partial<Record<string, unknown>>
  return (
    a.text === b.text &&
    a.offset === b.offset &&
    a.position === b.position &&
    (a.path === b.path || Path.equals(a.path as Path, b.path as Path)) &&
    (a.newPath === b.newPath ||
      Path.equals(a.newPath as Path, b.newPath as Path))
  )
}

export const transformOperation = (
  op: Operation,
  by: Operation,
  side: Side
): Operation[] | null => {
  const result = transform(op, by, side)
  if (result?.length === 1 && unchanged(op, result[0])) return [op]
  return result
}

const transform = (
  op: Operation,
  by: Operation,
  side: Side
): Operation[] | null => {
  switch (op.type) {
    case 'set_selection':
      return [op]
    case 'set_node':
    case 'remove_node': {
      const path = mapPath(op.path, by)
      return path ? [{ ...op, path }] : []
    }
    case 'insert_node': {
      if (
        by.type === 'insert_node' &&
        Path.equals(by.path, op.path) &&
        side === 'before'
      ) {
        return [op]
      }
      const path = mapSlot(op.path, by)
      return path ? [{ ...op, path }] : []
    }
    case 'move_node': {
      const path = mapPath(op.path, by)
      if (!path) return []
      const newPath = mapSlot(op.newPath, by)
      return newPath ? [{ ...op, path, newPath }] : null
    }
    case 'insert_text': {
      const at = mapOffset({ path: op.path, offset: op.offset }, by, side)
      return at ? [{ ...op, path: at.path, offset: at.offset }] : []
    }
    case 'remove_text':
      return transformRemoveText(op, by)
    case 'split_node': {
      if (!mapPath(op.path, by)) return []
      const at = mapOffset({ path: op.path, offset: op.position }, by, 'before')
      return at ? [{ ...op, path: at.path, position: at.offset }] : null
    }
    case 'merge_node': {
      const path = mapPath(op.path, by)
      if (!path) return null
      const previous = mapOffset(
        { path: Path.previous(op.path), offset: op.position },
        by,
        'after'
      )
      if (!previous || !Path.equals(previous.path, Path.previous(path))) {
        return null
      }
      return [{ ...op, path, position: previous.offset }]
    }
  }
}

const opposite = (side: Side): Side => (side === 'after' ? 'before' : 'after')

export const transformOperations = (
  ops: Operation[],
  by: Operation[],
  side: Side
): [Operation[], Operation[]] | null => {
  if (ops.length === 0 || by.length === 0) return [ops, by]
  if (ops.length > 1) {
    const first = transformOperations([ops[0]], by, side)
    if (!first) return null
    const rest = transformOperations(ops.slice(1), first[1], side)
    if (!rest) return null
    return [first[0].concat(rest[0]), rest[1]]
  }
  if (by.length > 1) {
    const first = transformOperations(ops, [by[0]], side)
    if (!first) return null
    const rest = transformOperations(first[0], by.slice(1), side)
    if (!rest) return null
    return [rest[0], first[1].concat(rest[1])]
  }
  const op = transformOperation(ops[0], by[0], side)
  const other = transformOperation(by[0], ops[0], opposite(side))
  return op && other ? [op, other] : null
}

export const transformRange = (
  range: Range | null,
  ops: Operation[]
): Range | null => {
  let current = range
  for (const op of ops) {
    if (!current) return null
    current = Range.transform(current, op, { affinity: 'inward' })
  }
  return current
}

const same = (a: Operation[], b: Operation[]) =>
  a.length === b.length && a.every((op, index) => op === b[index])

const rebaseRedos = (redos: History['redos'], op: Operation) => {
  let unsaved: Operation[] = [op]
  for (let i = redos.length - 1; i >= 0 && unsaved.length; i--) {
    const batch = redos[i]
    const result = transformOperations(batch.operations, unsaved, 'after')
    if (!result || !result[0].length) {
      redos.splice(0, i + 1)
      return
    }
    batch.selectionBefore = transformRange(batch.selectionBefore, unsaved)
    if (!same(result[0], batch.operations)) batch.operations = result[0]
    unsaved = result[1]
  }
}

const rebaseUndos = (undos: History['undos'], op: Operation) => {
  let unsaved: Operation[] = [op]
  for (let i = undos.length - 1; i >= 0 && unsaved.length; i--) {
    const batch = undos[i]
    const inverse = batch.operations.map(Operation.inverse).reverse()
    const result = transformOperations(inverse, unsaved, 'after')
    if (!result) {
      unsaved = batch.operations.concat(unsaved)
      undos.splice(i, 1)
      continue
    }
    unsaved = result[1]
    if (!result[0].length) {
      undos.splice(i, 1)
      continue
    }
    if (!same(result[0], inverse)) {
      batch.operations = result[0].map(Operation.inverse).reverse()
    }
    batch.selectionBefore = transformRange(batch.selectionBefore, unsaved)
  }
}

export const rebaseHistory = (history: History, op: Operation) => {
  rebaseRedos(history.redos, op)
  rebaseUndos(history.undos, op)
}
