import { Range } from '../interfaces/range'
import { Path } from '../interfaces/path'
import { Node } from '../interfaces/node'
import { Element } from '../interfaces/element'
import { Transforms } from '../interfaces/transforms'
import { Editor, EditorInterface } from '../interfaces/editor'

export const deleteFragment: EditorInterface['deleteFragment'] = (
  editor,
  { direction = 'forward' } = {}
) => {
  const { selection } = editor

  if (selection && Range.isExpanded(selection)) {
    const [start, end] = Range.edges(selection)
    const blockAt = (at: typeof start) =>
      Editor.above(editor, {
        at,
        match: n => Node.isElement(n) && Editor.isBlock(editor, n),
      })?.[1]
    const startBlock = blockAt(start)
    const endBlock = blockAt(end)
    const isolated = Editor.above(editor, {
      at: start,
      match: n => Node.isElement(n) && editor.isIsolated(n),
    })

    if (
      !isolated &&
      startBlock &&
      endBlock &&
      startBlock.length === 1 &&
      Path.isSibling(startBlock, endBlock) &&
      Path.isBefore(startBlock, endBlock) &&
      !Editor.isVoid(editor, Node.get(editor, endBlock) as Element) &&
      Editor.isStart(editor, start, startBlock) &&
      Editor.isStart(editor, end, endBlock)
    ) {
      const following = Editor.pathRef(editor, endBlock)
      Editor.withoutNormalizing(editor, () => {
        for (
          let index = endBlock[endBlock.length - 1] - 1;
          index >= startBlock[startBlock.length - 1];
          index--
        ) {
          Transforms.removeNodes(editor, {
            at: [...Path.parent(startBlock), index],
          })
        }
      })
      const path = following.unref()
      if (path) Transforms.select(editor, Editor.start(editor, path))
      return
    }

    Transforms.delete(editor, { reverse: direction === 'backward' })
  }
}
