import EVENT_HANDLERS from '../../constants/event-handlers'

/**
 * Props that can be defined by plugins.
 *
 * @type {Array}
 */

const PROPS = [
  ...EVENT_HANDLERS,
  'commands',
  'decorateNode',
  'queries',
  'renderAnnotation',
  'renderBlock',
  'renderDecoration',
  'renderDocument',
  'renderEditor',
  'renderInline',
  'renderMark',
  'schema',
]

/**
 * The top-level editor props in a plugin.
 *
 * @param {Object} options
 * @return {Object}
 */

function EditorPropsPlugin(options = {}) {
  const plugin = PROPS.reduce((memo, prop) => {
    if (prop in options) memo[prop] = options[prop]
    return memo
  }, {})

  return plugin
}

/**
 * Export.
 *
 * @type {Function}
 */

export default EditorPropsPlugin
