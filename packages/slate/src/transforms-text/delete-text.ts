import { Editor } from '../interfaces/editor'
import { Element } from '../interfaces/element'
import { NodeEntry } from '../interfaces/node'
import { Path } from '../interfaces/path'
import { Point } from '../interfaces/point'
import { Range } from '../interfaces/range'
import { Transforms } from '../interfaces/transforms'
import { TextTransforms } from '../interfaces/transforms/text'

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
    if (Range.isRange(at) && Range.isCollapsed(at)) {
      isCollapsed = true
      at = at.anchor
    }

    if (Point.isPoint(at)) {
      const furthestVoid = Editor.void(editor, { at, mode: 'highest' })

      if (!voids && furthestVoid) {
        const [, voidPath] = furthestVoid
        at = voidPath
      } else {
        const opts = { unit, distance }
        const target = reverse
          ? Editor.before(editor, at, opts) || Editor.start(editor, [])
          : Editor.after(editor, at, opts) || Editor.end(editor, [])
        if (!target) {
          editor.onError({
            key: 'deleteText.target',
            message: `Cannot find target point to delete from.`,
            data: { at, unit, distance, reverse },
          })
          return
        }
        at = { anchor: at, focus: target }
        hanging = true
      }
    }

    if (Path.isPath(at)) {
      Transforms.removeNodes(editor, { at, voids })
      return
    }

    if (Range.isCollapsed(at)) {
      return
    }

    if (!hanging) {
      const [, end] = Range.edges(at)
      const endOfDoc = Editor.end(editor, [])
      if (!endOfDoc) {
        editor.onError({
          key: 'deleteText.end',
          message: `Cannot find end of document.`,
          data: { at },
        })
        return
      }

      if (!Point.equals(end, endOfDoc)) {
        at = Editor.unhangRange(editor, at, { voids })
      }
    }

    let [start, end] = Range.edges(at)
    const startBlock = Editor.above(editor, {
      match: n => Element.isElement(n) && Editor.isBlock(editor, n),
      at: start,
      voids,
    })
    const endBlock = Editor.above(editor, {
      match: n => Element.isElement(n) && Editor.isBlock(editor, n),
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
          Element.isElement(node) &&
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
      const entry = Editor.leaf(editor, point)
      if (!entry) {
        editor.onError({
          key: 'deleteText.leaf',
          message: `Cannot find leaf node at path [${point.path}].`,
          data: { at },
        })
        return
      }
      const [node] = entry

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
      const entry = Editor.leaf(editor, point)
      if (!entry) {
        editor.onError({
          key: 'deleteText.leaf',
          message: `Cannot find leaf node at path [${point.path}].`,
          data: { at },
        })
        return
      }
      const [node] = entry

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

    // For Thai script, deleting N character(s) backward should delete
    // N code point(s) instead of an entire grapheme cluster.
    // Therefore, the remaining code points should be inserted back.
    if (
      isCollapsed &&
      reverse &&
      unit === 'character' &&
      removedText.length > 1 &&
      removedText.match(/[\u0E00-\u0E7F]+/)
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
