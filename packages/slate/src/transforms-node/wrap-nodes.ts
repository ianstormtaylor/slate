import { Editor } from '../interfaces/editor'
import { Element } from '../interfaces/element'
import { Path } from '../interfaces/path'
import { Range } from '../interfaces/range'
import { Text } from '../interfaces/text'
import { Transforms } from '../interfaces/transforms'
import { NodeTransforms } from '../interfaces/transforms/node'
import { matchPath } from '../utils/match-path'

export const wrapNodes: NodeTransforms['wrapNodes'] = (
  editor,
  element,
  options = {}
) => {
  Editor.withoutNormalizing(editor, () => {
    const { mode = 'lowest', split = false, voids = false } = options
    let { match, at = editor.selection } = options

    if (!at) {
      return
    }

    if (match == null) {
      if (Path.isPath(at)) {
        match = matchPath(editor, at)
      } else if (editor.isInline(element)) {
        match = n =>
          (Element.isElement(n) && Editor.isInline(editor, n)) || Text.isText(n)
      } else {
        match = n => Element.isElement(n) && Editor.isBlock(editor, n)
      }
    }

    if (split && Range.isRange(at)) {
      const [start, end] = Range.edges(at)
      const rangeRef = Editor.rangeRef(editor, at, {
        affinity: 'inward',
      })
      Transforms.splitNodes(editor, { at: end, match, voids })
      Transforms.splitNodes(editor, { at: start, match, voids })
      at = rangeRef.unref()!

      if (options.at == null) {
        Transforms.select(editor, at)
      }
    }

    const roots = Array.from(
      Editor.nodes(editor, {
        at,
        match: editor.isInline(element)
          ? n => Element.isElement(n) && Editor.isBlock(editor, n)
          : n => Editor.isEditor(n),
        mode: 'lowest',
        voids,
      })
    )

    for (const [, rootPath] of roots) {
      const range = Editor.range(editor, rootPath)
      if (!range) {
        editor.onError({
          key: 'wrapNodes.range',
          message: 'Could not find range for rootPath',
          data: { rootPath },
        })
        continue
      }

      const a = Range.isRange(at) ? Range.intersection(at, range) : at

      if (!a) {
        continue
      }

      const matches = Array.from(
        Editor.nodes(editor, { at: a, match, mode, voids })
      )

      if (matches.length > 0) {
        const [first] = matches
        const last = matches[matches.length - 1]
        const [, firstPath] = first
        const [, lastPath] = last

        if (firstPath.length === 0 && lastPath.length === 0) {
          // if there's no matching parent - usually means the node is an editor - don't do anything
          continue
        }

        const commonPath = Path.equals(firstPath, lastPath)
          ? Path.parent(firstPath)
          : Path.common(firstPath, lastPath)
        if (!commonPath) {
          editor.onError({
            key: 'wrapNodes.commonPath',
            message: 'Could not find commonPath',
            data: { firstPath, lastPath },
          })
          continue
        }

        const range = Editor.range(editor, firstPath, lastPath)
        const commonNodeEntry = Editor.node(editor, commonPath)
        if (!commonNodeEntry) {
          editor.onError({
            key: 'wrapNodes.commonNodeEntry',
            message: 'Could not find commonNodeEntry',
            data: { commonPath },
          })
          continue
        }

        const [commonNode] = commonNodeEntry
        const depth = commonPath.length + 1
        const wrapperPath = Path.next(lastPath.slice(0, depth))
        if (!wrapperPath) {
          editor.onError({
            key: 'wrapNodes.wrapperPath',
            message: 'Could not find wrapperPath',
            data: { lastPath, depth },
          })
          continue
        }

        const wrapper = { ...element, children: [] }
        Transforms.insertNodes(editor, wrapper, { at: wrapperPath, voids })

        Transforms.moveNodes(editor, {
          at: range,
          match: n =>
            Element.isAncestor(commonNode) && commonNode.children.includes(n),
          to: wrapperPath.concat(0),
          voids,
        })
      }
    }
  })
}
