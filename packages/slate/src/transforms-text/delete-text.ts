import { TextTransforms } from '../interfaces/transforms/text'
import { Editor } from '../interfaces/editor'
import { Range } from '../interfaces/range'
import { Point } from '../interfaces/point'
import { Path } from '../interfaces/path'
import { Transforms } from '../interfaces/transforms'
import { Node, NodeEntry } from '../interfaces/node'
import { Location } from '../interfaces'

const findEmptyBlockNextToVoid = (
  editor: Editor,
  point: Point,
  reverse: boolean
): [Path, Path] | undefined => {
  const blockEntry = Editor.above(editor, {
    at: point,
    match: n => Node.isElement(n) && Editor.isBlock(editor, n),
  })

  if (!blockEntry) {
    return undefined
  }

  const [block, blockPath] = blockEntry

  if (
    !Node.isElement(block) ||
    Editor.isVoid(editor, block) ||
    !Editor.isEmpty(editor, block)
  ) {
    return undefined
  }

  if (reverse && !Path.hasPrevious(blockPath)) {
    return undefined
  }

  const siblingPath = reverse ? Path.previous(blockPath) : Path.next(blockPath)

  if (!Node.has(editor, siblingPath)) {
    return undefined
  }

  const sibling = Node.get(editor, siblingPath)

  if (
    !Node.isElement(sibling) ||
    !Editor.isBlock(editor, sibling) ||
    !Editor.isVoid(editor, sibling)
  ) {
    return undefined
  }

  return [blockPath, siblingPath]
}

const isEmptyInline = (editor: Editor, node: Node) =>
  Node.isElement(node) &&
  Editor.isInline(editor, node) &&
  !Editor.isVoid(editor, node) &&
  Editor.isEmpty(editor, node)

const findEmptyInlineToDelete = (
  editor: Editor,
  point: Point,
  reverse: boolean
): Path | undefined => {
  const inlinePath = Path.parent(point.path)

  if (
    inlinePath.length > 0 &&
    isEmptyInline(editor, Node.get(editor, inlinePath))
  ) {
    return inlinePath
  }

  const text = Node.get(editor, point.path)
  const atEdge = reverse
    ? point.offset === 0
    : Node.isText(text) && point.offset === text.text.length

  if (!atEdge) {
    return undefined
  }

  if (reverse && !Path.hasPrevious(point.path)) {
    return undefined
  }

  const siblingPath = reverse
    ? Path.previous(point.path)
    : Path.next(point.path)

  if (
    Node.has(editor, siblingPath) &&
    isEmptyInline(editor, Node.get(editor, siblingPath))
  ) {
    return siblingPath
  }

  return undefined
}

export const deleteText: TextTransforms['delete'] = (editor, options = {}) => {
  Editor.withoutNormalizing(editor, () => {
    const {
      reverse = false,
      unit = 'character',
      distance = 1,
      voids = false,
    } = options
    let { at = editor.selection, hanging = false } = options

    if (!at) {
      return
    }

    let isCollapsed = false
    if (Location.isRange(at) && Range.isCollapsed(at)) {
      isCollapsed = true
      at = at.anchor
    }

    if (Location.isPoint(at)) {
      const emptyBlockNextToVoid =
        !voids && (unit === 'character' || unit === 'word') && distance === 1
          ? findEmptyBlockNextToVoid(editor, at, reverse)
          : undefined

      if (emptyBlockNextToVoid) {
        const [blockPath, voidPath] = emptyBlockNextToVoid
        const voidRef = Editor.pathRef(editor, voidPath)
        Transforms.removeNodes(editor, { at: blockPath })
        const target = voidRef.unref()

        if (target && options.at == null) {
          Transforms.select(
            editor,
            reverse ? Editor.end(editor, target) : Editor.start(editor, target)
          )
        }

        return
      }

      const furthestVoid = Editor.void(editor, { at, mode: 'highest' })

      const emptyInlinePath =
        unit === 'character' && distance === 1
          ? findEmptyInlineToDelete(editor, at, reverse)
          : undefined

      if (!voids && furthestVoid) {
        const [, voidPath] = furthestVoid
        at = voidPath
      } else if (emptyInlinePath) {
        at = emptyInlinePath
      } else {
        const opts = { unit, distance }
        const target = reverse
          ? Editor.before(editor, at, opts) || Editor.start(editor, [])
          : Editor.after(editor, at, opts) || Editor.end(editor, [])
        at = { anchor: at, focus: target }
        hanging = true
      }
    }

    if (Location.isPath(at)) {
      // When deleting a void backward from the cursor, keep the cursor before
      // it instead of letting it move into the following node.
      const before =
        options.at == null && reverse ? Editor.before(editor, at) : undefined
      const beforeRef =
        before && Path.isAncestor(Path.parent(at), before.path)
          ? Editor.pointRef(editor, before)
          : undefined

      Transforms.removeNodes(editor, { at, voids })

      if (editor.children.length === 0) {
        beforeRef?.unref()
        Transforms.insertNodes(
          editor,
          { children: [{ text: '' }] },
          { at: [0], select: options.at == null }
        )
        return
      }

      const point = beforeRef && beforeRef.unref()

      if (point) {
        Transforms.select(editor, point)
      }

      return
    }

    if (Range.isCollapsed(at)) {
      return
    }

    if (!hanging) {
      const [, end] = Range.edges(at)
      const endOfDoc = Editor.end(editor, [])

      if (!Point.equals(end, endOfDoc)) {
        at = Editor.unhangRange(editor, at, { voids })
      }
    }

    let [start, end] = Range.edges(at)
    const startBlock = Editor.above(editor, {
      match: n => Node.isElement(n) && Editor.isBlock(editor, n),
      at: start,
      voids,
    })
    const endBlock = Editor.above(editor, {
      match: n => Node.isElement(n) && Editor.isBlock(editor, n),
      at: end,
      voids,
    })
    const isAcrossBlocks =
      startBlock && endBlock && !Path.equals(startBlock[1], endBlock[1])
    const isSingleText = Path.equals(start.path, end.path)
    const startNonEditable = voids
      ? null
      : Editor.void(editor, { at: start, mode: 'highest' }) ??
        Editor.elementReadOnly(editor, { at: start, mode: 'highest' })
    const endNonEditable = voids
      ? null
      : Editor.void(editor, { at: end, mode: 'highest' }) ??
        Editor.elementReadOnly(editor, { at: end, mode: 'highest' })

    // If the start or end points are inside an inline void, nudge them out.
    if (startNonEditable) {
      const before = Editor.before(editor, start)

      if (before && startBlock && Path.isAncestor(startBlock[1], before.path)) {
        start = before
      }
    }

    if (endNonEditable) {
      const after = Editor.after(editor, end)

      if (after && endBlock && Path.isAncestor(endBlock[1], after.path)) {
        end = after
      }
    }

    // Get the highest nodes that are completely inside the range, as well as
    // the start and end nodes.
    const matches: NodeEntry[] = []
    let lastPath: Path | undefined

    for (const entry of Editor.nodes(editor, { at, voids })) {
      const [node, path] = entry

      if (lastPath && Path.compare(path, lastPath) === 0) {
        continue
      }

      if (
        (!voids &&
          Node.isElement(node) &&
          (Editor.isVoid(editor, node) ||
            Editor.isElementReadOnly(editor, node))) ||
        (!Path.isCommon(path, start.path) && !Path.isCommon(path, end.path))
      ) {
        matches.push(entry)
        lastPath = path
      }
    }

    const pathRefs = Array.from(matches, ([, p]) => Editor.pathRef(editor, p))
    const startRef = Editor.pointRef(editor, start)
    const endRef = Editor.pointRef(editor, end)

    let removedText = ''

    if (!isSingleText && !startNonEditable) {
      const point = startRef.current!
      const [node] = Editor.leaf(editor, point)
      const { path } = point
      const { offset } = start
      const text = node.text.slice(offset)
      if (text.length > 0) {
        editor.apply({ type: 'remove_text', path, offset, text })
        removedText = text
      }
    }

    pathRefs
      .reverse()
      .map(r => r.unref())
      .filter((r): r is Path => r !== null)
      .forEach(p => Transforms.removeNodes(editor, { at: p, voids }))

    if (!endNonEditable) {
      const point = endRef.current!
      const [node] = Editor.leaf(editor, point)
      const { path } = point
      const offset = isSingleText ? start.offset : 0
      const text = node.text.slice(offset, end.offset)
      if (text.length > 0) {
        editor.apply({ type: 'remove_text', path, offset, text })
        removedText = text
      }
    }

    if (!isSingleText && isAcrossBlocks && endRef.current && startRef.current) {
      Transforms.mergeNodes(editor, {
        at: endRef.current,
        hanging: true,
        voids,
      })
    }

    // For certain scripts, deleting N character(s) backward should delete
    // N code point(s) instead of an entire grapheme cluster.
    // Therefore, the remaining code points should be inserted back.
    // Bengali: \u0980-\u09FF
    // Thai: \u0E00-\u0E7F
    // Burmese (Myanmar): \u1000-\u109F
    // Hindi (Devanagari): \u0900-\u097F
    // Khmer: \u1780-\u17FF
    // Malayalam: \u0D00-\u0D7F
    // Oriya: \u0B00-\u0B7F
    // Punjabi (Gurmukhi): \u0A00-\u0A7F
    // Tamil: \u0B80-\u0BFF
    // Telugu: \u0C00-\u0C7F
    if (
      isCollapsed &&
      reverse &&
      unit === 'character' &&
      removedText.length > 1 &&
      removedText.match(
        /[\u0980-\u09FF\u0E00-\u0E7F\u1000-\u109F\u0900-\u097F\u1780-\u17FF\u0D00-\u0D7F\u0B00-\u0B7F\u0A00-\u0A7F\u0B80-\u0BFF\u0C00-\u0C7F]+/
      )
    ) {
      Transforms.insertText(
        editor,
        removedText.slice(0, removedText.length - distance)
      )
    }

    const startUnref = startRef.unref()
    const endUnref = endRef.unref()
    const point = reverse ? startUnref || endUnref : endUnref || startUnref

    if (options.at == null && point) {
      Transforms.select(editor, point)
    }
  })
}
