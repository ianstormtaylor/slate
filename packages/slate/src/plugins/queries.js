/**
 * A plugin that adds a set of queries to the editor.
 *
 * @param {Object} options
 * @return {Object}
 */

function QueriesPlugin(options = {}) {
  const { queries, defer = false } = options

  /**
   * On construct, register all the queries.
   *
   * @param {Editor} editor
   * @param {Function} next
   */

  function onConstruct(editor, next) {
    for (const query in queries) {
      editor.registerQuery(query)
    }

    return next()
  }

  /**
   * On query, if it exists in our list of queries, call it.
   *
   * @param {Object} query
   * @param {Function} next
   */

  function onQuery(query, next) {
    const { type, args } = query
    const fn = queries[type]
    if (!fn) return next()

    if (defer) {
      const ret = next()
      if (ret !== undefined) return ret
    }

    const ret = fn(...args)
    return ret
  }

  /**
   * Return the plugin.
   *
   * @type {Object}
   */

  return {
    onConstruct,
    onQuery,
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

export default QueriesPlugin
