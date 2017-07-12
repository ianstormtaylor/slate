/**
 * Set data on dataTransfer
 * COMPAT: In Edge, custom types throw errors, so embed all non-standard
 * types in text/plain compound object. (2017/7/12)
 *
 * @param {DataTransfer} dataTransfer
 * @param {String} type
 * @param {String} content
 */

function setTransferData(dataTransfer, type, content) {
  try {
    dataTransfer.setData(type, content)
  } catch (err) {
    const prefix = 'SLATE-DATA-EMBED::'
    let obj = {}
    const text = dataTransfer.getData('text/plain')

    // If prefixed, assume embedded drag data
    if (text.substring(0, prefix.length) === prefix) {
      try {
        obj = JSON.parse(text.substring(prefix.length))
      } catch (err2) {
        throw new Error('Unable to parse custom embedded drag data')
      }
    } else {
      obj['text/plain'] = text
    }

    obj[type] = content

    dataTransfer.setData('text/plain', `${prefix}${JSON.stringify(obj)}`)
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default setTransferData
