import { Set } from 'immutable'

import Document from '../models/document'

/**
 * Queries.
 *
 * @type {Object}
 */

const Queries = {}

/**
 * Get the active marks of the current selection.
 *
 * @param {Editor} editor
 * @return {Set<Mark>}
 */

Queries.getActiveMarks = editor => {
  const { document, selection } = editor.value
  return selection.isUnset
    ? new Set()
    : selection.marks || editor.getActiveMarksAtRange(selection, document)
}

/**
 * Get the fragment of the current selection.
 *
 * @param {Editor} editor
 * @return {Document}
 */

Queries.getFragment = editor => {
  const { document, selection } = editor.value
  return selection.isUnset
    ? Document.create()
    : editor.getFragmentAtRange(selection, document)
}

/**
 * Get the marks of the current selection.
 *
 * @param {Editor} editor
 * @return {Set<Mark>}
 */

Queries.getMarks = editor => {
  const { document, selection } = editor.value
  return selection.isUnset
    ? new Set()
    : selection.marks || document.getMarksAtRange(selection, editor)
}

export default Queries
