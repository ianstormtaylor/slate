import Value from '../models/value'

/**
 * Commands.
 *
 * @type {Object}
 */

const Commands = {}

/**
 * Set `properties` on the value.
 *
 * @param {Editor} editor
 * @param {Object|Value} properties
 */

Commands.setData = (editor, data = {}) => {
  const properties = Value.createProperties({ data })
  const { value } = editor

  editor.applyOperation({
    type: 'set_value',
    properties,
    value,
  })
}

/**
 * Set `properties` on the value.
 *
 * @param {Editor} editor
 * @param {Object|Value} properties
 */

Commands.setDecorations = (editor, decorations = []) => {
  const properties = Value.createProperties({ decorations })
  const { value } = editor

  editor.applyOperation({
    type: 'set_value',
    properties,
    value,
  })
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Commands
