import { is } from 'immutable'
import warning from 'tiny-warning'
import pick from 'lodash/pick'

import Selection from '../models/selection'

const Commands = {}

/**
 * Get the next point by `n`.
 *
 * @param {Editor} editor
 * @param {Point} point
 * @param {Number} n
 * @return {Point}
 */

function getNextPoint(editor, point, n) {
  for (let i = 0; i < n; i++) {
    point = editor.getNextPoint(point)
  }

  return point
}

/**
 * Get the previous point by `n`.
 *
 * @param {Editor} editor
 * @param {Point} point
 * @param {Number} n
 * @return {Point}
 */

function getPreviousPoint(editor, point, n) {
  for (let i = 0; i < n; i++) {
    point = editor.getPreviousPoint(point)
  }

  return point
}

/**
 * Blur the selection.
 *
 * @param {Editor} editor
 */

Commands.blur = editor => {
  editor.select({ isFocused: false })
}

/**
 * Deselect the selection.
 *
 * @param {Editor} editor
 */

Commands.deselect = editor => {
  editor.select(Selection.create())
}

/**
 * Focus the selection.
 *
 * @param {Editor} editor
 */

Commands.focus = editor => {
  editor.select({ isFocused: true })
}

/**
 * Flip the selection's anchor and focus points.
 *
 * @param {Editor} editor
 */

Commands.flip = editor => {
  const { value: { selection } } = editor
  const range = selection.flip()
  editor.select(range)
}

/**
 * Move the selection's anchor point backwards by `n`.
 *
 * @param {Editor} editor
 * @param {Number} n
 */

Commands.moveAnchorBackward = (editor, n = 1) => {
  const { value: { selection } } = editor
  const point = getPreviousPoint(editor, selection.anchor, n)
  editor.setAnchor(point)
}

/**
 * Move the selection's anchor point forwards by `n`.
 *
 * @param {Editor} editor
 * @param {Number} n
 */

Commands.moveAnchorForward = (editor, n = 1) => {
  const { value: { selection } } = editor
  const point = getNextPoint(editor, selection.anchor, n)
  editor.setAnchor(point)
}

/**
 * Move the selection's anchor point to a specific `path` and `offset`.
 *
 * @param {Editor} editor
 * @param {Path} path
 * @param {Number} offset
 */

Commands.moveAnchorTo = (editor, path, offset) => {
  const { value: { selection } } = editor
  const range = selection.moveAnchorTo(path, offset)
  editor.select(range)
}

/**
 * Move the selection's anchor point to the end of the block it's in.
 *
 * @param {Editor} editor
 */

Commands.moveAnchorToEndOfBlock = editor => {
  const { value: { document, selection } } = editor
  const entry = document.closestBlock(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToEndOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the end of the node at `path`.
 *
 * @param {Editor} editor
 */

Commands.moveAnchorToEndOfPath = (editor, path) => {
  const { value: { document } } = editor
  const entry = document.lastText({ path })

  if (entry) {
    const [targetNode, targetPath] = entry
    editor.moveAnchorTo(targetPath, targetNode.text.length)
  }
}

/**
 * Move the selection's anchor point to the end of the nearest inline.
 *
 * @param {Editor} editor
 */

Commands.moveAnchorToEndOfInline = editor => {
  const { value: { document, selection } } = editor
  const entry = document.closestInline(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToEndOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the end of the document.
 *
 * @param {Editor} editor
 */

Commands.moveAnchorToEndOfDocument = editor => {
  const { value: { document } } = editor
  const entry = document.lastText()

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToEndOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the end of the next block.
 *
 * @param {Editor} editor
 */

Commands.moveAnchorToEndOfNextBlock = editor => {
  const { value: { document, selection } } = editor
  const entry = document.nextBlock(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToEndOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the end of the next inline.
 *
 * @param {Editor} editor
 */

Commands.moveAnchorToEndOfNextInline = editor => {
  const { value: { document, selection } } = editor
  const entry = document.nextInline(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToEndOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the end of the next text node.
 *
 * @param {Editor} editor
 */

Commands.moveAnchorToEndOfNextText = editor => {
  const { value: { document, selection } } = editor
  const entry = document.nextText(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToEndOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the end of the previous block.
 *
 * @param {Editor} editor
 */

Commands.moveAnchorToEndOfPreviousBlock = editor => {
  const { value: { document, selection } } = editor
  const entry = document.previousBlock(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToEndOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the end of the previous inline.
 *
 * @param {Editor} editor
 */

Commands.moveAnchorToEndOfPreviousInline = editor => {
  const { value: { document, selection } } = editor
  const entry = document.previousInline(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToEndOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the end of the previous text node.
 *
 * @param {Editor} editor
 */

Commands.moveAnchorToEndOfPreviousText = editor => {
  const { value: { document, selection } } = editor
  const entry = document.previousText(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToEndOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the end of the text node it's in.
 *
 * @param {Editor} editor
 */

Commands.moveAnchorToEndOfText = editor => {
  const { value: { selection } } = editor
  editor.moveAnchorToEndOfPath(selection.anchor.path)
}

/**
 * Move the selection's anchor point to the start of the block it's in.
 *
 * @param {Editor} editor
 */

Commands.moveAnchorToStartOfBlock = editor => {
  const { value: { document, selection } } = editor
  const entry = document.closestBlock(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToStartOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the start of the node at `path`.
 *
 * @param {Editor} editor
 */

Commands.moveAnchorToStartOfPath = (editor, path) => {
  const { value: { document } } = editor
  const entry = document.lastText({ path })

  if (entry) {
    const [, targetPath] = entry
    editor.moveAnchorTo(targetPath, 0)
  }
}

/**
 * Move the selection's anchor point to the start of the nearest inline.
 *
 * @param {Editor} editor
 */

Commands.moveAnchorToStartOfInline = editor => {
  const { value: { document, selection } } = editor
  const entry = document.closestInline(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToStartOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the start of the document.
 *
 * @param {Editor} editor
 */

Commands.moveAnchorToStartOfDocument = editor => {
  const { value: { document } } = editor
  const entry = document.firstText()

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToStartOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the start of the next block.
 *
 * @param {Editor} editor
 */

Commands.moveAnchorToStartOfNextBlock = editor => {
  const { value: { document, selection } } = editor
  const entry = document.nextBlock(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToStartOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the start of the next inline.
 *
 * @param {Editor} editor
 */

Commands.moveAnchorToStartOfNextInline = editor => {
  const { value: { document, selection } } = editor
  const entry = document.nextInline(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToStartOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the start of the next text node.
 *
 * @param {Editor} editor
 */

Commands.moveAnchorToStartOfNextText = editor => {
  const { value: { document, selection } } = editor
  const entry = document.nextText(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToStartOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the start of the previous block.
 *
 * @param {Editor} editor
 */

Commands.moveAnchorToStartOfPreviousBlock = editor => {
  const { value: { document, selection } } = editor
  const entry = document.previousBlock(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToStartOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the start of the previous inline.
 *
 * @param {Editor} editor
 */

Commands.moveAnchorToStartOfPreviousInline = editor => {
  const { value: { document, selection } } = editor
  const entry = document.previousInline(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToStartOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the start of the previous text node.
 *
 * @param {Editor} editor
 */

Commands.moveAnchorToStartOfPreviousText = editor => {
  const { value: { document, selection } } = editor
  const entry = document.previousText(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToStartOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the start of the text node it's in.
 *
 * @param {Editor} editor
 */

Commands.moveAnchorToStartOfText = editor => {
  const { value: { selection } } = editor
  editor.moveAnchorToStartOfPath(selection.anchor.path)
}

/**
 * Move the selection's anchor point backward to the edge of the nearest word.
 *
 * @param {Editor} editor
 */

Commands.moveAnchorWordBackward = editor => {
  const { value: { selection } } = editor
  const point = editor.getPreviousWordPoint(selection.anchor)
  editor.setAnchor(point)
}

/**
 * Move the selection's anchor point forward to the edge of the nearest word.
 *
 * @param {Editor} editor
 */

Commands.moveAnchorWordForward = editor => {
  const { value: { selection } } = editor
  const point = editor.getNextWordPoint(selection.anchor)
  editor.setAnchor(point)
}

/**
 * Move the selection backward by `n`.
 *
 * @param {Editor} editor
 * @param {Number} n
 */

Commands.moveBackward = (editor, n) => {
  editor.moveAnchorBackward(n)
  editor.moveFocusBackward(n)
}

/**
 * Move the selection backward by `n` words.
 *
 * @param {Editor} editor
 * @param {Number} n
 */

Commands.moveWordBackward = (editor, n) => {
  editor.moveAnchorWordBackward(n)
  editor.moveFocusWordBackward(n)
}

/**
 * Move the selection's end point backwards by `n`.
 *
 * @param {Editor} editor
 * @param {Number} n
 */

Commands.moveEndBackward = (editor, n = 1) => {
  if (editor.value.selection.isForward) {
    editor.moveFocusBackward(n)
  } else {
    editor.moveAnchorBackward(n)
  }
}

/**
 * Move the selection's end point forwards by `n`.
 *
 * @param {Editor} editor
 * @param {Number} n
 */

Commands.moveEndForward = (editor, n = 1) => {
  if (editor.value.selection.isForward) {
    editor.moveFocusForward(n)
  } else {
    editor.moveAnchorForward()
  }
}

/**
 * Move the selection's end point to a specific `path` and `offset`.
 *
 * @param {Editor} editor
 * @param {Array} path
 * @param {Number} offset
 */

Commands.moveEndTo = (editor, path, offset) => {
  const { value: { selection } } = editor
  const range = selection.moveEndTo(path, offset)
  editor.select(range)
}

/**
 * Move the selection's end point to the end of the block it's in.
 *
 * @param {Editor} editor
 */

Commands.moveEndToEndOfBlock = editor => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToEndOfBlock()
  } else {
    editor.moveAnchorToEndOfBlock()
  }
}

/**
 * Move the selection's end point to the end of the document.
 *
 * @param {Editor} editor
 */

Commands.moveEndToEndOfDocument = editor => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToEndOfDocument()
  } else {
    editor.moveAnchorToEndOfDocument()
  }
}

/**
 * Move the selection's end point to the end of the nearest inline.
 *
 * @param {Editor} editor
 */

Commands.moveEndToEndOfInline = editor => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToEndOfInline()
  } else {
    editor.moveAnchorToEndOfInline()
  }
}

/**
 * Move the selection's end point to the end of the next block.
 *
 * @param {Editor} editor
 */

Commands.moveEndToEndOfNextBlock = editor => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToEndOfNextBlock()
  } else {
    editor.moveAnchorToEndOfNextBlock()
  }
}

/**
 * Move the selection's end point to the end of the next inline.
 *
 * @param {Editor} editor
 */

Commands.moveEndToEndOfNextInline = editor => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToEndOfNextInline()
  } else {
    editor.moveAnchorToEndOfNextInline()
  }
}

/**
 * Move the selection's end point to the end of the next text node.
 *
 * @param {Editor} editor
 */

Commands.moveEndToEndOfNextText = editor => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToEndOfNextText()
  } else {
    editor.moveAnchorToEndOfNextText()
  }
}

/**
 * Move the selection's end point to the end of the node at `path`.
 *
 * @param {Editor} editor
 */

Commands.moveEndToEndOfPath = (editor, path) => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToEndOfPath(path)
  } else {
    editor.moveAnchorToEndOfPath(path)
  }
}

/**
 * Move the selection's end point to the end of the previous block.
 *
 * @param {Editor} editor
 */

Commands.moveEndToEndOfPreviousBlock = editor => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToEndOfPreviousBlock()
  } else {
    editor.moveAnchorToEndOfPreviousBlock()
  }
}

/**
 * Move the selection's end point to the end of the previous inline.
 *
 * @param {Editor} editor
 */

Commands.moveEndToEndOfPreviousInline = editor => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToEndOfPreviousInline()
  } else {
    editor.moveAnchorToEndOfPreviousInline()
  }
}

/**
 * Move the selection's end point to the end of the previous text node.
 *
 * @param {Editor} editor
 */

Commands.moveEndToEndOfPreviousText = editor => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToEndOfPreviousText()
  } else {
    editor.moveAnchorToEndOfPreviousText()
  }
}

/**
 * Move the selection's end point to the end of the text node it's in.
 *
 * @param {Editor} editor
 */

Commands.moveEndToEndOfText = editor => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToEndOfText()
  } else {
    editor.moveAnchorToEndOfText()
  }
}

/**
 * Move the selection's end point to the start of the block it's in.
 *
 * @param {Editor} editor
 */

Commands.moveEndToStartOfBlock = editor => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToStartOfBlock()
  } else {
    editor.moveAnchorToStartOfBlock()
  }
}

/**
 * Move the selection's end point to the start of the document.
 *
 * @param {Editor} editor
 */

Commands.moveEndToStartOfDocument = editor => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToStartOfDocument()
  } else {
    editor.moveAnchorToStartOfDocument()
  }
}

/**
 * Move the selection's end point to the start of the nearest inline.
 *
 * @param {Editor} editor
 */

Commands.moveEndToStartOfInline = editor => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToStartOfInline()
  } else {
    editor.moveAnchorToStartOfInline()
  }
}

/**
 * Move the selection's end point to the start of the next block.
 *
 * @param {Editor} editor
 */

Commands.moveEndToStartOfNextBlock = editor => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToStartOfNextBlock()
  } else {
    editor.moveAnchorToStartOfNextBlock()
  }
}

/**
 * Move the selection's end point to the start of the next inline.
 *
 * @param {Editor} editor
 */

Commands.moveEndToStartOfNextInline = editor => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToStartOfNextInline()
  } else {
    editor.moveAnchorToStartOfNextInline()
  }
}

/**
 * Move the selection's end point to the start of the next text node.
 *
 * @param {Editor} editor
 */

Commands.moveEndToStartOfNextText = editor => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToStartOfNextText()
  } else {
    editor.moveAnchorToStartOfNextText()
  }
}

/**
 * Move the selection's end point to the start of the node at `path`.
 *
 * @param {Editor} editor
 */

Commands.moveEndToStartOfPath = (editor, path) => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToStartOfPath(path)
  } else {
    editor.moveAnchorToStartOfPath(path)
  }
}

/**
 * Move the selection's end point to the start of the previous block.
 *
 * @param {Editor} editor
 */

Commands.moveEndToStartOfPreviousBlock = editor => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToStartOfPreviousBlock()
  } else {
    editor.moveAnchorToStartOfPreviousBlock()
  }
}

/**
 * Move the selection's end point to the start of the previous inline.
 *
 * @param {Editor} editor
 */

Commands.moveEndToStartOfPreviousInline = editor => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToStartOfPreviousInline()
  } else {
    editor.moveAnchorToStartOfPreviousInline()
  }
}

/**
 * Move the selection's end point to the start of the previous text node.
 *
 * @param {Editor} editor
 */

Commands.moveEndToStartOfPreviousText = editor => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToStartOfPreviousText()
  } else {
    editor.moveAnchorToStartOfPreviousText()
  }
}

/**
 * Move the selection's end point to the start of the text node it's in.
 *
 * @param {Editor} editor
 */

Commands.moveEndToStartOfText = editor => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToStartOfText()
  } else {
    editor.moveAnchorToStartOfText()
  }
}

/**
 * Move the selection's end point backward to the edge of the nearest word.
 *
 * @param {Editor} editor
 */

Commands.moveEndWordBackward = (editor, ...args) => {
  if (editor.value.selection.isForward) {
    editor.moveFocusWordBackward()
  } else {
    editor.moveAnchorWordBackward()
  }
}

/**
 * Move the selection's end point forward to the edge of the nearest word.
 *
 * @param {Editor} editor
 */

Commands.moveEndWordForward = (editor, ...args) => {
  if (editor.value.selection.isForward) {
    editor.moveFocusWordForward()
  } else {
    editor.moveAnchorWordForward()
  }
}

/**
 * Move the selection's focus point backwards by `n`.
 *
 * @param {Editor} editor
 * @param {Number} n
 */

Commands.moveFocusBackward = (editor, n = 1) => {
  const { value: { selection } } = editor
  const point = getPreviousPoint(editor, selection.focus, n)
  editor.setFocus(point)
}

/**
 * Move the selection's focus point forwards by `n`.
 *
 * @param {Editor} editor
 * @param {Number} n
 */

Commands.moveFocusForward = (editor, n = 1) => {
  const { value: { selection } } = editor
  const point = getNextPoint(editor, selection.focus, n)
  editor.setFocus(point)
}

/**
 * Move the selection's focus point to a specific `path` and `offset`.
 *
 * @param {Path} path
 * @param {Number} offset
 * @param {Editor} editor
 */

Commands.moveFocusTo = (editor, path, offset) => {
  const { value: { selection } } = editor
  const range = selection.moveFocusTo(path, offset)
  editor.select(range)
}

/**
 * Move the selection's focus point to the end of the block it's in.
 *
 * @param {Editor} editor
 */

Commands.moveFocusToEndOfBlock = editor => {
  const { value: { document, selection } } = editor
  const entry = document.closestBlock(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToEndOfPath(path)
  }
}

/**
 * Move the selection's focus point to the end of the node at `path`.
 *
 * @param {Editor} editor
 */

Commands.moveFocusToEndOfPath = (editor, path) => {
  const { value: { document } } = editor
  const entry = document.lastText({ path })

  if (entry) {
    const [targetNode, targetPath] = entry
    editor.moveFocusTo(targetPath, targetNode.text.length)
  }
}

/**
 * Move the selection's focus point to the end of the nearest inline.
 *
 * @param {Editor} editor
 */

Commands.moveFocusToEndOfInline = editor => {
  const { value: { document, selection } } = editor
  const entry = document.closestInline(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToEndOfPath(path)
  }
}

/**
 * Move the selection's focus point to the end of the document.
 *
 * @param {Editor} editor
 */

Commands.moveFocusToEndOfDocument = editor => {
  const { value: { document } } = editor
  const entry = document.lastText()

  if (entry) {
    const [, path] = entry
    editor.moveFocusToEndOfPath(path)
  }
}

/**
 * Move the selection's focus point to the end of the next block.
 *
 * @param {Editor} editor
 */

Commands.moveFocusToEndOfNextBlock = editor => {
  const { value: { document, selection } } = editor
  const entry = document.nextBlock(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToEndOfPath(path)
  }
}

/**
 * Move the selection's focus point to the end of the next inline.
 *
 * @param {Editor} editor
 */

Commands.moveFocusToEndOfNextInline = editor => {
  const { value: { document, selection } } = editor
  const entry = document.nextInline(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToEndOfPath(path)
  }
}

/**
 * Move the selection's focus point to the end of the next text node.
 *
 * @param {Editor} editor
 */

Commands.moveFocusToEndOfNextText = editor => {
  const { value: { document, selection } } = editor
  const entry = document.nextText(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToEndOfPath(path)
  }
}

/**
 * Move the selection's focus point to the end of the previous block.
 *
 * @param {Editor} editor
 */

Commands.moveFocusToEndOfPreviousBlock = editor => {
  const { value: { document, selection } } = editor
  const entry = document.previousBlock(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToEndOfPath(path)
  }
}

/**
 * Move the selection's focus point to the end of the previous inline.
 *
 * @param {Editor} editor
 */

Commands.moveFocusToEndOfPreviousInline = editor => {
  const { value: { document, selection } } = editor
  const entry = document.previousInline(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToEndOfPath(path)
  }
}

/**
 * Move the selection's focus point to the end of the previous text node.
 *
 * @param {Editor} editor
 */

Commands.moveFocusToEndOfPreviousText = editor => {
  const { value: { document, selection } } = editor
  const entry = document.previousText(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToEndOfPath(path)
  }
}

/**
 * Move the selection's focus point to the end of the text node it's in.
 *
 * @param {Editor} editor
 */

Commands.moveFocusToEndOfText = editor => {
  const { value: { selection } } = editor
  editor.moveFocusToEndOfPath(selection.focus.path)
}

/**
 * Move the selection's focus point to the start of the block it's in.
 *
 * @param {Editor} editor
 */

Commands.moveFocusToStartOfBlock = editor => {
  const { value: { document, selection } } = editor
  const entry = document.closestBlock(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToStartOfPath(path)
  }
}

/**
 * Move the selection's focus point to the start of the node at `path`.
 *
 * @param {Editor} editor
 */

Commands.moveFocusToStartOfPath = (editor, path) => {
  const { value: { document } } = editor
  const entry = document.lastText({ path })

  if (entry) {
    const [, targetPath] = entry
    editor.moveFocusTo(targetPath, 0)
  }
}

/**
 * Move the selection's focus point to the start of the nearest inline.
 *
 * @param {Editor} editor
 */

Commands.moveFocusToStartOfInline = editor => {
  const { value: { document, selection } } = editor
  const entry = document.closestInline(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToStartOfPath(path)
  }
}

/**
 * Move the selection's focus point to the start of the document.
 *
 * @param {Editor} editor
 */

Commands.moveFocusToStartOfDocument = editor => {
  const { value: { document } } = editor
  const entry = document.firstText()

  if (entry) {
    const [, path] = entry
    editor.moveFocusToStartOfPath(path)
  }
}

/**
 * Move the selection's focus point to the start of the next block.
 *
 * @param {Editor} editor
 */

Commands.moveFocusToStartOfNextBlock = editor => {
  const { value: { document, selection } } = editor
  const entry = document.nextBlock(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToStartOfPath(path)
  }
}

/**
 * Move the selection's focus point to the start of the next inline.
 *
 * @param {Editor} editor
 */

Commands.moveFocusToStartOfNextInline = editor => {
  const { value: { document, selection } } = editor
  const entry = document.nextInline(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToStartOfPath(path)
  }
}

/**
 * Move the selection's focus point to the start of the next text node.
 *
 * @param {Editor} editor
 */

Commands.moveFocusToStartOfNextText = editor => {
  const { value: { document, selection } } = editor
  const entry = document.nextText(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToStartOfPath(path)
  }
}

/**
 * Move the selection's focus point to the start of the previous block.
 *
 * @param {Editor} editor
 */

Commands.moveFocusToStartOfPreviousBlock = editor => {
  const { value: { document, selection } } = editor
  const entry = document.previousBlock(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToStartOfPath(path)
  }
}

/**
 * Move the selection's focus point to the start of the previous inline.
 *
 * @param {Editor} editor
 */

Commands.moveFocusToStartOfPreviousInline = editor => {
  const { value: { document, selection } } = editor
  const entry = document.previousInline(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToStartOfPath(path)
  }
}

/**
 * Move the selection's focus point to the start of the previous text node.
 *
 * @param {Editor} editor
 */

Commands.moveFocusToStartOfPreviousText = editor => {
  const { value: { document, selection } } = editor
  const entry = document.previousText(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToStartOfPath(path)
  }
}

/**
 * Move the selection's focus point to the start of the text node it's in.
 *
 * @param {Editor} editor
 */

Commands.moveFocusToStartOfText = editor => {
  const { value: { selection } } = editor
  editor.moveFocusToStartOfPath(selection.focus.path)
}

/**
 * Move the selection's focus point backward to the edge of the nearest word.
 *
 * @param {Editor} editor
 */

Commands.moveFocusWordBackward = editor => {
  const { value: { selection } } = editor
  const point = editor.getPreviousWordPoint(selection.focus)
  editor.setFocus(point)
}

/**
 * Move the selection's focus point forward to the edge of the nearest word.
 *
 * @param {Editor} editor
 */

Commands.moveFocusWordForward = editor => {
  const { value: { selection } } = editor
  const point = editor.getNextWordPoint(selection.focus)
  editor.setFocus(point)
}

/**
 * Move the selection's points each forward by one character.
 *
 * @param {Editor} editor
 */

Commands.moveForward = (editor, ...args) => {
  editor.moveAnchorForward(...args)
  editor.moveFocusForward(...args)
}

/**
 * Move the selection's start point backwards by `n`.
 *
 * @param {Editor} editor
 * @param {Number} n
 */

Commands.moveStartBackward = (editor, n = 1) => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorBackward(n)
  } else {
    editor.moveFocusBackward(n)
  }
}

/**
 * Move the selection's start point forwards by `n`.
 *
 * @param {Editor} editor
 * @param {Number} n
 */

Commands.moveStartForward = (editor, n = 1) => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorForward(n)
  } else {
    editor.moveFocusForward(n)
  }
}

/**
 * Move the selection's start point to a specific `path` and `offset`.
 *
 * @param {Editor} editor
 * @param {Array} path
 * @param {Number} offset
 */

Commands.moveStartTo = (editor, path, offset) => {
  const { value: { selection } } = editor
  const range = selection.moveStartTo(path, offset)
  editor.select(range)
}

/**
 * Move the selection's start point to the end of the block it's in.
 *
 * @param {Editor} editor
 */

Commands.moveStartToEndOfBlock = editor => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToEndOfBlock()
  } else {
    editor.moveFocusToEndOfBlock()
  }
}

/**
 * Move the selection's start point to the end of the document.
 *
 * @param {Editor} editor
 */

Commands.moveStartToEndOfDocument = editor => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToEndOfDocument()
  } else {
    editor.moveFocusToEndOfDocument()
  }
}

/**
 * Move the selection's start point to the end of the nearest inline.
 *
 * @param {Editor} editor
 */

Commands.moveStartToEndOfInline = editor => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToEndOfInline()
  } else {
    editor.moveFocusToEndOfInline()
  }
}

/**
 * Move the selection's start point to the end of the next block.
 *
 * @param {Editor} editor
 */

Commands.moveStartToEndOfNextBlock = editor => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToEndOfNextBlock()
  } else {
    editor.moveFocusToEndOfNextBlock()
  }
}

/**
 * Move the selection's start point to the end of the next inline.
 *
 * @param {Editor} editor
 */

Commands.moveStartToEndOfNextInline = editor => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToEndOfNextInline()
  } else {
    editor.moveFocusToEndOfNextInline()
  }
}

/**
 * Move the selection's start point to the end of the next text node.
 *
 * @param {Editor} editor
 */

Commands.moveStartToEndOfNextText = editor => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToEndOfNextText()
  } else {
    editor.moveFocusToEndOfNextText()
  }
}

/**
 * Move the selection's start point to the end of the node at `path`.
 *
 * @param {Editor} editor
 */

Commands.moveStartToEndOfPath = (editor, path) => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToEndOfPath(path)
  } else {
    editor.moveFocusToEndOfPath(path)
  }
}

/**
 * Move the selection's start point to the end of the previous block.
 *
 * @param {Editor} editor
 */

Commands.moveStartToEndOfPreviousBlock = editor => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToEndOfPreviousBlock()
  } else {
    editor.moveFocusToEndOfPreviousBlock()
  }
}

/**
 * Move the selection's start point to the end of the previous inline.
 *
 * @param {Editor} editor
 */

Commands.moveStartToEndOfPreviousInline = editor => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToEndOfPreviousInline()
  } else {
    editor.moveFocusToEndOfPreviousInline()
  }
}

/**
 * Move the selection's start point to the end of the previous text node.
 *
 * @param {Editor} editor
 */

Commands.moveStartToEndOfPreviousText = editor => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToEndOfPreviousText()
  } else {
    editor.moveFocusToEndOfPreviousText()
  }
}

/**
 * Move the selection's start point to the end of the text node it's in.
 *
 * @param {Editor} editor
 */

Commands.moveStartToEndOfText = editor => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToEndOfText()
  } else {
    editor.moveFocusToEndOfText()
  }
}

/**
 * Move the selection's start point to the start of the block it's in.
 *
 * @param {Editor} editor
 */

Commands.moveStartToStartOfBlock = editor => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToStartOfBlock()
  } else {
    editor.moveFocusToStartOfBlock()
  }
}

/**
 * Move the selection's start point to the start of the document.
 *
 * @param {Editor} editor
 */

Commands.moveStartToStartOfDocument = editor => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToStartOfDocument()
  } else {
    editor.moveFocusToStartOfDocument()
  }
}

/**
 * Move the selection's start point to the start of the nearest inline.
 *
 * @param {Editor} editor
 */

Commands.moveStartToStartOfInline = editor => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToStartOfInline()
  } else {
    editor.moveFocusToStartOfInline()
  }
}

/**
 * Move the selection's start point to the start of the next block.
 *
 * @param {Editor} editor
 */

Commands.moveStartToStartOfNextBlock = editor => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToStartOfNextBlock()
  } else {
    editor.moveFocusToStartOfNextBlock()
  }
}

/**
 * Move the selection's start point to the start of the next inline.
 *
 * @param {Editor} editor
 */

Commands.moveStartToStartOfNextInline = editor => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToStartOfNextInline()
  } else {
    editor.moveFocusToStartOfNextInline()
  }
}

/**
 * Move the selection's start point to the start of the next text node.
 *
 * @param {Editor} editor
 */

Commands.moveStartToStartOfNextText = editor => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToStartOfNextText()
  } else {
    editor.moveFocusToStartOfNextText()
  }
}

/**
 * Move the selection's start point to the start of the node at `path`.
 *
 * @param {Editor} editor
 */

Commands.moveStartToStartOfPath = (editor, path) => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToStartOfPath(path)
  } else {
    editor.moveFocusToStartOfPath(path)
  }
}

/**
 * Move the selection's start point to the start of the previous block.
 *
 * @param {Editor} editor
 */

Commands.moveStartToStartOfPreviousBlock = editor => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToStartOfPreviousBlock()
  } else {
    editor.moveFocusToStartOfPreviousBlock()
  }
}

/**
 * Move the selection's start point to the start of the previous inline.
 *
 * @param {Editor} editor
 */

Commands.moveStartToStartOfPreviousInline = editor => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToStartOfPreviousInline()
  } else {
    editor.moveFocusToStartOfPreviousInline()
  }
}

/**
 * Move the selection's start point to the start of the previous text node.
 *
 * @param {Editor} editor
 */

Commands.moveStartToStartOfPreviousText = editor => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToStartOfPreviousText()
  } else {
    editor.moveFocusToStartOfPreviousText()
  }
}

/**
 * Move the selection's start point to the start of the text node it's in.
 *
 * @param {Editor} editor
 */

Commands.moveStartToStartOfText = editor => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToStartOfText()
  } else {
    editor.moveFocusToStartOfText()
  }
}

/**
 * Move the selection's start point backward to the edge of the nearest word.
 *
 * @param {Editor} editor
 */

Commands.moveStartWordBackward = (editor, ...args) => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorWordBackward()
  } else {
    editor.moveFocusWordBackward()
  }
}

/**
 * Move the selection's start point forward to the edge of the nearest word.
 *
 * @param {Editor} editor
 */

Commands.moveStartWordForward = (editor, ...args) => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorWordForward()
  } else {
    editor.moveFocusWordForward()
  }
}

/**
 * Move the cursor to a specific `path` and `offset`.
 *
 * @param {Editor} editor
 * @param {Array} path
 * @param {Number} offset
 */

Commands.moveTo = (editor, path, offset) => {
  const { value: { selection } } = editor
  const range = selection.moveTo(path, offset)
  editor.select(range)
}

/**
 * Collapse the cursor to the selection's anchor point.
 *
 * @param {Editor} editor
 */

Commands.moveToAnchor = editor => {
  const { value: { selection } } = editor
  const range = selection.moveToAnchor()
  editor.select(range)
}

/**
 * Collapse the cursor to the selection's end point.
 *
 * @param {Editor} editor
 */

Commands.moveToEnd = editor => {
  const { value: { selection } } = editor
  const range = selection.moveToEnd()
  editor.select(range)
}

/**
 * Collapse the cursor to the end of the current block.
 *
 * @param {Editor} editor
 */

Commands.moveToEndOfBlock = editor => {
  editor.moveEndToEndOfBlock()
  editor.moveToEnd()
}

/**
 * Collapse the cursor to the end of the document.
 *
 * @param {Editor} editor
 */

Commands.moveToEndOfDocument = editor => {
  editor.moveEndToEndOfDocument()
  editor.moveToEnd()
}

/**
 * Collapse the cursor to the end of the current inline.
 *
 * @param {Editor} editor
 */

Commands.moveToEndOfInline = editor => {
  editor.moveEndToEndOfInline()
  editor.moveToEnd()
}

/**
 * Collapse the cursor to the end of the next block.
 *
 * @param {Editor} editor
 */

Commands.moveToEndOfNextBlock = editor => {
  editor.moveEndToEndOfNextBlock()
  editor.moveToEnd()
}

/**
 * Collapse the cursor to the end of the next inline.
 *
 * @param {Editor} editor
 */

Commands.moveToEndOfNextInline = editor => {
  editor.moveEndToEndOfNextInline()
  editor.moveToEnd()
}

/**
 * Collapse the cursor to the end of the next text node.
 *
 * @param {Editor} editor
 */

Commands.moveToEndOfNextText = editor => {
  editor.moveEndToEndOfNextText()
  editor.moveToEnd()
}

/**
 * Collapse the cursor to the end of the node at `path`.
 *
 * @param {Editor}
 * @param {Array} path
 */

Commands.moveToEndOfPath = (editor, path) => {
  editor.moveAnchorToEndOfPath(path)
  editor.moveToAnchor()
}

/**
 * Collapse the cursor to the end of the previous block.
 *
 * @param {Editor} editor
 */

Commands.moveToEndOfPreviousBlock = editor => {
  editor.moveStartToEndOfPreviousBlock()
  editor.moveToStart()
}

/**
 * Collapse the cursor to the end of the previous inline.
 *
 * @param {Editor} editor
 */

Commands.moveToEndOfPreviousInline = editor => {
  editor.moveStartToEndOfPreviousInline()
  editor.moveToStart()
}

/**
 * Collapse the cursor to the end of the previous text node.
 *
 * @param {Editor} editor
 */

Commands.moveToEndOfPreviousText = editor => {
  editor.moveStartToEndOfPreviousText()
  editor.moveToStart()
}

/**
 * Collapse the cursor to the end of the current text node.
 *
 * @param {Editor} editor
 */

Commands.moveToEndOfText = editor => {
  editor.moveEndToEndOfText()
  editor.moveToEnd()
}

/**
 * Collapse the cursor to the selection's focus point.
 *
 * @param {Editor} editor
 */

Commands.moveToFocus = editor => {
  const { value: { selection } } = editor
  const range = selection.moveToFocus()
  editor.select(range)
}

/**
 * Move the selection's anchor and focus points to the start and end of the
 * document, respectively.
 *
 * @param {Editor} editor
 */

Commands.moveToRangeOfDocument = editor => {
  editor.moveAnchorToStartOfDocument()
  editor.moveFocusToEndOfDocument()
}

/**
 * Move the selection's anchor and focus points to the start and end of the
 * current block, respectively.
 *
 * @param {Editor} editor
 */

Commands.moveToRangeOfBlock = editor => {
  editor.moveToStart()
  editor.moveAnchorToStartOfBlock()
  editor.moveFocusToEndOfBlock()
}

/**
 * Move the selection's anchor and focus points to the start and end of the
 * current inline, respectively.
 *
 * @param {Editor} editor
 */

Commands.moveToRangeOfInline = editor => {
  editor.moveToStart()
  editor.moveAnchorToStartOfBlock()
  editor.moveFocusToEndOfBlock()
}

/**
 * Move the selection's anchor and focus points to the start and end of the
 * current text node, respectively.
 *
 * @param {Editor} editor
 */

Commands.moveToRangeOfInline = editor => {
  editor.moveToStart()
  editor.moveAnchorToStartOfText()
  editor.moveFocusToEndOfText()
}

/**
 * Collapse the cursor to the end of the node at `path`.
 *
 * @param {Editor}
 * @param {Array} path
 */

Commands.moveToRangeOfPath = (editor, path) => {
  editor.moveAnchorToStartOfPath(path)
  editor.moveFocusToEndOfPath(path)
}

/**
 * Collapse the cursor to the selection's start point.
 *
 * @param {Editor} editor
 */

Commands.moveToStart = editor => {
  const { value: { selection } } = editor
  const range = selection.moveToStart()
  editor.select(range)
}

/**
 * Collapse the cursor to the start of the current block.
 *
 * @param {Editor} editor
 */

Commands.moveToStartOfBlock = editor => {
  editor.moveStartToStartOfBlock()
  editor.moveToStart()
}

/**
 * Collapse the cursor to the start of the document.
 *
 * @param {Editor} editor
 */

Commands.moveToStartOfDocument = editor => {
  editor.moveStartToStartOfDocument()
  editor.moveToStart()
}

/**
 * Collapse the cursor to the start of the current inline.
 *
 * @param {Editor} editor
 */

Commands.moveToStartOfInline = editor => {
  editor.moveStartToStartOfInline()
  editor.moveToStart()
}

/**
 * Collapse the cursor to the start of the next block.
 *
 * @param {Editor} editor
 */

Commands.moveToStartOfNextBlock = editor => {
  editor.moveEndToStartOfNextBlock()
  editor.moveToEnd()
}

/**
 * Collapse the cursor to the start of the next inline.
 *
 * @param {Editor} editor
 */

Commands.moveToStartOfNextInline = editor => {
  editor.moveEndToStartOfNextInline()
  editor.moveToEnd()
}

/**
 * Collapse the cursor to the start of the next text node.
 *
 * @param {Editor} editor
 */

Commands.moveToStartOfNextText = editor => {
  editor.moveEndToStartOfNextText()
  editor.moveToEnd()
}

/**
 * Collapse the cursor to the start of the node at `path`.
 *
 * @param {Editor} editor
 * @param {Array} path
 */

Commands.moveToStartOfPath = (editor, path) => {
  editor.moveAnchorToStartOfPath(path)
  editor.moveToAnchor()
}

/**
 * Collapse the cursor to the start of the previous block.
 *
 * @param {Editor} editor
 */

Commands.moveToStartOfPreviousBlock = editor => {
  editor.moveStartToStartOfPreviousBlock()
  editor.moveToStart()
}

/**
 * Collapse the cursor to the start of the previous inline.
 *
 * @param {Editor} editor
 */

Commands.moveToStartOfPreviousInline = editor => {
  editor.moveStartToStartOfPreviousInline()
  editor.moveToStart()
}

/**
 * Collapse the cursor to the start of the previous text node.
 *
 * @param {Editor} editor
 */

Commands.moveToStartOfPreviousText = editor => {
  editor.moveStartToStartOfPreviousText()
  editor.moveToStart()
}

/**
 * Collapse the cursor to the start of the current text node.
 *
 * @param {Editor} editor
 */

Commands.moveToStartOfText = editor => {
  editor.moveStartToStartOfText()
  editor.moveToStart()
}

/**
 * Move the selection's points each backward by `n` words.
 *
 * @param {Editor} editor
 * @param {Number} n
 */

Commands.moveWordBackward = (editor, n) => {
  editor.moveAnchorWordBackward(n)
  editor.moveFocusWordBackward(n)
}

/**
 * Move the selection's points each forward by `n` words.
 *
 * @param {Editor} editor
 * @param {Number} n
 */

Commands.moveWordForward = (editor, n) => {
  editor.moveAnchorWordForward(n)
  editor.moveFocusWordForward(n)
}

/**
 * Set new `properties` on the selection.
 *
 * @param {Editor} editor
 * @param {Object} properties
 * @param {Object} options
 */

Commands.select = (editor, properties, options = {}) => {
  properties = Selection.createProperties(properties)
  const { snapshot = false } = options
  const { value } = editor
  const { document, selection } = value
  const newProperties = {}
  let next = selection.setProperties(properties)
  next = document.resolveSelection(next)

  // Re-compute the properties, to ensure that we get their normalized values.
  properties = pick(next, Object.keys(properties))

  // Remove any properties that are already equal to the current selection. And
  // create a dictionary of the previous values for all of the properties that
  // are being changed, for the inverse operation.
  for (const k in properties) {
    if (snapshot === true || !is(properties[k], selection[k])) {
      newProperties[k] = properties[k]
    }
  }

  // If the selection moves, clear any marks, unless the new selection
  // properties change the marks in some way.
  if (
    selection.marks &&
    !newProperties.marks &&
    (newProperties.anchor || newProperties.focus)
  ) {
    newProperties.marks = null
  }

  // If there are no new properties to set, abort to avoid extra operations.
  if (Object.keys(newProperties).length === 0) {
    return
  }

  // TODO: for some reason toJSON() is required here (it breaks selections between blocks)? - 2018-10-10
  const prevProperties = pick(selection.toJSON(), Object.keys(newProperties))

  editor.applyOperation(
    {
      type: 'set_selection',
      value,
      properties: prevProperties,
      newProperties,
    },
    snapshot ? { skip: false, merge: false } : {}
  )
}

/**
 * Set the selection's anchor point to the return value of `fn`.
 *
 * @param {Editor} editor
 * @param {Function} fn
 */

Commands.setAnchor = (editor, fn) => {
  const { value: { selection } } = editor
  const range = selection.setAnchor(fn)
  editor.select(range)
}

/**
 * Set the selection's end point to the return value of `fn`.
 *
 * @param {Editor} editor
 * @param {Function} fn
 */

Commands.setEnd = (editor, fn) => {
  const { value: { selection } } = editor
  const range = selection.setEnd(fn)
  editor.select(range)
}

/**
 * Set the selection's focus point to the return value of `fn`.
 *
 * @param {Editor} editor
 * @param {Function} fn
 */

Commands.setFocus = (editor, fn) => {
  const { value: { selection } } = editor
  const range = selection.setFocus(fn)
  editor.select(range)
}

/**
 * Set the selection's start point to the return value of `fn`.
 *
 * @param {Editor} editor
 * @param {Function} fn
 */

Commands.setStart = (editor, fn) => {
  const { value: { selection } } = editor
  const range = selection.setStart(fn)
  editor.select(range)
}

/**
 * HACK: Snapshot the selection, saving an entry in the history.
 *
 * @param {Editor} editor
 */

Commands.snapshotSelection = editor => {
  editor.withoutMerging(() => {
    editor.select(editor.value.selection, { snapshot: true })
  })
}

/**
 * Deprecated.
 */

Commands.moveAnchorToEndOfNode = (editor, ...args) => {
  warning(
    false,
    'As of slate@0.48 the `editor.moveAnchorToEndOfNode(node) command is deprecated. Use the `editor.moveAnchorToEndOfPath(path)` command instead.'
  )

  const { value: { selection } } = editor
  const range = selection.moveAnchorToEndOfNode(...args)
  editor.select(range)
}

Commands.moveAnchorToStartOfNode = (editor, ...args) => {
  warning(
    false,
    'As of slate@0.48 the `editor.moveAnchorToStartOfNode(node) command is deprecated. Use the `editor.moveAnchorToStartOfPath(path)` command instead.'
  )

  const { value: { selection } } = editor
  const range = selection.moveAnchorToStartOfNode(...args)
  editor.select(range)
}

Commands.moveEndToEndOfNode = (editor, ...args) => {
  warning(
    false,
    'As of slate@0.48 the `editor.moveEndToEndOfNode(node) command is deprecated. Use the `editor.moveEndToEndOfPath(path)` command instead.'
  )

  const { value: { selection } } = editor
  const range = selection.moveEndToEndOfNode(...args)
  editor.select(range)
}

Commands.moveEndToStartOfNode = (editor, ...args) => {
  warning(
    false,
    'As of slate@0.48 the `editor.moveEndToStartOfNode(node) command is deprecated. Use the `editor.moveEndToStartOfPath(path)` command instead.'
  )

  const { value: { selection } } = editor
  const range = selection.moveEndToStartOfNode(...args)
  editor.select(range)
}

Commands.moveFocusToEndOfNode = (editor, ...args) => {
  warning(
    false,
    'As of slate@0.48 the `editor.moveFocusToEndOfNode(node) command is deprecated. Use the `editor.moveFocusToEndOfPath(path)` command instead.'
  )

  const { value: { selection } } = editor
  const range = selection.moveFocusToEndOfNode(...args)
  editor.select(range)
}

Commands.moveFocusToStartOfNode = (editor, ...args) => {
  warning(
    false,
    'As of slate@0.48 the `editor.moveFocusToStartOfNode(node) command is deprecated. Use the `editor.moveFocusToStartOfPath(path)` command instead.'
  )

  const { value: { selection } } = editor
  const range = selection.moveFocusToStartOfNode(...args)
  editor.select(range)
}

Commands.moveStartToEndOfNode = (editor, ...args) => {
  warning(
    false,
    'As of slate@0.48 the `editor.moveStartToEndOfNode(node) command is deprecated. Use the `editor.moveStartToEndOfPath(path)` command instead.'
  )

  const { value: { selection } } = editor
  const range = selection.moveStartToEndOfNode(...args)
  editor.select(range)
}

Commands.moveStartToStartOfNode = (editor, ...args) => {
  warning(
    false,
    'As of slate@0.48 the `editor.moveStartToStartOfNode(node) command is deprecated. Use the `editor.moveStartToStartOfPath(path)` command instead.'
  )

  const { value: { selection } } = editor
  const range = selection.moveStartToStartOfNode(...args)
  editor.select(range)
}

Commands.moveToEndOfNode = (editor, ...args) => {
  warning(
    false,
    'As of slate@0.48 the `editor.moveToEndOfNode(node) command is deprecated. Use the `editor.moveToEndOfPath(path)` command instead.'
  )

  const { value: { selection } } = editor
  const range = selection.moveToEndOfNode(...args)
  editor.select(range)
}

Commands.moveToRangeOfNode = (editor, ...args) => {
  warning(
    false,
    'As of slate@0.48 the `editor.moveToRangeOfNode(node) command is deprecated. Use the `editor.moveToRangeOfPath(path)` command instead.'
  )

  const { value: { selection } } = editor
  const range = selection.moveToRangeOfNode(...args)
  editor.select(range)
}

Commands.moveToStartOfNode = (editor, ...args) => {
  warning(
    false,
    'As of slate@0.48 the `editor.moveToStartOfNode(node) command is deprecated. Use the `editor.moveToStartOfPath(path)` command instead.'
  )

  const { value: { selection } } = editor
  const range = selection.moveToStartOfNode(...args)
  editor.select(range)
}

export default Commands
