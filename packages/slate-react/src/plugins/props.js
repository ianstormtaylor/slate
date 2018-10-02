import EVENT_HANDLERS from '../constants/event-handlers'

/**
 * Props that can be defined by plugins.
 *
 * @type {Array}
 */

const PROPS = [
  ...EVENT_HANDLERS,
  'decorateNode',
  'renderEditor',
  'renderMark',
  'renderNode',
  'renderPlaceholder',
  'schema',
  'normalizeNode',
]

/**
 * A plugin that is defined from the props on the `<Editor>` component.
 *
 * @param {Object} props
 * @return {Object}
 */

function PropsPlugin(props) {
  const plugin = {}

  for (const prop of PROPS) {
    if (prop in props) {
      plugin[prop] = props[prop]
    }
  }

  return plugin
}

/**
 * Export.
 *
 * @type {Object}
 */

export default PropsPlugin
