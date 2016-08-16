
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
 * @param {State} state
 * @param {Mark} mark
 * @return {State} state
 */

export function addMark(state, mark) {
  mark = Normalize.mark(mark)
  let { cursorMarks, document, selection } = state

  // If the selection is collapsed, add the mark to the cursor instead.
  if (selection.isCollapsed) {
    const marks = document.getMarksAtRange(selection)
    state = state.merge({ cursorMarks: marks.add(mark) })
    return state
  }

  return addMarkAtRange(state, selection, mark)
}

/**
 * Delete at the current selection.
 *
 * @param {State} state
 * @return {State}
 */

export function _delete(state) {
  let { document, selection } = state
  let after

  // When collapsed, there's nothing to do.
  if (selection.isCollapsed) return state

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
  state = deleteAtRange(state, selection)
  state = state.merge({ selection: after })
  return state
}

/**
 * Delete backward `n` characters at the current selection.
 *
 * @param {State} state
 * @param {Number} n (optional)
 * @return {State}
 */

export function deleteBackward(state, n = 1) {
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
  state = deleteBackwardAtRange(state, selection, n)
  state = state.merge({ selection: after })
  return state
}

/**
 * Delete forward `n` characters at the current selection.
 *
 * @param {State} state
 * @param {Number} n (optional)
 * @return {State}
 */

export function deleteForward(state, n = 1) {
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
  state = deleteForwardAtRange(state, selection, n)
  state = state.merge({ selection: after })
  return state
}

/**
 * Insert a `block` at the current selection.
 *
 * @param {State} state
 * @param {String || Object || Block} block
 * @return {State}
 */

export function insertBlock(state, block) {
  let { document, selection } = state
  const keys = document.getTexts().map(text => text.key)

  // Insert the block
  state = insertBlockAtRange(state, selection, block)
  document = state.document
  selection = state.selection

  // Determine what the selection should be after inserting.
  const text = document.getTexts().find(n => !keys.includes(n.key))
  selection = selection.collapseToEndOf(text)

  // Update the document and selection.
  state = state.merge({ selection })
  return state
}

/**
 * Insert a `fragment` at the current selection.
 *
 * @param {State} state
 * @param {Document} fragment
 * @return {State}
 */

export function insertFragment(state, fragment) {
  let { document, selection } = state
  let after = selection

  // If there's nothing in the fragment, do nothing.
  if (!fragment.length) return state

  // Lookup some nodes for determining the selection next.
  const lastText = fragment.getTexts().last()
  const lastInline = fragment.getClosestInline(lastText)
  const beforeTexts = document.getTexts()

  // Insert the fragment.
  state = insertFragmentAtRange(state, selection, fragment)
  document = state.document
  selection = state.selection

  // Determine what the selection should be after inserting.
  const keys = beforeTexts.map(text => text.key)
  const text = document.getTexts().findLast(n => !keys.includes(n.key))
  const previousText = text ? document.getPreviousText(text) : null

  if (text && lastInline && previousText) {
    after = selection.collapseToEndOf(previousText)
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
  return state
}

/**
 * Insert a `inline` at the current selection.
 *
 * @param {State} state
 * @param {String || Object || Block} inline
 * @return {State}
 */

export function insertInline(state, inline) {
  let { document, selection, startText } = state
  const hasVoid = document.hasVoidParent(startText)
  const keys = document.getTexts().map(text => text.key)

  // Insert the inline
  state = insertInlineAtRange(state, selection, inline)
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
  return state
}

/**
 * Insert a `text` string at the current selection.
 *
 * @param {State} state
 * @param {String} text
 * @param {Set} marks (optional)
 * @return {State}
 */

export function insertText(state, text, marks) {
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
  state = insertTextAtRange(state, selection, text, marks || cursorMarks)
  state = state.merge({ selection: after })
  return state
}


/**
 * Set `properties` of the block nodes in the current selection.
 *
 * @param {State} state
 * @param {Object} properties
 * @return {State}
 */

export function setBlock(state, properties) {
  return setBlockAtRange(state, state.selection, properties)
}

/**
 * Set `properties` of the inline nodes in the current selection.
 *
 * @param {State} state
 * @param {Object} properties
 * @return {State}
 */

export function setInline(state, properties) {
  return setInlineAtRange(state, state.selection, properties)
}

/**
 * Split the block node at the current selection, to optional `depth`.
 *
 * @param {State} state
 * @param {Number} depth (optional)
 * @return {State}
 */

export function splitBlock(state, depth = 1) {
  state = splitBlockAtRange(state, state.selection, depth)
  let { document, selection } = state

  // Determine what the selection should be after splitting.
  const { startKey } = selection
  const startNode = document.getDescendant(startKey)
  const nextNode = document.getNextText(startNode)
  selection = selection.collapseToStartOf(nextNode)
  state = state.merge({ selection })
  return state
}

/**
 * Split the inline nodes at the current selection, to optional `depth`.
 *
 * @param {State} state
 * @param {Number} depth (optional)
 * @return {State}
 */

export function splitInline(state, depth = Infinity) {
  let { document, selection } = state

  // Split the document.
  state = splitInlineAtRange(state, selection, depth)
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
  return state
}

/**
 * Remove a `mark` from the characters in the current selection.
 *
 * @param {State} state
 * @param {Mark} mark
 * @return {State}
 */

export function removeMark(state, mark) {
  mark = Normalize.mark(mark)
  let { cursorMarks, document, selection } = state

  // If the selection is collapsed, remove the mark from the cursor instead.
  if (selection.isCollapsed) {
    const marks = document.getMarksAtRange(selection)
    state = state.merge({ cursorMarks: marks.remove(mark) })
    return state
  }

  return removeMarkAtRange(state, state.selection, mark)
}

/**
 * Add or remove a `mark` from the characters in the current selection,
 * depending on whether it's already there.
 *
 * @param {State} state
 * @param {Mark} mark
 * @return {State}
 */

export function toggleMark(state, mark) {
  mark = Normalize.mark(mark)
  const exists = state.marks.some(m => m.equals(mark))
  return exists
    ? removeMark(state, mark)
    : addMark(state, mark)
}

/**
 * Unwrap the current selection from a block parent with `properties`.
 *
 * @param {State} state
 * @param {Object or String} properties
 * @return {State}
 */

export function unwrapBlock(state, properties) {
  return unwrapBlockAtRange(state, state.selection, properties)
}

/**
 * Unwrap the current selection from an inline parent with `properties`.
 *
 * @param {State} state
 * @param {Object or String} properties
 * @return {State}
 */

export function unwrapInline(state, properties) {
  return unwrapInlineAtRange(state, state.selection, properties)
}

/**
 * Wrap the block nodes in the current selection with a new block node with
 * `properties`.
 *
 * @param {State} state
 * @param {Object or String} properties
 * @return {State}
 */

export function wrapBlock(state, properties) {
  return wrapBlockAtRange(state, state.selection, properties)
}

/**
 * Wrap the current selection in new inline nodes with `properties`.
 *
 * @param {State} state
 * @param {Object or String} properties
 * @return {State}
 */

export function wrapInline(state, properties) {
  let { document, selection } = state
  const { startKey } = selection
  const previous = document.getPreviousText(startKey)

  state = wrapInlineAtRange(state, selection, properties)
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

  state = state.merge({ selection })
  return state
}

/**
 * Wrap the current selection with prefix/suffix.
 *
 * @param {State} state
 * @param {String} prefix
 * @param {String} suffix
 * @return {State}
 */

export function wrapText(state, prefix, suffix = prefix) {
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
  state = wrapTextAtRange(state, selection, prefix, suffix)
  state = state.merge({ selection: after })
  return state
}
