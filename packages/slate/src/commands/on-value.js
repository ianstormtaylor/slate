import pick from 'lodash/pick'
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
  const { value } = editor
  const newProperties = Value.createProperties({ data })
  const prevProperties = pick(value, Object.keys(newProperties))

  editor.applyOperation({
    type: 'set_value',
    properties: prevProperties,
    newProperties,
  })
}

/**
 * Set `properties` on the value.
 *
 * @param {Editor} editor
 * @param {Object|Value} properties
 */

Commands.setDecorations = (editor, decorations = []) => {
  const { value } = editor
  const newProperties = Value.createProperties({ decorations })
  const prevProperties = pick(value, Object.keys(newProperties))

  editor.applyOperation({
    type: 'set_value',
    properties: prevProperties,
    newProperties,
  })
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Commands
