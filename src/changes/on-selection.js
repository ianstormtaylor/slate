
import Selection from '../models/selection'
import isEmpty from 'is-empty'
import pick from 'lodash/pick'

/**
 * Changes.
 *
 * @type {Object}
 */

const Changes = {}

/**
 * Set `properties` on the selection.
 *
 * @param {Change} change
 * @param {Object} properties
 */

Changes.select = (change, properties, options = {}) => {
  properties = Selection.createProperties(properties)

  const { snapshot = false } = options
  const { state } = change
  const { document, selection } = state
  const props = {}
  const sel = selection.toJSON()
  const next = selection.merge(properties).normalize(document)
  properties = pick(next, Object.keys(properties))

  // Remove any properties that are already equal to the current selection. And
  // create a dictionary of the previous values for all of the properties that
  // are being changed, for the inverse operation.
  for (const k in properties) {
    if (snapshot == false && properties[k] == sel[k]) continue
    props[k] = properties[k]
  }

  // Resolve the selection keys into paths.
  sel.anchorPath = sel.anchorKey == null ? null : document.getPath(sel.anchorKey)
  delete sel.anchorKey

  if (props.anchorKey) {
    props.anchorPath = props.anchorKey == null ? null : document.getPath(props.anchorKey)
    delete props.anchorKey
  }

  sel.focusPath = sel.focusKey == null ? null : document.getPath(sel.focusKey)
  delete sel.focusKey

  if (props.focusKey) {
    props.focusPath = props.focusKey == null ? null : document.getPath(props.focusKey)
    delete props.focusKey
  }

  // If the selection moves, clear any marks, unless the new selection
  // properties change the marks in some way.
  const moved = [
    'anchorPath',
    'anchorOffset',
    'focusPath',
    'focusOffset',
  ].some(p => props.hasOwnProperty(p))

  if (sel.marks && properties.marks == sel.marks && moved) {
    props.marks = null
  }

  // If there are no new properties to set, abort.
  if (isEmpty(props)) {
    return
  }

  // Apply the operation.
  change.applyOperation({
    type: 'set_selection',
    properties: props,
    selection: sel,
  }, snapshot ? { skip: false, merge: false } : {})
}

/**
 * Select the whole document.
 *
 * @param {Change} change
 */

Changes.selectAll = (change) => {
  const { state } = change
  const { document, selection } = state
  const next = selection.moveToRangeOf(document)
  change.select(next)
}

/**
 * Snapshot the current selection.
 *
 * @param {Change} change
 */

Changes.snapshotSelection = (change) => {
  const { state } = change
  const { selection } = state
  change.select(selection, { snapshot: true })
}

/**
 * Mix in selection changes that are just a proxy for the selection method.
 */

const PROXY_TRANSFORMS = [
  'blur',
  'collapseTo',
  'collapseToAnchor',
  'collapseToEnd',
  'collapseToEndOf',
  'collapseToFocus',
  'collapseToStart',
  'collapseToStartOf',
  'extend',
  'extendTo',
  'extendToEndOf',
  'extendToStartOf',
  'flip',
  'focus',
  'move',
  'moveAnchor',
  'moveAnchorOffsetTo',
  'moveAnchorTo',
  'moveAnchorToEndOf',
  'moveAnchorToStartOf',
  'moveEnd',
  'moveEndOffsetTo',
  'moveEndTo',
  'moveFocus',
  'moveFocusOffsetTo',
  'moveFocusTo',
  'moveFocusToEndOf',
  'moveFocusToStartOf',
  'moveOffsetsTo',
  'moveStart',
  'moveStartOffsetTo',
  'moveStartTo',
  // 'moveTo', Commented out for now, since it conflicts with a deprecated one.
  'moveToEnd',
  'moveToEndOf',
  'moveToRangeOf',
  'moveToStart',
  'moveToStartOf',
  'deselect',
]

PROXY_TRANSFORMS.forEach((method) => {
  Changes[method] = (change, ...args) => {
    const normalize = method != 'deselect'
    const { state } = change
    const { document, selection } = state
    let next = selection[method](...args)
    if (normalize) next = next.normalize(document)
    change.select(next)
  }
})

/**
 * Mix in node-related changes.
 */

const PREFIXES = [
  'moveTo',
  'collapseTo',
  'extendTo',
]

const DIRECTIONS = [
  'Next',
  'Previous',
]

const KINDS = [
  'Block',
  'Inline',
  'Text',
]

PREFIXES.forEach((prefix) => {
  const edges = [
    'Start',
    'End',
  ]

  if (prefix == 'moveTo') {
    edges.push('Range')
  }

  edges.forEach((edge) => {
    DIRECTIONS.forEach((direction) => {
      KINDS.forEach((kind) => {
        const get = `get${direction}${kind}`
        const getAtRange = `get${kind}sAtRange`
        const index = direction == 'Next' ? 'last' : 'first'
        const method = `${prefix}${edge}Of`
        const name = `${method}${direction}${kind}`

        Changes[name] = (change) => {
          const { state } = change
          const { document, selection } = state
          const nodes = document[getAtRange](selection)
          const node = nodes[index]()
          const target = document[get](node.key)
          if (!target) return
          const next = selection[method](target)
          change.select(next)
        }
      })
    })
  })
})

/**
 * Export.
 *
 * @type {Object}
 */

export default Changes
