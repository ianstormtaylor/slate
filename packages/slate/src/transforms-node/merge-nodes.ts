import { NodeTransforms } from '../interfaces/transforms/node'
import { Editor } from '../interfaces/editor'
import { Path } from '../interfaces/path'
import { Element } from '../interfaces/element'
import { Range } from '../interfaces/range'
import { Transforms } from '../interfaces/transforms'
import { Text } from '../interfaces/text'
import { Scrubber } from '../interfaces/scrubber'
import { Node } from '../interfaces/node'

const hasSingleChildNest = (editor: Editor, node: Node): boolean => {
  if (Element.isElement(node)) {
    const element = node as Element
    if (Editor.isVoid(editor, node)) {
      return true
    } else if (element.children.length === 1) {
      return hasSingleChildNest(editor, element.children[0])
    } else {
      return false
    }
  } else if (Editor.isEditor(node)) {
    return false
  } else {
    return true
  }
}

export const mergeNodes: NodeTransforms['mergeNodes'] = (
  editor,
  options = {}
) => {
  Editor.withoutNormalizing(editor, () => {
    let { match, at = editor.selection } = options
    const { hanging = false, voids = false, mode = 'lowest' } = options

    if (!at) {
      return
    }

    if (match == null) {
      if (Path.isPath(at)) {
        const [parent] = Editor.parent(editor, at)
        match = n => parent.children.includes(n)
      } else {
        match = n => Element.isElement(n) && Editor.isBlock(editor, n)
      }
    }

    if (!hanging && Range.isRange(at)) {
      at = Editor.unhangRange(editor, at, { voids })
    }

    if (Range.isRange(at)) {
      if (Range.isCollapsed(at)) {
        at = at.anchor
      } else {
        const [, end] = Range.edges(at)
        const pointRef = Editor.pointRef(editor, end)
        Transforms.delete(editor, { at })
        at = pointRef.unref()!

        if (options.at == null) {
          Transforms.select(editor, at)
        }
      }
    }

    const [current] = Editor.nodes(editor, { at, match, voids, mode })
    const prev = Editor.previous(editor, { at, match, voids, mode })

    if (!current || !prev) {
      return
    }

    const [node, path] = current
    const [prevNode, prevPath] = prev

    if (path.length === 0 || prevPath.length === 0) {
      return
    }

    const newPath = Path.next(prevPath)
    const commonPath = Path.common(path, prevPath)
    const isPreviousSibling = Path.isSibling(path, prevPath)
    const levels = Array.from(Editor.levels(editor, { at: path }), ([n]) => n)
      .slice(commonPath.length)
      .slice(0, -1)

    // Determine if the merge will leave an ancestor of the path empty as a
    // result, in which case we'll want to remove it after merging.
    const emptyAncestor = Editor.above(editor, {
      at: path,
      mode: 'highest',
      match: n => levels.includes(n) && hasSingleChildNest(editor, n),
    })

    const emptyRef = emptyAncestor && Editor.pathRef(editor, emptyAncestor[1])
    let properties
    let position

    // Ensure that the nodes are equivalent, and figure out what the position
    // and extra properties of the merge will be.
    if (Text.isText(node) && Text.isText(prevNode)) {
      const { text, ...rest } = node
      position = prevNode.text.length
      properties = rest as Partial<Text>
    } else if (Element.isElement(node) && Element.isElement(prevNode)) {
      const { children, ...rest } = node
      position = prevNode.children.length
      properties = rest as Partial<Element>
    } else {
      throw new Error(
        `Cannot merge the node at path [${path}] with the previous sibling because it is not the same kind: ${Scrubber.stringify(
          node
        )} ${Scrubber.stringify(prevNode)}`
      )
    }

    // If the node isn't already the next sibling of the previous node, move
    // it so that it is before merging.
    if (!isPreviousSibling) {
      Transforms.moveNodes(editor, { at: path, to: newPath, voids })
    }

    // If there was going to be an empty ancestor of the node that was merged,
    // we remove it from the tree.
    if (emptyRef) {
      Transforms.removeNodes(editor, { at: emptyRef.current!, voids })
    }

    if (Editor.shouldMergeNodesRemovePrevNode(editor, prev, current)) {
      Transforms.removeNodes(editor, { at: prevPath, voids })
    } else {
      editor.apply({
        type: 'merge_node',
        path: newPath,
        position,
        properties,
      })
    }

    if (emptyRef) {
      emptyRef.unref()
    }
  })
}
