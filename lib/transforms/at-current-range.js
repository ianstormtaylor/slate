
import Normalize from '../utils/normalize'

import {
  addMarkAtRange,
  deleteAtRange,
  deleteBackwardAtRange,
  deleteForwardAtRange,
  insertBlockAtRange,
  insertFragmentAtRange,
  insertInlineAtRange,
  insertTextAtRange,
  removeMarkAtRange,
  setBlockAtRange,
  setInlineAtRange,
  splitBlockAtRange,
  splitInlineAtRange,
  splitTextAtRange,
  toggleMarkAtRange,
  unwrapBlockAtRange,
  unwrapInlineAtRange,
  wrapBlockAtRange,
  wrapInlineAtRange,
  wrapTextAtRange,
} from './at-range'

/**
 * Add a `mark` to the characters in the current selection.
 *
 * @param {Transform} transform
 * @param {Mark} mark
 * @return {Transform}
 */

export function addMark(transform, mark) {
  mark = Normalize.mark(mark)
  let { state } = transform
  let { cursorMarks, document, selection } = state

  // If the selection is collapsed, add the mark to the cursor instead.
  if (selection.isCollapsed) {
    const marks = document.getMarksAtRange(selection)
    state = state.merge({ cursorMarks: marks.add(mark) })
    transform.state = state
    return transform
  }

  return addMarkAtRange(transform, selection, mark)
}

/**
 * Delete at the current selection.
 *
 * @param {Transform} transform
 * @return {Transform}
 */

export function _delete(transform) {
  let { state } = transform
  let { document, selection } = state
  let after

  // When collapsed, there's nothing to do.
  if (selection.isCollapsed) return transform

  // Determine what the selection will be after deleting.
  const { startText } = state
  const { startKey, startOffset, endKey, endOffset } = selection
  const block = document.getClosestBlock(startText)
  const highest = block.getHighestChild(startText)
  const previous = block.getPreviousSibling(highest)
  const next = block.getNextSibling(highest)

  if (
    previous &&
    startOffset == 0 &&
    (endKey != startKey || endOffset == startText.length)
  ) {
    if (previous.kind == 'text') {
      if (next && next.kind == 'text') {
        after = selection.merge({
          anchorKey: previous.key,
          anchorOffset: previous.length,
          focusKey: previous.key,
          focusOffset: previous.length
        })
      } else {
        after = selection.collapseToEndOf(previous)
      }
    } else {
      const last = previous.getTexts().last()
      after = selection.collapseToEndOf(last)
    }
  }

  else {
    after = selection.collapseToStart()
  }

  // Delete and update the selection.
  transform = deleteAtRange(transform, selection)
  state = transform.state
  state = state.merge({ selection: after })
  transform.state = state
  return transform
}

/**
 * Delete backward `n` characters at the current selection.
 *
 * @param {Transform} transform
 * @param {Number} n (optional)
 * @return {Transform}
 */

export function deleteBackward(transform, n = 1) {
  let { state } = transform
  let { document, selection } = state
  let after = selection

  // Determine what the selection should be after deleting.
  const { startKey } = selection
  const startNode = document.getDescendant(startKey)

  if (selection.isExpanded) {
    after = selection.collapseToStart()
  }

  else if (selection.isAtStartOf(document)) {
    after = selection
  }

  else if (selection.isAtStartOf(startNode)) {
    const previous = document.getPreviousText(startNode)
    const prevBlock = document.getClosestBlock(previous)
    const prevInline = document.getClosestInline(previous)

    if (prevBlock && prevBlock.isVoid) {
      after = selection
    } else if (prevInline && prevInline.isVoid) {
      after = selection
    } else {
      after = selection.collapseToEndOf(previous)
    }
  }

  else if (selection.isAtEndOf(startNode) && startNode.length == 1) {
    const block = document.getClosestBlock(startKey)
    const highest = block.getHighestChild(startKey)
    const previous = block.getPreviousSibling(highest)
    const next = block.getNextSibling(highest)

    if (previous) {
      if (previous.kind == 'text') {
        if (next && next.kind == 'text') {
          after = selection.merge({
            anchorKey: previous.key,
            anchorOffset: previous.length,
            focusKey: previous.key,
            focusOffset: previous.length
          })
        } else {
          after = selection.collapseToEndOf(previous)
        }
      } else {
        const last = previous.getTexts().last()
        after = selection.collapseToEndOf(last)
      }
    } else {
      after = selection.moveBackward(n)
    }
  }

  else {
    after = selection.moveBackward(n)
  }

  // Delete backward and then update the selection.
  transform = deleteBackwardAtRange(transform, selection, n)
  state = transform.state
  state = state.merge({ selection: after })
  transform.state = state
  return transform
}

/**
 * Delete forward `n` characters at the current selection.
 *
 * @param {Transform} transform
 * @param {Number} n (optional)
 * @return {Transform}
 */

export function deleteForward(transform, n = 1) {
  let { state } = transform
  let { document, selection, startText } = state
  let { startKey, startOffset } = selection
  let after = selection

  // Determine what the selection should be after deleting.
  const block = document.getClosestBlock(startKey)
  const inline = document.getClosestInline(startKey)
  const highest = block.getHighestChild(startKey)
  const previous = block.getPreviousSibling(highest)
  const next = block.getNextSibling(highest)

  if (selection.isExpanded) {
    after = selection.collapseToStart()
  }

  else if ((block && block.isVoid) || (inline && inline.isVoid)) {
    const nextText = document.getNextText(startKey)
    const prevText = document.getPreviousText(startKey)
    after = next
      ? selection.collapseToStartOf(nextText)
      : selection.collapseToEndOf(prevText)
  }

  else if (previous && startOffset == 0 && startText.length == 1) {
    if (previous.kind == 'text') {
      if (next && next.kind == 'text') {
        after = selection.merge({
          anchorKey: previous.key,
          anchorOffset: previous.length,
          focusKey: previous.key,
          focusOffset: previous.length
        })
      } else {
        after = selection.collapseToEndOf(previous)
      }
    } else {
      const last = previous.getTexts().last()
      after = selection.collapseToEndOf(last)
    }
  }

  // Delete forward and then update the selection.
  transform = deleteForwardAtRange(transform, selection, n)
  state = transform.state
  state = state.merge({ selection: after })
  transform.state = state
  return transform
}

/**
 * Insert a `block` at the current selection.
 *
 * @param {Transform} transform
 * @param {String || Object || Block} block
 * @return {Transform}
 */

export function insertBlock(transform, block) {
  let { state } = transform
  let { document, selection } = state
  const keys = document.getTexts().map(text => text.key)

  // Insert the block
  transform = insertBlockAtRange(transform, selection, block)
  state = transform.state
  document = state.document
  selection = state.selection

  // Determine what the selection should be after inserting.
  const text = document.getTexts().find(n => !keys.includes(n.key))
  selection = selection.collapseToEndOf(text)

  // Update the document and selection.
  state = state.merge({ selection })
  transform.state = state
  return transform
}

/**
 * Insert a `fragment` at the current selection.
 *
 * @param {Transform} transform
 * @param {Document} fragment
 * @return {Transform}
 */

export function insertFragment(transform, fragment) {
  let { state } = transform
  let { document, selection } = state
  let after = selection

  // If there's nothing in the fragment, do nothing.
  if (!fragment.length) return transform

  // Lookup some nodes for determining the selection next.
  const lastText = fragment.getTexts().last()
  const lastInline = fragment.getClosestInline(lastText)
  const beforeTexts = document.getTexts()

  // Insert the fragment.
  transform = insertFragmentAtRange(transform, selection, fragment)
  state = transform.state
  document = state.document
  selection = state.selection

  // Determine what the selection should be after inserting.
  const keys = beforeTexts.map(text => text.key)
  const news = document.getTexts().filter(n => !keys.includes(n.key))
  const text = news.size ? news.takeLast(2).first() : null

  if (text && lastInline) {
    after = selection.collapseToEndOf(text)
  }

  else if (text && lastInline) {
    after = selection.collapseToStart()
  }

  else if (text) {
    after = selection
      .collapseToStartOf(text)
      .moveForward(lastText.length)
  }

  else {
    after = selection
      .collapseToStart()
      .moveForward(lastText.length)
  }

  // Update the document and selection.
  selection = after
  state = state.merge({ document, selection })
  transform.state = state
  return transform
}

/**
 * Insert a `inline` at the current selection.
 *
 * @param {Transform} transform
 * @param {String || Object || Block} inline
 * @return {Transform}
 */

export function insertInline(transform, inline) {
  let { state } = transform
  let { document, selection, startText } = state
  const hasVoid = document.hasVoidParent(startText)
  const keys = document.getTexts().map(text => text.key)

  // Insert the inline
  transform = insertInlineAtRange(transform, selection, inline)
  state = transform.state
  document = state.document
  selection = state.selection

  // Determine what the selection should be after inserting.
  if (hasVoid) {
    selection = selection
  }

  else {
    const text = document.getTexts().find(n => !keys.includes(n.key))
    selection = selection.collapseToEndOf(text)
  }

  // Update the document and selection.
  state = state.merge({ document, selection })
  transform.state = state
  return transform
}

/**
 * Insert a `text` string at the current selection.
 *
 * @param {Transform} transform
 * @param {String} text
 * @param {Set} marks (optional)
 * @return {Transform}
 */

export function insertText(transform, text, marks) {
  let { state } = transform
  let { cursorMarks, document, selection } = state
  let after
  const isVoid = document.hasVoidParent(state.startText)

  // Determine what the selection should be after inserting.
  if (isVoid) {
    after = selection
  }

  else if (selection.isExpanded) {
    after = selection.collapseToStart().moveForward(text.length)
  }

  else {
    after = selection.moveForward(text.length)
  }

  // Insert the text and update the selection.
  state = insertTextAtRange(transform, selection, text, marks || cursorMarks)
  state = transform.state
  state = state.merge({ selection: after })
  transform.state = state
  return transform
}


/**
 * Set `properties` of the block nodes in the current selection.
 *
 * @param {Transform} transform
 * @param {Object} properties
 * @return {Transform}
 */

export function setBlock(transform, properties) {
  const { state } = transform
  const { selection } = state
  return setBlockAtRange(transform, selection, properties)
}

/**
 * Set `properties` of the inline nodes in the current selection.
 *
 * @param {Transform} transform
 * @param {Object} properties
 * @return {Transform}
 */

export function setInline(transform, properties) {
  const { state } = transform
  const { selection } = state
  return setInlineAtRange(transform, selection, properties)
}

/**
 * Split the block node at the current selection, to optional `depth`.
 *
 * @param {Transform} transform
 * @param {Number} depth (optional)
 * @return {Transform}
 */

export function splitBlock(transform, depth = 1) {
  let { state } = transform
  transform = splitBlockAtRange(transform, state.selection, depth)
  state = transform.state
  let { document, selection } = state

  // Determine what the selection should be after splitting.
  const { startKey } = selection
  const startNode = document.getDescendant(startKey)
  const nextNode = document.getNextText(startNode)
  selection = selection.collapseToStartOf(nextNode)
  state = state.merge({ selection })
  transform.state = state
  return transform
}

/**
 * Split the inline nodes at the current selection, to optional `depth`.
 *
 * @param {Transform} transform
 * @param {Number} depth (optional)
 * @return {Transform}
 */

export function splitInline(transform, depth = Infinity) {
  let { state } = transform
  let { document, selection } = state

  // Split the document.
  transform = splitInlineAtRange(transform, selection, depth)
  state = transform.state
  document = state.document
  selection = state.selection

  // Determine what the selection should be after splitting.
  const { startKey } = selection
  const inlineParent = document.getClosestInline(startKey)

  if (inlineParent) {
    const startNode = document.getDescendant(startKey)
    const nextNode = document.getNextText(startNode)
    selection = selection.collapseToStartOf(nextNode)
  }

  state = state.merge({ document, selection })
  transform.state = state
  return transform
}

/**
 * Remove a `mark` from the characters in the current selection.
 *
 * @param {Transform} transform
 * @param {Mark} mark
 * @return {Transform}
 */

export function removeMark(transform, mark) {
  mark = Normalize.mark(mark)
  let { state } = transform
  let { cursorMarks, document, selection } = state

  // If the selection is collapsed, remove the mark from the cursor instead.
  if (selection.isCollapsed) {
    const marks = document.getMarksAtRange(selection)
    state = state.merge({ cursorMarks: marks.remove(mark) })
    transform.state = state
    return transform
  }

  return removeMarkAtRange(transform, state.selection, mark)
}

/**
 * Add or remove a `mark` from the characters in the current selection,
 * depending on whether it's already there.
 *
 * @param {Transform} transform
 * @param {Mark} mark
 * @return {Transform}
 */

export function toggleMark(transform, mark) {
  mark = Normalize.mark(mark)
  const { state } = transform
  const exists = state.marks.some(m => m.equals(mark))
  return exists
    ? removeMark(transform, mark)
    : addMark(transform, mark)
}

/**
 * Unwrap the current selection from a block parent with `properties`.
 *
 * @param {Transform} transform
 * @param {Object or String} properties
 * @return {Transform}
 */

export function unwrapBlock(transform, properties) {
  const { state } = transform
  const { selection } = state
  return unwrapBlockAtRange(transform, selection, properties)
}

/**
 * Unwrap the current selection from an inline parent with `properties`.
 *
 * @param {Transform} transform
 * @param {Object or String} properties
 * @return {Transform}
 */

export function unwrapInline(transform, properties) {
  const { state } = transform
  const { selection } = state
  return unwrapInlineAtRange(transform, selection, properties)
}

/**
 * Wrap the block nodes in the current selection with a new block node with
 * `properties`.
 *
 * @param {Transform} transform
 * @param {Object or String} properties
 * @return {Transform}
 */

export function wrapBlock(transform, properties) {
  const { state } = transform
  const { selection } = state
  return wrapBlockAtRange(transform, selection, properties)
}

/**
 * Wrap the current selection in new inline nodes with `properties`.
 *
 * @param {Transform} transform
 * @param {Object or String} properties
 * @return {Transform}
 */

export function wrapInline(transform, properties) {
  let { state } = transform
  let { document, selection } = state
  const { startKey } = selection
  const previous = document.getPreviousText(startKey)

  transform = wrapInlineAtRange(transform, selection, properties)
  state = transform.state
  document = state.document
  selection = state.selection

  // Determine what the selection should be after wrapping.
  if (selection.isCollapsed) {
    selection = selection
  }

  else if (selection.startOffset == 0) {
    const text = previous
      ? document.getNextText(previous)
      : document.getTexts().first()
    selection = selection.moveToRangeOf(text)
  }

  else if (selection.startKey == selection.endKey) {
    const text = document.getNextText(selection.startKey)
    selection = selection.moveToRangeOf(text)
  }

  else {
    const anchor = document.getNextText(selection.anchorKey)
    const focus = document.getDescendant(selection.focusKey)
    selection = selection.merge({
      anchorKey: anchor.key,
      anchorOffset: 0,
      focusKey: focus.key,
      focusOffset: selection.focusOffset
    })
  }

  selection = selection.normalize(document)
  state = state.merge({ selection })
  transform.state = state
  return transform
}

/**
 * Wrap the current selection with prefix/suffix.
 *
 * @param {Transform} transform
 * @param {String} prefix
 * @param {String} suffix
 * @return {Transform}
 */

export function wrapText(transform, prefix, suffix = prefix) {
  let { state } = transform
  let { document, selection } = state
  let { anchorOffset, anchorKey, focusOffset, focusKey, isBackward } = selection
  let after

  // Determine what the selection should be after wrapping.
  if (anchorKey == focusKey) {
    after = selection.moveForward(prefix.length)
  }

  else {
    after = selection.merge({
      anchorOffset: isBackward ? anchorOffset : anchorOffset + prefix.length,
      focusOffset: isBackward ? focusOffset + prefix.length : focusOffset
    })
  }

  // Wrap the text and update the state.
  transform = wrapTextAtRange(transform, selection, prefix, suffix)
  state = transform.state
  state = state.merge({ selection: after })
  transform.state = state
  return transform
}
