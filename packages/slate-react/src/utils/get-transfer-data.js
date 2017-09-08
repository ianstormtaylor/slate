
import Base64 from '../serializers/base-64'
import TRANSFER_TYPES from '../constants/transfer-types'

/**
 * Fragment matching regexp for HTML nodes.
 *
 * @type {RegExp}
 */

const FRAGMENT_MATCHER = / data-slate-fragment="([^\s"]+)"/

/**
 * Get the data and type from a native data `transfer`.
 *
 * @param {DataTransfer} transfer
 * @return {Object}
 */

function getTransferData(transfer) {
  let fragment = getType(transfer, TRANSFER_TYPES.FRAGMENT)
  let node = getType(transfer, TRANSFER_TYPES.NODE)
  const html = getType(transfer, 'text/html')
  const rich = getType(transfer, 'text/rtf')
  let text = getType(transfer, 'text/plain')
  let files

  // If there isn't a fragment, but there is HTML, check to see if the HTML is
  // actually an encoded fragment.
  if (
    !fragment &&
    html &&
    ~html.indexOf(' data-slate-fragment="')
  ) {
    const matches = FRAGMENT_MATCHER.exec(html)
    const [ full, encoded ] = matches // eslint-disable-line no-unused-vars
    if (encoded) fragment = encoded
  }

  // COMPAT: Edge doesn't handle custom data types
  // These will be embedded in text/plain in this case (2017/7/12)
  if (text) {
    const embeddedTypes = getEmbeddedTypes(text)

    if (embeddedTypes[TRANSFER_TYPES.FRAGMENT]) fragment = embeddedTypes[TRANSFER_TYPES.FRAGMENT]
    if (embeddedTypes[TRANSFER_TYPES.NODE]) node = embeddedTypes[TRANSFER_TYPES.NODE]
    if (embeddedTypes['text/plain']) text = embeddedTypes['text/plain']
  }

  // Decode a fragment or node if they exist.
  if (fragment) fragment = Base64.deserializeNode(fragment)
  if (node) node = Base64.deserializeNode(node)

  // COMPAT: Edge sometimes throws 'NotSupportedError'
  // when accessing `transfer.items` (2017/7/12)
  try {
    // Get and normalize files if they exist.
    if (transfer.items && transfer.items.length) {
      files = Array.from(transfer.items)
        .map(item => item.kind == 'file' ? item.getAsFile() : null)
        .filter(exists => exists)
    } else if (transfer.files && transfer.files.length) {
      files = Array.from(transfer.files)
    }
  } catch (err) {
    if (transfer.files && transfer.files.length) {
      files = Array.from(transfer.files)
    }
  }

  // Determine the type of the data.
  const data = { files, fragment, html, node, rich, text }
  data.type = getTransferType(data)
  return data
}

/**
 * Takes text input, checks whether contains embedded data
 * and returns object with original text +/- additional data
 *
 * @param {String} text
 * @return {Object}
 */

function getEmbeddedTypes(text) {
  const prefix = 'SLATE-DATA-EMBED::'

  if (text.substring(0, prefix.length) !== prefix) {
    return { 'text/plain': text }
  }

  // Attempt to parse, if fails then just standard text/plain
  // Otherwise, already had data embedded
  try {
    return JSON.parse(text.substring(prefix.length))
  } catch (err) {
    throw new Error('Unable to parse custom embedded drag data')
  }
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

  if (data.files && data.files.length) return 'files'
  if (data.html) return 'html'
  if (data.text) return 'text'
  return 'unknown'
}

/**
 * Get one of types `TYPES.FRAGMENT`, `TYPES.NODE`, `text/html`, `text/rtf` or
 * `text/plain` from transfers's `data` if possible, otherwise return null.
 *
 * @param {Object} transfer
 * @param {String} type
 * @return {String}
 */

function getType(transfer, type) {
  if (!transfer.types || !transfer.types.length) {
    // COMPAT: In IE 11, there is no `types` field but `getData('Text')`
    // is supported`. (2017/06/23)
    return type === 'text/plain' ? transfer.getData('Text') || null : null
  }

  return transfer.types.indexOf(type) !== -1 ? transfer.getData(type) || null : null
}

/**
 * Export.
 *
 * @type {Function}
 */

export default getTransferData
