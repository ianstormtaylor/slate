
import Normalize from '../utils/normalize'

/**
 * Add a `mark` to the characters in the current selection.
 *
 * @param {Transform} transform
 * @param {Mark} mark
 * @return {Transform}
 */

export function addMark(transform, mark) {
  mark = Normalize.mark(mark)

  const { state } = transform
  const { document, selection } = state

  if (selection.isExpanded) {
    return transform.addMarkAtRange(selection, mark)
  }

  else if (selection.marks) {
    const marks = selection.marks.add(mark)
    const sel = selection.merge({ marks })
    return transform.moveTo(sel)
  }

  else {
    const marks = document.getMarksAtRange(selection).add(mark)
    const sel = selection.merge({ marks })
    return transform.moveTo(sel)
  }
}

/**
 * Delete at the current selection.
 *
 * @param {Transform} transform
 * @return {Transform}
 */

export function _delete(transform) {
  const { state } = transform
  const { document, selection } = state
  let after

  if (selection.isCollapsed) return transform

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
      const last = previous.getLastText()
      after = selection.collapseToEndOf(last)
    }
  }

  else {
    after = selection.collapseToStart()
  }

  return transform
    .unsetSelection()
    .deleteAtRange(selection)
    .moveTo(after)
}

/**
 * Delete backward `n` characters at the current selection.
 *
 * @param {Transform} transform
 * @param {Number} n (optional)
 * @return {Transform}
 */

export function deleteBackward(transform, n = 1) {
  const { state } = transform
  const { selection } = state

  return transform
    .deleteBackwardAtRange(selection, n)
    .collapseToEnd()
}

/**
 * Delete forward `n` characters at the current selection.
 *
 * @param {Transform} transform
 * @param {Number} n (optional)
 * @return {Transform}
 */

export function deleteForward(transform, n = 1) {
  const { state } = transform
  const { selection } = state

  return transform
    .deleteForwardAtRange(selection, n)
    .collapseToEnd()
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

  transform.unsetSelection()
  transform.insertBlockAtRange(selection, block)
  state = transform.state
  document = state.document

  const text = document.getTexts().find(n => !keys.includes(n.key))
  const after = selection.collapseToEndOf(text)

  return transform.moveTo(after)
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

  if (!fragment.length) return transform

  const lastText = fragment.getLastText()
  const lastInline = fragment.getClosestInline(lastText)
  const beforeTexts = document.getTexts()
  const appending = selection.hasEdgeAtEndOf(document.getDescendant(selection.endKey))

  transform.unsetSelection()
  transform.insertFragmentAtRange(selection, fragment)
  state = transform.state
  document = state.document

  const keys = beforeTexts.map(text => text.key)
  const news = document.getTexts().filter(n => !keys.includes(n.key))
  const text = appending ? news.last() : news.takeLast(2).first()
  let after

  if (text && lastInline) {
    after = selection.collapseToEndOf(text)
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

  return transform.moveTo(after)
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
  let after

  const hasVoid = document.hasVoidParent(startText)
  const keys = document.getTexts().map(text => text.key)

  transform.unsetSelection()
  transform.insertInlineAtRange(selection, inline)
  state = transform.state
  document = state.document

  if (hasVoid) {
    after = selection
  }

  else {
    const text = document.getTexts().find((n) => {
      if (keys.includes(n.key)) return false
      const parent = document.getParent(n)
      if (parent.kind != 'inline') return false
      return true
    })

    after = selection.collapseToEndOf(text)
  }

  return transform.moveTo(after)
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
  const { state } = transform
  const { document, selection } = state
  const { startKey } = selection
  const isVoid = document.hasVoidParent(startKey)
  let after

  if (isVoid) {
    after = selection
  }

  else if (selection.isExpanded) {
    after = selection.collapseToStart().moveForward(text.length)
  }

  else {
    after = selection.moveForward(text.length)
  }

  marks = marks || selection.marks

  return transform
    .unsetSelection()
    .insertTextAtRange(selection, text, marks)
    .moveTo(after)
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
  return transform.setBlockAtRange(selection, properties)
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
  return transform.setInlineAtRange(selection, properties)
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
  let { document, selection } = state

  transform.unsetSelection()
  transform.splitBlockAtRange(selection, depth)

  state = transform.state
  document = state.document

  const { startKey } = selection
  const startNode = document.getDescendant(startKey)
  const nextNode = document.getNextText(startNode)
  const after = selection.collapseToStartOf(nextNode)

  return transform.moveTo(after)
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

  // If the selection is expanded, remove it first.
  if (selection.isExpanded) {
    transform.delete()
    state = transform.state
    document = state.document
    selection = state.selection
  }

  let after = selection
  const { startKey, startOffset } = selection
  let startNode = document.assertDescendant(startKey)
  const furthestInline = document.getFurthestInline(startKey)
  const offset = furthestInline.getOffset(startNode)

  // If the selection is at the start of end of the furthest inline, there isn't
  // anything to split, so abort.
  if (
    (offset + startOffset == 0) ||
    (offset + startNode.length == startOffset)
  ) {
    return transform
  }

  transform.unsetSelection()
  transform.splitInlineAtRange(selection, depth)
  state = transform.state
  document = state.document
  const closestInline = document.getClosestInline(startKey)

  if (closestInline) {
    startNode = document.getDescendant(startKey)
    const nextNode = document.getNextText(startNode)
    after = selection.collapseToStartOf(nextNode)
  }

  return transform.moveTo(after)
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

  const { state } = transform
  const { document, selection } = state

  if (selection.isExpanded) {
    return transform.removeMarkAtRange(selection, mark)
  }

  else if (selection.marks) {
    const marks = selection.marks.remove(mark)
    const sel = selection.merge({ marks })
    return transform.moveTo(sel)
  }

  else {
    const marks = document.getMarksAtRange(selection).remove(mark)
    const sel = selection.merge({ marks })
    return transform.moveTo(sel)
  }
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

  if (exists) {
    return transform.removeMark(mark)
  } else {
    return transform.addMark(mark)
  }
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
  return transform.unwrapBlockAtRange(selection, properties)
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
  return transform.unwrapInlineAtRange(selection, properties)
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
  return transform.wrapBlockAtRange(selection, properties)
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
  let after

  const { startKey } = selection
  const previous = document.getPreviousText(startKey)

  transform.unsetSelection()
  transform.wrapInlineAtRange(selection, properties)
  state = transform.state
  document = state.document

  // Determine what the selection should be after wrapping.
  if (selection.isCollapsed) {
    after = selection
  }

  else if (selection.startOffset == 0) {
    const text = previous ? document.getNextText(previous) : document.getFirstText()
    after = selection.moveToRangeOf(text)
  }

  else if (selection.startKey == selection.endKey) {
    const text = document.getNextText(selection.startKey)
    after = selection.moveToRangeOf(text)
  }

  else {
    const anchor = document.getNextText(selection.anchorKey)
    const focus = document.getDescendant(selection.focusKey)
    after = selection.merge({
      anchorKey: anchor.key,
      anchorOffset: 0,
      focusKey: focus.key,
      focusOffset: selection.focusOffset
    })
  }

  after = after.normalize(document)
  return transform.moveTo(after)
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
  const { state } = transform
  const { selection } = state
  const { anchorOffset, anchorKey, focusOffset, focusKey, isBackward } = selection
  let after

  if (anchorKey == focusKey) {
    after = selection.moveForward(prefix.length)
  }

  else {
    after = selection.merge({
      anchorOffset: isBackward ? anchorOffset : anchorOffset + prefix.length,
      focusOffset: isBackward ? focusOffset + prefix.length : focusOffset
    })
  }

  return transform
    .unsetSelection()
    .wrapTextAtRange(selection, prefix, suffix)
    .moveTo(after)
}
