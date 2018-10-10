/**
 * A plugin that adds a set of queries to the editor.
 *
 * @param {Object} queries
 * @return {Object}
 */

function QueriesPlugin(queries = {}) {
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
   * @param {Editor} editor
   * @param {Function} next
   */

  function onQuery(query, editor, next) {
    const { type, args } = query
    const fn = queries[type]
    if (!fn) return next()
    const ret = fn(editor, ...args)
    return ret === undefined ? next() : ret
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
