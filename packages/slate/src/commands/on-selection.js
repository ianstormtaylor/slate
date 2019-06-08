import { is } from 'immutable'
import warning from 'tiny-warning'
import pick from 'lodash/pick'

import Selection from '../models/selection'

const Commands = {}

/**
 * Get the next point by `n`.
 *
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
 */

Commands.blur = (fn, editor) => () => {
  editor.select({ isFocused: false })
}

/**
 * Deselect the selection.
 */

Commands.deselect = (fn, editor) => () => {
  editor.select(Selection.create())
}

/**
 * Focus the selection.
 */

Commands.focus = (fn, editor) => () => {
  editor.select({ isFocused: true })
}

/**
 * Flip the selection's anchor and focus points.
 */

Commands.flip = (fn, editor) => () => {
  const { value: { selection } } = editor
  const range = selection.flip()
  editor.select(range)
}

/**
 * Move the selection's anchor point backwards by `n`.
 *
 * @param {Number} n
 */

Commands.moveAnchorBackward = (fn, editor) => (n = 1) => {
  const { value: { selection } } = editor
  const point = getPreviousPoint(editor, selection.anchor, n)
  editor.setAnchor(point)
}

/**
 * Move the selection's anchor point forwards by `n`.
 *
 * @param {Number} n
 */

Commands.moveAnchorForward = (fn, editor) => (n = 1) => {
  const { value: { selection } } = editor
  const point = getNextPoint(editor, selection.anchor, n)
  editor.setAnchor(point)
}

/**
 * Move the selection's anchor point to a specific `path` and `offset`.
 *
 * @param {Path} path
 * @param {Number} offset
 */

Commands.moveAnchorTo = (fn, editor) => (path, offset) => {
  const { value: { selection } } = editor
  const range = selection.moveAnchorTo(path, offset)
  editor.select(range)
}

/**
 * Move the selection's anchor point to the end of the block it's in.
 */

Commands.moveAnchorToEndOfBlock = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.closestBlock(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToEndOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the end of the node at `path`.
 */

Commands.moveAnchorToEndOfPath = (fn, editor) => path => {
  const { value: { document } } = editor
  const entry = document.lastText({ path })

  if (entry) {
    const [targetNode, targetPath] = entry
    editor.moveAnchorTo(targetPath, targetNode.text.length)
  }
}

/**
 * Move the selection's anchor point to the end of the nearest inline.
 */

Commands.moveAnchorToEndOfInline = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.closestInline(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToEndOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the end of the document.
 */

Commands.moveAnchorToEndOfDocument = (fn, editor) => () => {
  const { value: { document } } = editor
  const entry = document.lastText()

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToEndOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the end of the next block.
 */

Commands.moveAnchorToEndOfNextBlock = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.nextBlock(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToEndOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the end of the next inline.
 */

Commands.moveAnchorToEndOfNextInline = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.nextInline(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToEndOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the end of the next text node.
 */

Commands.moveAnchorToEndOfNextText = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.nextText(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToEndOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the end of the previous block.
 */

Commands.moveAnchorToEndOfPreviousBlock = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.previousBlock(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToEndOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the end of the previous inline.
 */

Commands.moveAnchorToEndOfPreviousInline = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.previousInline(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToEndOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the end of the previous text node.
 */

Commands.moveAnchorToEndOfPreviousText = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.previousText(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToEndOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the end of the text node it's in.
 */

Commands.moveAnchorToEndOfText = (fn, editor) => () => {
  const { value: { selection } } = editor
  editor.moveAnchorToEndOfPath(selection.anchor.path)
}

/**
 * Move the selection's anchor point to the start of the block it's in.
 */

Commands.moveAnchorToStartOfBlock = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.closestBlock(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToStartOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the start of the node at `path`.
 */

Commands.moveAnchorToStartOfPath = (fn, editor) => path => {
  const { value: { document } } = editor
  const entry = document.lastText({ path })

  if (entry) {
    const [, targetPath] = entry
    editor.moveAnchorTo(targetPath, 0)
  }
}

/**
 * Move the selection's anchor point to the start of the nearest inline.
 */

Commands.moveAnchorToStartOfInline = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.closestInline(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToStartOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the start of the document.
 */

Commands.moveAnchorToStartOfDocument = (fn, editor) => () => {
  const { value: { document } } = editor
  const entry = document.firstText()

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToStartOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the start of the next block.
 */

Commands.moveAnchorToStartOfNextBlock = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.nextBlock(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToStartOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the start of the next inline.
 */

Commands.moveAnchorToStartOfNextInline = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.nextInline(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToStartOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the start of the next text node.
 */

Commands.moveAnchorToStartOfNextText = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.nextText(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToStartOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the start of the previous block.
 */

Commands.moveAnchorToStartOfPreviousBlock = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.previousBlock(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToStartOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the start of the previous inline.
 */

Commands.moveAnchorToStartOfPreviousInline = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.previousInline(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToStartOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the start of the previous text node.
 */

Commands.moveAnchorToStartOfPreviousText = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.previousText(selection.anchor.path)

  if (entry) {
    const [, path] = entry
    editor.moveAnchorToStartOfPath(path)
  }
}

/**
 * Move the selection's anchor point to the start of the text node it's in.
 */

Commands.moveAnchorToStartOfText = (fn, editor) => () => {
  const { value: { selection } } = editor
  editor.moveAnchorToStartOfPath(selection.anchor.path)
}

/**
 * Move the selection's anchor point backward to the edge of the nearest word.
 */

Commands.moveAnchorWordBackward = (fn, editor) => () => {
  const { value: { selection } } = editor
  const point = editor.getPreviousWordPoint(selection.anchor)
  editor.setAnchor(point)
}

/**
 * Move the selection's anchor point forward to the edge of the nearest word.
 */

Commands.moveAnchorWordForward = (fn, editor) => () => {
  const { value: { selection } } = editor
  const point = editor.getNextWordPoint(selection.anchor)
  editor.setAnchor(point)
}

/**
 * Move the selection backward by `n`.
 *
 * @param {Number} n
 */

Commands.moveBackward = (fn, editor) => n => {
  editor.moveAnchorBackward(n)
  editor.moveFocusBackward(n)
}

/**
 * Move the selection's end point backwards by `n`.
 *
 * @param {Number} n
 */

Commands.moveEndBackward = (fn, editor) => (n = 1) => {
  if (editor.value.selection.isForward) {
    editor.moveFocusBackward(n)
  } else {
    editor.moveAnchorBackward(n)
  }
}

/**
 * Move the selection's end point forwards by `n`.
 *
 * @param {Number} n
 */

Commands.moveEndForward = (fn, editor) => (n = 1) => {
  if (editor.value.selection.isForward) {
    editor.moveFocusForward(n)
  } else {
    editor.moveAnchorForward()
  }
}

/**
 * Move the selection's end point to a specific `path` and `offset`.
 *
 * @param {Array} path
 * @param {Number} offset
 */

Commands.moveEndTo = (fn, editor) => (path, offset) => {
  const { value: { selection } } = editor
  const range = selection.moveEndTo(path, offset)
  editor.select(range)
}

/**
 * Move the selection's end point to the end of the block it's in.
 */

Commands.moveEndToEndOfBlock = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToEndOfBlock()
  } else {
    editor.moveAnchorToEndOfBlock()
  }
}

/**
 * Move the selection's end point to the end of the document.
 */

Commands.moveEndToEndOfDocument = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToEndOfDocument()
  } else {
    editor.moveAnchorToEndOfDocument()
  }
}

/**
 * Move the selection's end point to the end of the nearest inline.
 */

Commands.moveEndToEndOfInline = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToEndOfInline()
  } else {
    editor.moveAnchorToEndOfInline()
  }
}

/**
 * Move the selection's end point to the end of the next block.
 */

Commands.moveEndToEndOfNextBlock = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToEndOfNextBlock()
  } else {
    editor.moveAnchorToEndOfNextBlock()
  }
}

/**
 * Move the selection's end point to the end of the next inline.
 */

Commands.moveEndToEndOfNextInline = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToEndOfNextInline()
  } else {
    editor.moveAnchorToEndOfNextInline()
  }
}

/**
 * Move the selection's end point to the end of the next text node.
 */

Commands.moveEndToEndOfNextText = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToEndOfNextText()
  } else {
    editor.moveAnchorToEndOfNextText()
  }
}

/**
 * Move the selection's end point to the end of the node at `path`.
 */

Commands.moveEndToEndOfPath = (fn, editor) => path => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToEndOfPath(path)
  } else {
    editor.moveAnchorToEndOfPath(path)
  }
}

/**
 * Move the selection's end point to the end of the previous block.
 */

Commands.moveEndToEndOfPreviousBlock = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToEndOfPreviousBlock()
  } else {
    editor.moveAnchorToEndOfPreviousBlock()
  }
}

/**
 * Move the selection's end point to the end of the previous inline.
 */

Commands.moveEndToEndOfPreviousInline = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToEndOfPreviousInline()
  } else {
    editor.moveAnchorToEndOfPreviousInline()
  }
}

/**
 * Move the selection's end point to the end of the previous text node.
 */

Commands.moveEndToEndOfPreviousText = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToEndOfPreviousText()
  } else {
    editor.moveAnchorToEndOfPreviousText()
  }
}

/**
 * Move the selection's end point to the end of the text node it's in.
 */

Commands.moveEndToEndOfText = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToEndOfText()
  } else {
    editor.moveAnchorToEndOfText()
  }
}

/**
 * Move the selection's end point to the start of the block it's in.
 */

Commands.moveEndToStartOfBlock = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToStartOfBlock()
  } else {
    editor.moveAnchorToStartOfBlock()
  }
}

/**
 * Move the selection's end point to the start of the document.
 */

Commands.moveEndToStartOfDocument = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToStartOfDocument()
  } else {
    editor.moveAnchorToStartOfDocument()
  }
}

/**
 * Move the selection's end point to the start of the nearest inline.
 */

Commands.moveEndToStartOfInline = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToStartOfInline()
  } else {
    editor.moveAnchorToStartOfInline()
  }
}

/**
 * Move the selection's end point to the start of the next block.
 */

Commands.moveEndToStartOfNextBlock = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToStartOfNextBlock()
  } else {
    editor.moveAnchorToStartOfNextBlock()
  }
}

/**
 * Move the selection's end point to the start of the next inline.
 */

Commands.moveEndToStartOfNextInline = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToStartOfNextInline()
  } else {
    editor.moveAnchorToStartOfNextInline()
  }
}

/**
 * Move the selection's end point to the start of the next text node.
 */

Commands.moveEndToStartOfNextText = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToStartOfNextText()
  } else {
    editor.moveAnchorToStartOfNextText()
  }
}

/**
 * Move the selection's end point to the start of the node at `path`.
 */

Commands.moveEndToStartOfPath = (fn, editor) => path => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToStartOfPath(path)
  } else {
    editor.moveAnchorToStartOfPath(path)
  }
}

/**
 * Move the selection's end point to the start of the previous block.
 */

Commands.moveEndToStartOfPreviousBlock = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToStartOfPreviousBlock()
  } else {
    editor.moveAnchorToStartOfPreviousBlock()
  }
}

/**
 * Move the selection's end point to the start of the previous inline.
 */

Commands.moveEndToStartOfPreviousInline = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToStartOfPreviousInline()
  } else {
    editor.moveAnchorToStartOfPreviousInline()
  }
}

/**
 * Move the selection's end point to the start of the previous text node.
 */

Commands.moveEndToStartOfPreviousText = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToStartOfPreviousText()
  } else {
    editor.moveAnchorToStartOfPreviousText()
  }
}

/**
 * Move the selection's end point to the start of the text node it's in.
 */

Commands.moveEndToStartOfText = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveFocusToStartOfText()
  } else {
    editor.moveAnchorToStartOfText()
  }
}

/**
 * Move the selection's end point backward to the edge of the nearest word.
 */

Commands.moveEndWordBackward = (fn, editor) => (...args) => {
  if (editor.value.selection.isForward) {
    editor.moveFocusWordBackward()
  } else {
    editor.moveAnchorWordBackward()
  }
}

/**
 * Move the selection's end point forward to the edge of the nearest word.
 */

Commands.moveEndWordForward = (fn, editor) => (...args) => {
  if (editor.value.selection.isForward) {
    editor.moveFocusWordForward()
  } else {
    editor.moveAnchorWordForward()
  }
}

/**
 * Move the selection's focus point backwards by `n`.
 *
 * @param {Number} n
 */

Commands.moveFocusBackward = (fn, editor) => (n = 1) => {
  const { value: { selection } } = editor
  const point = getPreviousPoint(editor, selection.focus, n)
  editor.setFocus(point)
}

/**
 * Move the selection's focus point forwards by `n`.
 *
 * @param {Number} n
 */

Commands.moveFocusForward = (fn, editor) => (n = 1) => {
  const { value: { selection } } = editor
  const point = getNextPoint(editor, selection.focus, n)
  editor.setFocus(point)
}

/**
 * Move the selection's focus point to a specific `path` and `offset`.
 *
 * @param {Path} path
 * @param {Number} offset
 */

Commands.moveFocusTo = (fn, editor) => (path, offset) => {
  const { value: { selection } } = editor
  const range = selection.moveFocusTo(path, offset)
  editor.select(range)
}

/**
 * Move the selection's focus point to the end of the block it's in.
 */

Commands.moveFocusToEndOfBlock = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.closestBlock(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToEndOfPath(path)
  }
}

/**
 * Move the selection's focus point to the end of the node at `path`.
 */

Commands.moveFocusToEndOfPath = (fn, editor) => path => {
  const { value: { document } } = editor
  const entry = document.lastText({ path })

  if (entry) {
    const [targetNode, targetPath] = entry
    editor.moveFocusTo(targetPath, targetNode.text.length)
  }
}

/**
 * Move the selection's focus point to the end of the nearest inline.
 */

Commands.moveFocusToEndOfInline = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.closestInline(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToEndOfPath(path)
  }
}

/**
 * Move the selection's focus point to the end of the document.
 */

Commands.moveFocusToEndOfDocument = (fn, editor) => () => {
  const { value: { document } } = editor
  const entry = document.lastText()

  if (entry) {
    const [, path] = entry
    editor.moveFocusToEndOfPath(path)
  }
}

/**
 * Move the selection's focus point to the end of the next block.
 */

Commands.moveFocusToEndOfNextBlock = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.nextBlock(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToEndOfPath(path)
  }
}

/**
 * Move the selection's focus point to the end of the next inline.
 */

Commands.moveFocusToEndOfNextInline = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.nextInline(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToEndOfPath(path)
  }
}

/**
 * Move the selection's focus point to the end of the next text node.
 */

Commands.moveFocusToEndOfNextText = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.nextText(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToEndOfPath(path)
  }
}

/**
 * Move the selection's focus point to the end of the previous block.
 */

Commands.moveFocusToEndOfPreviousBlock = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.previousBlock(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToEndOfPath(path)
  }
}

/**
 * Move the selection's focus point to the end of the previous inline.
 */

Commands.moveFocusToEndOfPreviousInline = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.previousInline(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToEndOfPath(path)
  }
}

/**
 * Move the selection's focus point to the end of the previous text node.
 */

Commands.moveFocusToEndOfPreviousText = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.previousText(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToEndOfPath(path)
  }
}

/**
 * Move the selection's focus point to the end of the text node it's in.
 */

Commands.moveFocusToEndOfText = (fn, editor) => () => {
  const { value: { selection } } = editor
  editor.moveFocusToEndOfPath(selection.focus.path)
}

/**
 * Move the selection's focus point to the start of the block it's in.
 */

Commands.moveFocusToStartOfBlock = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.closestBlock(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToStartOfPath(path)
  }
}

/**
 * Move the selection's focus point to the start of the node at `path`.
 */

Commands.moveFocusToStartOfPath = (fn, editor) => path => {
  const { value: { document } } = editor
  const entry = document.lastText({ path })

  if (entry) {
    const [, targetPath] = entry
    editor.moveFocusTo(targetPath, 0)
  }
}

/**
 * Move the selection's focus point to the start of the nearest inline.
 */

Commands.moveFocusToStartOfInline = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.closestInline(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToStartOfPath(path)
  }
}

/**
 * Move the selection's focus point to the start of the document.
 */

Commands.moveFocusToStartOfDocument = (fn, editor) => () => {
  const { value: { document } } = editor
  const entry = document.firstText()

  if (entry) {
    const [, path] = entry
    editor.moveFocusToStartOfPath(path)
  }
}

/**
 * Move the selection's focus point to the start of the next block.
 */

Commands.moveFocusToStartOfNextBlock = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.nextBlock(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToStartOfPath(path)
  }
}

/**
 * Move the selection's focus point to the start of the next inline.
 */

Commands.moveFocusToStartOfNextInline = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.nextInline(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToStartOfPath(path)
  }
}

/**
 * Move the selection's focus point to the start of the next text node.
 */

Commands.moveFocusToStartOfNextText = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.nextText(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToStartOfPath(path)
  }
}

/**
 * Move the selection's focus point to the start of the previous block.
 */

Commands.moveFocusToStartOfPreviousBlock = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.previousBlock(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToStartOfPath(path)
  }
}

/**
 * Move the selection's focus point to the start of the previous inline.
 */

Commands.moveFocusToStartOfPreviousInline = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.previousInline(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToStartOfPath(path)
  }
}

/**
 * Move the selection's focus point to the start of the previous text node.
 */

Commands.moveFocusToStartOfPreviousText = (fn, editor) => () => {
  const { value: { document, selection } } = editor
  const entry = document.previousText(selection.focus.path)

  if (entry) {
    const [, path] = entry
    editor.moveFocusToStartOfPath(path)
  }
}

/**
 * Move the selection's focus point to the start of the text node it's in.
 */

Commands.moveFocusToStartOfText = (fn, editor) => () => {
  const { value: { selection } } = editor
  editor.moveFocusToStartOfPath(selection.focus.path)
}

/**
 * Move the selection's focus point backward to the edge of the nearest word.
 */

Commands.moveFocusWordBackward = (fn, editor) => () => {
  const { value: { selection } } = editor
  const point = editor.getPreviousWordPoint(selection.focus)
  editor.setFocus(point)
}

/**
 * Move the selection's focus point forward to the edge of the nearest word.
 */

Commands.moveFocusWordForward = (fn, editor) => () => {
  const { value: { selection } } = editor
  const point = editor.getNextWordPoint(selection.focus)
  editor.setFocus(point)
}

/**
 * Move the selection's points each forward by one character.
 */

Commands.moveForward = (fn, editor) => (...args) => {
  editor.moveAnchorForward(...args)
  editor.moveFocusForward(...args)
}

/**
 * Move the selection's start point backwards by `n`.
 *
 * @param {Number} n
 */

Commands.moveStartBackward = (fn, editor) => (n = 1) => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorBackward(n)
  } else {
    editor.moveFocusBackward(n)
  }
}

/**
 * Move the selection's start point forwards by `n`.
 *
 * @param {Number} n
 */

Commands.moveStartForward = (fn, editor) => (n = 1) => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorForward(n)
  } else {
    editor.moveFocusForward(n)
  }
}

/**
 * Move the selection's start point to a specific `path` and `offset`.
 *
 * @param {Array} path
 * @param {Number} offset
 */

Commands.moveStartTo = (fn, editor) => (path, offset) => {
  const { value: { selection } } = editor
  const range = selection.moveStartTo(path, offset)
  editor.select(range)
}

/**
 * Move the selection's start point to the end of the block it's in.
 */

Commands.moveStartToEndOfBlock = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToEndOfBlock()
  } else {
    editor.moveFocusToEndOfBlock()
  }
}

/**
 * Move the selection's start point to the end of the document.
 */

Commands.moveStartToEndOfDocument = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToEndOfDocument()
  } else {
    editor.moveFocusToEndOfDocument()
  }
}

/**
 * Move the selection's start point to the end of the nearest inline.
 */

Commands.moveStartToEndOfInline = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToEndOfInline()
  } else {
    editor.moveFocusToEndOfInline()
  }
}

/**
 * Move the selection's start point to the end of the next block.
 */

Commands.moveStartToEndOfNextBlock = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToEndOfNextBlock()
  } else {
    editor.moveFocusToEndOfNextBlock()
  }
}

/**
 * Move the selection's start point to the end of the next inline.
 */

Commands.moveStartToEndOfNextInline = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToEndOfNextInline()
  } else {
    editor.moveFocusToEndOfNextInline()
  }
}

/**
 * Move the selection's start point to the end of the next text node.
 */

Commands.moveStartToEndOfNextText = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToEndOfNextText()
  } else {
    editor.moveFocusToEndOfNextText()
  }
}

/**
 * Move the selection's start point to the end of the node at `path`.
 */

Commands.moveStartToEndOfPath = (fn, editor) => path => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToEndOfPath(path)
  } else {
    editor.moveFocusToEndOfPath(path)
  }
}

/**
 * Move the selection's start point to the end of the previous block.
 */

Commands.moveStartToEndOfPreviousBlock = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToEndOfPreviousBlock()
  } else {
    editor.moveFocusToEndOfPreviousBlock()
  }
}

/**
 * Move the selection's start point to the end of the previous inline.
 */

Commands.moveStartToEndOfPreviousInline = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToEndOfPreviousInline()
  } else {
    editor.moveFocusToEndOfPreviousInline()
  }
}

/**
 * Move the selection's start point to the end of the previous text node.
 */

Commands.moveStartToEndOfPreviousText = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToEndOfPreviousText()
  } else {
    editor.moveFocusToEndOfPreviousText()
  }
}

/**
 * Move the selection's start point to the end of the text node it's in.
 */

Commands.moveStartToEndOfText = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToEndOfText()
  } else {
    editor.moveFocusToEndOfText()
  }
}

/**
 * Move the selection's start point to the start of the block it's in.
 */

Commands.moveStartToStartOfBlock = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToStartOfBlock()
  } else {
    editor.moveFocusToStartOfBlock()
  }
}

/**
 * Move the selection's start point to the start of the document.
 */

Commands.moveStartToStartOfDocument = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToStartOfDocument()
  } else {
    editor.moveFocusToStartOfDocument()
  }
}

/**
 * Move the selection's start point to the start of the nearest inline.
 */

Commands.moveStartToStartOfInline = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToStartOfInline()
  } else {
    editor.moveFocusToStartOfInline()
  }
}

/**
 * Move the selection's start point to the start of the next block.
 */

Commands.moveStartToStartOfNextBlock = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToStartOfNextBlock()
  } else {
    editor.moveFocusToStartOfNextBlock()
  }
}

/**
 * Move the selection's start point to the start of the next inline.
 */

Commands.moveStartToStartOfNextInline = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToStartOfNextInline()
  } else {
    editor.moveFocusToStartOfNextInline()
  }
}

/**
 * Move the selection's start point to the start of the next text node.
 */

Commands.moveStartToStartOfNextText = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToStartOfNextText()
  } else {
    editor.moveFocusToStartOfNextText()
  }
}

/**
 * Move the selection's start point to the start of the node at `path`.
 */

Commands.moveStartToStartOfPath = (fn, editor) => path => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToStartOfPath(path)
  } else {
    editor.moveFocusToStartOfPath(path)
  }
}

/**
 * Move the selection's start point to the start of the previous block.
 */

Commands.moveStartToStartOfPreviousBlock = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToStartOfPreviousBlock()
  } else {
    editor.moveFocusToStartOfPreviousBlock()
  }
}

/**
 * Move the selection's start point to the start of the previous inline.
 */

Commands.moveStartToStartOfPreviousInline = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToStartOfPreviousInline()
  } else {
    editor.moveFocusToStartOfPreviousInline()
  }
}

/**
 * Move the selection's start point to the start of the previous text node.
 */

Commands.moveStartToStartOfPreviousText = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToStartOfPreviousText()
  } else {
    editor.moveFocusToStartOfPreviousText()
  }
}

/**
 * Move the selection's start point to the start of the text node it's in.
 */

Commands.moveStartToStartOfText = (fn, editor) => () => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorToStartOfText()
  } else {
    editor.moveFocusToStartOfText()
  }
}

/**
 * Move the selection's start point backward to the edge of the nearest word.
 */

Commands.moveStartWordBackward = (fn, editor) => (...args) => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorWordBackward()
  } else {
    editor.moveFocusWordBackward()
  }
}

/**
 * Move the selection's start point forward to the edge of the nearest word.
 */

Commands.moveStartWordForward = (fn, editor) => (...args) => {
  if (editor.value.selection.isForward) {
    editor.moveAnchorWordForward()
  } else {
    editor.moveFocusWordForward()
  }
}

/**
 * Move the cursor to a specific `path` and `offset`.
 *
 * @param {Array} path
 * @param {Number} offset
 */

Commands.moveTo = (fn, editor) => (path, offset) => {
  const { value: { selection } } = editor
  const range = selection.moveTo(path, offset)
  editor.select(range)
}

/**
 * Collapse the cursor to the selection's anchor point.
 */

Commands.moveToAnchor = (fn, editor) => () => {
  const { value: { selection } } = editor
  const range = selection.moveToAnchor()
  editor.select(range)
}

/**
 * Collapse the cursor to the selection's end point.
 */

Commands.moveToEnd = (fn, editor) => () => {
  const { value: { selection } } = editor
  const range = selection.moveToEnd()
  editor.select(range)
}

/**
 * Collapse the cursor to the end of the current block.
 */

Commands.moveToEndOfBlock = (fn, editor) => () => {
  editor.moveEndToEndOfBlock()
  editor.moveToEnd()
}

/**
 * Collapse the cursor to the end of the document.
 */

Commands.moveToEndOfDocument = (fn, editor) => () => {
  editor.moveEndToEndOfDocument()
  editor.moveToEnd()
}

/**
 * Collapse the cursor to the end of the current inline.
 */

Commands.moveToEndOfInline = (fn, editor) => () => {
  editor.moveEndToEndOfInline()
  editor.moveToEnd()
}

/**
 * Collapse the cursor to the end of the next block.
 */

Commands.moveToEndOfNextBlock = (fn, editor) => () => {
  editor.moveEndToEndOfNextBlock()
  editor.moveToEnd()
}

/**
 * Collapse the cursor to the end of the next inline.
 */

Commands.moveToEndOfNextInline = (fn, editor) => () => {
  editor.moveEndToEndOfNextInline()
  editor.moveToEnd()
}

/**
 * Collapse the cursor to the end of the next text node.
 */

Commands.moveToEndOfNextText = (fn, editor) => () => {
  editor.moveEndToEndOfNextText()
  editor.moveToEnd()
}

/**
 * Collapse the cursor to the end of the node at `path`.
 *
 * @param {Editor}
 * @param {Array} path
 */

Commands.moveToEndOfPath = (fn, editor) => path => {
  editor.moveAnchorToEndOfPath(path)
  editor.moveToAnchor()
}

/**
 * Collapse the cursor to the end of the previous block.
 */

Commands.moveToEndOfPreviousBlock = (fn, editor) => () => {
  editor.moveStartToEndOfPreviousBlock()
  editor.moveToStart()
}

/**
 * Collapse the cursor to the end of the previous inline.
 */

Commands.moveToEndOfPreviousInline = (fn, editor) => () => {
  editor.moveStartToEndOfPreviousInline()
  editor.moveToStart()
}

/**
 * Collapse the cursor to the end of the previous text node.
 */

Commands.moveToEndOfPreviousText = (fn, editor) => () => {
  editor.moveStartToEndOfPreviousText()
  editor.moveToStart()
}

/**
 * Collapse the cursor to the end of the current text node.
 */

Commands.moveToEndOfText = (fn, editor) => () => {
  editor.moveEndToEndOfText()
  editor.moveToEnd()
}

/**
 * Collapse the cursor to the selection's focus point.
 */

Commands.moveToFocus = (fn, editor) => () => {
  const { value: { selection } } = editor
  const range = selection.moveToFocus()
  editor.select(range)
}

/**
 * Move the selection's anchor and focus points to the start and end of the
 * document, respectively.
 */

Commands.moveToRangeOfDocument = (fn, editor) => () => {
  editor.moveAnchorToStartOfDocument()
  editor.moveFocusToEndOfDocument()
}

/**
 * Move the selection's anchor and focus points to the start and end of the
 * current block, respectively.
 */

Commands.moveToRangeOfBlock = (fn, editor) => () => {
  editor.moveToStart()
  editor.moveAnchorToStartOfBlock()
  editor.moveFocusToEndOfBlock()
}

/**
 * Move the selection's anchor and focus points to the start and end of the
 * current text node, respectively.
 */

Commands.moveToRangeOfInline = (fn, editor) => () => {
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

Commands.moveToRangeOfPath = (fn, editor) => path => {
  editor.moveAnchorToStartOfPath(path)
  editor.moveFocusToEndOfPath(path)
}

/**
 * Collapse the cursor to the selection's start point.
 */

Commands.moveToStart = (fn, editor) => () => {
  const { value: { selection } } = editor
  const range = selection.moveToStart()
  editor.select(range)
}

/**
 * Collapse the cursor to the start of the current block.
 */

Commands.moveToStartOfBlock = (fn, editor) => () => {
  editor.moveStartToStartOfBlock()
  editor.moveToStart()
}

/**
 * Collapse the cursor to the start of the document.
 */

Commands.moveToStartOfDocument = (fn, editor) => () => {
  editor.moveStartToStartOfDocument()
  editor.moveToStart()
}

/**
 * Collapse the cursor to the start of the current inline.
 */

Commands.moveToStartOfInline = (fn, editor) => () => {
  editor.moveStartToStartOfInline()
  editor.moveToStart()
}

/**
 * Collapse the cursor to the start of the next block.
 */

Commands.moveToStartOfNextBlock = (fn, editor) => () => {
  editor.moveEndToStartOfNextBlock()
  editor.moveToEnd()
}

/**
 * Collapse the cursor to the start of the next inline.
 */

Commands.moveToStartOfNextInline = (fn, editor) => () => {
  editor.moveEndToStartOfNextInline()
  editor.moveToEnd()
}

/**
 * Collapse the cursor to the start of the next text node.
 */

Commands.moveToStartOfNextText = (fn, editor) => () => {
  editor.moveEndToStartOfNextText()
  editor.moveToEnd()
}

/**
 * Collapse the cursor to the start of the node at `path`.
 *
 * @param {Array} path
 */

Commands.moveToStartOfPath = (fn, editor) => path => {
  editor.moveAnchorToStartOfPath(path)
  editor.moveToAnchor()
}

/**
 * Collapse the cursor to the start of the previous block.
 */

Commands.moveToStartOfPreviousBlock = (fn, editor) => () => {
  editor.moveStartToStartOfPreviousBlock()
  editor.moveToStart()
}

/**
 * Collapse the cursor to the start of the previous inline.
 */

Commands.moveToStartOfPreviousInline = (fn, editor) => () => {
  editor.moveStartToStartOfPreviousInline()
  editor.moveToStart()
}

/**
 * Collapse the cursor to the start of the previous text node.
 */

Commands.moveToStartOfPreviousText = (fn, editor) => () => {
  editor.moveStartToStartOfPreviousText()
  editor.moveToStart()
}

/**
 * Collapse the cursor to the start of the current text node.
 */

Commands.moveToStartOfText = (fn, editor) => () => {
  editor.moveStartToStartOfText()
  editor.moveToStart()
}

/**
 * Move the selection's points each backward by `n` words.
 *
 * @param {Number} n
 */

Commands.moveWordBackward = (fn, editor) => n => {
  editor.moveAnchorWordBackward(n)
  editor.moveFocusWordBackward(n)
}

/**
 * Move the selection's points each forward by `n` words.
 *
 * @param {Number} n
 */

Commands.moveWordForward = (fn, editor) => n => {
  editor.moveAnchorWordForward(n)
  editor.moveFocusWordForward(n)
}

/**
 * Set new `properties` on the selection.
 *
 * @param {Object} properties
 * @param {Object} options
 */

Commands.select = (fn, editor) => (properties, options = {}) => {
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
 * @param {Function} fn
 */

Commands.setAnchor = (fn, editor) => value => {
  const { value: { selection } } = editor
  const range = selection.setAnchor(value)
  editor.select(range)
}

/**
 * Set the selection's end point to the return value of `fn`.
 *
 * @param {Function} fn
 */

Commands.setEnd = (fn, editor) => value => {
  const { value: { selection } } = editor
  const range = selection.setEnd(value)
  editor.select(range)
}

/**
 * Set the selection's focus point to the return value of `fn`.
 *
 * @param {Function} fn
 */

Commands.setFocus = (fn, editor) => value => {
  const { value: { selection } } = editor
  const range = selection.setFocus(value)
  editor.select(range)
}

/**
 * Set the selection's start point to the return value of `fn`.
 *
 * @param {Function} fn
 */

Commands.setStart = (fn, editor) => value => {
  const { value: { selection } } = editor
  const range = selection.setStart(value)
  editor.select(range)
}

/**
 * HACK: Snapshot the selection, saving an entry in the history.
 */

Commands.snapshotSelection = (fn, editor) => () => {
  editor.withoutMerging(() => {
    editor.select(editor.value.selection, { snapshot: true })
  })
}

/**
 * Deprecated.
 */

Commands.moveAnchorToEndOfNode = (fn, editor) => (...args) => {
  warning(
    false,
    'As of slate@0.48 the `editor.moveAnchorToEndOfNode(node) command is deprecated. Use the `editor.moveAnchorToEndOfPath(path)` command instead.'
  )

  const { value: { selection } } = editor
  const range = selection.moveAnchorToEndOfNode(...args)
  editor.select(range)
}

Commands.moveAnchorToStartOfNode = (fn, editor) => (...args) => {
  warning(
    false,
    'As of slate@0.48 the `editor.moveAnchorToStartOfNode(node) command is deprecated. Use the `editor.moveAnchorToStartOfPath(path)` command instead.'
  )

  const { value: { selection } } = editor
  const range = selection.moveAnchorToStartOfNode(...args)
  editor.select(range)
}

Commands.moveEndToEndOfNode = (fn, editor) => (...args) => {
  warning(
    false,
    'As of slate@0.48 the `editor.moveEndToEndOfNode(node) command is deprecated. Use the `editor.moveEndToEndOfPath(path)` command instead.'
  )

  const { value: { selection } } = editor
  const range = selection.moveEndToEndOfNode(...args)
  editor.select(range)
}

Commands.moveEndToStartOfNode = (fn, editor) => (...args) => {
  warning(
    false,
    'As of slate@0.48 the `editor.moveEndToStartOfNode(node) command is deprecated. Use the `editor.moveEndToStartOfPath(path)` command instead.'
  )

  const { value: { selection } } = editor
  const range = selection.moveEndToStartOfNode(...args)
  editor.select(range)
}

Commands.moveFocusToEndOfNode = (fn, editor) => (...args) => {
  warning(
    false,
    'As of slate@0.48 the `editor.moveFocusToEndOfNode(node) command is deprecated. Use the `editor.moveFocusToEndOfPath(path)` command instead.'
  )

  const { value: { selection } } = editor
  const range = selection.moveFocusToEndOfNode(...args)
  editor.select(range)
}

Commands.moveFocusToStartOfNode = (fn, editor) => (...args) => {
  warning(
    false,
    'As of slate@0.48 the `editor.moveFocusToStartOfNode(node) command is deprecated. Use the `editor.moveFocusToStartOfPath(path)` command instead.'
  )

  const { value: { selection } } = editor
  const range = selection.moveFocusToStartOfNode(...args)
  editor.select(range)
}

Commands.moveStartToEndOfNode = (fn, editor) => (...args) => {
  warning(
    false,
    'As of slate@0.48 the `editor.moveStartToEndOfNode(node) command is deprecated. Use the `editor.moveStartToEndOfPath(path)` command instead.'
  )

  const { value: { selection } } = editor
  const range = selection.moveStartToEndOfNode(...args)
  editor.select(range)
}

Commands.moveStartToStartOfNode = (fn, editor) => (...args) => {
  warning(
    false,
    'As of slate@0.48 the `editor.moveStartToStartOfNode(node) command is deprecated. Use the `editor.moveStartToStartOfPath(path)` command instead.'
  )

  const { value: { selection } } = editor
  const range = selection.moveStartToStartOfNode(...args)
  editor.select(range)
}

Commands.moveToEndOfNode = (fn, editor) => (...args) => {
  warning(
    false,
    'As of slate@0.48 the `editor.moveToEndOfNode(node) command is deprecated. Use the `editor.moveToEndOfPath(path)` command instead.'
  )

  const { value: { selection } } = editor
  const range = selection.moveToEndOfNode(...args)
  editor.select(range)
}

Commands.moveToRangeOfNode = (fn, editor) => (...args) => {
  warning(
    false,
    'As of slate@0.48 the `editor.moveToRangeOfNode(node) command is deprecated. Use the `editor.moveToRangeOfPath(path)` command instead.'
  )

  const { value: { selection } } = editor
  const range = selection.moveToRangeOfNode(...args)
  editor.select(range)
}

Commands.moveToStartOfNode = (fn, editor) => (...args) => {
  warning(
    false,
    'As of slate@0.48 the `editor.moveToStartOfNode(node) command is deprecated. Use the `editor.moveToStartOfPath(path)` command instead.'
  )

  const { value: { selection } } = editor
  const range = selection.moveToStartOfNode(...args)
  editor.select(range)
}

export default Commands
