/**
 * A plugin that adds a set of commands to the editor.
 *
 * @param {Object} commands
 * @return {Object}
 */

function CommandsPlugin(commands = {}) {
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
    change.call(fn, ...args)
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
