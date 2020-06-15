import TRANSFER_TYPES from '../constants/transfer-types'

/**
 * The default plain text transfer type.
 *
 * @type {String}
 */

const { TEXT } = TRANSFER_TYPES

/**
 * Set data with `type` and `content` on an `event`.
 *
 * COMPAT: In Edge, custom types throw errors, so embed all non-standard
 * types in text/plain compound object. (2017/7/12)
 *
 * @param {Event} event
 * @param {String} type
 * @param {String} content
 */

function setEventTransfer(event, type, content) {
  const mime = TRANSFER_TYPES[type.toUpperCase()]

  if (!mime) {
    throw new Error(`Cannot set unknown transfer type "${mime}".`)
  }

  if (event.nativeEvent) {
    event = event.nativeEvent
  }

  const transfer = event.dataTransfer || event.clipboardData

  try {
    transfer.setData(mime, content)
    // COMPAT: Safari needs to have the 'text' (and not 'text/plain') value in dataTransfer
    // to display the cursor while dragging internally.
    transfer.setData('text', transfer.getData('text'))
  } catch (err) {
    const prefix = 'SLATE-DATA-EMBED::'
    const text = transfer.getData(TEXT)
    let obj = {}

    // If the existing plain text data is prefixed, it's Slate JSON data.
    if (text.substring(0, prefix.length) === prefix) {
      try {
        obj = JSON.parse(text.substring(prefix.length))
      } catch (e) {
        throw new Error(
          'Failed to parse Slate data from `DataTransfer` object.'
        )
      }
    } else {
      // Otherwise, it's just set it as is.
      obj[TEXT] = text
    }

    obj[mime] = content
    const string = `${prefix}${JSON.stringify(obj)}`
    transfer.setData(TEXT, string)
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default setEventTransfer
