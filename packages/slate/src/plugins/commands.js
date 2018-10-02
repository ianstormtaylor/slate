/**
 * Create a plugin from a set of `commands`.
 *
 * @param {Object} commands
 * @return {Object}
 */

function CommandsPlugin(commands) {
  /**
   * On command, if it exists in our list of commands, call it.
   *
   * @param {Object} command
   * @param {Change} change
   * @param {Function} next
   */

  function onCommand(command, change, next) {
    const { type, args } = command

    // Defer to other plugins in the stack.
    const ret = next()
    if (ret !== undefined) return ret

    // If the command isn't found, abort.
    if (!(type in commands)) return

    // Otherwise, call the change function.
    const fn = commands[type]
    change.call(fn, ...args)
    return true
  }

  /**
   * Return the plugin.
   *
   * @type {Object}
   */

  return {
    onCommand,
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

export default CommandsPlugin
