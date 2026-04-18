export type EditorSelectionPoint = {
  path: number[]
  offset: number
}

export type EditorSelectionSnapshot = {
  anchor: EditorSelectionPoint
  focus: EditorSelectionPoint
}

export type DOMSelectionSnapshot = {
  anchorNodeText: string | null
  anchorOffset: number
  focusNodeText: string | null
  focusOffset: number
}

const getEditorTextNodes = (root: ParentNode) =>
  Array.from(root.querySelectorAll('[data-slate-node="text"]'))

const hasZeroWidthMarker = (node: Node | null) => {
  const element = node?.nodeType === 1 ? (node as Element) : node?.parentElement

  return !!element?.getAttribute('data-slate-zero-width')
}

const getNodeLength = (node: Node | null) =>
  node?.nodeType === 3
    ? (node.textContent?.length ?? 0)
    : (node?.childNodes.length ?? 0)

const toEditorOffset = (node: Node | null, offset: number) =>
  hasZeroWidthMarker(node) && offset === 1 && getNodeLength(node) <= 1
    ? 0
    : offset

const findTextIndex = (root: ParentNode, node: Node | null) => {
  const owner =
    node?.nodeType === 1
      ? (node as Element).closest('[data-slate-node="text"]')
      : node?.parentElement?.closest('[data-slate-node="text"]')

  if (!owner) {
    throw new Error('Cannot resolve selection to a Slate text node')
  }

  const index = getEditorTextNodes(root).indexOf(owner)

  if (index < 0) {
    throw new Error('Selection text node is outside the editor root')
  }

  return index
}

export const takeDOMSelectionSnapshot = (
  selection: Selection | null
): DOMSelectionSnapshot | null => {
  if (!selection || selection.rangeCount === 0) {
    return null
  }

  return {
    anchorNodeText: selection.anchorNode?.textContent ?? null,
    anchorOffset: selection.anchorOffset,
    focusNodeText: selection.focusNode?.textContent ?? null,
    focusOffset: selection.focusOffset,
  }
}

export const takeEditorSelectionSnapshot = (
  root: ParentNode,
  selection: Selection | null
): EditorSelectionSnapshot | null => {
  if (!selection || selection.rangeCount === 0) {
    return null
  }

  return {
    anchor: {
      path: [findTextIndex(root, selection.anchorNode), 0],
      offset: toEditorOffset(selection.anchorNode, selection.anchorOffset),
    },
    focus: {
      path: [findTextIndex(root, selection.focusNode), 0],
      offset: toEditorOffset(selection.focusNode, selection.focusOffset),
    },
  }
}
