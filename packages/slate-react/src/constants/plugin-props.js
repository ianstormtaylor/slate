import EVENT_HANDLERS from './event-handlers'

/**
 * Props that can be defined by plugins.
 *
 * @type {Array}
 */

const PLUGIN_PROPS = [
  ...EVENT_HANDLERS,
  'decorateNode',
  'onChange',
  'renderEditor',
  'renderMark',
  'renderNode',
  'renderPlaceholder',
  'renderPortal',
  'schema',
  'validateNode',
]

/**
 * Export.
 *
 * @type {Array}
 */

export default PLUGIN_PROPS
