
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
  if (event.nativeEvent) {
    event = event.nativeEvent
  }

  const transfer = event.dataTransfer || event.clipboardData

  try {
    transfer.setData(type, content)
  } catch (err) {
    const prefix = 'SLATE-DATA-EMBED::'
    const text = transfer.getData('text/plain')
    let obj = {}

    // If the existing plain text data is prefixed, it's Slate JSON data.
    if (text.substring(0, prefix.length) === prefix) {
      try {
        obj = JSON.parse(text.substring(prefix.length))
      } catch (e) {
        throw new Error('Failed to parse Slate data from `DataTransfer` object.')
      }
    }

    // Otherwise, it's just set it as is.
    else {
      obj['text/plain'] = text
    }

    obj[type] = content
    const string = `${prefix}${JSON.stringify(obj)}`
    transfer.setData('text/plain', string)
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default setEventTransfer
