import { Editor } from '../interfaces/editor'
import { Element } from '../interfaces/element'
import { Scrubber } from '../interfaces/index'
import { Node } from '../interfaces/node'
import { Path } from '../interfaces/path'
import { Point } from '../interfaces/point'
import { PointRef } from '../interfaces/point-ref'
import { Range } from '../interfaces/range'
import { Transforms } from '../interfaces/transforms'
import { NodeTransforms } from '../interfaces/transforms/node'

/**
 * Convert a range into a point by deleting it's content.
 */
const deleteRange = (editor: Editor, range: Range): Point | null => {
  if (Range.isCollapsed(range)) {
    return range.anchor
  } else {
    const [, end] = Range.edges(range)
    const pointRef = Editor.pointRef(editor, end)
    Transforms.delete(editor, { at: range })
    return pointRef.unref()
  }
}

export const splitNodes: NodeTransforms['splitNodes'] = (
  editor,
  options = {}
) => {
  Editor.withoutNormalizing(editor, () => {
    const { mode = 'lowest', voids = false } = options
    let { match, at = editor.selection, height = 0, always = false } = options

    if (match == null) {
      match = n => Element.isElement(n) && Editor.isBlock(editor, n)
    }

    if (Range.isRange(at)) {
      at = deleteRange(editor, at)
    }

    // If the target is a path, the default height-skipping and position
    // counters need to account for us potentially splitting at a non-leaf.
    if (Path.isPath(at)) {
      const path = at
      const point = Editor.point(editor, path)
      if (!point) {
        editor.onError({
          key: 'splitNodes.point',
          message: `Cannot find point at path ${Scrubber.stringify(path)}`,
          data: { path },
        })
        return
      }

      const parentEntry = Editor.parent(editor, path)
      if (!parentEntry) {
        editor.onError({
          key: 'splitNodes.parent',
          message: `Cannot find parent node at path ${Scrubber.stringify(
            path
          )}`,
          data: { path },
        })
        return
      }
      const [parent] = parentEntry
      match = n => n === parent
      height = point.path.length - path.length + 1
      at = point
      always = true
    }

    if (!at) {
      return
    }

    const beforeRef = Editor.pointRef(editor, at, {
      affinity: 'backward',
    })
    let afterRef: PointRef | undefined
    try {
      const [highest] = Editor.nodes(editor, { at, match, mode, voids })

      if (!highest) {
        return
      }

      const voidMatch = Editor.void(editor, { at, mode: 'highest' })
      const nudge = 0

      if (!voids && voidMatch) {
        const [voidNode, voidPath] = voidMatch

        if (Element.isElement(voidNode) && editor.isInline(voidNode)) {
          let after = Editor.after(editor, voidPath)

          if (!after) {
            const text = { text: '' }
            const afterPath = Path.next(voidPath)
            if (!afterPath) {
              editor.onError({
                key: 'splitNodes.next',
                message: `Cannot find next path after ${Scrubber.stringify(
                  voidPath
                )}`,
                data: { path: voidPath },
              })
              return
            }

            Transforms.insertNodes(editor, text, { at: afterPath, voids })
            after = Editor.point(editor, afterPath)!
          }

          at = after
          always = true
        }

        const siblingHeight = at.path.length - voidPath.length
        height = siblingHeight + 1
        always = true
      }

      afterRef = Editor.pointRef(editor, at)
      const depth = at.path.length - height
      const [, highestPath] = highest
      const lowestPath = at.path.slice(0, depth)
      let position = height === 0 ? at.offset : at.path[depth] + nudge

      for (const [node, path] of Editor.levels(editor, {
        at: lowestPath,
        reverse: true,
        voids,
      })) {
        let split = false

        if (
          path.length < highestPath.length ||
          path.length === 0 ||
          (!voids && Element.isElement(node) && Editor.isVoid(editor, node))
        ) {
          break
        }

        const point = beforeRef.current!
        const isEnd = Editor.isEnd(editor, point, path)

        if (always || !beforeRef || !Editor.isEdge(editor, point, path)) {
          split = true
          const properties = Node.extractProps(node)
          editor.apply({
            type: 'split_node',
            path,
            position,
            properties,
          })
        }

        position = path[path.length - 1] + (split || isEnd ? 1 : 0)
      }

      if (options.at == null) {
        const point = afterRef.current || Editor.end(editor, [])
        if (!point) {
          editor.onError({
            key: 'splitNodes.end',
            message: `Cannot find end point after splitting nodes`,
            data: { at },
          })
          return
        }
        Transforms.select(editor, point)
      }
    } finally {
      beforeRef.unref()
      afterRef?.unref()
    }
  })
}
