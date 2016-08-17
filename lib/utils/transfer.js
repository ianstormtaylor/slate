
import Base64 from '../serializers/base-64'
import TYPES from '../constants/types'

/**
 * Fragment matching regexp for HTML nodes.
 *
 * @type {RegExp}
 */

const FRAGMENT_MATCHER = /data-slate-fragment="([^\s]+)"/

/**
 * Data transfer helper.
 *
 * @type {Transfer}
 */

class Transfer {

  /**
   * Constructor.
   *
   * @param {DataTransfer} data
   */

  constructor(data) {
    this.data = data
    this.cache = {}
  }

  /**
   * Get a data object representing the transfer's primary content type.
   *
   * @return {Object}
   */

  getData() {
    const type = this.getType()
    const data = {}
    data.type = type

    switch (type) {
      case 'files':
        data.files = this.getFiles()
        break
      case 'fragment':
        data.fragment = this.getFragment()
        break
      case 'html':
        data.html = this.getHtml()
        data.text = this.getText()
        break
      case 'node':
        data.node = this.getNode()
        break
      case 'text':
        data.text = this.getText()
        break
    }

    return data
  }

  /**
   * Get the Files content of the data transfer.
   *
   * @return {Array || Void}
   */

  getFiles() {
    if ('files' in this.cache) return this.cache.files

    const { data } = this
    let files

    if (data.items && data.items.length) {
      const fileItems = Array.from(data.items)
        .map(item => item.kind == 'file' ? item.getAsFile() : null)
        .filter(exists => exists)

      if (fileItems.length) files = fileItems
    }

    if (data.files && data.files.length) {
      files = Array.from(data.files)
    }

    this.cache.files = files
    return files
  }

  /**
   * Get the Slate document fragment content of the data transfer.
   *
   * @return {Document || Void}
   */

  getFragment() {
    if ('fragment' in this.cache) return this.cache.fragment

    const html = this.getHtml()
    let encoded = this.data.getData(TYPES.FRAGMENT)
    let fragment

    // If there's html content, and the html includes a `data-fragment`
    // attribute, it's actually a Base64-serialized fragment from a cut/copy.
    if (!encoded && html && ~html.indexOf('<span data-slate-fragment="')) {
      const matches = FRAGMENT_MATCHER.exec(html)
      const [ full, attribute ] = matches
      encoded = attribute
    }

    if (encoded) {
      fragment = Base64.deserializeNode(encoded)
    }

    this.cache.fragment = fragment
    return fragment
  }

  /**
   * Get the HTML content of the data transfer.
   *
   * @return {String || Void}
   */

  getHtml() {
    if ('html' in this.cache) return this.cache.html

    let html
    const string = this.data.getData('text/html')

    if (string != '') html = string

    this.cache.html = html
    return html
  }

  /**
   * Get the Slate node content of the data transfer.
   *
   * @return {Node || Void}
   */

  getNode() {
    if ('node' in this.cache) return this.cache.node

    const encoded = this.data.getData(TYPES.NODE)
    let node

    if (encoded) {
      node = Base64.deserializeNode(encoded)
    }

    this.cache.node = node
    return node
  }

  /**
   * Get the text content of the data transfer.
   *
   * @return {String || Void}
   */

  getText() {
    if ('text' in this.cache) return this.cache.text

    let text
    const string = this.data.getData('text/plain')

    if (string != '') text = string

    this.cache.text = text
    return text
  }

  /**
   * Get the primary type of the data transfer.
   *
   * @return {String}
   */

  getType() {
    if (this.hasFragment()) return 'fragment'
    if (this.hasNode()) return 'node'
    if (this.hasFiles()) return 'files'
    if (this.hasHtml()) return 'html'
    if (this.hasText()) return 'text'
    return 'unknown'
  }

  /**
   * Check whether the data transfer has File content.
   *
   * @return {Boolean}
   */

  hasFiles() {
    return this.getFiles() != null
  }

  /**
   * Check whether the data transfer has HTML content.
   *
   * @return {Boolean}
   */

  hasHtml() {
    return this.getHtml() != null
  }

  /**
   * Check whether the data transfer has text content.
   *
   * @return {Boolean}
   */

  hasText() {
    return this.getText() != null
  }

  /**
   * Check whether the data transfer has a Slate document fragment as content.
   *
   * @return {Boolean}
   */

  hasFragment() {
    return this.getFragment() != null
  }

  /**
   * Check whether the data transfer has a Slate node as content.
   *
   * @return {Boolean}
   */

  hasNode() {
    return this.getNode() != null
  }

}

/**
 * Export.
 */

export default Transfer
