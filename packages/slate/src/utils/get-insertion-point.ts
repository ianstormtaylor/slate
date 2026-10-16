import { Editor } from '../interfaces/editor'
import { Element } from '../interfaces/element'
import { Node } from '../interfaces/node'
import { Path } from '../interfaces/path'
import { Point } from '../interfaces/point'
import { Text } from '../interfaces/text'

const inlineInsertionPoint = (editor: Editor, point: Point) => {
  const inline = Editor.above<Element>(editor, {
    at: point,
    match: (n, path) =>
      Element.isElement(n) &&
      editor.isInline(n) &&
      Editor.isEdge(editor, point, path),
    mode: 'highest',
    voids: true,
  })
  let outside = point
  if (inline) {
    const [, path] = inline
    if (Editor.isStart(editor, point, path) && Path.hasPrevious(path)) {
      const previous = Path.previous(path)
      if (!Text.isText(Node.getIf(editor, previous))) return null
      outside = Editor.end(editor, previous)
    } else if (Editor.isEnd(editor, point, path)) {
      const next = Path.next(path)
      if (!Text.isText(Node.getIf(editor, next))) return null
      outside = Editor.start(editor, next)
    } else {
      return null
    }
  }

  const parent = Node.parent(editor, outside.path)
  let index = outside.path[outside.path.length - 1]
  const emptyInline = (node: Node) =>
    Element.isElement(node) &&
    editor.isInline(node) &&
    !editor.isVoid(node) &&
    Node.string(node) === ''
  while (
    outside.offset === 0 &&
    index > 1 &&
    emptyInline(parent.children[index - 1]) &&
    Text.isText(parent.children[index - 2])
  ) {
    index -= 2
    outside = Editor.end(editor, Path.parent(outside.path).concat(index))
  }
  const candidates: [Element, Path, 'start' | 'end'][] = []
  const previous = parent.children[index - 1]
  if (
    outside.offset === 0 &&
    Element.isElement(previous) &&
    editor.isInline(previous)
  ) {
    candidates.push([previous, Path.previous(outside.path), 'end'])
  }
  let [leaf] = Editor.leaf(editor, outside)
  if (outside.offset === leaf.text.length) {
    while (index + 1 < parent.children.length) {
      const next = parent.children[index + 1]
      if (!Element.isElement(next) || !editor.isInline(next)) break
      candidates.push([
        next,
        Path.parent(outside.path).concat(index + 1),
        'start',
      ])
      const nextLeaf = parent.children[index + 2]
      if (!emptyInline(next) || !Text.isText(nextLeaf)) break
      index += 2
      leaf = nextLeaf
      if (leaf.text.length) break
    }
  }
  for (const [element, path, edge] of candidates) {
    const affinity = editor.inlineEdgeAffinity(element, edge)
    if (affinity === null) continue
    if (
      affinity === 'inside' &&
      (editor.isVoid(element) ||
        editor.isElementReadOnly(element) ||
        !editor.isSelectable(element))
    )
      continue
    return {
      point:
        affinity === 'outside'
          ? outside
          : edge === 'start'
          ? Editor.start(editor, path)
          : Editor.end(editor, path),
      affinity,
    }
  }
  return null
}

export const getInsertionPoint = (editor: Editor, point: Point) => {
  if (!Text.isText(Node.getIf(editor, point.path))) {
    return { point, affinity: false, inlineAffinity: null }
  }

  const inline = inlineInsertionPoint(editor, point)
  let result = inline?.point ?? point
  let affinity = inline !== null
  const [node] = Editor.leaf(editor, result)
  const siblings = Node.parent(editor, result.path).children
  const index = result.path[result.path.length - 1]
  const previous = siblings[index - 1]
  const next = siblings[index + 1]
  let pair: [Text, Text, Path, Path] | undefined
  if (result.offset === 0 && Text.isText(previous)) {
    pair = [previous, node, Path.previous(result.path), result.path]
  } else if (result.offset === node.text.length && Text.isText(next)) {
    pair = [node, next, result.path, Path.next(result.path)]
  }
  if (pair) {
    const [before, after, beforePath, afterPath] = pair
    const value = editor.leafEdgeAffinity(before, after)
    if (value !== null) {
      affinity = true
      result =
        value === 'backward'
          ? { path: beforePath, offset: before.text.length }
          : { path: afterPath, offset: 0 }
    }
  }
  return { point: result, affinity, inlineAffinity: inline?.affinity ?? null }
}
