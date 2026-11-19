import { Editor, EditorInterface } from '../interfaces/editor'
import { Element } from '../interfaces/element'
import { Location } from '../interfaces/location'
import { Path } from '../interfaces/path'
import { Point } from '../interfaces/point'
import { Text } from '../interfaces/text'
import { getWordBounds } from '../utils/string'

type TextRun = { path: Path; start: number; end: number }

/** @ignore */
export const word: EditorInterface['word'] = (editor, options = {}) => {
  const { at = editor.selection, isWordCharacter } = options

  if (!at) {
    return undefined
  }

  const point = Location.isPoint(at) ? at : at.focus
  const block = Editor.above(editor, {
    at: point,
    match: n => Element.isElement(n) && Editor.isBlock(editor, n),
  })

  if (!block || Editor.isVoid(editor, block[0])) {
    return undefined
  }

  let text = ''
  let runs: TextRun[] = []
  let index = -1

  for (const [node, path] of Editor.nodes(editor, {
    at: block[1],
    match: Text.isText,
    voids: true,
  })) {
    const isInVoid = Editor.above(editor, {
      at: path,
      match: n => Element.isElement(n) && Editor.isVoid(editor, n),
      voids: true,
    })

    if (isInVoid) {
      if (Path.equals(path, point.path)) {
        return undefined
      }

      if (index >= 0) {
        break
      }

      text = ''
      runs = []
      continue
    }

    if (Path.equals(path, point.path)) {
      index = text.length + point.offset
    }

    runs.push({ path, start: text.length, end: text.length + node.text.length })
    text += node.text
  }

  if (index < 0) {
    return undefined
  }

  const [start, end] = getWordBounds(text, index, isWordCharacter)

  if (start === end) {
    return undefined
  }

  const toPoint = (offset: number, preferNext: boolean): Point => {
    const run = preferNext
      ? runs.find(r => offset >= r.start && offset < r.end)
      : runs.find(r => offset > r.start && offset <= r.end)
    const { path, start: runStart } = run!
    return { path, offset: offset - runStart }
  }

  return { anchor: toPoint(start, true), focus: toPoint(end, false) }
}
