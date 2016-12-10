
import Base64 from '../serializers/base-64'
import TYPES from '../constants/types'

/**
 * Fragment matching regexp for HTML nodes.
 *
 * @type {RegExp}
 */

const FRAGMENT_MATCHER = /data-slate-fragment="([^\s]+)"/

/**
 * Get the data and type from a native data `transfer`.
 *
 * @param {DataTransfer} transfer
 * @return {Object}
 */

function getTransferData(transfer) {
  let fragment = transfer.getData(TYPES.FRAGMENT) || null
  let node = transfer.getData(TYPES.NODE) || null
  let html = transfer.getData('text/html') || null
  let rich = transfer.getData('text/rtf') || null
  let text = transfer.getData('text/plain') || null
  let files

  // If there isn't a fragment, but there is HTML, check to see if the HTML is
  // actually an encoded fragment.
  if (
    !fragment &&
    html &&
    ~html.indexOf('<span data-slate-fragment="')
  ) {
    const matches = FRAGMENT_MATCHER.exec(html)
    const [ full, encoded ] = matches // eslint-disable-line no-unused-vars
    if (encoded) fragment = encoded
  }

  // Decode a fragment or node if they exist.
  if (fragment) fragment = Base64.deserializeNode(fragment)
  if (node) node = Base64.deserializeNode(node)

  // Get and normalize files if they exist.
  if (transfer.items && transfer.items.length) {
    const fileItems = Array.from(transfer.items)
      .map(item => item.kind == 'file' ? item.getAsFile() : null)
      .filter(exists => exists)

    if (fileItems.length) files = fileItems
  }

  if (transfer.files && transfer.files.length) {
    files = Array.from(files)
  }

  // Determine the type of the data.
  const data = { files, fragment, html, node, rich, text }
  data.type = getTransferType(data)
  return data
}

/**
 * Get the type of a transfer from its `data`.
 *
 * @param {Object} data
 * @return {String}
 */

function getTransferType(data) {
  if (data.fragment) return 'fragment'
  if (data.node) return 'node'

  // COMPAT: Microsoft Word adds an image of the selected text to the data.
  // Since files are preferred over HTML or text, this would cause the type to
  // be considered `files`. But it also adds rich text data so we can check
  // for that and properly set the type to `html` or `text`. (2016/11/21)
  if (data.rich && data.html) return 'html'
  if (data.rich && data.text) return 'text'

  if (data.files) return 'files'
  if (data.html) return 'html'
  if (data.text) return 'text'
  return 'unknown'
}

/**
 * Export.
 *
 * @type {Function}
 */

export default getTransferData
