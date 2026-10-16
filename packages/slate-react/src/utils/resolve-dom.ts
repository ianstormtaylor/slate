import { Node, Point, Range } from 'slate'
import {
  DOMPoint,
  DOMRange,
  EDITOR_TO_ELEMENT,
  IS_NODE_MAP_DIRTY,
} from 'slate-dom'
import { ReactEditor } from '../plugin/react-editor'

const isDOMSettled = (editor: ReactEditor, points: Point[]) =>
  !IS_NODE_MAP_DIRTY.get(editor) &&
  !!EDITOR_TO_ELEMENT.get(editor)?.isConnected &&
  points.every(point => Node.has(editor, point.path))

const reportDOMError = (editor: ReactEditor, error: unknown) => {
  if (typeof editor.onDOMError !== 'function') {
    throw error
  }

  editor.onDOMError(error)
}

export const resolveDOMPoint = (
  editor: ReactEditor,
  point: Point
): DOMPoint | null => {
  if (!isDOMSettled(editor, [point])) {
    return null
  }

  try {
    return ReactEditor.toDOMPoint(editor, point)
  } catch (error) {
    reportDOMError(editor, error)
    return null
  }
}

export const resolveDOMRange = (
  editor: ReactEditor,
  range: Range
): DOMRange | null => {
  if (!isDOMSettled(editor, [range.anchor, range.focus])) {
    return null
  }

  try {
    return ReactEditor.toDOMRange(editor, range)
  } catch (error) {
    reportDOMError(editor, error)
    return null
  }
}

export const resolveDOMRangeDuringFlush = (
  editor: ReactEditor,
  range: Range
): DOMRange | null => {
  try {
    return ReactEditor.toDOMRange(editor, range)
  } catch {
    return null
  }
}
