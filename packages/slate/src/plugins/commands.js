/**
 * A plugin that adds a set of commands to the editor.
 *
 * @param {Object} options
 * @return {Object}
 */

function CommandsPlugin(options = {}) {
  const { commands, defer = false } = options

  /**
   * On command, if it exists in our list of commands, call it.
   *
   * @param {Object} command
   * @param {Change} change
   * @param {Function} next
   */

  function onCommand(command, change, next) {
    const { type, args } = command
    const fn = commands[type]
    if (!fn) return next()

    if (defer) {
      const ret = next()
      if (ret !== undefined) return ret
    }

    change.call(fn, ...args)
    return true
  }

  /**
   * On construct, register all the commands.
   *
   * @param {Editor} editor
   * @param {Function} next
   */

  function onConstruct(editor, next) {
    for (const command in commands) {
      editor.registerCommand(command)
    }

    return next()
  }

  /**
   * Return the plugin.
   *
   * @type {Object}
   */

  return {
    onCommand,
    onConstruct,
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

export default CommandsPlugin
