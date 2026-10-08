import { Editor, Node, Path, Point, Range, Transforms } from 'slate'

const blockPathAt = (editor: Editor, point: Point): Path | undefined =>
  Editor.above(editor, {
    at: point,
    match: n => Node.isElement(n) && Editor.isBlock(editor, n),
  })?.[1]

export const getWholeTopLevelBlockPaths = (
  editor: Editor,
  range: Range
): Path[] | null => {
  const [start, end] = Range.edges(range)
  const startBlock = blockPathAt(editor, start)
  const endBlock = blockPathAt(editor, end)

  if (
    !startBlock ||
    !endBlock ||
    startBlock.length !== 1 ||
    endBlock.length !== 1 ||
    startBlock[0] >= endBlock[0] ||
    !Editor.isStart(editor, start, startBlock) ||
    !Editor.isStart(editor, end, endBlock)
  ) {
    return null
  }

  return Array.from({ length: endBlock[0] - startBlock[0] }, (_, offset) => [
    startBlock[0] + offset,
  ])
}

export const getMovableRange = (editor: Editor, range: Range): Range =>
  getWholeTopLevelBlockPaths(editor, range)
    ? range
    : Editor.unhangRange(editor, range)

export const deleteMovedRange = (editor: Editor, range: Range) => {
  if (Range.isCollapsed(range)) {
    return
  }

  const blockPaths = getWholeTopLevelBlockPaths(editor, range)

  if (!blockPaths) {
    Transforms.select(editor, range)
    Editor.deleteFragment(editor)
    return
  }

  const followingBlockRef = Editor.pathRef(
    editor,
    Path.next(blockPaths[blockPaths.length - 1])
  )

  Editor.withoutNormalizing(editor, () => {
    for (const path of [...blockPaths].reverse()) {
      Transforms.removeNodes(editor, { at: path })
    }
  })

  const followingBlock = followingBlockRef.unref()

  if (followingBlock) {
    Transforms.select(editor, Editor.start(editor, followingBlock))
  }
}
